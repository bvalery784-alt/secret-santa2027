import { getParticipantContext, sendHint, setGiftReady, updateWishlist } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const context = await getParticipantContext(token);
  if (!context) {
    return Response.json({ error: "Ссылка не найдена." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const action = String(body.action ?? "");

  if (action === "hint") {
    const result = await sendHint(context, body.body);
    if ("error" in result) return Response.json(result, { status: 400 });
    return Response.json({ ok: true });
  }

  if (action === "wishlist") {
    await updateWishlist(
      context.participant.id,
      body.wishlist,
      body.antiWishlist,
      body.wishlistItems,
    );
    return Response.json({ ok: true });
  }

  if (action === "complete") {
    await setGiftReady(context.participant.id, body.ready === true);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Неизвестное действие." }, { status: 400 });
}
