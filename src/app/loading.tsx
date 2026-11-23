import { SnowflakeIcon } from "@/components/brand";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-pine-950 text-cream-100">
      <div className="text-center">
        <SnowflakeIcon className="animate-float mx-auto size-10 text-gold-300" />
        <p className="mt-4 font-display text-xl text-cream-200/80">Распаковываем подарки…</p>
      </div>
    </div>
  );
}
