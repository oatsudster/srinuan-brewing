// POST /api/order - public. Records a cart order: checks stock for every item,
// reserves it, computes shipping + total (prices always come from the table
// below, never from the client) and alerts the shop over Telegram.
//
// No payment details appear here or anywhere public. The order is created
// unpaid; how to pay is sent privately to the customer by email, and the slip
// comes back later through /api/submit-slip.

// Mirrors js/products.js (client-side estimate/preview) - keep both in sync.
const CAN_WEIGHT_KG = 0.34;
const PACKAGING_KG = 0.15;
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
  "cali-mead": 110,
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
  return { free: false, cost: emsRateForWeight(weightKg), weightKg };
}

function escapeText(s) {
  return String(s).replace(/[\r\n]+/g, " ").trim().slice(0, 500);
}

async function sendTelegram(env, text) {
  try {
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
    const payUrl = "https://srinuan-brewing.pages.dev/pay.html?id=" +
      encodeURIComponent(order.id) + "&phone=" + encodeURIComponent(order.phone);
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
      '<p style="margin-top:24px">ขั้นตอนถัดไป: กดปุ่มด้านล่างเพื่อดูช่องทางชำระเงิน ' +
      "แล้วแนบสลิปกลับมาในหน้าเดียวกันได้เลยครับ</p>" +
      '<p><a href="' + payUrl + '" ' +
      'style="display:inline-block;padding:12px 24px;background:#d9a45b;color:#0d1b2a;' +
      'text-decoration:none;border-radius:8px;font-weight:bold">ชำระเงินและแนบสลิป</a></p>' +
      '<p style="font-size:12px;color:#666">ลิงก์นี้เป็นของออเดอร์คุณโดยเฉพาะ ' +
      "กรุณาอย่าส่งต่อให้ผู้อื่น</p>" +
      "<p>เมื่อทางร้านตรวจสลิปแล้วจะติดต่อกลับเพื่อยืนยันอีกครั้ง ขอบคุณที่อุดหนุนครับ</p>" +
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

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (PRICES[i.productId] || 0) * i.quantity, 0);
  const shipping = deliveryMethod === "pickup" ? { free: true, cost: 0, weightKg: 0 } : estimateShipping(totalQty);
  const shipCost = deliveryMethod === "pickup" ? 0 : (shipping.free ? 0 : (shipping.cost || 0));
  const grandTotal = subtotal + shipCost;

  // Verify the transfer before taking stock, so a rejected slip leaves nothing behind.
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

  const orderId = new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const itemLines = items
    .map((i) => "  - " + i.productName + " x " + i.quantity + " (" + (PRICES[i.productId] || 0) + " THB each)")
    .join("\n");
  const shipLine = deliveryMethod === "pickup"
    ? "Self pickup (no shipping)"
    : (shipping.cost != null ? shipping.cost + " THB" : "Contact customer - over 30kg");

  const text =
    "New Order #" + orderId + " - Srinuan Brewing\n\n" +
    "Items:\n" + itemLines + "\n\n" +
    "Subtotal: " + subtotal + " THB\n" +
    (deliveryMethod === "pickup" ? "" : "Est. weight: " + shipping.weightKg + " kg\n") +
    "Shipping: " + shipLine + "\n" +
    "Total: " + grandTotal + " THB\n" +
    "AWAITING PAYMENT - slip not received yet" + "\n\n" +
    "Name: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Email: " + (email || "-") + "\n" +
    (deliveryMethod === "pickup" ? "Pickup: Self pickup at Tham Phanna, Nakhon Si Thammarat" : "Address: " + address);

  await sendTelegram(env, text);

  if (lowStockAlerts.length) {
    const alertText =
      "⚠️ Low Stock Alert\n\n" +
      lowStockAlerts.map((a) => "  - " + a.productName + ": " + a.remaining + " left").join("\n");
    await sendTelegram(env, alertText);
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
    paid: false,
    paidAt: null,
    status: "awaiting_payment",
    trackingNumber: null,
    carrier: null,
    createdAt: new Date().toISOString()
  };
  await env.STOCK_KV.put("order:" + orderId, JSON.stringify(orderRecord));
  const mail = await sendOrderConfirmation(env, orderRecord);

  return Response.json({ ok: true, remaining, subtotal, shipping: shipCost, total: grandTotal, orderId, emailSent: mail.sent });
}
