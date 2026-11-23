"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Shuffle,
  Lock,
  Gift,
  Heart,
  Ban,
  MapPin,
  Check,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  Shield,
  HelpCircle,
  PartyPopper,
} from "lucide-react";
import type { GameFormData } from "./screen-one-create";

export interface ExclusionPair {
  id1: number;
  id2: number;
  name1: string;
  name2: string;
}

export interface DrawAssignment {
  giverIndex: number;
  giverName: string;
  receiverIndex: number;
  receiverName: string;
  receiverWishlist?: string;
  receiverWishlistItems?: string[];
  receiverAntiWishlist?: string;
  receiverAddress?: string;
}

interface Props {
  gameData: GameFormData;
  assignments: DrawAssignment[];
  isDrawn: boolean;
  onExecuteDraw: (exclusions: Array<[number, number]>) => void;
  onResetGame: () => void;
  onRedraw?: () => void;
  isDrawing?: boolean;
}

export function ScreenFourDraw({
  gameData,
  assignments,
  isDrawn,
  onExecuteDraw,
  onResetGame,
  onRedraw,
  isDrawing = false,
}: Props) {
  // Exclusion manager state
  const [showExclusionsModal, setShowExclusionsModal] = useState(false);
  const [exclusions, setExclusions] = useState<Array<[number, number]>>([]);
  const [exclP1, setExclP1] = useState<number>(0);
  const [exclP2, setExclP2] = useState<number>(1);

  // Secret Player Viewer: "Каждый игрок видит ТОЛЬКО своё назначение (вводит своё имя — получает «Ты даришь подарок: ...»)"
  const [searchName, setSearchName] = useState("");
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [viewError, setViewError] = useState<string | null>(null);

  // Organizer view: hidden by default to keep mystery
  const [showOrganizerMasterList, setShowOrganizerMasterList] = useState(false);

  // Add exclusion pair
  function handleAddExclusion() {
    if (exclP1 === exclP2) return;
    const exists = exclusions.some(
      ([a, b]) => (a === exclP1 && b === exclP2) || (a === exclP2 && b === exclP1),
    );
    if (!exists) {
      setExclusions((prev) => [...prev, [exclP1, exclP2]]);
    }
  }

  // Remove exclusion
  function handleRemoveExclusion(index: number) {
    setExclusions((prev) => prev.filter((_, i) => i !== index));
  }

  // Trigger draw with confetti
  function handleDrawClick() {
    onExecuteDraw(exclusions);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ef233c", "#fbbf24", "#38bdf8", "#ffffff"],
      });
    } catch {
      // fallback
    }
  }

  // Player search & reveal
  function handleFindMyAssignment() {
    setViewError(null);
    const query = searchName.trim().toLowerCase();
    if (!query) {
      setViewError("Введите ваше имя");
      return;
    }

    const foundIdx = gameData.participants.findIndex((p) =>
      p.name.toLowerCase().includes(query),
    );

    if (foundIdx === -1) {
      setViewError("Игрок с таким именем не найден в списке обмена.");
      return;
    }

    setSelectedPlayerIndex(foundIdx);
    setIsRevealed(false);
  }

  function handleOpenEnvelope() {
    setIsRevealed(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#ef233c", "#fbbf24", "#ffffff"],
      });
    } catch {
      // fallback
    }
  }

  // Find active assignment for revealed player
  const currentAssignment =
    selectedPlayerIndex !== null
      ? assignments.find((a) => a.giverIndex === selectedPlayerIndex)
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Badge indicating Screen 4 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="winter-badge winter-badge-red text-xs">
          <Sparkles className="size-3.5" /> Экран 4 из 4 · Жеребьёвка
        </span>

        {/* Button «Начать заново» */}
        <button
          type="button"
          onClick={onResetGame}
          className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          <RotateCcw className="size-3.5" />
          <span>Начать заново</span>
        </button>
      </div>

      {/* Main Draw Control Card */}
      <div className="winter-card p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg">
              <Shuffle className="size-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {isDrawn ? "Жеребьёвка завершена!" : "Проведение жеребьёвки"}
              </h1>
              <p className="text-xs sm:text-sm text-snow-200/80 mt-0.5">
                Игра: <strong className="text-white">{gameData.title}</strong> · {gameData.participants.length} игроков
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isDrawn ? (
              <span className="winter-badge winter-badge-gold">
                <Check className="size-3.5" /> Пары распределены
              </span>
            ) : (
              <span className="winter-badge winter-badge-blue">
                <ClockIcon className="size-3.5" /> Ждёт запуска
              </span>
            )}
          </div>
        </div>

        {/* Exclusion Rules info & button */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-gold-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                Исключение пар (супруги, близкие коллеги)
              </p>
              <p className="text-[0.72rem] text-snow-300/70">
                {exclusions.length > 0
                  ? `Настроено правил исключения: ${exclusions.length}`
                  : "Алгоритм гарантирует: никто не дарит сам себе. Можно исключить пары вручную."}
              </p>
            </div>
          </div>

          {!isDrawn && (
            <button
              type="button"
              onClick={() => setShowExclusionsModal((v) => !v)}
              className="btn-secondary !py-2 !px-4 text-xs font-bold"
            >
              <span>{showExclusionsModal ? "Скрыть настройки" : "Настроить исключения пар"}</span>
            </button>
          )}
        </div>

        {/* Exclusions Panel */}
        {showExclusionsModal && !isDrawn && (
          <div className="mb-6 rounded-2xl border border-gold-400/30 bg-gold-400/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🚫</span> Правила исключений (кто кому НЕ может дарить)
              </h3>
              <span className="text-[11px] text-snow-300/70">
                Например: муж и жена, коллеги за одним столом
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-[1.5fr_auto_1.5fr_auto] items-center">
              <select
                value={exclP1}
                onChange={(e) => setExclP1(Number(e.target.value))}
                className="winter-input text-xs"
              >
                {gameData.participants.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>

              <span className="text-xs text-red-400 font-bold px-1 text-center">не дарит</span>

              <select
                value={exclP2}
                onChange={(e) => setExclP2(Number(e.target.value))}
                className="winter-input text-xs"
              >
                {gameData.participants.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddExclusion}
                className="btn-gold !py-2 !px-3 text-xs font-bold shrink-0"
              >
                + Исключить пару
              </button>
            </div>

            {exclusions.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <p className="text-[11px] font-bold text-snow-300">Действующие исключения:</p>
                <div className="flex flex-wrap gap-2">
                  {exclusions.map(([i1, i2], idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-snow-100"
                    >
                      <span>
                        {gameData.participants[i1]?.name || `Игрок ${i1 + 1}`} ✕{" "}
                        {gameData.participants[i2]?.name || `Игрок ${i2 + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(idx)}
                        className="text-red-400 hover:text-red-300 ml-1 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Draw CTA Button */}
        {!isDrawn ? (
          <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600/20 via-winter-900 to-red-600/10 p-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PartyPopper className="size-5 text-gold-400" />
                <span>Все игроки в сборе? Запускаем магию!</span>
              </h3>
              <p className="text-xs text-snow-200/80 mt-1 max-w-lg">
                Алгоритм распределит пары за секунду с учётом всех правил. Каждый участник сможет
                узнать только своего подопечного.
              </p>
            </div>

            <button
              type="button"
              disabled={isDrawing || gameData.participants.length < 3}
              onClick={handleDrawClick}
              className="btn-primary text-base font-bold shadow-xl shadow-red-600/50"
            >
              <Shuffle className="size-4" />
              <span>{isDrawing ? "Перемешиваем…" : "Провести жеребьёвку 🎅"}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Check className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">Жеребьёвка успешно проведена!</p>
                <p className="text-xs text-snow-200/70">
                  Все {assignments.length} участников получили своих подопечных.
                </p>
              </div>
            </div>

            {onRedraw && (
              <button
                type="button"
                onClick={onRedraw}
                className="btn-secondary !py-2 !px-3 text-xs"
              >
                <RotateCcw className="size-3.5" /> Перемешать заново
              </button>
            )}
          </div>
        )}
      </div>

      {/* Specified Section: «Каждый игрок видит ТОЛЬКО своё назначение (вводит своё имя — получает «Ты даришь подарок: ...»), чужие назначения скрыты.» */}
      <section className="winter-card p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid size-10 place-items-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
            <Lock className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Узнай, кому ты даришь подарок</h2>
            <p className="text-xs text-snow-300/70">
              Введите своё имя. Чужие назначения строго скрыты!
            </p>
          </div>
        </div>

        {!isDrawn ? (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-snow-300/60">
            <p className="text-base font-semibold text-white">Жеребьёвка ещё не проведена</p>
            <p className="text-xs mt-1 max-w-md mx-auto">
              Организатор должен нажать кнопку «Провести жеребьёвку» выше, после чего здесь появится
              ваш тайный подопечный!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search box or quick selector */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <label className="winter-label mb-2 flex items-center justify-between">
                <span>Введите или выберите ваше имя:</span>
                <span className="text-[10px] text-snow-300/50">секретный просмотр</span>
              </label>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFindMyAssignment()}
                    placeholder="Например: Катя Лебедева"
                    className="winter-input"
                    list="participants-datalist"
                  />
                  <datalist id="participants-datalist">
                    {gameData.participants.map((p, idx) => (
                      <option key={idx} value={p.name} />
                    ))}
                  </datalist>
                </div>

                <button
                  type="button"
                  onClick={handleFindMyAssignment}
                  className="btn-gold !py-2.5 !px-5 text-xs font-bold"
                >
                  <Eye className="size-4" /> Найти моё имя
                </button>
              </div>

              {viewError && <p className="mt-2 text-xs text-red-400">{viewError}</p>}

              {/* Quick pills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
                <span className="text-[11px] text-snow-300/60 mr-1">Быстрый выбор:</span>
                {gameData.participants.slice(0, 8).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchName(p.name);
                      setSelectedPlayerIndex(idx);
                      setIsRevealed(false);
                      setViewError(null);
                    }}
                    className={`rounded-full px-2.5 py-0.5 text-xs transition-all ${
                      selectedPlayerIndex === idx
                        ? "bg-red-600 text-white font-bold"
                        : "bg-white/5 text-snow-300 hover:bg-white/10"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Revealed Player Card */}
            {selectedPlayerIndex !== null && currentAssignment && (
              <div className="rounded-3xl border border-gold-400/40 bg-gradient-to-b from-winter-900 to-winter-950 p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <span className="winter-badge winter-badge-gold text-xs">
                      Привет, {currentAssignment.giverName}!
                    </span>
                    <p className="text-xs text-snow-300/70 mt-1">
                      Тсс… никому не рассказывай результат!
                    </p>
                  </div>

                  <span className="text-xs text-snow-300/50 flex items-center gap-1">
                    <Lock className="size-3" /> Персональная тайна
                  </span>
                </div>

                {!isRevealed ? (
                  /* Interactive envelope ready to be opened */
                  <div className="rounded-2xl border border-dashed border-red-500/50 bg-red-600/10 p-8 text-center space-y-4">
                    <div className="text-5xl animate-bounce">💌</div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">
                        Ваш конверт от Тайного Санты запечатан
                      </h3>
                      <p className="text-xs text-snow-200/80 max-w-sm mx-auto mt-1">
                        Убедитесь, что рядом никто не подглядывает в экран, и сорвите праздничную
                        ленточку!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenEnvelope}
                      className="btn-primary text-base font-bold shadow-xl shadow-red-600/50"
                    >
                      <Gift className="size-5" />
                      <span>Открыть конверт и узнать имя</span>
                    </button>
                  </div>
                ) : (
                  /* Revealed content: «Ты даришь подарок: ...» with wishlist */
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-600/25 to-rose-700/20 p-6 text-center sm:text-left flex flex-col sm:flex-row items-center gap-5">
                      <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-3xl shadow-xl">
                        🎁
                      </div>
                      <div>
                        <p className="text-xs uppercase font-bold tracking-widest text-gold-300">
                          Ты даришь подарок:
                        </p>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
                          {currentAssignment.receiverName}
                        </h2>
                        <p className="text-xs text-snow-200/80 mt-1">
                          Бюджет: до {gameData.budget ? gameData.budget.toLocaleString("ru-RU") : "2 500"} ₽ · Вручить до{" "}
                          {gameData.giftDeadline || "праздника"}
                        </p>
                      </div>
                    </div>

                    {/* Receiver Wishlist */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                        <p className="winter-label flex items-center gap-1.5 text-gold-400">
                          <Heart className="size-3.5 text-red-400 fill-red-400" />
                          <span>Что хочет получить:</span>
                        </p>
                        <p className="text-sm text-snow-100 mt-2 leading-relaxed whitespace-pre-line">
                          {currentAssignment.receiverWishlist ||
                            "Участник пока не написал подробный вишлист — положитесь на свою новогоднюю интуицию!"}
                        </p>

                        {currentAssignment.receiverWishlistItems &&
                          currentAssignment.receiverWishlistItems.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                              {currentAssignment.receiverWishlistItems.map((item, i) => (
                                <span
                                  key={i}
                                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-snow-200"
                                >
                                  ✨ {item}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Receiver Anti-wishlist */}
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                        <p className="winter-label flex items-center gap-1.5 text-red-400">
                          <Ban className="size-3.5" />
                          <span>Что точно НЕ дарить:</span>
                        </p>
                        <p className="text-sm text-snow-200/90 mt-2 leading-relaxed whitespace-pre-line">
                          {currentAssignment.receiverAntiWishlist ||
                            "Анти-вишлист не указан, но лучше избегать банальных шампуней и сувенирных магнитиков."}
                        </p>

                        {/* Receiver Address for Online Format */}
                        {gameData.format === "online" && currentAssignment.receiverAddress && (
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <p className="winter-label flex items-center gap-1.5 text-blue-300">
                              <MapPin className="size-3.5" /> Адрес доставки:
                            </p>
                            <p className="text-xs text-snow-100 mt-1 font-mono bg-white/5 p-2 rounded-lg">
                              {currentAssignment.receiverAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setIsRevealed(false)}
                        className="btn-secondary !py-2 text-xs"
                      >
                        <EyeOff className="size-3.5" /> Скрыть открытку снова
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Secret Organizer Master Table (toggleable, for organizer reference after event) */}
      {isDrawn && (
        <section className="winter-card p-6 border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-snow-300/50">
                Секретно · Только для организатора
              </p>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Полная таблица пар (для проверки после праздника)
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowOrganizerMasterList((v) => !v)}
              className="btn-secondary !py-1.5 !px-3 text-xs"
            >
              {showOrganizerMasterList ? "Скрыть таблицу" : "Показать все пары"}
            </button>
          </div>

          {showOrganizerMasterList && (
            <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
              {assignments.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 text-xs text-snow-200"
                >
                  <span className="font-semibold text-white">{item.giverName}</span>
                  <span className="text-gold-400 font-bold px-2">➔ дарит ➔</span>
                  <span className="font-semibold text-white">{item.receiverName}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
