"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  GiftIcon,
  LockIcon,
  MailIcon,
  ShuffleIcon,
  SnowflakeIcon,
  SparkleIcon,
  TrashIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/brand";

export type OrganizerParticipant = {
  id: number;
  name: string;
  email: string | null;
  wishlist: string;
  token: string;
  gifteeId: number | null;
  giftReady: boolean;
};

type Props = {
  organizerToken: string;
  slug: string;
  exchange: {
    title: string;
    description: string;
    organizerName: string;
    eventDate: string | null;
    budget: number | null;
    status: string;
  };
  participants: OrganizerParticipant[];
};

type Notice = { type: "success" | "error"; text: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function copyToClipboard(path: string) {
  const url = `${window.location.origin}${path}`;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const area = document.createElement("textarea");
    area.value = url;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    document.body.removeChild(area);
  }
  return url;
}

export function OrganizerDashboard({ organizerToken, slug, exchange, participants }: Props) {
  const router = useRouter();
  const drawn = exchange.status === "drawn";
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(participants.length < 2);
  const [showPairs, setShowPairs] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmDraw, setConfirmDraw] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [openWishlist, setOpenWishlist] = useState<number | null>(null);

  const byId = new Map(participants.map((p) => [p.id, p]));
  const readyCount = participants.filter((p) => p.giftReady).length;

  const runAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}, successText?: string) => {
      setPending(action);
      setNotice(null);
      try {
        const response = await fetch(`/api/organizer/${organizerToken}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...payload }),
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          setNotice({ type: "error", text: data.error ?? "Что-то пошло не так." });
          return false;
        }
        if (successText) setNotice({ type: "success", text: successText });
        router.refresh();
        return true;
      } catch {
        setNotice({ type: "error", text: "Сеть подвела. Попробуйте ещё раз." });
        return false;
      } finally {
        setPending(null);
      }
    },
    [organizerToken, router],
  );

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const ok = await runAction(
      "add",
      {
        name: form.get("name"),
        email: form.get("email"),
        wishlist: form.get("wishlist"),
      },
      "Участник добавлен — скопируйте его персональную ссылку.",
    );
    if (ok) {
      formEl.reset();
      setAddOpen(false);
    }
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await runAction(
      "update",
      {
        title: form.get("title"),
        organizerName: form.get("organizerName"),
        eventDate: form.get("eventDate"),
        budget: form.get("budget"),
        description: form.get("description"),
      },
      "Настройки обмена сохранены.",
    );
  }

  async function handleCopy(key: string, path: string) {
    await copyToClipboard(path);
    setCopied(key);
    window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 2200);
  }

  async function handleRemove(id: number) {
    const ok = await runAction("remove", { participantId: id }, "Участник удалён.");
    if (ok) setRemoving(null);
  }

  async function handleDraw() {
    const ok = await runAction("draw", {}, "Жеребьёвка проведена! Теперь каждый может открыть свою ссылку.");
    if (ok) setConfirmDraw(false);
  }

  async function handleReset() {
    const ok = await runAction("reset", {}, "Жеребьёвка сброшена. Можно менять состав участников.");
    if (ok) {
      setConfirmReset(false);
      setShowPairs(false);
    }
  }

  async function handleDelete() {
    const ok = await runAction("delete", {}, "");
    if (ok) router.push("/");
  }

  const personalPath = (token: string) => `/s/${token}`;
  const invitePath = `/e/${slug}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
      <div className="space-y-6">
        {notice ? (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
              notice.type === "success"
                ? "border-pine-500/25 bg-pine-500/10 text-pine-800"
                : "border-berry-500/25 bg-berry-500/10 text-berry-500"
            }`}
          >
            {notice.type === "success" ? (
              <CheckIcon className="mt-0.5 size-4 shrink-0" />
            ) : (
              <SparkleIcon className="mt-0.5 size-4 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
        ) : null}

        <section className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pine-900/8 px-6 py-5">
            <div>
              <p className="eyebrow text-pine-500">
                <UsersIcon className="size-3.5" />
                Состав обмена
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold text-pine-900">
                Участники
                <span className="ml-2 align-middle text-sm font-sans font-semibold text-pine-900/40">
                  {participants.length}
                </span>
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-pine btn-sm"
              onClick={() => setAddOpen((value) => !value)}
            >
              {addOpen ? "Свернуть" : "Добавить участника"}
            </button>
          </div>

          {addOpen ? (
            <form onSubmit={handleAdd} className="border-b border-pine-900/8 bg-cream-100/60 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="participant-name">
                    Имя
                  </label>
                  <input
                    id="participant-name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    placeholder="Катя Лебедева"
                    className="field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="participant-email">
                    Почта (необязательно)
                  </label>
                  <input
                    id="participant-email"
                    name="email"
                    type="email"
                    placeholder="katya@example.com"
                    className="field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="participant-wishlist">
                    Вишлист (можно заполнить позже)
                  </label>
                  <textarea
                    id="participant-wishlist"
                    name="wishlist"
                    rows={2}
                    maxLength={1200}
                    placeholder="Что любит, размеры, антиподарки…"
                    className="field resize-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="btn btn-gold btn-sm" disabled={pending === "add"}>
                  {pending === "add" ? "Добавляем…" : "Добавить в обмен"}
                </button>
                {drawn ? (
                  <p className="self-center text-xs text-berry-500">
                    Состав зафиксирован: сначала сбросьте жеребьёвку.
                  </p>
                ) : null}
              </div>
            </form>
          ) : null}

          {participants.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-cream-200 text-pine-700">
                <SnowflakeIcon className="size-6" />
              </span>
              <p className="mt-4 font-display text-lg text-pine-900">Пока никого нет</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-pine-900/60">
                Добавьте участников вручную или отправьте им общую ссылку — они присоединятся сами.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-pine-900/8">
              {participants.map((person) => (
                <li key={person.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-pine-800 text-xs font-bold tracking-wide text-gold-300">
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-pine-900">{person.name}</p>
                        {person.giftReady ? (
                          <span className="tag bg-pine-500/12 text-pine-700">
                            <CheckIcon className="size-3" />
                            подарок готов
                          </span>
                        ) : drawn ? (
                          <span className="tag bg-gold-300/30 text-gold-600">выбирает подарок</span>
                        ) : (
                          <span className="tag bg-cream-200 text-pine-900/55">в списке</span>
                        )}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-pine-900/45">
                        {person.email ? (
                          <>
                            <MailIcon className="size-3.5" />
                            {person.email}
                          </>
                        ) : (
                          "персональная ссылка вместо почты"
                        )}
                      </p>

                      {person.wishlist ? (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenWishlist((value) => (value === person.id ? null : person.id))
                            }
                            className="text-xs font-semibold text-pine-600 underline decoration-gold-500/50 decoration-2 underline-offset-4 hover:text-pine-900"
                          >
                            {openWishlist === person.id ? "Скрыть вишлист" : "Показать вишлист"}
                          </button>
                          {openWishlist === person.id ? (
                            <p className="mt-2 rounded-xl bg-cream-100 px-3 py-2 text-sm leading-relaxed whitespace-pre-line text-pine-900/70">
                              {person.wishlist}
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-pine-900/40">вишлист пока не заполнен</p>
                      )}
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(`personal-${person.id}`, personalPath(person.token))}
                        className="btn btn-outline btn-sm px-3"
                        title="Скопировать персональную ссылку"
                      >
                        {copied === `personal-${person.id}` ? (
                          <>
                            <CheckIcon className="size-4" /> Готово
                          </>
                        ) : (
                          <>
                            <CopyIcon className="size-4" /> Ссылка
                          </>
                        )}
                      </button>
                      <Link
                        href={personalPath(person.token)}
                        target="_blank"
                        className="grid size-9 place-items-center rounded-full border border-pine-900/12 text-pine-700 transition hover:border-pine-900/30 hover:bg-cream-100"
                        title="Открыть страницу участника"
                      >
                        <EyeIcon className="size-4" />
                      </Link>
                      {removing === person.id ? (
                        <span className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleRemove(person.id)}
                            className="rounded-full bg-berry-500 px-3 py-1.5 text-xs font-bold text-cream-50"
                            disabled={pending === "remove"}
                          >
                            Удалить
                          </button>
                          <button
                            type="button"
                            onClick={() => setRemoving(null)}
                            className="rounded-full px-2 py-1.5 text-xs font-semibold text-pine-900/50"
                          >
                            Отмена
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRemoving(person.id)}
                          className="grid size-9 place-items-center rounded-full border border-pine-900/12 text-pine-900/40 transition hover:border-berry-500/40 hover:text-berry-500"
                          title="Удалить участника"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gold-300/20 blur-2xl" />
          <div className="relative px-6 py-6">
            <p className="eyebrow text-pine-500">
              <ShuffleIcon className="size-3.5" />
              Жеребьёвка
            </p>
            {drawn ? (
              <>
                <h2 className="mt-2 font-display text-2xl font-semibold text-pine-900">
                  Пары распределены
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-pine-900/65">
                  Каждый участник видит только своего подопечного по персональной ссылке. Общий
                  список пар лучше показать после вручения подарков.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPairs((value) => !value)}
                    className="btn btn-pine btn-sm"
                  >
                    <EyeIcon className="size-4" />
                    {showPairs ? "Скрыть пары" : "Показать пары"}
                  </button>
                  {confirmReset ? (
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-sm bg-berry-500 text-cream-50"
                        disabled={pending === "reset"}
                      >
                        {pending === "reset" ? "Сбрасываем…" : "Да, сбросить"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="btn btn-outline btn-sm"
                      >
                        Отмена
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="btn btn-outline btn-sm"
                    >
                      Провести заново
                    </button>
                  )}
                </div>

                {showPairs ? (
                  <div className="mt-5 rounded-2xl border border-gold-500/30 bg-gold-300/10 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-gold-600">
                      Секретно · только для организатора
                    </p>
                    <ul className="space-y-2">
                      {participants.map((person) => {
                        const giftee = person.gifteeId ? byId.get(person.gifteeId) : null;
                        return (
                          <li
                            key={person.id}
                            className="flex flex-wrap items-center gap-2 text-sm text-pine-900"
                          >
                            <span className="font-semibold">{person.name}</span>
                            <ArrowRightIcon className="size-3.5 text-pine-900/40" />
                            <span className="rounded-full bg-cream-50 px-2.5 py-0.5 font-semibold">
                              {giftee?.name ?? "не распределён"}
                            </span>
                            {giftee?.wishlist ? (
                              <span className="text-xs text-pine-900/50">вишлист заполнен</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <h2 className="mt-2 font-display text-2xl font-semibold text-pine-900">
                  Все готовы? Запускаем!
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-pine-900/65">
                  Алгоритм перемешает участников так, что никто не попадёт к самому себе. После
                  жеребьёвки каждый увидит своего подопечного в личной ссылке.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmDraw(true)}
                    className="btn btn-gold"
                    disabled={participants.length < 3}
                  >
                    <ShuffleIcon className="size-4" />
                    Провести жеребьёвку
                  </button>
                  <span className="text-xs text-pine-900/55">
                    {participants.length < 3
                      ? `Нужно ещё ${3 - participants.length} ${participants.length === 2 ? "участника" : "участников"}`
                      : `${participants.length} участников готовы`}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="card p-6">
          <p className="eyebrow text-pine-500">
            <MailIcon className="size-3.5" />
            Приглашение
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-pine-900">
            Общая ссылка для участников
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-pine-900/60">
            Отправьте её в чат или на почту. Каждый заполнит вишлист и получит личную ссылку со
            своим подопечным.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-pine-900/12 bg-cream-100 px-3 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-pine-900/60">
              /e/{slug}
            </span>
            <button
              type="button"
              onClick={() => handleCopy("invite", invitePath)}
              className="btn btn-pine btn-sm px-3"
            >
              {copied === "invite" ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
              {copied === "invite" ? "Готово" : "Копировать"}
            </button>
          </div>
          <Link
            href={invitePath}
            target="_blank"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-pine-700 underline decoration-gold-500/50 decoration-2 underline-offset-4 hover:text-pine-900"
          >
            <EyeIcon className="size-3.5" />
            Посмотреть, как видят участники
          </Link>
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-gold-300/20 px-3 py-2 text-[0.72rem] leading-relaxed text-gold-600">
            <LockIcon className="mt-0.5 size-3.5 shrink-0" />
            Ссылка панели организатора — секретная. Никому её не пересылайте.
          </div>
        </section>

        <section className="card p-6">
          <p className="eyebrow text-pine-500">Чек-лист</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-pine-900">Путь обмена</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { done: true, label: "Обмен создан", hint: exchange.title },
              {
                done: participants.length >= 3,
                label: "Собраны участники",
                hint: `${participants.length} из 3 минимум`,
              },
              {
                done: drawn,
                label: "Проведена жеребьёвка",
                hint: drawn ? "Пары распределены" : "Нажмите «Провести жеребьёвку»",
              },
              {
                done: readyCount > 0 && readyCount === participants.length,
                label: "Все подарки готовы",
                hint: `${readyCount} из ${participants.length}`,
              },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
                    item.done
                      ? "border-pine-600 bg-pine-600 text-cream-50"
                      : "border-pine-900/20 bg-transparent text-transparent"
                  }`}
                >
                  <CheckIcon className="size-3" />
                </span>
                <span>
                  <span
                    className={`block font-semibold ${
                      item.done ? "text-pine-900" : "text-pine-900/70"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-xs text-pine-900/45">{item.hint}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-pine-500">Детали</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-pine-900">
                Настройки обмена
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen((value) => !value)}
              className="btn btn-outline btn-sm"
            >
              {settingsOpen ? "Скрыть" : "Изменить"}
            </button>
          </div>

          {settingsOpen ? (
            <form onSubmit={handleUpdate} className="mt-4 space-y-3">
              <div>
                <label className="label" htmlFor="edit-title">
                  Название
                </label>
                <input
                  id="edit-title"
                  name="title"
                  defaultValue={exchange.title}
                  className="field"
                  maxLength={140}
                />
              </div>
              <div>
                <label className="label" htmlFor="edit-organizer">
                  Организатор
                </label>
                <input
                  id="edit-organizer"
                  name="organizerName"
                  defaultValue={exchange.organizerName}
                  className="field"
                  maxLength={80}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="edit-date">
                    Дата
                  </label>
                  <input
                    id="edit-date"
                    name="eventDate"
                    type="date"
                    defaultValue={exchange.eventDate ?? ""}
                    className="field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="edit-budget">
                    Бюджет, ₽
                  </label>
                  <input
                    id="edit-budget"
                    name="budget"
                    inputMode="numeric"
                    defaultValue={exchange.budget ?? ""}
                    className="field"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="edit-description">
                  Описание
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  defaultValue={exchange.description}
                  className="field resize-none"
                  maxLength={600}
                />
              </div>
              <button className="btn btn-pine btn-sm w-full" disabled={pending === "update"}>
                {pending === "update" ? "Сохраняем…" : "Сохранить изменения"}
              </button>
            </form>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-pine-900/70">
                <CalendarIcon className="size-4 text-pine-500" />
                {exchange.eventDate ?? "Дата не указана"}
              </div>
              <div className="flex items-center gap-2 text-pine-900/70">
                <WalletIcon className="size-4 text-pine-500" />
                {exchange.budget ? `До ${exchange.budget.toLocaleString("ru-RU")} ₽` : "Бюджет не указан"}
              </div>
              <div className="flex items-center gap-2 text-pine-900/70">
                <GiftIcon className="size-4 text-pine-500" />
                {participants.length} участников
              </div>
            </dl>
          )}

          <div className="mt-5 border-t border-pine-900/10 pt-4">
            {confirmDelete ? (
              <div className="rounded-xl border border-berry-500/25 bg-berry-500/8 p-3 text-xs text-berry-500">
                <p className="font-semibold">Удалить обмен и все ссылки?</p>
                <p className="mt-1 text-berry-500/80">Действие необратимо.</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full bg-berry-500 px-3 py-1.5 font-bold text-cream-50"
                    disabled={pending === "delete"}
                  >
                    {pending === "delete" ? "Удаляем…" : "Удалить навсегда"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-full px-2 py-1.5 font-semibold text-pine-900/50"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-pine-900/40 transition hover:text-berry-500"
              >
                <TrashIcon className="size-3.5" />
                Удалить обмен
              </button>
            )}
          </div>
        </section>
      </div>

      {confirmDraw ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-pine-950/60 px-5 backdrop-blur-sm">
          <div className="animate-fade-up w-full max-w-md rounded-3xl border border-cream-100/20 bg-cream-50 p-6 shadow-lift">
            <span className="grid size-12 place-items-center rounded-full bg-pine-800 text-gold-300">
              <ShuffleIcon className="size-6" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-pine-900">
              Провести жеребьёвку?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-pine-900/65">
              {participants.length} участников получат по одному подопечному. Изменить пары можно
              будет только повторной жеребьёвкой.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDraw}
                className="btn btn-gold btn-sm"
                disabled={pending === "draw"}
              >
                {pending === "draw" ? "Перемешиваем…" : "Да, распределить"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDraw(false)}
                className="btn btn-outline btn-sm"
              >
                Пока рано
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
