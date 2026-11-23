import Link from "next/link";
import { ArrowRightIcon, SiteFooter, SnowflakeIcon, SparkleIcon } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="hero-shell flex min-h-[78vh] items-center text-cream-100">
        <div className="relative mx-auto w-full max-w-2xl px-5 py-20 text-center sm:px-8">
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-gold-300/30 bg-gold-300/10 text-gold-300">
            <SnowflakeIcon className="animate-float size-8" />
          </span>
          <p className="eyebrow mt-6 justify-center text-gold-300">
            <SparkleIcon className="size-3.5" />
            Ошибка 404
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.2rem)] leading-tight font-medium text-balance">
            Эта ссылка растаяла, как снежинка
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream-200/70">
            Возможно, обмен удалили или в ссылке потерялась пара символов. Попросите организатора
            прислать её заново — или создайте свой обмен.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-gold">
              На главную
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="/demo" className="btn btn-ghost-light">
              Посмотреть демо
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
