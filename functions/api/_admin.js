// Shared admin auth + brute-force throttle.
//
// The leading underscore keeps Cloudflare Pages from routing this file, so it
// is import-only. Every admin endpoint calls guardAdmin() before trusting the
// password, which turns "unlimited guesses" into "5 wrong tries per IP per 15
// minutes" - the counter lives in the same KV namespace and expires itself.
//
// KV is eventually consistent, so a determined attacker spraying many edge
// locations at once could slip a few extra guesses through before the count
// catches up. That is fine here: it still turns an overnight brute force into
// something that would take longer than the heat death of the shop, which is
// all this single-password admin needs. If it ever guards something richer,
// move to Cloudflare's native Rate Limiting rules or a Durable Object counter.

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

// Length-independent compare so a wrong password cannot be distinguished by how
// long the check took. Rate limiting is the real defence; this is cheap insurance.
function safeEqual(a, b) {
  a = String(a || "");
  b = String(b || "");
  let diff = a.length ^ b.length;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
  }
  return diff === 0;
}

// Returns null when the caller may proceed, otherwise a Response to return as-is
// (429 when throttled, 401 when the password is simply wrong).
export async function guardAdmin(request, env, password) {
  const key = "ratelimit:admin:" + clientIp(request);
  let fails = 0;
  try {
    fails = parseInt((await env.STOCK_KV.get(key)) || "0", 10) || 0;
  } catch (err) {
    console.error("rate-limit read failed:", err);
  }

  if (fails >= MAX_ATTEMPTS) {
    return Response.json(
      { error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": String(WINDOW_SECONDS) } }
    );
  }

  if (env.ADMIN_PASSWORD && safeEqual(password, env.ADMIN_PASSWORD)) {
    // A legit admin who fat-fingered a couple of times shouldn't stay one slip
    // from the wall, so a success wipes the counter.
    if (fails > 0) { try { await env.STOCK_KV.delete(key); } catch (err) { /* best effort */ } }
    return null;
  }

  // Wrong password: bump the counter and (re)start the window from now.
  try {
    await env.STOCK_KV.put(key, String(fails + 1), { expirationTtl: WINDOW_SECONDS });
  } catch (err) {
    console.error("rate-limit write failed:", err);
  }
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
