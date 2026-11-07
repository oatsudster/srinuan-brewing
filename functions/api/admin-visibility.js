import { guardAdmin } from "./_admin.js";
// POST /api/admin-visibility { productId, hidden } - takes a beer off the
// storefront (hidden: true) or puts it back (hidden: false). Nothing about the
// beer is deleted, so showing it again restores it exactly as it was.
// Requires the admin password in the x-admin-password header.
export async function onRequestPost({ request, env }) {
  const blocked = await guardAdmin(request, env, request.headers.get("x-admin-password") || "");
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const productId = body && typeof body.productId === "string" ? body.productId.trim() : "";
  if (!/^[a-z0-9-]{1,40}$/.test(productId) || typeof body.hidden !== "boolean") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const key = "hidden:" + productId;
  if (body.hidden) {
    await env.STOCK_KV.put(key, "1");
  } else {
    await env.STOCK_KV.delete(key);
  }
  return Response.json({ ok: true, productId, hidden: body.hidden });
}
