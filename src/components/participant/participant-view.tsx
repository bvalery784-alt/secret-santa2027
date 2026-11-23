"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import confetti from "canvas-confetti";
import {
  CheckIcon,
  GiftIcon,
  LockIcon,
  MailIcon,
  SnowflakeIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/brand";
import { Ban, Heart, MapPin } from "lucide-react";

type Props = {
  token: string;
  exchange: {
    title: string;
    description: string;
    organizerName: string;
    published: boolean;
    drawnAtLabel: string | null;
    eventDateLabel: string | null;
    budgetLabel: string | null;
  };
  participant: {
    name: string;
    wishlist: string;
    antiWishlist?: string;
    giftReady: boolean;
  };
  giftee: {
    name: string;
    wishlist: string;
    antiWishlist?: string;
    address?: string;
    giftReady: boolean;
  } | null;
  hints: Array<{ id: number; body: string; dateLabel: string }>;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ParticipantView({ token, exchange, participant, giftee, hints }: Props) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [giftReady, setGiftReady] = useState(participant.giftReady);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState(participant.wishlist);
  const [antiWishlist, setAntiWishlist] = useState(participant.antiWishlist || "");
  const [hintBody, setHintBody] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function send(action: string, payload: Record<string, unknown>) {
    setPending(action);
    setNotice(null);
    try {
      const response = await fetch(`/api/participant/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setNotice({ type: "error", text: data.error ?? "Не получилось. Попробуйте ещё раз." });
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setNotice({ type: "error", text: "Сеть подвела. Попробуйте ещё раз." });
      return false;
    } finally {
      setPending(null);
    }
  }

  function handleOpenEnvelope() {
    setRevealed(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ef233c", "#fbbf24", "#38bdf8", "#ffffff"],
      });
    } catch {
      // fallback
    }
  }

  async function toggleGiftReady() {
    const next = !giftReady;
    setGiftReady(next);
    const ok = await send("complete", { ready: next });
    if (!ok) setGiftReady(!next);
    if (ok) {
      setNotice({
        type: "success",
        text: next ? "Отметили: подарок готов. Организатор это увидит." : "Отметка снята.",
      });
    }
  }

  async function submitHint(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await send("hint", { body: hintBody });
    if (ok) {
      setHintBody("");
      setNotice({ type: "success", text: "Подсказка отправлена анонимно." });
    }
  }

  async function saveWishlist() {
    const ok = await send("wishlist", { wishlist, antiWishlist });
    if (ok) {
      setWishlistOpen(false);
      setNotice({ type: "success", text: "Ваш вишлист обновлён." });
    }
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {notice.type === "success" ? (
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-400" />
          ) : (
            <SparkleIcon className="mt-0.5 size-4 shrink-0 text-red-400" />
          )}
          <span>{notice.text}</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        <div className="space-y-6">
          {exchange.published && giftee ? (
            <section className="winter-card relative overflow-hidden">
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-gold-400/15 blur-3xl" />
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="winter-badge winter-badge-red text-xs">
                    <GiftIcon className="size-3.5" />
                    Ваш подопечный
                  </p>
                  <span className="winter-badge winter-badge-gold text-xs">
                    <LockIcon className="size-3" />
                    видно только вам
                  </span>
                </div>

                {revealed ? (
                  <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4">
                      <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 font-display text-2xl font-bold text-white shadow-xl">
                        {initials(giftee.name)}
                      </span>
                      <div>
                        <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gold-300">
                          вы дарите подарок
                        </p>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                          {giftee.name}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm text-snow-200/80">
                      Тсс… сохраняйте секретность до момента вручения! Ниже — вишлист и анти-вишлист.
                    </p>

                    {/* Giftee Wishlist details */}
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
                      <div>
                        <p className="winter-label flex items-center gap-1.5 text-gold-400">
                          <Heart className="size-3.5 text-red-400 fill-red-400" />
                          <span>Что хочет получить в подарок:</span>
                        </p>
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-snow-100">
                          {giftee.wishlist || "Подопечный пока не заполнил подробный вишлист."}
                        </p>
                      </div>

                      {giftee.antiWishlist && (
                        <div className="pt-3 border-t border-white/10">
                          <p className="winter-label flex items-center gap-1.5 text-red-400">
                            <Ban className="size-3.5" />
                            <span>Что точно не стоит дарить:</span>
                          </p>
                          <p className="mt-1.5 text-xs text-snow-200/80 leading-relaxed whitespace-pre-line">
                            {giftee.antiWishlist}
                          </p>
                        </div>
                      )}

                      {giftee.address && (
                        <div className="pt-3 border-t border-white/10">
                          <p className="winter-label flex items-center gap-1.5 text-blue-300">
                            <MapPin className="size-3.5" />
                            <span>Адрес для доставки курьером:</span>
                          </p>
                          <p className="mt-1 text-xs text-snow-100 font-mono bg-white/5 p-2 rounded-lg">
                            {giftee.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-red-500/40 bg-red-600/10 px-5 py-8 text-center space-y-3">
                    <span className="text-5xl animate-bounce">💌</span>
                    <p className="font-display text-xl font-bold text-white">
                      Имя спрятано в конверте
                    </p>
                    <p className="max-w-xs text-xs text-snow-200/80 mx-auto">
                      Убедитесь, что рядом нет любопытных коллег — и сорвите ленточку!
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenEnvelope}
                      className="btn-primary mt-3 text-sm font-bold shadow-lg shadow-red-600/40"
                    >
                      <GiftIcon className="size-4" />
                      <span>Открыть конверт и узнать имя</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="winter-card p-6 sm:p-10 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/5 text-2xl">
                ❄️
              </span>
              <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold text-white">
                Жеребьёвка пока не проведена
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-snow-200/80 leading-relaxed">
                {exchange.organizerName} ещё собирает участников. Как только пары распределят, эта
                страница покажет вашего подопечного. Загляните позже — ссылка останется рабочей.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-400/20 px-4 py-2 text-xs font-semibold text-gold-300">
                <SparkleIcon className="size-3.5" />
                Пока можно заполнить или дополнить свой вишлист ниже
              </div>
            </section>
          )}

          {/* Редактирование своего вишлиста */}
          <section className="winter-card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="winter-label text-gold-400">Мои пожелания</p>
                <h2 className="text-lg font-bold text-white">Ваш вишлист и анти-подарки</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWishlist(participant.wishlist);
                  setAntiWishlist(participant.antiWishlist || "");
                  setWishlistOpen((v) => !v);
                }}
                className="btn-secondary !py-1.5 !px-3 text-xs font-bold"
              >
                {wishlistOpen ? "Закрыть" : "Редактировать"}
              </button>
            </div>

            {wishlistOpen ? (
              <div className="space-y-4">
                <div>
                  <label className="winter-label">Что хотели бы получить в подарок:</label>
                  <textarea
                    value={wishlist}
                    onChange={(e) => setWishlist(e.target.value)}
                    rows={4}
                    maxLength={1500}
                    placeholder="Что вам действительно пригодится? Размеры, любимые ароматы..."
                    className="winter-input resize-y text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="winter-label">Что точно не стоит дарить:</label>
                  <textarea
                    value={antiWishlist}
                    onChange={(e) => setAntiWishlist(e.target.value)}
                    rows={2}
                    maxLength={1500}
                    placeholder="Признайтесь, что вам больше не нужны конфеты и шампуни..."
                    className="winter-input text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={saveWishlist}
                    className="btn-gold !py-2 !px-4 text-xs font-bold"
                    disabled={pending === "wishlist"}
                  >
                    {pending === "wishlist" ? "Сохраняем…" : "Сохранить пожелания"}
                  </button>
                  <span className="text-[11px] text-snow-300/50">{wishlist.length} / 1500</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <p className="text-[11px] font-bold text-gold-400 uppercase tracking-wider mb-1">
                    Хочу в подарок:
                  </p>
                  <p className="text-xs sm:text-sm text-snow-100 whitespace-pre-line leading-relaxed">
                    {participant.wishlist || "Пока не заполнено — нажмите «Редактировать»!"}
                  </p>
                </div>

                {participant.antiWishlist && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
                    <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-1">
                      Точно не дарить:
                    </p>
                    <p className="text-xs text-snow-200/90 whitespace-pre-line leading-relaxed">
                      {participant.antiWishlist}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar: Readiness & Hints */}
        <div className="space-y-6">
          {exchange.published && giftee ? (
            <>
              {/* Подарок готов */}
              <section className="winter-card p-6">
                <p className="winter-label text-gold-400">Статус подготовки</p>
                <h3 className="text-base font-bold text-white mt-1">Подарок уже готов?</h3>
                <p className="text-xs text-snow-300/70 mt-1">
                  Отметьте, когда всё будет упаковано. Организатор увидит процент готовности группы.
                </p>

                <button
                  type="button"
                  onClick={toggleGiftReady}
                  disabled={pending === "complete"}
                  className={`mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                    giftReady
                      ? "border-emerald-500/40 bg-emerald-500/15"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="text-left">
                    <span
                      className={`block text-xs sm:text-sm font-bold ${
                        giftReady ? "text-emerald-300" : "text-white"
                      }`}
                    >
                      {giftReady ? "✓ Подарок куплен и упакован" : "Отметить подарок как готовый"}
                    </span>
                    <span className="text-[10px] text-snow-300/60 block mt-0.5">
                      {giftReady ? "Можно снять отметку в любой момент" : "Нажмите, когда всё готово"}
                    </span>
                  </span>

                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-xl border ${
                      giftReady
                        ? "border-emerald-400 bg-emerald-500 text-white"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <CheckIcon className="size-4" />
                  </span>
                </button>
              </section>

              {/* Анонимная подсказка подопечному */}
              <section className="winter-card p-6">
                <p className="winter-label text-red-400">Анонимное послание</p>
                <h3 className="text-base font-bold text-white mt-1">Подсказка подопечному</h3>
                <p className="text-xs text-snow-300/70 mt-1">
                  Намекните на сюрприз или уточните размер/детали. Ваше имя останется в тайне!
                </p>

                <form onSubmit={submitHint} className="mt-4 space-y-3">
                  <textarea
                    value={hintBody}
                    onChange={(e) => setHintBody(e.target.value)}
                    rows={3}
                    maxLength={500}
                    required
                    minLength={2}
                    placeholder={`Привет, ${giftee.name.split(" ")[0]}! Я твой Тайный Санта…`}
                    className="winter-input text-xs"
                  />
                  <button
                    className="btn-primary w-full !py-2 text-xs font-bold"
                    disabled={pending === "hint" || hintBody.trim().length < 2}
                  >
                    {pending === "hint" ? "Отправляем…" : "Отправить анонимно"}
                  </button>
                </form>
              </section>
            </>
          ) : null}

          {/* Входящие подсказки */}
          <section className="winter-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="winter-label text-gold-400">Входящие</p>
              <span className="winter-badge winter-badge-gold text-[10px]">{hints.length}</span>
            </div>
            <h3 className="text-base font-bold text-white">Подсказки от вашего Санты</h3>

            {hints.length === 0 ? (
              <p className="text-xs text-snow-300/60 mt-2">
                Пока тихо. Ваш Санта, скорее всего, уже в поисках лучшего подарка!
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {hints.map((hint) => (
                  <li
                    key={hint.id}
                    className="rounded-xl border border-gold-400/30 bg-gold-400/10 p-3 text-xs"
                  >
                    <p className="text-snow-100 leading-relaxed">{hint.body}</p>
                    <p className="mt-1.5 text-[10px] font-bold text-gold-300 uppercase tracking-wider">
                      {hint.dateLabel} · Тайный Санта
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
