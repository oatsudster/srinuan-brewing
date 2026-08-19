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
const LOW_STOCK_THRESHOLD = 5;
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
    // Photo captions are capped at 1024 chars by Telegram, and the delivery
    // address is the last line - so a long order would silently lose it.
    // Send the slip with a short caption, then the full details as their own
    // message (4096 limit).
    if (slipImage && slipImage.startsWith("data:image")) {
      const bytes = base64ToBytes(slipImage);
      const form = new FormData();
      form.append("chat_id", env.TELEGRAM_CHAT_ID);
      form.append("caption", text.slice(0, 200));
      form.append("photo", new Blob([bytes], { type: "image/jpeg" }), "slip.jpg");
      const photoResp = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendPhoto", {
        method: "POST",
        body: form
      });
      if (!photoResp.ok) console.error("Telegram sendPhoto failed:", await photoResp.text());
    }
    const resp = await fetch("https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: text.slice(0, 4096) })
    });
    if (!resp.ok) console.error("Telegram sendMessage failed:", await resp.text());
  } catch (err) {
    console.error("Telegram send error:", err);
  }
}

function escapeHtml(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// The customer has just transferred money; without this they leave with no
// receipt and no order number, which also makes the tracking page unusable.
async function sendOrderConfirmation(env, order) {
  if (!order.email || !env.RESEND_API_KEY) return { sent: false };
  try {
    const rows = order.items
      .map((i) => "<tr><td style=\"padding:4px 12px 4px 0\">" + escapeHtml(i.productName) +
                  "</td><td style=\"padding:4px 0;text-align:right\">x" + escapeHtml(i.quantity) + "</td></tr>")
      .join("");
    const where = order.deliveryMethod === "pickup"
      ? "รับสินค้าเอง ที่ถ้ำพรรณรา จ.นครศรีธรรมราช"
      : escapeHtml(order.address);
    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
      '<body style="font-family:sans-serif;color:#1a1a1a">' +
      "<p>สวัสดีครับ คุณ" + escapeHtml(order.name) + "</p>" +
      "<p>ศรีนวล บริววิ่ง ได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว</p>" +
      '<p style="font-size:13px;color:#666;margin-bottom:4px">เลขออเดอร์ของคุณ</p>' +
      '<p style="font-size:24px;font-weight:bold;color:#b8860b;margin-top:0">#' + escapeHtml(order.id) + "</p>" +
      "<table>" + rows + "</table>" +
      "<p>ค่าสินค้า " + escapeHtml(order.subtotal) + " บาท<br>" +
      "ค่าจัดส่ง " + (order.shipping ? escapeHtml(order.shipping) + " บาท" : "ฟรี") + "<br>" +
      "<strong>ยอดรวม " + escapeHtml(order.total) + " บาท</strong></p>" +
      "<p>จัดส่งไปที่: " + where + "</p>" +
      '<p><a href="https://srinuan-brewing.pages.dev/track.html" ' +
      'style="display:inline-block;padding:12px 24px;background:#d9a45b;color:#0d1b2a;' +
      'text-decoration:none;border-radius:8px;font-weight:bold">เช็คสถานะออเดอร์</a></p>' +
      "<p>ทางร้านจะตรวจสอบสลิปและติดต่อกลับเพื่อยืนยันอีกครั้ง ขอบคุณที่อุดหนุนครับ</p>" +
      "</body></html>";
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({
        from: "Srinuan Brewing <onboarding@resend.dev>",
        to: [order.email],
        subject: "รับคำสั่งซื้อแล้ว #" + order.id + " - Srinuan Brewing",
        html
      })
    });
    if (!resp.ok) { console.error("Resend confirmation failed:", await resp.text()); return { sent: false }; }
    return { sent: true };
  } catch (err) {
    console.error("Resend confirmation error:", err);
    return { sent: false };
  }
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const deliveryMethod = body.deliveryMethod === "pickup" ? "pickup" : "delivery";
  const name = escapeText(body.name || "");
  const phone = escapeText(body.phone || "");
  const address = deliveryMethod === "pickup" ? "" : escapeText(body.address || "");
  const email = escapeText(body.email || "");
  if (!name || !phone || (deliveryMethod === "delivery" && !address)) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }
  // Was silently blanked before, which meant no tracking email and nobody knew.
  if (!isValidEmail(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  // The browser blocks this, but the browser is not a security boundary: without
  // a server check a direct POST creates a real order and decrements stock.
  const slipImage = typeof body.slipImage === "string" ? body.slipImage : "";
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(slipImage)) {
    return Response.json({ error: "missing_slip" }, { status: 400 });
  }
  if (slipImage.length > 8 * 1024 * 1024) {
    return Response.json({ error: "slip_too_large" }, { status: 413 });
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
  const lowStockAlerts = [];
  for (const item of items) {
    const key = "stock:" + item.productId;
    const before = currentStock[item.productId];
    const next = before - item.quantity;
    await env.STOCK_KV.put(key, String(next));
    remaining[item.productId] = next;
    if (before > LOW_STOCK_THRESHOLD && next <= LOW_STOCK_THRESHOLD) {
      lowStockAlerts.push({ productName: item.productName, remaining: next });
    }
  }

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (PRICES[i.productId] || 0) * i.quantity, 0);
  const shipping = deliveryMethod === "pickup" ? { free: true, cost: 0, weightKg: 0 } : estimateShipping(totalQty);
  const shipCost = deliveryMethod === "pickup" ? 0 : (shipping.free ? 0 : (shipping.cost || 0));
  const grandTotal = subtotal + shipCost;

  const orderId = new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const itemLines = items
    .map((i) => "  - " + i.productName + " x " + i.quantity + " (" + (PRICES[i.productId] || 0) + " THB each)")
    .join("\n");
  const shipLine = deliveryMethod === "pickup"
    ? "Self pickup (no shipping)"
    : (shipping.free ? "Free (" + totalQty + "+ cans)" : (shipping.cost != null ? shipping.cost + " THB" : "Contact customer - over 30kg"));
  const slipLine = "Payment slip: attached above";

  const text =
    "New Order #" + orderId + " - Srinuan Brewing\n\n" +
    "Items:\n" + itemLines + "\n\n" +
    "Subtotal: " + subtotal + " THB\n" +
    (deliveryMethod === "pickup" ? "" : "Est. weight: " + shipping.weightKg + " kg\n") +
    "Shipping: " + shipLine + "\n" +
    "Total: " + grandTotal + " THB\n" +
    slipLine + "\n\n" +
    "Name: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Email: " + (email || "-") + "\n" +
    (deliveryMethod === "pickup" ? "Pickup: Self pickup at Tham Phanna, Nakhon Si Thammarat" : "Address: " + address);

  await sendTelegram(env, text, slipImage);

  if (lowStockAlerts.length) {
    const alertText =
      "⚠️ Low Stock Alert\n\n" +
      lowStockAlerts.map((a) => "  - " + a.productName + ": " + a.remaining + " left").join("\n");
    await sendTelegram(env, alertText, null);
  }

  const orderRecord = {
    id: orderId,
    items,
    name,
    phone,
    email,
    address,
    deliveryMethod,
    subtotal,
    shipping: shipCost,
    total: grandTotal,
    status: "pending",
    trackingNumber: null,
    carrier: null,
    createdAt: new Date().toISOString()
  };
  await env.STOCK_KV.put("order:" + orderId, JSON.stringify(orderRecord));
  const mail = await sendOrderConfirmation(env, orderRecord);

  return Response.json({ ok: true, remaining, subtotal, shipping: shipCost, total: grandTotal, orderId, emailSent: mail.sent });
}
