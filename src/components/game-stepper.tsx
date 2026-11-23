"use client";

import { Sparkles, Mail, FileText, Shuffle } from "lucide-react";

export type ScreenId = 1 | 2 | 3 | 4;

interface Props {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  gameTitle?: string;
  isDrawn?: boolean;
  participantCount?: number;
  onResetGame?: () => void;
}

export function GameStepper({
  currentScreen,
  onSelectScreen,
  gameTitle,
  isDrawn,
  participantCount = 0,
  onResetGame,
}: Props) {
  const screens = [
    {
      id: 1 as ScreenId,
      label: "Экран 1: Создание",
      sub: "Настройки и оформление",
      icon: Sparkles,
      badge: "Организатор",
    },
    {
      id: 2 as ScreenId,
      label: "Экран 2: Приглашение",
      sub: "Что видят игроки",
      icon: Mail,
      badge: "Визитка",
    },
    {
      id: 3 as ScreenId,
      label: "Экран 3: Анкета",
      sub: "Вишлист и анти-подарки",
      icon: FileText,
      badge: `${participantCount} игроков`,
    },
    {
      id: 4 as ScreenId,
      label: "Экран 4: Жеребьёвка",
      sub: isDrawn ? "Пары распределены" : "Определение подопечных",
      icon: Shuffle,
      badge: isDrawn ? "Готово 🎅" : "Секретно",
      activeColor: isDrawn ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-winter-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-xl shadow-lg shadow-red-600/30">
            🎅
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                Тайный Санта
              </span>
              <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-red-400">
                2026
              </span>
            </div>
            <p className="text-xs text-snow-300/70 truncate max-w-[220px] sm:max-w-xs">
              {gameTitle || "Новогодний обмен подарками"}
            </p>
          </div>
        </div>

        {/* Screen navigator */}
        <nav className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-winter-900/90 p-1.5 shadow-inner">
          {screens.map((s) => {
            const Icon = s.icon;
            const active = currentScreen === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectScreen(s.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  active
                    ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30"
                    : "text-snow-300/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`size-4 ${active ? "text-white" : "text-snow-300/60"}`} />
                <span className="hidden md:inline">{s.label}</span>
                <span className="md:hidden">Э{s.id}</span>
                {s.badge && (
                  <span
                    className={`hidden rounded-full px-1.5 py-0.2 text-[0.62rem] font-bold uppercase tracking-wider lg:inline-block ${
                      active ? "bg-white/20 text-white" : "bg-white/10 text-snow-300/60"
                    }`}
                  >
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Reset button */}
        {onResetGame && (
          <button
            type="button"
            onClick={onResetGame}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 hover:text-white"
            title="Сбросить все данные и начать заново"
          >
            <span>🔄</span>
            <span className="hidden sm:inline">Начать заново</span>
          </button>
        )}
      </div>
    </header>
  );
}
