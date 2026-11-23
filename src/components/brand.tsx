import Link from "next/link";
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SnowflakeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10" />
      <path d="M12 6l2.4-2.4M12 6L9.6 3.6M12 18l2.4 2.4M12 18l-2.4 2.4" />
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M3 10.5h18V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z" />
      <path d="M2.5 7.5h19v3h-19zM12 7.5V21" />
      <path d="M12 7.5S10.8 3 8.2 3a2.4 2.4 0 0 0 0 4.5H12Zm0 0S13.2 3 15.8 3a2.4 2.4 0 0 1 0 4.5H12Z" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M12 3l2.2 6.1L20.5 11l-6.3 1.9L12 19l-2.2-6.1L3.5 11l6.3-1.9L12 3Z" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M12 2c.6 4.7 3.3 7.4 8 8-4.7.6-7.4 3.3-8 8-.6-4.7-3.3-7.4-8-8 4.7-.6 7.4-3.3 8-8Z" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M16 19a4 4 0 0 0-8 0" />
      <circle cx="12" cy="9" r="3.2" />
      <path d="M3 19a3.4 3.4 0 0 1 5-2.9M21 19a3.4 3.4 0 0 0-5-2.9M6.4 7.2a2.6 2.6 0 1 1 0 5.2M17.6 7.2a2.6 2.6 0 1 0 0 5.2" />
    </svg>
  );
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M17 4l3 3-3 3M17 14l3 3-3 3" />
      <path d="M4 7h3.2c2 0 2.8 1.2 4 3.2l1.6 2.7c1.2 2 2 3.1 4 3.1H20M4 17h3.2c1.4 0 2.2-.6 3-1.8M14 8.3c.8-1 1.6-1.3 2.8-1.3H20" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.4" />
      <path d="M8.2 10V7.6a3.8 3.8 0 0 1 7.6 0V10M12 14.4v2.4" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.6" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2.6" />
      <path d="M3 10h18M16.5 14.5h1.5" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.2" />
      <path d="M15 9V6.2A2.2 2.2 0 0 0 12.8 4H6.2A2.2 2.2 0 0 0 4 6.2v6.6A2.2 2.2 0 0 0 6.2 15H9" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M4.5 7h15M9 7V4.8h6V7M6.5 7l.9 12.2A1.8 1.8 0 0 0 9.2 21h5.6a1.8 1.8 0 0 0 1.8-1.8L17.5 7M10 11v6M14 11v6" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="M3.8 6.5 12 13l8.2-6.5" />
    </svg>
  );
}

export function Logo({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const dark = tone === "dark";
  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`grid size-11 place-items-center rounded-full border ${
          dark
            ? "border-pine-900/15 bg-pine-800 text-gold-300"
            : "border-gold-400/40 bg-cream-100/10 text-gold-300"
        }`}
      >
        <SnowflakeIcon className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.15rem] font-semibold tracking-tight ${
            dark ? "text-pine-900" : "text-cream-100"
          }`}
        >
          Тайный Санта
        </span>
        {!compact && (
          <span
            className={`mt-1 text-[0.6rem] font-bold uppercase tracking-[0.28em] ${
              dark ? "text-pine-900/50" : "text-cream-200/60"
            }`}
          >
            secret gift exchange
          </span>
        )}
      </span>
    </span>
  );
}

export function SiteHeader({
  variant = "dark",
  actions,
}: {
  variant?: "dark" | "light";
  actions?: ReactNode;
}) {
  const dark = variant === "dark";
  return (
    <header
      className={`relative z-20 border-b ${
        dark ? "border-cream-100/10" : "border-pine-900/10"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="На главную">
          <Logo tone={dark ? "light" : "dark"} />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {actions ?? (
            <Link href="/#create" className="btn btn-gold btn-sm">
              Создать обмен
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-pine-950 text-cream-200/70">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Простой и по-настоящему праздничный способ обменяться подарками с командой, семьёй
            или друзьями.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-gold-300">Сервис</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/#how" className="transition hover:text-cream-100">
                Как это работает
              </Link>
            </li>
            <li>
              <Link href="/#features" className="transition hover:text-cream-100">
                Возможности
              </Link>
            </li>
            <li>
              <Link href="/#create" className="transition hover:text-cream-100">
                Создать обмен
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-gold-300">Попробовать</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/demo" className="transition hover:text-cream-100">
                Демо: глазами участника
              </Link>
            </li>
            <li>
              <Link href="/demo/organizer" className="transition hover:text-cream-100">
                Демо: панель организатора
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-100/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} Тайный Санта. Сделано для тёплых зим.</span>
          <span className="text-cream-200/50">Никаких аккаунтов и лишних писем — только ссылки.</span>
        </div>
      </div>
    </footer>
  );
}
