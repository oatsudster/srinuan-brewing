// POST /api/order - retired.
//
// The site is a catalogue now: it shows what we brew and how to reach us, and
// no sale is concluded through it. Selling alcohol by electronic means is
// prohibited in Thailand (ประกาศสำนักนายกรัฐมนตรี, 7 ธ.ค. 2563, issued under
// มาตรา 30(6)), so this endpoint must stay closed rather than merely be
// unlinked - an unlinked endpoint is still a live ordering channel.
//
// /api/payment-info, /api/submit-slip and /api/track-order stay up so the
// orders taken before the switch can still be paid and followed.
export async function onRequest() {
  return Response.json(
    { error: "ordering_closed" },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
