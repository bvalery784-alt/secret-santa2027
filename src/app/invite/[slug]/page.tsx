import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getExchangeBySlug } from "@/lib/data";
import { ScreenTwoInvite } from "@/components/screen-two-invite";
import { Snowfall } from "@/components/snowflakes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Приглашение в игру «Тайный Санта»",
  robots: { index: false, follow: false },
};

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exchange = await getExchangeBySlug(slug);
  if (!exchange) notFound();

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
      wishlist: p.wishlist,
      antiWishlist: p.antiWishlist || "",
    })),
  };

  return (
    <div className="min-h-screen bg-winter-sky text-snow-100 flex flex-col relative selection:bg-red-600 selection:text-white">
      <Snowfall />

      <header className="border-b border-white/10 bg-winter-950/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-snow-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>На главную страницу игры</span>
          </Link>
          <span className="winter-badge winter-badge-red text-[11px]">🎅 Приглашение в игру</span>
        </div>
      </header>

      <main className="flex-1 pb-16">
        <ScreenTwoInvite
          gameData={gameData}
          inviteSlug={slug}
          onJoinClick={async () => {
            "use server";
            redirect(`/join/${slug}`);
          }}
        />
      </main>
    </div>
  );
}
