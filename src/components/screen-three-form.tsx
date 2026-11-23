"use client";

import { useState } from "react";
import {
  Sparkles,
  Gift,
  Heart,
  Ban,
  MapPin,
  Plus,
  Trash2,
  Check,
  ArrowRight,
  ListPlus,
  Info,
} from "lucide-react";
import type { GameFormData } from "./screen-one-create";

export interface PlayerProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  wishlist: string; // "Что хотели бы получить в подарок от Санты?" (min 4 chars)
  wishlistItems: string[]; // specific items for "В вишлисте игры: N подарков"
  antiWishlist: string; // "Что точно не стоит дарить?"
}

interface Props {
  gameData: GameFormData;
  onSubmitProfile: (profile: PlayerProfile) => void;
  isSubmitting?: boolean;
}

export function ScreenThreeForm({ gameData, onSubmitProfile, isSubmitting = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [wishlist, setWishlist] = useState("");
  const [antiWishlist, setAntiWishlist] = useState("");

  // Wishlist items list + modal/toggle for "Изменить вишлист →"
  const [wishlistItems, setWishlistItems] = useState<string[]>([
    "Кружка с новогодним принтом",
    "Свеча с ароматом хвои и мандарина",
  ]);
  const [newItemText, setNewItemText] = useState("");
  const [showWishlistEditor, setShowWishlistEditor] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleAddItem() {
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    setWishlistItems((prev) => [...prev, trimmed]);
    setNewItemText("");

    // Also auto-append to main wishlist text if empty
    if (!wishlist.trim()) {
      setWishlist(trimmed);
    } else if (!wishlist.includes(trimmed)) {
      setWishlist((prev) => `${prev}, ${trimmed}`);
    }
  }

  function handleRemoveItem(index: number) {
    setWishlistItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Укажите ваше имя (минимум 2 символа)";
    }
    if (!wishlist.trim() || wishlist.trim().length < 4) {
      newErrors.wishlist = "Поле «Что хотели бы получить» должно содержать минимум 4 символа!";
    }
    if (gameData.format === "online" && (!address.trim() || address.trim().length < 6)) {
      newErrors.address = "Для онлайн-формата укажите адрес доставки с индексом для курьера";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmitProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        wishlist: wishlist.trim(),
        wishlistItems,
        antiWishlist: antiWishlist.trim(),
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Badge indicating Screen 3 */}
      <div className="mb-6">
        <span className="winter-badge winter-badge-red text-xs">
          <Sparkles className="size-3.5" /> Экран 3 из 4 · Анкета игрока
        </span>
      </div>

      <div className="winter-card p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-2xl shadow-lg">
              📝
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Анкета участника Тайного Санты
              </h1>
              <p className="text-xs sm:text-sm text-snow-200/80 mt-1">
                Для игры: <strong className="text-white">{gameData.title}</strong>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Имя и контакты */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="winter-label">
                Ваше имя и фамилия <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Катя Лебедева"
                className={`winter-input ${errors.name ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
                maxLength={80}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="winter-label">Email или Telegram для ссылки</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="katya@example.ru или @katya"
                className="winter-input"
              />
            </div>
          </div>

          {/* Если Онлайн-формат — поле Адрес доставки */}
          {gameData.format === "online" && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
              <label className="winter-label flex items-center gap-1.5 text-blue-300">
                <MapPin className="size-3.5" />
                <span>Адрес доставки с индексом и комментариями курьеру *</span>
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Москва, ул. Тверская 12, кв. 45, индекс 125009. Подъезд 2, домофон 45К"
                className={`winter-input mt-1.5 ${
                  errors.address ? "border-red-500 ring-2 ring-red-500/20" : ""
                }`}
              />
              {errors.address ? (
                <p className="mt-1 text-xs text-red-400">{errors.address}</p>
              ) : (
                <p className="mt-1 text-[0.72rem] text-blue-200/70">
                  Ваш адрес будет виден только вашему Тайному Санте для отправки посылки.
                </p>
              )}
            </div>
          )}

          {/* Поле 1: «Что хотели бы получить в подарок от Санты?» (минимум 4 символа) */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="winter-label flex items-center gap-1.5 !mb-0 text-gold-400">
                <Heart className="size-3.5 text-red-400 fill-red-400" />
                <span>
                  Что хотели бы получить в подарок от Санты? <span className="text-red-400">*</span>
                </span>
              </label>
              <span className="text-[11px] font-bold text-snow-300/60">минимум 4 символа</span>
            </div>

            <textarea
              rows={3}
              required
              minLength={4}
              value={wishlist}
              onChange={(e) => setWishlist(e.target.value)}
              placeholder="Например: Люблю уютные книги с плотной бумагой, свечи с ароматом хвои, тёплые носки 38 размера или настольные игры. Буду рада любому сюрпризу с душой!"
              className={`winter-input ${errors.wishlist ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
            />
            {errors.wishlist && <p className="mt-1.5 text-xs text-red-400">{errors.wishlist}</p>}

            {/* Счётчик «В вишлисте игры: N подарков», кнопка «Изменить вишлист →» */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3.5">
              <div className="flex items-center gap-2">
                <span className="winter-badge winter-badge-gold">
                  <Gift className="size-3.5" /> В вишлисте игры: {wishlistItems.length} подарков
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowWishlistEditor((v) => !v)}
                className="text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1 underline underline-offset-4"
              >
                <span>{showWishlistEditor ? "Скрыть редактор списка" : "Изменить вишлист →"}</span>
              </button>
            </div>

            {/* Раскрывающийся редактор вишлиста */}
            {showWishlistEditor && (
              <div className="mt-4 rounded-xl border border-gold-400/30 bg-gold-400/10 p-4 space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ListPlus className="size-3.5 text-gold-400" />
                  <span>Добавьте конкретные идеи и ссылки (по одной):</span>
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem())}
                    placeholder="Например: Книга «Маленький принц» в иллюстрированном издании"
                    className="winter-input !py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="btn-gold !py-1.5 !px-3 text-xs shrink-0"
                  >
                    <Plus className="size-3.5" /> Добавить
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {wishlistItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-winter-900/80 px-2.5 py-1 text-xs text-snow-100"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-snow-300/50 hover:text-red-400 ml-1"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Поле 2: «Что точно не стоит дарить?» с подписью «Признайтесь, что вам больше не нужны конфеты и шампуни» */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <label className="winter-label flex items-center gap-1.5 text-red-300">
              <Ban className="size-3.5" />
              <span>Что точно не стоит дарить?</span>
            </label>

            <p className="text-xs text-snow-300/80 mb-2 italic">
              «Признайтесь, что вам больше не нужны конфеты и шампуни»
            </p>

            <textarea
              rows={2}
              value={antiWishlist}
              onChange={(e) => setAntiWishlist(e.target.value)}
              placeholder="Например: Пожалуйста, без сладких наборов с марципаном, шампуней 3-в-1, сувениров с символом года и статуэток — ставить уже некуда!"
              className="winter-input"
            />
            <p className="mt-1.5 text-[0.72rem] text-snow-300/60 flex items-center gap-1">
              <Info className="size-3 text-snow-300/60" />
              <span>
                Этот честный анти-вишлист спасёт вашего Санту от покупки ненужных пылесборников.
              </span>
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-base font-bold shadow-xl shadow-red-600/40"
            >
              <span>{isSubmitting ? "Регистрируем…" : "Зарегистрироваться в игре 🎅"}</span>
              <ArrowRight className="size-4" />
            </button>
            <p className="mt-2 text-center text-[0.72rem] text-snow-300/60">
              После регистрации вы перейдёте на Экран 4 (Жеребьёвка), где сможете узнать своего
              подопечного!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
