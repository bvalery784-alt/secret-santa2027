"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/brand";

export function CreateExchangeForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      organizerName: form.get("organizerName"),
      eventDate: form.get("eventDate"),
      budget: form.get("budget"),
      description: form.get("description"),
      includeOrganizer: form.get("includeOrganizer") === "on",
    };

    try {
      const response = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        organizerToken?: string;
        error?: string;
      };
      if (!response.ok || !data.organizerToken) {
        setError(data.error ?? "Не получилось создать обмен. Попробуйте ещё раз.");
        setPending(false);
        return;
      }
      router.push(`/o/${data.organizerToken}`);
    } catch {
      setError("Сеть подвела. Проверьте соединение и попробуйте снова.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-pine-500">Шаг 1 из 3</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-pine-900 sm:text-[1.7rem]">
            Создайте свой обмен
          </h2>
        </div>
        <span className="hidden rounded-full border border-gold-500/30 bg-gold-300/25 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-gold-600 sm:inline-flex">
          2 минуты
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">
            Название обмена
          </label>
          <input
            id="title"
            name="title"
            required
            minLength={2}
            maxLength={140}
            defaultValue=""
            placeholder="Например: Новогодний обмен в офисе"
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="organizerName">
            Ваше имя
          </label>
          <input
            id="organizerName"
            name="organizerName"
            required
            minLength={2}
            maxLength={80}
            placeholder="Аня Морозова"
            className="field"
          />
        </div>

        <div>
          <label className="label" htmlFor="eventDate">
            Дата вручения подарков
          </label>
          <input id="eventDate" name="eventDate" type="date" className="field" />
        </div>

        <div>
          <label className="label" htmlFor="budget">
            Бюджет на подарок, ₽
          </label>
          <input
            id="budget"
            name="budget"
            inputMode="numeric"
            placeholder="2500"
            className="field"
          />
        </div>

        <div className="flex items-end pb-1.5">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-pine-900/80">
            <input
              type="checkbox"
              name="includeOrganizer"
              defaultChecked
              className="mt-0.5 size-4 accent-pine-700"
            />
            <span>
              Я тоже участвую
              <span className="block text-xs text-pine-900/50">Ссылка организатора появится у вас</span>
            </span>
          </label>
        </div>
      </div>

      {advanced ? (
        <div className="mt-4">
          <label className="label" htmlFor="description">
            Описание и правила
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={600}
            placeholder="Где и когда вручаем подарки, что важно знать участникам…"
            className="field resize-none"
          />
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-gold w-full sm:w-auto" disabled={pending}>
          {pending ? "Создаём…" : "Создать обмен"}
          {!pending && <ArrowRightIcon className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => setAdvanced((value) => !value)}
          className="text-sm font-semibold text-pine-700 underline decoration-gold-500/60 decoration-2 underline-offset-4 transition hover:text-pine-900"
        >
          {advanced ? "Скрыть описание" : "Добавить описание и правила"}
        </button>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-berry-500/25 bg-berry-500/10 px-4 py-3 text-sm text-berry-500"
        >
          {error}
        </p>
      ) : null}

      <p className="mt-4 flex items-center gap-2 text-xs text-pine-900/50">
        <span className="inline-block size-1.5 rounded-full bg-pine-500" />
        Без регистрации. Мы создадим личную ссылку для вас и для каждого участника.
      </p>
    </form>
  );
}
