import { guardAdmin } from "./_admin.js";
// POST /api/admin-stock - updates the stock count for one product.
// Requires the admin password in the x-admin-password header.
export async function onRequestPost({ request, env }) {
  const blocked = await guardAdmin(request, env, request.headers.get("x-admin-password") || "");
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  if (!body || !body.productId || body.stock == null) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const stock = Math.max(0, parseInt(body.stock, 10) || 0);
  await env.STOCK_KV.put("stock:" + body.productId, String(stock));
  return Response.json({ ok: true, productId: body.productId, stock });
}
