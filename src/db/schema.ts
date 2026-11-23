import {
  type AnyPgColumn,
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const exchanges = pgTable("exchanges", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 32 }).notNull().unique(),
  organizerToken: varchar("organizer_token", { length: 48 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull().default(""),
  organizerName: varchar("organizer_name", { length: 100 }).notNull(),
  organizerPhoto: text("organizer_photo").default(""),
  format: varchar("format", { length: 16 }).notNull().default("offline"), // "offline" | "online"
  budget: integer("budget"),
  eventDate: date("event_date"), // alias / date for gift giving
  drawDate: date("draw_date"), // date of the draw
  giftDeadline: date("gift_deadline"), // deadline for buying gifts
  avatar: varchar("avatar", { length: 100 }).default("tree"),
  cover: varchar("cover", { length: 100 }).default("aurora"),
  character: varchar("character", { length: 100 }).default("santa_classic"),
  messageHtml: text("message_html").notNull().default(
    "Всем привет! Начинаем игру \"Тайный Санта\". Скорее регистрируйтесь :)"
  ),
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft | drawn
  drawnAt: timestamp("drawn_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const participants = pgTable(
  "participants",
  {
    id: serial("id").primaryKey(),
    exchangeId: integer("exchange_id")
      .notNull()
      .references(() => exchanges.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 180 }),
    phone: varchar("phone", { length: 50 }),
    address: text("address").default(""), // for online format
    wishlist: text("wishlist").notNull().default(""), // "Что хотели бы получить в подарок?" (min 4 chars)
    wishlistItems: text("wishlist_items").default("[]"), // JSON string array of specific gifts
    antiWishlist: text("anti_wishlist").default(""), // "Что точно не стоит дарить?"
    exclusions: text("exclusions").default("[]"), // JSON string array of participant IDs to exclude
    token: varchar("token", { length: 48 }).notNull().unique(),
    gifteeId: integer("giftee_id").references((): AnyPgColumn => participants.id, {
      onDelete: "set null",
    }),
    giftReady: boolean("gift_ready").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("participants_exchange_idx").on(table.exchangeId)],
);

export const hints = pgTable(
  "hints",
  {
    id: serial("id").primaryKey(),
    exchangeId: integer("exchange_id")
      .notNull()
      .references(() => exchanges.id, { onDelete: "cascade" }),
    fromParticipantId: integer("from_participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    toParticipantId: integer("to_participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("hints_to_idx").on(table.toParticipantId)],
);

export type Exchange = typeof exchanges.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type Hint = typeof hints.$inferSelect;
