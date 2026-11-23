import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarIcon,
  GiftIcon,
  LockIcon,
  SiteFooter,
  SiteHeader,
  SnowflakeIcon,
  StarIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/brand";
import { JoinForm } from "@/components/join-form";
import { getExchangeBySlug } from "@/lib/data";
import { formatBudget, formatEventDate, plural } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Приглашение в обмен",
  robots: { index: false, follow: false },
};

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exchange = await getExchangeBySlug(slug);
  if (!exchange) notFound();

  const drawn = exchange.status === "drawn";
  const names = exchange.participants.slice(0, 6).map((p) => p.name);

  return (
    <div className="min-h-screen">
      <div className="hero-shell text-cream-100">
        <SiteHeader
          actions={
            <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold-200">
              Приглашение
            </span>
          }
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:pb-20">
          <div>
            <p className="eyebrow text-gold-300">
              <SnowflakeIcon className="size-3.5" />
              Вас приглашают в Тайного Санту
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.5rem)] leading-[1.04] font-medium text-balance">
              {exchange.title}
            </h1>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-cream-200/75">
              {exchange.description ||
                `${exchange.organizerName} собирает участников для секретного обмена подарками. Присоединяйтесь — жеребьёвка всё расставит по местам.`}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="tag border border-cream-100/20 bg-cream-100/10 text-cream-100">
                <UsersIcon className="size-3.5" />
                {exchange.participants.length}{" "}
                {plural(exchange.participants.length, ["участник", "участника", "участников"])}
              </span>
              {formatEventDate(exchange.eventDate) ? (
                <span className="tag border border-cream-100/20 bg-cream-100/10 text-cream-100">
                  <CalendarIcon className="size-3.5" />
                  {formatEventDate(exchange.eventDate)}
                </span>
              ) : null}
              {formatBudget(exchange.budget) ? (
                <span className="tag border border-gold-300/30 bg-gold-300/10 text-gold-200">
                  <WalletIcon className="size-3.5" /> до {formatBudget(exchange.budget)}
                </span>
              ) : null}
            </div>

            {names.length > 0 ? (
              <div className="mt-8">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cream-200/50">
                  Уже в обмене
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex -space-x-2">
                    {names.slice(0, 4).map((name) => (
                      <span
                        key={name}
                        className="grid size-9 place-items-center rounded-full border border-pine-950/50 bg-pine-700 text-[0.65rem] font-bold text-gold-200"
                        title={name}
                      >
                        {name
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) => part[0]?.toUpperCase())
                          .join("")}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-cream-200/60">
                    {names.join(", ")}
                    {exchange.participants.length > names.length
                      ? ` и ещё ${exchange.participants.length - names.length}`
                      : ""}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: GiftIcon, title: "1 подарок", text: "одному человеку" },
                { icon: LockIcon, title: "Тайна", text: "никто не узнает" },
                { icon: StarIcon, title: "Сюрприз", text: "по вишлисту" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-cream-100/12 bg-cream-100/5 px-4 py-3"
                >
                  <item.icon className="size-4 text-gold-300" />
                  <p className="mt-2 text-sm font-bold text-cream-100">{item.title}</p>
                  <p className="text-xs text-cream-200/55">{item.text}</p>
                </div>
              ))}
            </div>

            {drawn ? (
              <div className="mt-8 rounded-2xl border border-gold-300/25 bg-gold-300/10 px-4 py-3 text-sm text-gold-200">
                Жеребьёвка уже проведена. Попросите организатора{" "}
                <span className="font-semibold">{exchange.organizerName}</span> добавить вас и
                распределить пары заново.
              </div>
            ) : null}
          </div>

          <div>
            {drawn ? (
              <div className="card p-6 sm:p-8">
                <span className="grid size-12 place-items-center rounded-full bg-cream-200 text-pine-700">
                  <LockIcon className="size-6" />
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-pine-900">
                  Приём участников закрыт
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-pine-900/60">
                  Жеребьёвка прошла — новые участники не могут присоединиться автоматически. Если вы
                  уже участвуете, откройте свою персональную ссылку: её прислал организатор.
                </p>
                <Link href="/" className="btn btn-outline btn-sm mt-5">
                  Узнать о сервисе
                </Link>
              </div>
            ) : (
              <JoinForm slug={slug} />
            )}
          </div>
        </div>
      </div>

      <main className="paper-grain px-5 py-14 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Заполните вишлист",
                text: "Пара строк о желаниях — и подарок станет точным попаданием.",
              },
              {
                step: "02",
                title: "Дождитесь жеребьёвки",
                text: "Организатор запустит её, когда все будут в списке.",
              },
              {
                step: "03",
                title: "Выберите подарок",
                text: "Ваш подопечный появится по вашей личной ссылке.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-3xl border border-pine-900/10 bg-cream-50/70 p-6">
                <span className="font-display text-3xl font-semibold text-gold-500/70">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-pine-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-pine-900/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
