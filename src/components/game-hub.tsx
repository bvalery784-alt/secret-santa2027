"use client";

import { useEffect, useState } from "react";
import { GameStepper, type ScreenId } from "./game-stepper";
import { ScreenOneCreate, type GameFormData } from "./screen-one-create";
import { ScreenTwoInvite } from "./screen-two-invite";
import { ScreenThreeForm, type PlayerProfile } from "./screen-three-form";
import { ScreenFourDraw, type DrawAssignment } from "./screen-four-draw";
import { Snowfall } from "./snowflakes";

const LOCAL_STORAGE_KEY = "santa_interactive_game_v1";

const DEFAULT_INITIAL_GAME: GameFormData = {
  title: "Секретный Санта в офисе «Полярная звезда» 2026",
  organizerName: "Аня Смирнова",
  organizerEmail: "anya@company.ru",
  format: "offline",
  budget: 2500,
  drawDate: "2026-12-25",
  giftDeadline: "2026-12-28",
  avatar: "tree",
  cover: "aurora",
  character: "santa_classic",
  messageHtml:
    "Всем привет! Начинаем игру \"Тайный Санта\". Скорее регистрируйтесь :) Подарки вручаем 28 декабря на общем праздничном завтраке в переговорке.",
  participants: [
    {
      name: "Аня Смирнова",
      email: "anya@company.ru",
      wishlist: "Керамическая кружка ручной работы, уютная свеча с ароматом хвои или корицы, книга про дизайн.",
      antiWishlist: "Пожалуйста, никаких сладких подарочных наборов и сувенирных статуэток с символом года.",
      wishlistItems: ["Кружка ручной работы", "Свеча с ароматом хвои", "Книга по дизайну"],
    },
    {
      name: "Дмитрий Соколов",
      email: "dima@company.ru",
      wishlist: "Настольная игра для компании (например, «Кодовые имена»), хороший молотый кофе, тёплые носки 43 размера.",
      antiWishlist: "Сладкое не ем, чай не пью — только чистый кофе. Ежедневники тоже не нужны.",
      wishlistItems: ["Настольная игра", "Молотый кофе 100% арабика", "Термоноски (43 р-р)"],
    },
    {
      name: "Катя Лебедева",
      email: "katya@company.ru",
      wishlist: "Блокнот с нелинованными листами плотной бумаги, набор гелевых ручек Muji, маленький суккулент в горшке.",
      antiWishlist: "Не дарите дешёвую косметику, мыло ручной работы и парфюм — у меня аллергия.",
      wishlistItems: ["Блокнот с плотной бумагой", "Суккулент в горшке", "Чёрные линеры 0.38"],
    },
    {
      name: "Илья Волков",
      email: "ilya@company.ru",
      wishlist: "Термокружка 450 мл (непроливайка), горький шоколад с морской солью, коврик для мыши XXL.",
      antiWishlist: "Никаких шампуней 3-в-1, гелей для душа из супермаркета и открыток с готовым текстом.",
      wishlistItems: ["Термокружка непроливайка", "Шоколад с солью", "Коврик для мыши XXL"],
    },
    {
      name: "Марк Попов",
      email: "mark@company.ru",
      wishlist: "Чехол для AirPods Pro 2, стикерпак с IT-мемами, качественный зелёный чай сенча.",
      antiWishlist: "Кружек дома уже 15 штук, ставить некуда! И календари на стену тоже мимо.",
      wishlistItems: ["Чехол AirPods Pro 2", "Чай сенча", "Стикерпак"],
    },
    {
      name: "Светлана Морозова",
      email: "sveta@company.ru",
      wishlist: "Шерстяной шарф спокойного бежевого цвета, диффузор для дома с цитрусовым ароматом.",
      antiWishlist: "Пластиковые сувениры, магнитики на холодильник и дешёвый алкоголь.",
      wishlistItems: ["Шарф бежевый шерсть", "Аромадиффузор мандарин"],
    },
  ],
};

export function GameHub() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(1);
  const [gameData, setGameData] = useState<GameFormData>(DEFAULT_INITIAL_GAME);
  const [assignments, setAssignments] = useState<DrawAssignment[]>([]);
  const [isDrawn, setIsDrawn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteSlug, setInviteSlug] = useState<string>("demo");
  const [mounted, setMounted] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.gameData) setGameData(parsed.gameData);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.isDrawn !== undefined) setIsDrawn(parsed.isDrawn);
        if (parsed.currentScreen) setCurrentScreen(parsed.currentScreen);
        if (parsed.inviteSlug) setInviteSlug(parsed.inviteSlug);
      }
    } catch {
      // localStorage error fallback
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          gameData,
          assignments,
          isDrawn,
          currentScreen,
          inviteSlug,
        }),
      );
    } catch {
      // ignore
    }
  }, [gameData, assignments, isDrawn, currentScreen, inviteSlug, mounted]);

  // Sync with DB API when game is updated from Screen 1
  async function handleScreenOneSave(data: GameFormData) {
    setGameData(data);
    setIsSaving(true);
    try {
      const response = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          organizerName: data.organizerName,
          organizerEmail: data.organizerEmail,
          format: data.format,
          budget: data.budget,
          drawDate: data.drawDate,
          giftDeadline: data.giftDeadline,
          eventDate: data.giftDeadline,
          avatar: data.avatar,
          cover: data.cover,
          character: data.character,
          messageHtml: data.messageHtml,
          description: data.messageHtml,
          includeOrganizer: true,
          initialParticipants: data.participants,
        }),
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.slug) setInviteSlug(resData.slug);
      }
    } catch {
      // fallback to client mode
    } finally {
      setIsSaving(false);
      setCurrentScreen(2); // Go to Screen 2
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // When player clicks "Участвовать" on Screen 2 -> Go to Screen 3
  function handleScreenTwoJoin() {
    setCurrentScreen(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // When player submits Screen 3 profile -> Add to game & Go to Screen 4
  function handleScreenThreeSubmit(profile: PlayerProfile) {
    // Check if player with this name already exists; if so, update their wishlist
    const existingIndex = gameData.participants.findIndex(
      (p) => p.name.toLowerCase() === profile.name.toLowerCase(),
    );

    let updatedList = [...gameData.participants];
    if (existingIndex >= 0) {
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        ...profile,
      };
    } else {
      updatedList.push(profile);
    }

    setGameData((prev) => ({
      ...prev,
      participants: updatedList,
    }));

    setCurrentScreen(4); // Go to Screen 4
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Draw algorithm on Screen 4
  function handleExecuteDraw(exclusions: Array<[number, number]>) {
    const n = gameData.participants.length;
    if (n < 2) return;

    // Build exclusion lookup map
    const exclMap = new Map<number, Set<number>>();
    for (const [a, b] of exclusions) {
      if (!exclMap.has(a)) exclMap.set(a, new Set());
      if (!exclMap.has(b)) exclMap.set(b, new Set());
      exclMap.get(a)!.add(b);
      exclMap.get(b)!.add(a);
    }

    // Try derangement algorithm
    const indices = Array.from({ length: n }, (_, i) => i);
    let assigned: number[] | null = null;

    for (let attempt = 0; attempt < 500; attempt += 1) {
      // Shuffle
      const shuffled = [...indices];
      for (let i = n - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      let valid = true;
      for (let i = 0; i < n; i += 1) {
        const giver = indices[i];
        const receiver = shuffled[i];
        if (giver === receiver) {
          valid = false;
          break;
        }
        const excluded = exclMap.get(giver);
        if (excluded && excluded.has(receiver)) {
          valid = false;
          break;
        }
      }

      if (valid) {
        assigned = shuffled;
        break;
      }
    }

    // If fast shuffle failed due to strict constraints, fallback to cycle rotation
    if (!assigned) {
      assigned = [...indices.slice(1), indices[0]];
    }

    const newAssignments: DrawAssignment[] = indices.map((giverIdx, i) => {
      const receiverIdx = assigned![i];
      const receiver = gameData.participants[receiverIdx];
      return {
        giverIndex: giverIdx,
        giverName: gameData.participants[giverIdx].name,
        receiverIndex: receiverIdx,
        receiverName: receiver.name,
        receiverWishlist: receiver.wishlist,
        receiverWishlistItems: receiver.wishlistItems,
        receiverAntiWishlist: receiver.antiWishlist,
        receiverAddress: (receiver as any).address,
      };
    });

    setAssignments(newAssignments);
    setIsDrawn(true);
  }

  // Reset entire game: «Кнопка «Начать заново» сбрасывает игру»
  function handleResetGame() {
    if (confirm("Вы уверены, что хотите сбросить игру и начать заново?")) {
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {
        // ignore
      }
      setGameData(DEFAULT_INITIAL_GAME);
      setAssignments([]);
      setIsDrawn(false);
      setCurrentScreen(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-winter-sky text-snow-100 flex flex-col relative selection:bg-red-600 selection:text-white">
      {/* Animated falling snowflakes */}
      <Snowfall />

      {/* Screen Navigation Bar */}
      <GameStepper
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        gameTitle={gameData.title}
        isDrawn={isDrawn}
        participantCount={gameData.participants.length}
        onResetGame={handleResetGame}
      />

      {/* Active Screen Content */}
      <main className="flex-1 pb-16">
        {currentScreen === 1 && (
          <ScreenOneCreate
            initialData={gameData}
            onSaveAndNext={handleScreenOneSave}
            isSaving={isSaving}
          />
        )}

        {currentScreen === 2 && (
          <ScreenTwoInvite
            gameData={gameData}
            onJoinClick={handleScreenTwoJoin}
            inviteSlug={inviteSlug}
          />
        )}

        {currentScreen === 3 && (
          <ScreenThreeForm
            gameData={gameData}
            onSubmitProfile={handleScreenThreeSubmit}
          />
        )}

        {currentScreen === 4 && (
          <ScreenFourDraw
            gameData={gameData}
            assignments={assignments}
            isDrawn={isDrawn}
            onExecuteDraw={handleExecuteDraw}
            onResetGame={handleResetGame}
            onRedraw={() => handleExecuteDraw([])}
          />
        )}
      </main>

      {/* Winter Footer */}
      <footer className="border-t border-white/10 bg-winter-950/80 py-8 text-center text-xs text-snow-300/60 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} «Тайный Санта». Сервис новогоднего обмена подарками.</p>
          <div className="flex items-center gap-4 text-snow-300/70">
            <span>❄️ Зимний режим</span>
            <span>🎅 Секретная жеребьёвка</span>
            <span>🎁 Без повторов</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
