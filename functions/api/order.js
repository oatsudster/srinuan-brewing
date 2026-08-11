// POST /api/order - public, places a cart order: checks stock for every item,
// decrements it, computes an estimated shipping fee, and notifies the shop
// owner via Telegram. No payment is processed here; this only creates an
// order inquiry for the owner to confirm manually.

// Mirrors the rate table in js/products.js (client-side estimate) - Thailand
// Post's published domestic EMS rates, flat nationwide by weight.
const CAN_WEIGHT_KG = 0.34;
const PACKAGING_KG = 0.15;
const FREE_SHIPPING_QTY = 10;
const EMS_RATE_TIERS = [
  [0.02, 32], [0.10, 37], [0.25, 42], [0.50, 52], [1.00, 67],
  [1.50, 82], [2.00, 97], [5.00, 120], [10.00, 220], [20.00, 320], [30.00, 480]
];

function emsRateForWeight(weightKg) {
  for (const [maxKg, price] of EMS_RATE_TIERS) {
    if (weightKg <= maxKg) return price;
  }
  return null;
}

function estimateShipping(totalQty) {
  const weightKg = Math.round((totalQty * CAN_WEIGHT_KG + PACKAGING_KG) * 100) / 100;
  if (totalQty >= FREE_SHIPPING_QTY) return { free: true, cost: 0, weightKg };
  return { free: false, cost: emsRateForWeight(weightKg), weightKg };
}

function escapeText(s) {
  return String(s).replace(/[\r\n]+/g, " ").trim().slice(0, 500);
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const name = escapeText(body.name || "");
  const phone = escapeText(body.phone || "");
  const address = escapeText(body.address || "");
  if (!name || !phone || !address) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const items = [];
  for (const raw of body.items) {
    const productId = escapeText(raw.productId || "");
    const productName = escapeText(raw.productName || productId);
    const quantity = parseInt(raw.quantity, 10);
    if (!productId || !Number.isFinite(quantity) || quantity < 1) {
      return Response.json({ error: "invalid_item" }, { status: 400 });
    }
    items.push({ productId, productName, quantity });
  }

  // Check stock for every item first - don't decrement anything if any item is short.
  const shortfalls = [];
  const currentStock = {};
  for (const item of items) {
    const key = "stock:" + item.productId;
    const current = parseInt((await env.STOCK_KV.get(key)) || "0", 10);
    currentStock[item.productId] = current;
    if (current < item.quantity) {
      shortfalls.push({ productId: item.productId, available: current });
    }
  }
  if (shortfalls.length) {
    return Response.json({ error: "insufficient_stock", shortfalls }, { status: 409 });
  }

  const remaining = {};
  for (const item of items) {
    const key = "stock:" + item.productId;
    const next = currentStock[item.productId] - item.quantity;
    await env.STOCK_KV.put(key, String(next));
    remaining[item.productId] = next;
  }

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = estimateShipping(totalQty);

  const itemLines = items.map((i) => "  - " + i.productName + " x " + i.quantity).join("\n");
  const shipLine = shipping.free
    ? "Free (" + totalQty + "+ cans)"
    : (shipping.cost != null ? shipping.cost + " THB" : "Contact customer - over 30kg");

  const text =
    "New Order - Srinuan Brewing\n\n" +
    "Items:\n" + itemLines + "\n\n" +
    "Total cans: " + totalQty + "\n" +
    "Est. weight: " + shipping.weightKg + " kg\n" +
    "Est. shipping (EMS): " + shipLine + "\n\n" +
    "Name: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Address: " + address;

  try {
    const tgResp = await fetch(
      "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
      }
    );
    if (!tgResp.ok) {
      console.error("Telegram send failed:", await tgResp.text());
    }
  } catch (err) {
    console.error("Telegram send error:", err);
  }

  return Response.json({ ok: true, remaining, shipping });
}
