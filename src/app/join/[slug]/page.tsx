import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { addParticipant, getExchangeBySlug } from "@/lib/data";
import { ScreenThreeForm, type PlayerProfile } from "@/components/screen-three-form";
import { Snowfall } from "@/components/snowflakes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Анкета участника · Тайный Санта",
  robots: { index: false, follow: false },
};

export default async function JoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exchange = await getExchangeBySlug(slug);
  if (!exchange) notFound();

  const exchangeId = exchange.id;

  const gameData = {
    title: exchange.title,
    organizerName: exchange.organizerName,
    organizerEmail: "",
    format: (exchange.format as "offline" | "online") || "offline",
    budget: exchange.budget || 2500,
    drawDate: exchange.drawDate || "",
    giftDeadline: exchange.giftDeadline || exchange.eventDate || "",
    avatar: exchange.avatar || "tree",
    cover: exchange.cover || "aurora",
    character: exchange.character || "santa_classic",
    messageHtml: exchange.messageHtml || exchange.description || "",
    participants: exchange.participants.map((p) => ({
      name: p.name,
      email: p.email || "",
    })),
  };

  async function handleProfileSubmit(profile: PlayerProfile) {
    "use server";
    const result = await addParticipant(exchangeId, {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      wishlist: profile.wishlist,
      wishlistItems: profile.wishlistItems,
      antiWishlist: profile.antiWishlist,
    });
    if ("error" in result) {
      throw new Error(result.error);
    }
    redirect(`/s/${result.participant.token}`);
  }

  return (
    <div className="min-h-screen bg-winter-sky text-snow-100 flex flex-col relative selection:bg-red-600 selection:text-white">
      <Snowfall />

      <header className="border-b border-white/10 bg-winter-950/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href={`/invite/${slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-snow-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Назад к приглашению</span>
          </Link>
          <span className="winter-badge winter-badge-gold text-[11px]">📝 Экран 3 · Анкета</span>
        </div>
      </header>

      <main className="flex-1 pb-16">
        <ScreenThreeForm gameData={gameData} onSubmitProfile={handleProfileSubmit} />
      </main>
    </div>
  );
}
