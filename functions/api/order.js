// POST /api/order - public, places a cart order: checks stock for every item,
// decrements it, computes shipping + total (prices are always taken from the
// server-side table below, never trusted from the client), and notifies the
// shop owner via Telegram (with the payment slip photo, if one was attached).
// No payment is processed here; PromptPay is a self-serve bank transfer the
// customer completes themselves - this only creates an order inquiry.

// Mirrors js/products.js (client-side estimate/preview) - keep both in sync.
const CAN_WEIGHT_KG = 0.34;
const PACKAGING_KG = 0.15;
const FREE_SHIPPING_QTY = 10;
const EMS_RATE_TIERS = [
  [0.02, 32], [0.10, 37], [0.25, 42], [0.50, 52], [1.00, 67],
  [1.50, 82], [2.00, 97], [5.00, 120], [10.00, 220], [20.00, 320], [30.00, 480]
];
const PRICES = {
  ipa: 120,
  "ddh-ipa": 130,
  moonlight: 110,
  "som-som": 110,
  "nual-gaarden": 110,
  "honey-lime": 110,
  "apple-cider": 110,
  "blue-moon-pastry": 110,
  midnight: 110
};

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

function base64ToBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sendTelegram(env, text, slipImage) {
  try {
    if (slipImage && slipImage.startsWith("data:image")) {
      const bytes = base64ToBytes(slipImage);
      const form = new FormData();
      form.append("chat_id", env.TELEGRAM_CHAT_ID);
      form.append("caption", text.slice(0, 1024));
      form.append("photo", new Blob([bytes], { type: "image/jpeg" }), "slip.jpg");
      const resp = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendPhoto", {
        method: "POST",
        body: form
      });
      if (!resp.ok) console.error("Telegram sendPhoto failed:", await resp.text());
      return;
    }
    const resp = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
    });
    if (!resp.ok) console.error("Telegram sendMessage failed:", await resp.text());
  } catch (err) {
    console.error("Telegram send error:", err);
  }
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
  const subtotal = items.reduce((sum, i) => sum + (PRICES[i.productId] || 0) * i.quantity, 0);
  const shipping = estimateShipping(totalQty);
  const shipCost = shipping.free ? 0 : (shipping.cost || 0);
  const grandTotal = subtotal + shipCost;

  const itemLines = items
    .map((i) => "  - " + i.productName + " x " + i.quantity + " (" + (PRICES[i.productId] || 0) + " THB each)")
    .join("\n");
  const shipLine = shipping.free
    ? "Free (" + totalQty + "+ cans)"
    : (shipping.cost != null ? shipping.cost + " THB" : "Contact customer - over 30kg");
  const slipLine = body.slipImage ? "Payment slip: attached above" : "Payment slip: not attached";

  const text =
    "New Order - Srinuan Brewing\n\n" +
    "Items:\n" + itemLines + "\n\n" +
    "Subtotal: " + subtotal + " THB\n" +
    "Est. weight: " + shipping.weightKg + " kg\n" +
    "Shipping (EMS): " + shipLine + "\n" +
    "Total: " + grandTotal + " THB\n" +
    slipLine + "\n\n" +
    "Name: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Address: " + address;

  await sendTelegram(env, text, body.slipImage);

  return Response.json({ ok: true, remaining, subtotal, shipping: shipCost, total: grandTotal });
}
