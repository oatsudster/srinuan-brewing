// POST /api/admin-ship - marks an order as shipped with a tracking number,
// and emails the customer via Resend (if they gave an email and RESEND_API_KEY
// is configured). Requires the admin password in the x-admin-password header.
async function sendTrackingEmail(env, order) {
  if (!order.email || !env.RESEND_API_KEY) return { sent: false };
  try {
    const carrierLine = order.carrier ? order.carrier + " - " : "";
    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
      "<p>Hi " + order.name + ",</p>" +
      "<p>Your Srinuan Brewing order <strong>#" + order.id + "</strong> has shipped!</p>" +
      "<p><strong>Tracking number:</strong> " + carrierLine + order.trackingNumber + "</p>" +
      "<p>Thank you for your order!</p>" +
      "</body></html>";
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        from: "Srinuan Brewing <onboarding@resend.dev>",
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
  const auth = request.headers.get("x-admin-password") || "";
  if (!auth || auth !== env.ADMIN_PASSWORD) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.orderId || !body.trackingNumber) {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const key = "order:" + body.orderId;
  const raw = await env.STOCK_KV.get(key);
  if (!raw) return Response.json({ error: "not_found" }, { status: 404 });

  const order = JSON.parse(raw);
  order.status = "shipped";
  order.trackingNumber = String(body.trackingNumber).trim().slice(0, 100);
  order.carrier = body.carrier ? String(body.carrier).trim().slice(0, 50) : null;
  order.shippedAt = new Date().toISOString();

  await env.STOCK_KV.put(key, JSON.stringify(order));
  const emailResult = await sendTrackingEmail(env, order);

  return Response.json({ ok: true, emailSent: emailResult.sent });
}
