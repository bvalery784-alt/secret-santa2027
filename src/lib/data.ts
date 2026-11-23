import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { exchanges, hints, participants, type Exchange, type Participant } from "@/db/schema";
import { cleanDate, cleanEmail, cleanName, cleanBudget, randomToken, sanitizeText } from "@/lib/utils";

export type ExchangeWithParticipants = Exchange & { participants: Participant[] };

export async function getExchangeByOrganizerToken(
  token: string,
): Promise<ExchangeWithParticipants | null> {
  const [exchange] = await db
    .select()
    .from(exchanges)
    .where(eq(exchanges.organizerToken, token))
    .limit(1);
  if (!exchange) return null;
  const list = await db
    .select()
    .from(participants)
    .where(eq(participants.exchangeId, exchange.id))
    .orderBy(asc(participants.createdAt), asc(participants.id));
  return { ...exchange, participants: list };
}

export async function getExchangeBySlug(slug: string): Promise<ExchangeWithParticipants | null> {
  const [exchange] = await db.select().from(exchanges).where(eq(exchanges.slug, slug)).limit(1);
  if (!exchange) return null;
  const list = await db
    .select()
    .from(participants)
    .where(eq(participants.exchangeId, exchange.id))
    .orderBy(asc(participants.createdAt), asc(participants.id));
  return { ...exchange, participants: list };
}

export type ParticipantContext = {
  participant: Participant;
  exchange: Exchange;
  giftee: Participant | null;
  receivedHints: Array<{ id: number; body: string; createdAt: Date }>;
  fromName: string | null;
};

export async function getParticipantContext(token: string): Promise<ParticipantContext | null> {
  const [participant] = await db
    .select()
    .from(participants)
    .where(eq(participants.token, token))
    .limit(1);
  if (!participant) return null;

  const [exchange] = await db
    .select()
    .from(exchanges)
    .where(eq(exchanges.id, participant.exchangeId))
    .limit(1);
  if (!exchange) return null;

  let giftee: Participant | null = null;
  if (participant.gifteeId) {
    const [found] = await db
      .select()
      .from(participants)
      .where(eq(participants.id, participant.gifteeId))
      .limit(1);
    giftee = found ?? null;
  }

  const received = await db
    .select({ id: hints.id, body: hints.body, createdAt: hints.createdAt })
    .from(hints)
    .where(and(eq(hints.toParticipantId, participant.id), eq(hints.exchangeId, exchange.id)))
    .orderBy(desc(hints.createdAt))
    .limit(20);

  const [sender] = participant.gifteeId
    ? await db
        .select({ name: participants.name })
        .from(participants)
        .where(eq(participants.gifteeId, participant.id))
        .limit(1)
    : [];

  return {
    participant,
    exchange,
    giftee,
    receivedHints: received,
    fromName: sender?.name ?? null,
  };
}

export async function createExchange(input: {
  title: unknown;
  organizerName: unknown;
  organizerEmail?: unknown;
  organizerPhoto?: unknown;
  format?: unknown; // "offline" | "online"
  budget?: unknown;
  drawDate?: unknown;
  giftDeadline?: unknown;
  avatar?: unknown;
  cover?: unknown;
  character?: unknown;
  messageHtml?: unknown;
  description?: unknown;
  eventDate?: unknown;
  includeOrganizer?: unknown;
  initialParticipants?: Array<{
    name: string;
    email?: string;
    wishlist?: string;
    antiWishlist?: string;
    wishlistItems?: string[];
  }>;
}): Promise<{ organizerToken: string; slug: string } | { error: string }> {
  const title = sanitizeText(input.title, 160);
  const organizerName = cleanName(input.organizerName);
  if (title.length < 2) return { error: "Название обмена должно быть не короче 2 символов." };
  if (organizerName.length < 2) return { error: "Укажите имя организатора." };

  const drawDateClean = cleanDate(input.drawDate);
  const giftDeadlineClean = cleanDate(input.giftDeadline) ?? cleanDate(input.eventDate);

  // Validation: gift deadline cannot be earlier than draw date
  if (drawDateClean && giftDeadlineClean && giftDeadlineClean < drawDateClean) {
    return { error: "Дата «Покупаем подарки до» не может быть раньше даты жеребьёвки." };
  }

  const organizerToken = randomToken(32);
  const slug = randomToken(10);
  const organizerEmail = cleanEmail(input.organizerEmail);
  const format = input.format === "online" ? "online" : "offline";
  const avatar = sanitizeText(input.avatar, 100) || "tree";
  const cover = sanitizeText(input.cover, 100) || "aurora";
  const character = sanitizeText(input.character, 100) || "santa_classic";
  const messageHtml =
    sanitizeText(input.messageHtml, 2000) ||
    "Всем привет! Начинаем игру \"Тайный Санта\". Скорее регистрируйтесь :)";
  const description = sanitizeText(input.description, 1000) || messageHtml;

  const includeOrganizer = input.includeOrganizer !== false;

  await db.transaction(async (tx) => {
    const [exchange] = await tx
      .insert(exchanges)
      .values({
        slug,
        organizerToken,
        title,
        organizerName,
        organizerPhoto: sanitizeText(input.organizerPhoto, 300),
        format,
        budget: cleanBudget(input.budget),
        drawDate: drawDateClean,
        giftDeadline: giftDeadlineClean,
        eventDate: giftDeadlineClean,
        avatar,
        cover,
        character,
        messageHtml,
        description,
        status: "draft",
      })
      .returning();

    if (includeOrganizer) {
      await tx.insert(participants).values({
        exchangeId: exchange.id,
        name: organizerName,
        email: organizerEmail,
        token: randomToken(28),
        wishlist: "",
      });
    }

    if (Array.isArray(input.initialParticipants)) {
      for (const p of input.initialParticipants) {
        const pName = cleanName(p.name);
        if (pName.length >= 2 && pName !== organizerName) {
          await tx.insert(participants).values({
            exchangeId: exchange.id,
            name: pName,
            email: cleanEmail(p.email),
            token: randomToken(28),
            wishlist: sanitizeText(p.wishlist, 1500),
            antiWishlist: sanitizeText(p.antiWishlist, 1500),
            wishlistItems: JSON.stringify(p.wishlistItems ?? []),
          });
        }
      }
    }
  });

  return { organizerToken, slug };
}

export async function addParticipant(
  exchangeId: number,
  input: {
    name: unknown;
    email?: unknown;
    phone?: unknown;
    address?: unknown;
    wishlist?: unknown;
    wishlistItems?: unknown;
    antiWishlist?: unknown;
    token?: string;
  },
): Promise<{ participant: Participant } | { error: string }> {
  const name = cleanName(input.name);
  if (name.length < 2) return { error: "Укажите имя участника (минимум 2 символа)." };

  const existing = await db
    .select({ id: participants.id, name: participants.name })
    .from(participants)
    .where(eq(participants.exchangeId, exchangeId));

  if (existing.length >= 60) return { error: "В одном обмене может быть не более 60 участников." };

  const [created] = await db
    .insert(participants)
    .values({
      exchangeId,
      name,
      email: cleanEmail(input.email),
      phone: sanitizeText(input.phone, 50),
      address: sanitizeText(input.address, 500),
      wishlist: sanitizeText(input.wishlist, 1500),
      wishlistItems: typeof input.wishlistItems === "string" ? input.wishlistItems : JSON.stringify(input.wishlistItems ?? []),
      antiWishlist: sanitizeText(input.antiWishlist, 1500),
      token: input.token ?? randomToken(28),
    })
    .returning();

  return { participant: created };
}

export async function removeParticipant(exchangeId: number, participantId: number) {
  await db
    .delete(participants)
    .where(and(eq(participants.exchangeId, exchangeId), eq(participants.id, participantId)));
}

export async function updateParticipant(
  participantId: number,
  input: {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    address?: unknown;
    wishlist?: unknown;
    wishlistItems?: unknown;
    antiWishlist?: unknown;
    exclusions?: unknown;
  },
) {
  const updateData: Record<string, unknown> = {};

  if (input.name !== undefined) {
    const name = cleanName(input.name);
    if (name.length >= 2) updateData.name = name;
  }
  if (input.email !== undefined) updateData.email = cleanEmail(input.email);
  if (input.phone !== undefined) updateData.phone = sanitizeText(input.phone, 50);
  if (input.address !== undefined) updateData.address = sanitizeText(input.address, 500);
  if (input.wishlist !== undefined) updateData.wishlist = sanitizeText(input.wishlist, 1500);
  if (input.antiWishlist !== undefined) updateData.antiWishlist = sanitizeText(input.antiWishlist, 1500);
  if (input.wishlistItems !== undefined) {
    updateData.wishlistItems =
      typeof input.wishlistItems === "string"
        ? input.wishlistItems
        : JSON.stringify(input.wishlistItems);
  }
  if (input.exclusions !== undefined) {
    updateData.exclusions =
      typeof input.exclusions === "string"
        ? input.exclusions
        : JSON.stringify(input.exclusions);
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(participants).set(updateData).where(eq(participants.id, participantId));
  }
}

export async function updateExchange(
  exchangeId: number,
  input: {
    title?: unknown;
    organizerName?: unknown;
    organizerPhoto?: unknown;
    format?: unknown;
    budget?: unknown;
    drawDate?: unknown;
    giftDeadline?: unknown;
    eventDate?: unknown;
    avatar?: unknown;
    cover?: unknown;
    character?: unknown;
    messageHtml?: unknown;
    description?: unknown;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) {
    const t = sanitizeText(input.title, 160);
    if (t.length >= 2) updateData.title = t;
  }
  if (input.organizerName !== undefined) {
    const n = cleanName(input.organizerName);
    if (n.length >= 2) updateData.organizerName = n;
  }
  if (input.organizerPhoto !== undefined) updateData.organizerPhoto = sanitizeText(input.organizerPhoto, 300);
  if (input.format !== undefined) updateData.format = input.format === "online" ? "online" : "offline";
  if (input.budget !== undefined) updateData.budget = cleanBudget(input.budget);
  if (input.drawDate !== undefined) updateData.drawDate = cleanDate(input.drawDate);
  if (input.giftDeadline !== undefined) {
    const dl = cleanDate(input.giftDeadline);
    updateData.giftDeadline = dl;
    updateData.eventDate = dl;
  } else if (input.eventDate !== undefined) {
    const dl = cleanDate(input.eventDate);
    updateData.giftDeadline = dl;
    updateData.eventDate = dl;
  }
  if (input.avatar !== undefined) updateData.avatar = sanitizeText(input.avatar, 100);
  if (input.cover !== undefined) updateData.cover = sanitizeText(input.cover, 100);
  if (input.character !== undefined) updateData.character = sanitizeText(input.character, 100);
  if (input.messageHtml !== undefined) {
    const msg = sanitizeText(input.messageHtml, 2000);
    updateData.messageHtml = msg;
    if (input.description === undefined) updateData.description = msg;
  }
  if (input.description !== undefined) updateData.description = sanitizeText(input.description, 1000);

  if (Object.keys(updateData).length > 0) {
    await db.update(exchanges).set(updateData).where(eq(exchanges.id, exchangeId));
  }
}

function secureShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Derangement with exclusion rules:
 * - participant cannot gift themselves
 * - participant cannot gift anyone listed in their exclusions
 * - everyone gives exactly 1 gift and receives exactly 1 gift
 */
export function buildAssignmentsWithExclusions(
  ids: number[],
  exclusionsMap: Map<number, Set<number>>,
): number[] | null {
  const n = ids.length;
  if (n < 2) return null;

  // Try fast randomized approach with derangement
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const shuffled = secureShuffle(ids);
    let valid = true;
    for (let i = 0; i < n; i += 1) {
      const giver = ids[i];
      const receiver = shuffled[i];
      if (giver === receiver) {
        valid = false;
        break;
      }
      const excluded = exclusionsMap.get(giver);
      if (excluded && excluded.has(receiver)) {
        valid = false;
        break;
      }
    }
    if (valid) return shuffled;
  }

  // Backtracking algorithm as fallback
  const used = new Set<number>();
  const result: number[] = new Array(n).fill(-1);

  function backtrack(index: number): boolean {
    if (index === n) return true;
    const giver = ids[index];
    const excluded = exclusionsMap.get(giver);

    // Prioritize candidates with highest constraints
    const candidates = secureShuffle(ids);

    for (const candidate of candidates) {
      if (used.has(candidate)) continue;
      if (candidate === giver) continue;
      if (excluded && excluded.has(candidate)) continue;

      used.add(candidate);
      result[index] = candidate;

      if (backtrack(index + 1)) return true;

      used.delete(candidate);
      result[index] = -1;
    }

    return false;
  }

  if (backtrack(0)) {
    return result;
  }

  return null;
}

export async function drawAssignments(
  exchangeId: number,
): Promise<{ ok: true } | { error: string; code?: string }> {
  const list = await db
    .select()
    .from(participants)
    .where(eq(participants.exchangeId, exchangeId))
    .orderBy(asc(participants.id));

  if (list.length < 3) {
    return { error: "Для жеребьёвки нужно минимум 3 участника.", code: "TOO_FEW" };
  }

  const ids = list.map((row) => row.id);
  const exclusionsMap = new Map<number, Set<number>>();

  for (const p of list) {
    let rawExcl: unknown[] = [];
    try {
      if (p.exclusions) rawExcl = JSON.parse(p.exclusions);
    } catch {
      rawExcl = [];
    }
    const set = new Set<number>();
    if (Array.isArray(rawExcl)) {
      for (const item of rawExcl) {
        const idNum = Number(item);
        if (Number.isInteger(idNum) && idNum !== p.id) {
          set.add(idNum);
        }
      }
    }
    exclusionsMap.set(p.id, set);
  }

  const giftees = buildAssignmentsWithExclusions(ids, exclusionsMap);

  if (!giftees) {
    return {
      error:
        "Не удалось распределить пары с текущими правилами исключений. Попробуйте снять некоторые исключения (например, если слишком много людей исключили друг друга).",
      code: "NO_SOLUTION",
    };
  }

  await db.transaction(async (tx) => {
    for (let index = 0; index < ids.length; index += 1) {
      await tx
        .update(participants)
        .set({ gifteeId: giftees[index], giftReady: false })
        .where(eq(participants.id, ids[index]));
    }
    await tx
      .update(exchanges)
      .set({ status: "drawn", drawnAt: new Date() })
      .where(eq(exchanges.id, exchangeId));
  });

  return { ok: true };
}

export async function resetDraw(exchangeId: number) {
  await db.transaction(async (tx) => {
    await tx.delete(hints).where(eq(hints.exchangeId, exchangeId));
    await tx
      .update(participants)
      .set({ gifteeId: null, giftReady: false })
      .where(eq(participants.exchangeId, exchangeId));
    await tx
      .update(exchanges)
      .set({ status: "draft", drawnAt: null })
      .where(eq(exchanges.id, exchangeId));
  });
}

export async function deleteExchange(exchangeId: number) {
  await db.delete(exchanges).where(eq(exchanges.id, exchangeId));
}

export async function setGiftReady(participantId: number, ready: boolean) {
  await db.update(participants).set({ giftReady: ready }).where(eq(participants.id, participantId));
}

export async function updateWishlist(participantId: number, wishlist: unknown, antiWishlist?: unknown, wishlistItems?: unknown) {
  const updateData: Record<string, unknown> = {
    wishlist: sanitizeText(wishlist, 1500),
  };
  if (antiWishlist !== undefined) {
    updateData.antiWishlist = sanitizeText(antiWishlist, 1500);
  }
  if (wishlistItems !== undefined) {
    updateData.wishlistItems =
      typeof wishlistItems === "string" ? wishlistItems : JSON.stringify(wishlistItems);
  }

  await db
    .update(participants)
    .set(updateData)
    .where(eq(participants.id, participantId));
}

export async function setPairExclusion(
  exchangeId: number,
  id1: number,
  id2: number,
  exclude: boolean,
) {
  const [p1] = await db.select().from(participants).where(eq(participants.id, id1)).limit(1);
  const [p2] = await db.select().from(participants).where(eq(participants.id, id2)).limit(1);
  if (!p1 || !p2 || p1.exchangeId !== exchangeId || p2.exchangeId !== exchangeId) {
    return { error: "Участники не найдены." };
  }

  const updateSet = (currentJson: string | null, targetId: number, add: boolean): string => {
    let arr: number[] = [];
    try {
      if (currentJson) arr = JSON.parse(currentJson);
    } catch {
      arr = [];
    }
    const set = new Set(arr);
    if (add) set.add(targetId);
    else set.delete(targetId);
    return JSON.stringify(Array.from(set));
  };

  const newExcl1 = updateSet(p1.exclusions, id2, exclude);
  const newExcl2 = updateSet(p2.exclusions, id1, exclude);

  await db.transaction(async (tx) => {
    await tx.update(participants).set({ exclusions: newExcl1 }).where(eq(participants.id, id1));
    await tx.update(participants).set({ exclusions: newExcl2 }).where(eq(participants.id, id2));
  });

  return { ok: true };
}

export async function sendHint(context: ParticipantContext, body: unknown) {
  const text = sanitizeText(body, 500);
  if (text.length < 2) return { error: "Напишите хотя бы пару слов." };
  if (!context.giftee) return { error: "Жеребьёвка ещё не проведена." };

  const [last] = await db
    .select({ createdAt: hints.createdAt })
    .from(hints)
    .where(
      and(
        eq(hints.fromParticipantId, context.participant.id),
        eq(hints.exchangeId, context.exchange.id),
      ),
    )
    .orderBy(desc(hints.createdAt))
    .limit(1);

  if (last && Date.now() - new Date(last.createdAt).getTime() < 15_000) {
    return { error: "Подождите немного перед следующей подсказкой." };
  }

  await db.insert(hints).values({
    exchangeId: context.exchange.id,
    fromParticipantId: context.participant.id,
    toParticipantId: context.giftee.id,
    body: text,
  });

  return { ok: true as const };
}

export async function countExchanges(): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(exchanges);
  return row?.count ?? 0;
}

const DEMO_SLUG = "office-secret-santa";
const DEMO_PARTICIPANTS = [
  {
    name: "Аня Смирнова",
    token: "demo-anya-wishlist-token",
    wishlist:
      "Керамическая кружка ручной работы, уютная свеча с ароматом хвои или корицы, книга про дизайн.",
    antiWishlist: "Никаких сладких наборов и сувениров с символом года.",
    wishlistItems: ["Кружка ручной работы", "Свеча с ароматом хвои", "Книга по дизайну"],
  },
  {
    name: "Дима Соколов",
    token: "demo-dima-wishlist-token",
    wishlist:
      "Настольная игра на 4–6 человек, тёплые носки 43 размера, что-нибудь для кофе-геймера.",
    antiWishlist: "Сладкое не ем, чай не пью. Ежедневники не нужны.",
    wishlistItems: ["Настольная игра", "Молотый кофе 100% арабика", "Термоноски"],
  },
  {
    name: "Катя Лебедева",
    token: "demo-katya-wishlist-token",
    wishlist:
      "Блокнот с плотной бумагой, гелевые ручки, маленький суккулент в горшке.",
    antiWishlist: "Косметику, мыло и парфюм не дарите — аллергия.",
    wishlistItems: ["Блокнот с плотной бумагой", "Суккулент в горшке", "Чёрные линеры"],
  },
  {
    name: "Илья Волков",
    token: "demo-ilya-wishlist-token",
    wishlist:
      "Термокружка 450 мл, горький шоколад с солью, подписка на кино.",
    antiWishlist: "Шампуни 3-в-1 и гели для душа.",
    wishlistItems: ["Термокружка", "Шоколад с солью"],
  },
  {
    name: "Марк Попов",
    token: "demo-mark-wishlist-token",
    wishlist:
      "Чехол для наушников, стикеры для ноутбука, хороший зелёный чай.",
    antiWishlist: "Кружек дома уже 15 штук, календари на стену тоже мимо.",
    wishlistItems: ["Чехол для наушников", "Чай сенча", "Стикерпак"],
  },
  {
    name: "Света Морозова",
    token: "demo-sveta-wishlist-token",
    wishlist:
      "Шерстяной шарф бежевого цвета, диффузор для дома с цитрусовым ароматом.",
    antiWishlist: "Пластиковые сувениры и магниты.",
    wishlistItems: ["Шарф шерсть", "Диффузор цитрус"],
  },
];

export async function ensureDemoExchange(): Promise<ExchangeWithParticipants> {
  const existing = await getExchangeBySlug(DEMO_SLUG);
  if (existing) {
    if (existing.status !== "drawn") {
      await drawAssignments(existing.id);
      return (await getExchangeBySlug(DEMO_SLUG))!;
    }
    return existing;
  }

  await db
    .insert(exchanges)
    .values({
      slug: DEMO_SLUG,
      organizerToken: "demo-organizer-token-for-preview",
      title: "Секретный Санта в офисе «Полярная звезда»",
      organizerName: "Аня Смирнова",
      organizerPhoto: "",
      format: "offline",
      budget: 2500,
      drawDate: "2026-12-25",
      giftDeadline: "2026-12-28",
      eventDate: "2026-12-28",
      avatar: "tree",
      cover: "aurora",
      character: "santa_classic",
      messageHtml:
        "Всем привет! Начинаем игру \"Тайный Санта\". Скорее регистрируйтесь :) Подарки вручаем 28 декабря на общем завтраке в переговорке.",
      description:
        "Наш ежегодный обмен подарками: шутки, тёплые пожелания и один вечер без рабочих чатов. Подарки вручаем 28 декабря на общем завтраке.",
      status: "draft",
    })
    .onConflictDoNothing({ target: exchanges.slug });

  const demo = await getExchangeBySlug(DEMO_SLUG);
  if (!demo) throw new Error("Не удалось создать демо-обмен");

  await db
    .insert(participants)
    .values(
      DEMO_PARTICIPANTS.map((person) => ({
        exchangeId: demo.id,
        name: person.name,
        token: person.token,
        wishlist: person.wishlist,
        antiWishlist: person.antiWishlist,
        wishlistItems: JSON.stringify(person.wishlistItems),
      })),
    )
    .onConflictDoNothing({ target: participants.token });

  const result = await drawAssignments(demo.id);
  if ("error" in result) throw new Error(result.error);

  const refreshed = (await getExchangeBySlug(DEMO_SLUG))!;
  const anya = refreshed.participants.find((p) => p.name.startsWith("Аня"));
  const mark = refreshed.participants.find((p) => p.name.startsWith("Марк"));

  if (anya && mark) {
    await db
      .insert(hints)
      .values({
        exchangeId: refreshed.id,
        fromParticipantId: mark.id,
        toParticipantId: anya.id,
        body: "Привет! Я твой Тайный Санта. Увидел в вишлисте свечу с хвоей — кажется, у меня есть отличная идея! Уютных тебе праздников ☕✨",
      })
      .onConflictDoNothing();
  }

  return refreshed;
}

export const demoSlug = DEMO_SLUG;
