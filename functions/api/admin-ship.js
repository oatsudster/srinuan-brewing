import { guardAdmin } from "./_admin.js";
// POST /api/admin-ship - marks an order as shipped with a tracking number,
// and emails the customer via Resend (if they gave an email and RESEND_API_KEY
// is configured). Requires the admin password in the x-admin-password header.
//
// Resend's shared onboarding@resend.dev sender only delivers to the Resend
// account owner, so customer emails need a sender on a verified domain: set
// RESEND_FROM (e.g. "Srinuan Brewing <orders@your-domain>") in Cloudflare.
function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function sendTrackingEmail(env, order) {
  if (!order.email || !env.RESEND_API_KEY) return { sent: false };
  try {
    const trackUrl = "https://track.thailandpost.co.th/?trackNumber=" + encodeURIComponent(order.trackingNumber);
    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
      "<p>Hi " + escapeHtml(order.name) + ",</p>" +
      "<p>Your Srinuan Brewing order <strong>#" + escapeHtml(order.id) + "</strong> has shipped via " + escapeHtml(order.carrier) + "!</p>" +
      '<p><a href="' + escapeHtml(trackUrl) + '" style="display:inline-block;padding:12px 24px;background:#d9a45b;color:#0d1b2a;text-decoration:none;border-radius:8px;font-weight:bold;">Track Your Package</a></p>' +
      "<p>Thank you for your order!</p>" +
      "</body></html>";
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || "Srinuan Brewing <onboarding@resend.dev>",
        to: [order.email],
        subject: "Your Srinuan Brewing order has shipped - #" + order.id,
        html
      })
    });
    if (!resp.ok) {
      console.error("Resend send failed:", await resp.text());
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Resend send error:", err);
    return { sent: false };
  }
}

export async function onRequestPost({ request, env }) {
  const blocked = await guardAdmin(request, env, request.headers.get("x-admin-password") || "");
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  if (!body || !body.orderId) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const key = "order:" + body.orderId;
  const raw = await env.STOCK_KV.get(key);
  if (!raw) return Response.json({ error: "not_found" }, { status: 404 });

  const order = JSON.parse(raw);
  const isPickup = order.deliveryMethod === "pickup";
  if (!isPickup && !body.trackingNumber) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  order.status = "shipped";
  order.trackingNumber = isPickup ? null : String(body.trackingNumber).trim().slice(0, 100);
  order.carrier = isPickup ? null : (body.carrier ? String(body.carrier).trim().slice(0, 50) : null);
  order.shippedAt = new Date().toISOString();

  await env.STOCK_KV.put(key, JSON.stringify(order));
  const emailResult = isPickup ? { sent: false } : await sendTrackingEmail(env, order);

  return Response.json({ ok: true, emailSent: emailResult.sent });
}
