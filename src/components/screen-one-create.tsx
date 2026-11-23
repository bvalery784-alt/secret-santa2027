"use client";

import { useState } from "react";
import {
  Sparkles,
  Calendar,
  Wallet,
  Users,
  MapPin,
  Laptop,
  Check,
  Plus,
  Trash2,
  Bold,
  Italic,
  Heading2,
  List,
  Upload,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import {
  SANTA_CHARACTERS,
  AVATAR_PRESETS,
  COVER_THEMES,
  PAST_GAMES_PRESETS,
  type SantaCharacter,
  type AvatarPreset,
  type CoverTheme,
  type PastGamePreset,
} from "@/lib/game-constants";

export interface GameFormData {
  title: string;
  organizerName: string;
  organizerEmail: string;
  format: "offline" | "online";
  budget: number;
  drawDate: string;
  giftDeadline: string;
  avatar: string;
  cover: string;
  character: string;
  messageHtml: string;
  participants: Array<{
    name: string;
    email: string;
    wishlist?: string;
    antiWishlist?: string;
    wishlistItems?: string[];
  }>;
}

interface Props {
  initialData: GameFormData;
  onSaveAndNext: (data: GameFormData) => void;
  isSaving?: boolean;
}

export function ScreenOneCreate({ initialData, onSaveAndNext, isSaving = false }: Props) {
  const [formData, setFormData] = useState<GameFormData>(initialData);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [customCover, setCustomCover] = useState<string | null>(null);

  // New participant input
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerEmail, setNewPlayerEmail] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper for message editor
  function handleFormatText(command: string) {
    const current = formData.messageHtml;
    if (command === "bold") {
      setFormData((prev) => ({ ...prev, messageHtml: `**${prev.messageHtml}**` }));
    } else if (command === "italic") {
      setFormData((prev) => ({ ...prev, messageHtml: `*${prev.messageHtml}*` }));
    } else if (command === "heading") {
      setFormData((prev) => ({ ...prev, messageHtml: `### Новогоднее обращение\n${prev.messageHtml}` }));
    } else if (command === "list") {
      setFormData((prev) => ({ ...prev, messageHtml: `${prev.messageHtml}\n• Подарок упаковать в праздничную бумагу\n• Вложить открытку` }));
    }
  }

  // Quick past game import
  function handleImportPastGame(preset: PastGamePreset) {
    const existingNames = new Set(formData.participants.map((p) => p.name.toLowerCase()));
    const toAdd = preset.players.filter((p) => !existingNames.has(p.name.toLowerCase()));
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, ...toAdd],
    }));
  }

  // Add single player
  function handleAddPlayer() {
    setInputError(null);
    const trimmed = newPlayerName.trim();
    if (trimmed.length < 2) {
      setInputError("Имя игрока должно быть не короче 2 символов");
      return;
    }
    if (formData.participants.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setInputError("Игрок с таким именем уже есть в списке");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      participants: [
        ...prev.participants,
        {
          name: trimmed,
          email: newPlayerEmail.trim(),
          wishlist: "",
          antiWishlist: "",
          wishlistItems: [],
        },
      ],
    }));

    setNewPlayerName("");
    setNewPlayerEmail("");
  }

  // Remove player
  function handleRemovePlayer(index: number) {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  }

  // Validate and submit
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim() || formData.title.trim().length < 2) {
      newErrors.title = "Укажите название игры (минимум 2 символа)";
    }
    if (!formData.organizerName.trim() || formData.organizerName.trim().length < 2) {
      newErrors.organizerName = "Укажите ваше имя или название команды";
    }
    if (formData.drawDate && formData.giftDeadline) {
      if (formData.giftDeadline < formData.drawDate) {
        newErrors.giftDeadline = "Дедлайн покупки не может быть раньше даты жеребьёвки!";
      }
    }
    if (formData.participants.length < 3) {
      newErrors.participants = "Добавьте минимум 3 игроков для жеребьёвки (можно добавить из прошлых игр в 1 клик!)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSaveAndNext(formData);
    } else {
      // scroll to top error
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }

  const selectedCharacter =
    SANTA_CHARACTERS.find((c) => c.id === formData.character) || SANTA_CHARACTERS[0];
  const selectedTheme =
    COVER_THEMES.find((t) => t.id === formData.cover) || COVER_THEMES[0];
  const selectedAvatar =
    AVATAR_PRESETS.find((a) => a.id === formData.avatar) || AVATAR_PRESETS[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header banner */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-winter-900 via-winter-850 to-winter-900 p-6 sm:p-8 relative">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <span className="winter-badge winter-badge-red mb-3">
              <Sparkles className="size-3.5" /> Экран 1 из 4 · Организатор
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Создание игры в «Тайного Санту»
            </h1>
            <p className="mt-2 text-sm text-snow-200/80 max-w-xl">
              Настройте параметры обмена, выберите праздничного персонажа и пригласите игроков.
              Все шаги собраны на одном экране.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <div className="text-3xl">{selectedAvatar.emoji}</div>
            <div>
              <p className="text-xs text-snow-300/70">Выбран Санта</p>
              <p className="text-sm font-bold text-white">{selectedCharacter.name}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Название игры */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
              1
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Название игры</h2>
              <p className="text-xs text-snow-300/70">Название увидят ваши игроки</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Секретный Санта в офисе «Полярная звезда» 2026"
                className={`winter-input text-base sm:text-lg font-medium ${
                  errors.title ? "border-red-500 ring-2 ring-red-500/20" : ""
                }`}
                maxLength={120}
              />
              {errors.title && <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="winter-label">Имя организатора или компании</label>
                <input
                  type="text"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                  placeholder="Аня Смирнова / Команда дизайна"
                  className={`winter-input ${
                    errors.organizerName ? "border-red-500 ring-2 ring-red-500/20" : ""
                  }`}
                  maxLength={80}
                />
                {errors.organizerName && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.organizerName}</p>
                )}
              </div>

              <div>
                <label className="winter-label">Email организатора (для уведомлений)</label>
                <input
                  type="email"
                  value={formData.organizerEmail}
                  onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                  placeholder="santa-lead@company.ru"
                  className="winter-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Формат игры */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
              2
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Формат игры</h2>
              <p className="text-xs text-snow-300/70">
                Определяет, нужно ли запрашивать почтовый адрес у участников
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, format: "offline" })}
              className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                formData.format === "offline"
                  ? "border-red-500 bg-red-600/10 ring-2 ring-red-500/20"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 text-white shadow-md">
                <MapPin className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">Офлайн</span>
                  {formData.format === "offline" && (
                    <span className="winter-badge winter-badge-red text-[0.65rem]">Выбрано</span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-snow-200/80 leading-relaxed">
                  Для офиса или дома: все собираются в одном месте.{" "}
                  <strong className="text-white">Адрес доставки не спрашиваем</strong>.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, format: "online" })}
              className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
                formData.format === "online"
                  ? "border-red-500 bg-red-600/10 ring-2 ring-red-500/20"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md">
                <Laptop className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">Онлайн</span>
                  {formData.format === "online" && (
                    <span className="winter-badge winter-badge-red text-[0.65rem]">Выбрано</span>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-snow-200/80 leading-relaxed">
                  Для удалённых команд: подарки отправляются курьером или почтой.{" "}
                  <strong className="text-white">Участники укажут адрес доставки</strong>.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Step 3: Сумма на подарок */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
              3
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Сумма на подарок</h2>
              <p className="text-xs text-snow-300/70">
                Ориентировочный бюджет в рублях с ограничением
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {[1000, 1500, 2000, 2500, 3000, 5000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: amount })}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    formData.budget === amount
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : "border border-white/15 bg-white/5 text-snow-200 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {amount.toLocaleString("ru-RU")} ₽
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 max-w-xs">
              <div className="relative w-full">
                <input
                  type="number"
                  min={100}
                  max={100000}
                  step={100}
                  value={formData.budget || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: Number(e.target.value) || 0 })
                  }
                  placeholder="Другая сумма"
                  className="winter-input pr-10 font-bold text-lg"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-snow-300/60 font-semibold">
                  ₽
                </span>
              </div>
            </div>
            <p className="text-xs text-snow-300/60 flex items-center gap-1.5">
              <span>💡</span>
              <span>
                Одинаковый бюджет помогает избежать неловкости: никто не потратит больше или меньше
                других.
              </span>
            </p>
          </div>
        </section>

        {/* Steps 4 & 5: Даты жеребьёвки и покупки подарков */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
              4 & 5
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Календарь игры</h2>
              <p className="text-xs text-snow-300/70">
                Жеребьёвка и дедлайн покупки (дедлайн не может быть раньше жеребьёвки)
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Step 4: Дата жеребьёвки */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="winter-label flex items-center gap-1.5">
                <Calendar className="size-3.5 text-gold-400" />
                <span>4. Дата жеребьёвки</span>
              </label>
              <input
                type="date"
                value={formData.drawDate}
                onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                className="winter-input mt-1.5"
              />
              <p className="mt-2 text-xs text-snow-300/70 leading-relaxed">
                «Когда все игроки соберутся, вы сможете провести жеребьёвку. После этого все узнают,
                кто кому дарит».
              </p>
            </div>

            {/* Step 5: Покупаем подарки до */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="winter-label flex items-center gap-1.5">
                <Wallet className="size-3.5 text-red-400" />
                <span>5. Дата «Покупаем подарки до»</span>
              </label>
              <input
                type="date"
                value={formData.giftDeadline}
                onChange={(e) => setFormData({ ...formData, giftDeadline: e.target.value })}
                className={`winter-input mt-1.5 ${
                  errors.giftDeadline ? "border-red-500 ring-2 ring-red-500/20" : ""
                }`}
              />
              <p className="mt-2 text-xs text-snow-300/70 leading-relaxed">
                Дедлайн покупки и подготовки сюрприза. Участники получат напоминания.
              </p>
              {errors.giftDeadline && (
                <p className="mt-2 text-xs font-semibold text-red-400">{errors.giftDeadline}</p>
              )}
            </div>
          </div>
        </section>

        {/* Step 6: Оформление */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
              6
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Оформление игры</h2>
              <p className="text-xs text-snow-300/70">
                Аватар, обложка и персонаж Санты — это добавит игре праздничной индивидуальности
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Аватар игры */}
            <div>
              <label className="winter-label mb-2">
                Аватар игры («Это добавит игре индивидуальности»)
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, avatar: preset.id });
                      setCustomAvatar(null);
                    }}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all ${
                      formData.avatar === preset.id && !customAvatar
                        ? "border-red-500 bg-red-600/20 text-white ring-2 ring-red-500/30"
                        : "border-white/10 bg-white/5 text-snow-200 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl">{preset.emoji}</span>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Персонаж Санты */}
            <div>
              <label className="winter-label mb-2">
                Персонаж — выбор Санты из набора иллюстраций
              </label>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {SANTA_CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, character: char.id })}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                      formData.character === char.id
                        ? "border-red-500 bg-red-600/15 shadow-lg shadow-red-600/20 ring-2 ring-red-500/30"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-600/40 to-rose-700/40 text-2xl border border-white/20">
                      {char.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{char.name}</span>
                      </div>
                      <p className="text-[0.68rem] font-medium text-snow-300/80 leading-snug mt-0.5 line-clamp-2">
                        {char.tagline}
                      </p>
                      <span className="mt-1.5 inline-block text-[0.62rem] font-bold text-gold-400 bg-gold-400/10 px-1.5 py-0.5 rounded-md">
                        {char.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Обложка — выбор темы */}
            <div>
              <label className="winter-label mb-2">Обложка — выбор темы оформления</label>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {COVER_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, cover: theme.id })}
                    className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                      formData.cover === theme.id
                        ? "border-red-500 ring-2 ring-red-500/30 shadow-md"
                        : "border-white/10 hover:border-white/25"
                    }`}
                    style={{ background: theme.cssGradient }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white">{theme.name}</p>
                      {formData.cover === theme.id && (
                        <span className="grid size-4 place-items-center rounded-full bg-red-600 text-white text-[10px]">
                          <Check className="size-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[0.68rem] text-snow-200/70 mt-1 line-clamp-1">
                      {theme.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 7: Сообщение игрокам */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
              7
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Сообщение игрокам</h2>
              <p className="text-xs text-snow-300/70">
                Текстовый редактор с форматированием (жирный, курсив, заголовки, списки)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1.5">
              <button
                type="button"
                onClick={() => handleFormatText("bold")}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-snow-200 hover:bg-white/10 hover:text-white"
                title="Жирный текст"
              >
                <Bold className="size-3.5" /> Жирный
              </button>
              <button
                type="button"
                onClick={() => handleFormatText("italic")}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-snow-200 hover:bg-white/10 hover:text-white"
                title="Курсив"
              >
                <Italic className="size-3.5" /> Курсив
              </button>
              <button
                type="button"
                onClick={() => handleFormatText("heading")}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-snow-200 hover:bg-white/10 hover:text-white"
                title="Заголовок"
              >
                <Heading2 className="size-3.5" /> Заголовок
              </button>
              <button
                type="button"
                onClick={() => handleFormatText("list")}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-snow-200 hover:bg-white/10 hover:text-white"
                title="Список"
              >
                <List className="size-3.5" /> Список
              </button>
            </div>

            <textarea
              rows={4}
              value={formData.messageHtml}
              onChange={(e) => setFormData({ ...formData, messageHtml: e.target.value })}
              placeholder="Всем привет! Начинаем игру «Тайный Санта». Скорее регистрируйтесь :)"
              className="winter-input resize-y font-sans text-sm leading-relaxed"
            />
            <p className="text-xs text-snow-300/60">
              Это приветствие увидят участники на странице приглашения перед регистрацией.
            </p>
          </div>
        </section>

        {/* Step 8: Блок приглашений */}
        <section className="winter-card p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-xl bg-red-600 text-sm font-bold text-white">
                8
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Блок приглашений</h2>
                <p className="text-xs text-snow-300/70">
                  Добавляйте игроков вручную или импортируйте списки из прошлых игр
                </p>
              </div>
            </div>

            <span className="winter-badge winter-badge-gold text-sm font-bold">
              <Users className="size-4" /> Игроки ({formData.participants.length})
            </span>
          </div>

          <div className="space-y-5">
            {/* Быстрый импорт из прошлых игр */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="winter-label mb-2 flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-gold-400" />
                <span>Игроки из прошлых игр (добавить в один клик):</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {PAST_GAMES_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleImportPastGame(preset)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-winter-900/80 px-3 py-1.5 text-xs font-semibold text-snow-100 hover:border-gold-400/50 hover:bg-gold-500/10 transition-all"
                  >
                    <span>+</span>
                    <span>{preset.title}</span>
                    <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] text-snow-300">
                      {preset.players.length} чел.
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Добавить по email / имени */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="winter-label mb-2">Добавить игрока по имени и email:</p>
              <div className="grid gap-2 sm:grid-cols-[1.2fr_1.2fr_auto]">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPlayer())}
                  placeholder="Имя и фамилия (например, Катя Лебедева)"
                  className="winter-input"
                />
                <input
                  type="email"
                  value={newPlayerEmail}
                  onChange={(e) => setNewPlayerEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPlayer())}
                  placeholder="Email (необязательно)"
                  className="winter-input"
                />
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="btn-gold !py-2 !px-4 text-xs font-bold"
                >
                  <Plus className="size-4" /> Добавить
                </button>
              </div>
              {inputError && <p className="mt-2 text-xs text-red-400">{inputError}</p>}
            </div>

            {/* Список участников */}
            <div>
              <p className="winter-label mb-2">
                Текущий список участников ({formData.participants.length}):
              </p>
              {formData.participants.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-snow-300/60">
                  <p className="text-sm">В игре пока нет участников.</p>
                  <p className="text-xs mt-1">
                    Нажмите на «Офис: Продуктовая команда» выше, чтобы добавить игроков за 1 секунду!
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {formData.participants.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-winter-900/60 px-3.5 py-2.5 text-xs backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-red-600/30 text-[11px] font-bold text-red-300">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{player.name}</p>
                          {player.email ? (
                            <p className="text-[10px] text-snow-300/50 truncate">{player.email}</p>
                          ) : (
                            <p className="text-[10px] text-snow-300/40">персональная ссылка</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(idx)}
                        className="text-snow-300/40 hover:text-red-400 transition-colors p-1"
                        title="Удалить"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.participants && (
              <p className="text-xs font-semibold text-red-400">{errors.participants}</p>
            )}
          </div>
        </section>

        {/* Action button */}
        <div className="sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/15 bg-winter-950/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{selectedAvatar.emoji}</div>
            <div>
              <p className="text-xs text-snow-300/70">Готово к запуску</p>
              <p className="text-sm font-bold text-white">
                {formData.title || "Тайный Санта 2026"} · {formData.participants.length} игроков
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary text-base font-bold shadow-lg shadow-red-600/40"
          >
            <span>{isSaving ? "Сохраняем…" : "Далее → Экран 2 (Приглашение)"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
