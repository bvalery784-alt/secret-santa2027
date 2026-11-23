"use client";

import {
  Sparkles,
  Calendar,
  Wallet,
  Users,
  MapPin,
  Laptop,
  Gift,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Smile,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import {
  SANTA_CHARACTERS,
  AVATAR_PRESETS,
  COVER_THEMES,
} from "@/lib/game-constants";
import type { GameFormData } from "./screen-one-create";

interface Props {
  gameData: GameFormData;
  onJoinClick: () => void;
  inviteSlug?: string;
}

export function ScreenTwoInvite({ gameData, onJoinClick, inviteSlug }: Props) {
  const [copied, setCopied] = useState(false);

  const selectedCharacter =
    SANTA_CHARACTERS.find((c) => c.id === gameData.character) || SANTA_CHARACTERS[0];
  const selectedTheme =
    COVER_THEMES.find((t) => t.id === gameData.cover) || COVER_THEMES[0];
  const selectedAvatar =
    AVATAR_PRESETS.find((a) => a.id === gameData.avatar) || AVATAR_PRESETS[0];

  function copyInviteLink() {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/invite/${inviteSlug || "demo"}`
      : "";
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Badge indicating Screen 2 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="winter-badge winter-badge-red text-xs">
          <Sparkles className="size-3.5" /> Экран 2 из 4 · Страница приглашения (видят игроки)
        </span>

        {inviteSlug && (
          <button
            type="button"
            onClick={copyInviteLink}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Ссылка скопирована!" : "Скопировать ссылку для чата"}</span>
          </button>
        )}
      </div>

      {/* Hero card with custom cover & avatar */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/15 p-6 sm:p-10 shadow-2xl mb-8"
        style={{ background: selectedTheme.cssGradient }}
      >
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Кто приглашает */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-3xl shadow-lg border border-white/25">
                {selectedAvatar.emoji}
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-snow-300/70">
                  Кто приглашает
                </p>
                <h3 className="text-lg font-bold text-white sm:text-xl">
                  {gameData.organizerName || "Организатор игры"}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="winter-badge winter-badge-gold">
                {gameData.format === "online" ? (
                  <>
                    <Laptop className="size-3.5" /> Онлайн с доставкой
                  </>
                ) : (
                  <>
                    <MapPin className="size-3.5" /> Офлайн в офисе / дома
                  </>
                )}
              </span>
              <span className="winter-badge winter-badge-blue">
                <Users className="size-3.5" /> {gameData.participants.length} участников
              </span>
            </div>
          </div>

          {/* Game Title */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-300">
              Новогодний секретный обмен подарками
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              {gameData.title || "Тайный Санта 2026"}
            </h1>

            {/* Сообщение организатора */}
            {gameData.messageHtml && (
              <div className="mt-5 rounded-2xl border border-white/15 bg-winter-950/60 p-4 sm:p-5 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-wider text-red-300 mb-2 flex items-center gap-1.5">
                  <span>✉️</span> Обращение от организатора:
                </p>
                <div className="text-sm sm:text-base text-snow-100 whitespace-pre-line leading-relaxed">
                  {gameData.messageHtml}
                </div>
              </div>
            )}
          </div>

          {/* Metadata badges: dates, budget */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <span className="winter-label flex items-center gap-1 text-[0.68rem]">
                <Calendar className="size-3 text-gold-400" /> Жеребьёвка
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {gameData.drawDate
                  ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(
                      new Date(`${gameData.drawDate}T12:00:00Z`),
                    )
                  : "Скоро"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <span className="winter-label flex items-center gap-1 text-[0.68rem]">
                <Gift className="size-3 text-red-400" /> Покупаем подарки до
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {gameData.giftDeadline
                  ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(
                      new Date(`${gameData.giftDeadline}T12:00:00Z`),
                    )
                  : "К празднику"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <span className="winter-label flex items-center gap-1 text-[0.68rem]">
                <Wallet className="size-3 text-emerald-400" /> Бюджет на подарок
              </span>
              <p className="text-sm font-bold text-white mt-1">
                {gameData.budget ? `до ${gameData.budget.toLocaleString("ru-RU")} ₽` : "По договорённости"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Specified Text Block 1: «Что это вообще за игра "Тайный Санта"?» */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <section className="winter-card p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid size-10 place-items-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <HelpCircle className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Что это вообще за игра &laquo;Тайный Санта&raquo;?
            </h2>
          </div>

          <p className="text-sm sm:text-base text-snow-200/90 leading-relaxed">
            Новогодний обмен подарками: каждый участник становится тайным Сантой и анонимно готовит
            подарок для другого участника. В итоге каждый получает и радость подготовки сюрприза, и сам
            подарок. А ещё это экономно ;)
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-snow-300">
            <Smile className="size-4 text-gold-400 shrink-0" />
            <span>Один классный подарок вместо десяти случайных безделушек!</span>
          </div>
        </section>

        {/* Specified Text Block 2: «Какие правила и как играть?» */}
        <section className="winter-card p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid size-10 place-items-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <ShieldCheck className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Какие правила и как играть?</h2>
          </div>

          <p className="text-sm sm:text-base text-snow-200/90 leading-relaxed">
            Вы регистрируетесь на сервисе, указываете свои данные и оставляете подсказки, что бы вы
            хотели получить в подарок, а что точно нет. В день жеребьёвки вы узнаете, кому дарить
            подарок, и отправляетесь готовить сюрприз. Важно подарить его тайно и вовремя, чтобы
            сохранить секретность.
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-snow-300">
            <Sparkles className="size-4 text-emerald-400 shrink-0" />
            <span>Никаких случайных пар «сам себе» — алгоритм всё распределит честно.</span>
          </div>
        </section>
      </div>

      {/* Santa Character card banner */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-winter-900 via-winter-850 to-winter-900 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-3xl shadow-lg border border-white/20">
            {selectedCharacter.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">{selectedCharacter.name}</span>
              <span className="text-[10px] font-bold text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full">
                {selectedCharacter.badge}
              </span>
            </div>
            <p className="text-xs text-snow-300/80 mt-0.5">{selectedCharacter.description}</p>
          </div>
        </div>
      </div>

      {/* Button «Участвовать» (Lead to Screen 3) */}
      <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-600/20 via-winter-900 to-red-600/10 p-6 sm:p-8 shadow-xl">
        <div>
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
            Готовы подарить новогоднее чудо?
          </h3>
          <p className="text-xs sm:text-sm text-snow-200/80 mt-1">
            Заполните короткую анкету с вишлистом — и вы в игре!
          </p>
        </div>

        <button
          type="button"
          onClick={onJoinClick}
          className="btn-primary text-base font-bold shadow-xl shadow-red-600/50 hover:shadow-red-600/70"
        >
          <span>Участвовать</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
