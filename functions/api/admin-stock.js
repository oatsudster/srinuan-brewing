import { guardAdmin } from "./_admin.js";
// POST /api/admin-stock - updates the stock count for one product.
// Requires the admin password in the x-admin-password header.
export async function onRequestPost({ request, env }) {
  const blocked = await guardAdmin(request, env, request.headers.get("x-admin-password") || "");
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  // Product ids are short slugs (see js/products.js); anything else would
  // write a junk key that /api/stock then serves to every visitor.
  const productId = body && typeof body.productId === "string" ? body.productId.trim() : "";
  if (!/^[a-z0-9-]{1,40}$/.test(productId) || body.stock == null) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const stock = Math.max(0, parseInt(body.stock, 10) || 0);
  await env.STOCK_KV.put("stock:" + productId, String(stock));
  return Response.json({ ok: true, productId, stock });
}
