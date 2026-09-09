// POST /api/submit-slip  { orderId, phone, slipImage }
//
// The customer pays after the order exists, so the slip arrives separately.
// Authorised the same way as the tracking page: order id plus the phone
// number recorded on that order.
function normalizePhone(s) {
  return String(s || "").replace(/\D/g, "");
}

function base64ToBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function notifyShop(env, order, slipImage) {
  const lines = [
    "Payment slip received - Order #" + order.id,
    "",
    "Name: " + order.name,
    "Phone: " + order.phone,
    "Total: " + order.total + " THB"
  ];
  const text = lines.join(String.fromCharCode(10));
  try {
    const bytes = base64ToBytes(slipImage);
    const form = new FormData();
    form.append("chat_id", env.TELEGRAM_CHAT_ID);
    form.append("caption", text.slice(0, 900));
    form.append("photo", new Blob([bytes], { type: "image/jpeg" }), "slip.jpg");
    const resp = await fetch(
      "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/sendPhoto",
      { method: "POST", body: form }
    );
    if (!resp.ok) console.error("Telegram sendPhoto failed:", await resp.text());
  } catch (err) {
    console.error("Telegram slip send error:", err);
  }
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "invalid_body" }, { status: 400 });

  const orderId = String(body.orderId || "").trim();
  const phone = normalizePhone(body.phone);
  const slipImage = typeof body.slipImage === "string" ? body.slipImage : "";
  if (!orderId || !phone) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(slipImage)) {
    return Response.json({ error: "missing_slip" }, { status: 400 });
  }
  if (slipImage.length > 8 * 1024 * 1024) {
    return Response.json({ error: "slip_too_large" }, { status: 413 });
  }

  const key = "order:" + orderId;
  const raw = await env.STOCK_KV.get(key);
  if (!raw) return Response.json({ error: "not_found" }, { status: 404 });
  const order = JSON.parse(raw);
  if (normalizePhone(order.phone) !== phone) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  await notifyShop(env, order, slipImage);

  order.paid = true;
  order.paidAt = new Date().toISOString();
  if (order.status === "awaiting_payment") order.status = "pending";
  await env.STOCK_KV.put(key, JSON.stringify(order));

  return Response.json({ ok: true, orderId: order.id, status: order.status });
}
