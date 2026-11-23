import { createExchange } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const result = await createExchange({
    title: payload.title,
    organizerName: payload.organizerName,
    organizerEmail: payload.organizerEmail,
    organizerPhoto: payload.organizerPhoto,
    format: payload.format,
    budget: payload.budget,
    drawDate: payload.drawDate,
    giftDeadline: payload.giftDeadline,
    eventDate: payload.eventDate ?? payload.giftDeadline,
    avatar: payload.avatar,
    cover: payload.cover,
    character: payload.character,
    messageHtml: payload.messageHtml,
    description: payload.description ?? payload.messageHtml,
    includeOrganizer: payload.includeOrganizer,
    initialParticipants: Array.isArray(payload.initialParticipants)
      ? payload.initialParticipants
      : undefined,
  });

  if ("error" in result) {
    return Response.json(result, { status: 400 });
  }

  return Response.json(result, { status: 201 });
}
