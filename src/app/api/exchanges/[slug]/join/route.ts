import { addParticipant, getExchangeBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const exchange = await getExchangeBySlug(slug);
  if (!exchange) {
    return Response.json({ error: "Обмен не найден." }, { status: 404 });
  }
  if (exchange.status === "drawn") {
    return Response.json(
      {
        error:
          "Жеребьёвка в этом обмене уже прошла. Напишите организатору — он сможет добавить вас и провести её заново.",
      },
      { status: 409 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Некорректный запрос." }, { status: 400 });
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

  if ("error" in result) {
    return Response.json(result, { status: 400 });
  }

  return Response.json({ ok: true, participantToken: result.participant.token }, { status: 201 });
}
