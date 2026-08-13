// GET /api/track-order?id=<orderId>&phone=<phone> - public order lookup.
// Requires the phone number on file to match, so customers can only look up
// their own orders without needing an account.
function normalizePhone(s) {
  return String(s || "").replace(/\D/g, "");
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

  return Response.json({
    id: order.id,
    items: order.items,
    total: order.total,
    status: order.status,
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    createdAt: order.createdAt,
    shippedAt: order.shippedAt || null
  }, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
  });
}
