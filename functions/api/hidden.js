// GET /api/hidden - public, lists the product ids the shop has taken off the
// storefront. The beers stay in js/products.js; the page just skips these.
export async function onRequestGet({ env }) {
  const list = await env.STOCK_KV.list({ prefix: "hidden:" });
  const ids = list.keys.map(function (k) { return k.name.slice("hidden:".length); });
  return Response.json(ids, {
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
  });
}
