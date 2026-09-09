// POST /api/admin-login - checks the admin password against the server-side
// secret, behind the shared brute-force throttle.
import { guardAdmin } from "./_admin.js";

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => null);
  const password = body && typeof body.password === "string" ? body.password : "";
  const blocked = await guardAdmin(request, env, password);
  if (blocked) {
    // Keep the client's { ok } contract; add a flag so it can show a wait message.
    const throttled = blocked.status === 429;
    return Response.json({ ok: false, throttled }, { status: blocked.status });
  }
  return Response.json({ ok: true });
}
