"use client";

import Link from "next/link";
import { SnowflakeIcon, SparkleIcon } from "@/components/brand";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="hero-shell flex min-h-screen items-center text-cream-100">
      <div className="relative mx-auto w-full max-w-xl px-5 py-20 text-center sm:px-8">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold-300/30 bg-gold-300/10 text-gold-300">
          <SnowflakeIcon className="animate-float size-8" />
        </span>
        <p className="eyebrow mt-6 justify-center text-gold-300">
          <SparkleIcon className="size-3.5" />
          Что-то пошло не так
        </p>
        <h1 className="mt-4 font-display text-3xl leading-tight font-medium text-balance sm:text-4xl">
          Снежная буря помешала странице
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream-200/70">
          Попробуйте обновить страницу. Если ошибка повторяется — вернитесь на главную, ваши данные
          обмена останутся на месте.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-gold">
            Попробовать снова
          </button>
          <Link href="/" className="btn btn-ghost-light">
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
