// GET /api/stock - public, returns current stock count for every product.
export async function onRequestGet({ env }) {
  const list = await env.STOCK_KV.list({ prefix: "stock:" });
  const result = {};
  for (const key of list.keys) {
    const id = key.name.slice("stock:".length);
    const val = await env.STOCK_KV.get(key.name);
    result[id] = val !== null ? parseInt(val, 10) : 0;
  }
  return Response.json(result);
}
