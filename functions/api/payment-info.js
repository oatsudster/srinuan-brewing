// GET /api/payment-info?id=<orderId>&phone=<phone>
//
// Builds the PromptPay payload on the server so the shop's account number
// never appears in any file the public can fetch. It is returned only to
// someone who already knows a valid order id and the phone number on it.
function normalizePhone(s) {
  return String(s || "").replace(/\D/g, "");
}

function crc16ccitt(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(tag, value) {
  return tag + String(value.length).padStart(2, "0") + value;
}

// Dynamic PromptPay QR: point-of-initiation "12" plus a transaction amount,
// so the payer's banking app pre-fills the exact total.
export function buildPromptPayPayload(merchantBlock, amountBaht) {
  const payload =
    tlv("00", "01") +
    tlv("01", "12") +
    tlv("29", merchantBlock) +
    tlv("53", "764") +
    tlv("54", amountBaht.toFixed(2)) +
    tlv("58", "TH");
  return payload + "6304" + crc16ccitt(payload + "6304");
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const orderId = (url.searchParams.get("id") || "").trim();
  const phone = normalizePhone(url.searchParams.get("phone"));
  if (!orderId || !phone) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const raw = await env.STOCK_KV.get("order:" + orderId);
  if (!raw) return Response.json({ error: "not_found" }, { status: 404 });
  const order = JSON.parse(raw);
  if (normalizePhone(order.phone) !== phone) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const body = {
    orderId: order.id,
    total: order.total,
    paid: !!order.paid,
    status: order.status
  };
  // Without the secret configured we still answer, just without a QR, so the
  // page can tell the customer the shop will be in touch instead of breaking.
  // Strip anything the secret picked up on its way in - a stray BOM or newline
  // lands inside tag 29 and every banking app rejects the resulting QR.
  const merchant = String(env.PROMPTPAY_MERCHANT_BLOCK || "").replace(/[^0-9A-Za-z]/g, "");
  if (merchant && !order.paid) {
    body.payload = buildPromptPayPayload(merchant, order.total);
  }
  return Response.json(body, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
  });
}
