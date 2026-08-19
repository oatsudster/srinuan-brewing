// POST /api/admin-delete-order - permanently removes one order record.
// Requires the admin password in the x-admin-password header.
//
// Stock is deliberately left untouched. Deleting is used to clear test rows,
// but it would also be reachable for a real fulfilled order, and silently
// putting those cans back would corrupt the real inventory count.
export async function onRequestPost({ request, env }) {
  const auth = request.headers.get("x-admin-password") || "";
  if (!auth || auth !== env.ADMIN_PASSWORD) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const orderId = body && typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const key = "order:" + orderId;
  const raw = await env.STOCK_KV.get(key);
  if (!raw) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  await env.STOCK_KV.delete(key);
  return Response.json({ ok: true, deleted: orderId });
}
