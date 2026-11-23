"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon, LockIcon } from "@/components/brand";

export function JoinForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/exchanges/${slug}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          wishlist: form.get("wishlist"),
        }),
      });
      const data = (await response.json()) as { participantToken?: string; error?: string };
      if (!response.ok || !data.participantToken) {
        setError(data.error ?? "Не удалось присоединиться. Попробуйте ещё раз.");
        setPending(false);
        return;
      }
      router.push(`/s/${data.participantToken}`);
    } catch {
      setError("Сеть подвела. Попробуйте ещё раз.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <p className="eyebrow text-pine-500">Участие</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-pine-900">
        Присоединиться к обмену
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-pine-900/60">
        Заполните пару полей — и получите личную ссылку, где появится ваш подопечный после
        жеребьёвки.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="join-name">
            Имя и фамилия
          </label>
          <input
            id="join-name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            className="field"
            placeholder="Катя Лебедева"
          />
        </div>
        <div>
          <label className="label" htmlFor="join-email">
            Почта (необязательно)
          </label>
          <input
            id="join-email"
            name="email"
            type="email"
            className="field"
            placeholder="katya@example.com"
          />
        </div>
        <div>
          <label className="label" htmlFor="join-wishlist">
            Вишлист
          </label>
          <textarea
            id="join-wishlist"
            name="wishlist"
            rows={3}
            maxLength={1200}
            className="field resize-none"
            placeholder="Что вам пригодится? Размеры, любимые мелочи, антиподарки…"
          />
        </div>
      </div>

      <button className="btn btn-gold mt-5 w-full" disabled={pending}>
        {pending ? "Присоединяемся…" : "Я участвую"}
        {!pending && <ArrowRightIcon className="size-4" />}
      </button>

      {error ? (
        <p className="mt-3 rounded-xl border border-berry-500/25 bg-berry-500/10 px-4 py-3 text-sm text-berry-500">
          {error}
        </p>
      ) : null}

      <p className="mt-4 flex items-start gap-2 text-xs text-pine-900/45">
        <LockIcon className="mt-0.5 size-3.5 shrink-0" />
        Вишлист увидят только ваш Тайный Санта и организатор.
      </p>
    </form>
  );
}
