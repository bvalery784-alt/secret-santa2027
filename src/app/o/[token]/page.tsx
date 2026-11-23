import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/brand";
import { OrganizerDashboard } from "@/components/organizer/organizer-dashboard";
import { getExchangeByOrganizerToken } from "@/lib/data";
import { formatBudget, formatEventDate, formatShortDate, plural } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Панель организатора",
  robots: { index: false, follow: false },
};

export default async function OrganizerPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const exchange = await getExchangeByOrganizerToken(token);
  if (!exchange) notFound();

  const drawn = exchange.status === "drawn";
  const readyCount = exchange.participants.filter((p) => p.giftReady).length;

  return (
    <div className="min-h-screen">
      <div className="hero-shell text-cream-100">
        <SiteHeader
          actions={
            <>
              <span className="hidden rounded-full border border-cream-100/20 bg-cream-100/5 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cream-200/70 sm:inline-flex">
                Панель организатора
              </span>
              <Link href="/" className="btn btn-ghost-light btn-sm">
                На главную
              </Link>
            </>
          }
        />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-gold-300">
                {drawn ? "Жеребьёвка проведена" : "Черновик обмена"}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.06] font-medium text-balance">
                {exchange.title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-200/70">
                {exchange.description ||
                  "Добавьте участников, отправьте им общую ссылку и проведите жеребьёвку, когда все будут готовы."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="tag border border-cream-100/20 bg-cream-100/10 text-cream-100">
                {exchange.participants.length}{" "}
                {plural(exchange.participants.length, ["участник", "участника", "участников"])}
              </span>
              {formatEventDate(exchange.eventDate) ? (
                <span className="tag border border-gold-300/30 bg-gold-300/10 text-gold-200">
                  {formatEventDate(exchange.eventDate)}
                </span>
              ) : null}
              {formatBudget(exchange.budget) ? (
                <span className="tag border border-cream-100/20 bg-cream-100/10 text-cream-100">
                  до {formatBudget(exchange.budget)}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-cream-100/12 bg-cream-100/5 px-5 py-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cream-200/50">
                Статус
              </p>
              <p className="mt-1.5 font-display text-xl text-cream-100">
                {drawn ? "Пары распределены" : "Ждём участников"}
              </p>
              <p className="mt-1 text-xs text-cream-200/55">
                {drawn
                  ? `Жеребьёвка ${formatShortDate(exchange.drawnAt) ?? "только что"}`
                  : "Минимум 3 человека для старта"}
              </p>
            </div>
            <div className="rounded-2xl border border-cream-100/12 bg-cream-100/5 px-5 py-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cream-200/50">
                Подарки готовы
              </p>
              <p className="mt-1.5 font-display text-xl text-cream-100">
                {readyCount} из {exchange.participants.length}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-100/15">
                <div
                  className="h-full rounded-full bg-gold-400 transition-all"
                  style={{
                    width: `${
                      exchange.participants.length
                        ? Math.round((readyCount / exchange.participants.length) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-cream-100/12 bg-cream-100/5 px-5 py-4">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cream-200/50">
                Организатор
              </p>
              <p className="mt-1.5 font-display text-xl text-cream-100">{exchange.organizerName}</p>
              <p className="mt-1 text-xs text-cream-200/55">Ссылка панели — только для вас</p>
            </div>
          </div>
        </div>
      </div>

      <main className="paper-grain px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <OrganizerDashboard
            organizerToken={token}
            slug={exchange.slug}
            exchange={{
              title: exchange.title,
              description: exchange.description,
              organizerName: exchange.organizerName,
              eventDate: exchange.eventDate,
              budget: exchange.budget,
              status: exchange.status,
            }}
            participants={exchange.participants.map((p) => ({
              id: p.id,
              name: p.name,
              email: p.email,
              wishlist: p.wishlist,
              token: p.token,
              gifteeId: p.gifteeId,
              giftReady: p.giftReady,
            }))}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
