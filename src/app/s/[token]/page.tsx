import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ParticipantView } from "@/components/participant/participant-view";
import { Snowfall } from "@/components/snowflakes";
import { getParticipantContext } from "@/lib/data";
import { formatBudget, formatEventDate, formatShortDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ваш Тайный Санта",
  robots: { index: false, follow: false },
};

export default async function ParticipantPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const context = await getParticipantContext(token);
  if (!context) notFound();

  const { participant, exchange, giftee, receivedHints } = context;

  return (
    <div className="min-h-screen bg-winter-sky text-snow-100 flex flex-col relative selection:bg-red-600 selection:text-white">
      <Snowfall />

      <header className="border-b border-white/10 bg-winter-950/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-snow-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>На главную страницу игры</span>
          </Link>
          <span className="winter-badge winter-badge-gold text-[11px]">🎅 Кабинет участника</span>
        </div>
      </header>

      <main className="flex-1 pb-16 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="winter-badge winter-badge-red text-xs mb-3">
              ❄️ {exchange.title}
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Привет, {participant.name}!
            </h1>
            <p className="text-xs sm:text-sm text-snow-200/80 mt-1 max-w-2xl">
              {giftee
                ? "Ниже указан ваш тайный подопечный и его пожелания к подарку. Не раскрывайте секрет раньше времени!"
                : "Организатор ещё собирает участников перед жеребьёвкой. Пока можно дополнить свой вишлист."}
            </p>
          </div>

          <ParticipantView
            token={token}
            exchange={{
              title: exchange.title,
              description: exchange.description,
              organizerName: exchange.organizerName,
              published: exchange.status === "drawn",
              drawnAtLabel: formatShortDate(exchange.drawnAt),
              eventDateLabel: formatEventDate(exchange.giftDeadline || exchange.eventDate),
              budgetLabel: formatBudget(exchange.budget),
            }}
            participant={{
              name: participant.name,
              wishlist: participant.wishlist,
              antiWishlist: participant.antiWishlist || "",
              giftReady: participant.giftReady,
            }}
            giftee={
              giftee
                ? {
                    name: giftee.name,
                    wishlist: giftee.wishlist,
                    antiWishlist: giftee.antiWishlist || "",
                    address: giftee.address || "",
                    giftReady: giftee.giftReady,
                  }
                : null
            }
            hints={receivedHints.map((hint) => ({
              id: hint.id,
              body: hint.body,
              dateLabel: formatShortDate(hint.createdAt) ?? "только что",
            }))}
          />
        </div>
      </main>
    </div>
  );
}
