// POST /api/admin-login - checks the admin password against the server-side secret.
export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== "string" || body.password !== env.ADMIN_PASSWORD) {
    return Response.json({ ok: false }, { status: 401 });
  }
  return Response.json({ ok: true });
}
