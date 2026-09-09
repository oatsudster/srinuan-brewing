import { guardAdmin } from "./_admin.js";
// GET /api/admin-orders - lists recent orders. Requires the admin password
// in the x-admin-password header.
export async function onRequestGet({ request, env }) {
  const blocked = await guardAdmin(request, env, request.headers.get("x-admin-password") || "");
  if (blocked) return blocked;

  const list = await env.STOCK_KV.list({ prefix: "order:" });
  const orders = [];
  for (const key of list.keys) {
    const raw = await env.STOCK_KV.get(key.name);
    if (raw) {
      try { orders.push(JSON.parse(raw)); } catch (e) { /* skip malformed */ }
    }
  }
  orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return Response.json(orders, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
  });
}
