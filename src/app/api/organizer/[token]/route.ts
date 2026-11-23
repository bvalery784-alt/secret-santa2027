import {
  addParticipant,
  deleteExchange,
  drawAssignments,
  getExchangeByOrganizerToken,
  removeParticipant,
  resetDraw,
  setPairExclusion,
  updateExchange,
} from "@/lib/data";
import { cleanBudget, cleanDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const exchange = await getExchangeByOrganizerToken(token);
  if (!exchange) {
    return Response.json({ error: "Обмен не найден." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const action = String(body.action ?? "");

  if (action === "add") {
    if (exchange.status === "drawn") {
      return Response.json(
        {
          error:
            "Жеребьёвка уже проведена. Сначала сбросьте её, чтобы добавить новых участников.",
        },
        { status: 409 },
      );
    }
    const result = await addParticipant(exchange.id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      wishlist: body.wishlist,
      wishlistItems: body.wishlistItems,
      antiWishlist: body.antiWishlist,
    });
    if ("error" in result) return Response.json(result, { status: 400 });
    return Response.json({ ok: true, participantToken: result.participant.token });
  }

  if (action === "remove") {
    if (exchange.status === "drawn") {
      return Response.json(
        {
          error:
            "Сначала сбросьте жеребьёвку — иначе кто-то останется без подопечного. Пары будут перемешаны заново.",
        },
        { status: 409 },
      );
    }
    const participantId = Number(body.participantId);
    if (!Number.isInteger(participantId)) {
      return Response.json({ error: "Некорректный участник." }, { status: 400 });
    }
    await removeParticipant(exchange.id, participantId);
    return Response.json({ ok: true });
  }

  if (action === "exclude_pair") {
    const id1 = Number(body.id1);
    const id2 = Number(body.id2);
    const exclude = body.exclude !== false;
    const result = await setPairExclusion(exchange.id, id1, id2, exclude);
    return Response.json(result);
  }

  if (action === "draw") {
    const result = await drawAssignments(exchange.id);
    if ("error" in result) return Response.json(result, { status: 400 });
    return Response.json(result);
  }

  if (action === "reset") {
    await resetDraw(exchange.id);
    return Response.json({ ok: true });
  }

  if (action === "update") {
    await updateExchange(exchange.id, {
      title: body.title,
      organizerName: body.organizerName,
      organizerPhoto: body.organizerPhoto,
      format: body.format,
      drawDate: cleanDate(body.drawDate),
      giftDeadline: cleanDate(body.giftDeadline),
      eventDate: cleanDate(body.eventDate ?? body.giftDeadline),
      budget: cleanBudget(body.budget),
      avatar: body.avatar,
      cover: body.cover,
      character: body.character,
      messageHtml: body.messageHtml,
      description: body.description ?? body.messageHtml,
    });
    return Response.json({ ok: true });
  }

  if (action === "delete") {
    await deleteExchange(exchange.id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Неизвестное действие." }, { status: 400 });
}
