export interface SantaCharacter {
  id: string;
  name: string;
  badge: string;
  emoji: string;
  tagline: string;
  description: string;
  gradient: string;
}

export const SANTA_CHARACTERS: SantaCharacter[] = [
  {
    id: "santa_classic",
    name: "Классический Дед Мороз",
    badge: "Легенда",
    emoji: "🎅",
    tagline: "С бородой из ваты и мешком сюрпризов",
    description: "Настоящий хранитель новогодних традиций, помнит стишки наизусть и дарит именно то, что нужно.",
    gradient: "from-red-600 to-rose-700",
  },
  {
    id: "santa_hipster",
    name: "Хипстер-Санта",
    badge: "В тренде",
    emoji: "☕",
    tagline: "С тыквенным латте и в вязаном свитере",
    description: "Разбирается в крафтовом кофе, лимитированных свечах и виниле. Упаковывает всё в крафт с джутовой нитью.",
    gradient: "from-amber-600 to-orange-700",
  },
  {
    id: "santa_cat",
    name: "Кот Мороз",
    badge: "Мяу-режим",
    emoji: "🐱",
    tagline: "Пушистый повелитель шуршащих коробок",
    description: "Любит скидывать шарики с ёлки, но подарки выбирает с бесконечной нежностью и мурлыканьем.",
    gradient: "from-indigo-600 to-purple-700",
  },
  {
    id: "snegurochka",
    name: "Снегурочка",
    badge: "Магия",
    emoji: "❄️",
    tagline: "В лазурной шубке и серебряной короне",
    description: "Следит за идеальным порядком в вишлистах, добавляет блеска и никогда ничего не путает.",
    gradient: "from-cyan-600 to-blue-700",
  },
  {
    id: "santa_gamer",
    name: "Санта-Геймер",
    badge: "Level 100",
    emoji: "🎮",
    tagline: "В RGB-наушниках и с геймпадом",
    description: "Знает толк в стикерах, мерче, кружках с подогревом и подписках. Всегда в голосовом чате.",
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    id: "elf_helper",
    name: "Эльф-Помощник",
    badge: "Трудоголик",
    emoji: "🧝",
    tagline: "Главный по дедлайнам и упаковке",
    description: "Завяжет идеальный бант за 3 секунды, напомнит купить открытку и проследит за тайной жеребьёвки.",
    gradient: "from-green-600 to-emerald-700",
  },
];

export interface AvatarPreset {
  id: string;
  name: string;
  emoji: string;
  bg: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "tree", name: "Ёлочка", emoji: "🎄", bg: "from-emerald-700 to-green-900" },
  { id: "gift", name: "Подарок", emoji: "🎁", bg: "from-red-600 to-rose-900" },
  { id: "reindeer", name: "Олень", emoji: "🦌", bg: "from-amber-700 to-amber-950" },
  { id: "snowflake", name: "Снежинка", emoji: "❄️", bg: "from-blue-600 to-indigo-900" },
  { id: "sparkles", name: "Звезда", emoji: "⭐", bg: "from-yellow-500 to-amber-700" },
  { id: "bell", name: "Колокольчик", emoji: "🔔", bg: "from-amber-500 to-yellow-600" },
  { id: "mittens", name: "Варежки", emoji: "🧤", bg: "from-red-500 to-pink-700" },
  { id: "snowman", name: "Снеговик", emoji: "⛄", bg: "from-cyan-500 to-blue-800" },
];

export interface CoverTheme {
  id: string;
  name: string;
  description: string;
  cssGradient: string;
  accentColor: string;
  previewClass: string;
}

export const COVER_THEMES: CoverTheme[] = [
  {
    id: "aurora",
    name: "Северное сияние",
    description: "Переливы изумруда и глубокого индиго",
    cssGradient: "linear-gradient(135deg, #071a2f 0%, #0c3343 50%, #151d45 100%)",
    accentColor: "#38bdf8",
    previewClass: "from-[#071a2f] via-[#0c3343] to-[#151d45]",
  },
  {
    id: "night_sky",
    name: "Звёздная ночь",
    description: "Тёмно-синее небо с россыпью золотых искр",
    cssGradient: "linear-gradient(135deg, #060d1f 0%, #0e1e44 50%, #172b68 100%)",
    accentColor: "#fbbf24",
    previewClass: "from-[#060d1f] via-[#0e1e44] to-[#172b68]",
  },
  {
    id: "cozy_fireplace",
    name: "У тёплого камина",
    description: "Праздничный рубин и янтарные угли",
    cssGradient: "linear-gradient(135deg, #2b080c 0%, #4a1017 50%, #1a0609 100%)",
    accentColor: "#ef233c",
    previewClass: "from-[#2b080c] via-[#4a1017] to-[#1a0609]",
  },
  {
    id: "snowy_forest",
    name: "Заснеженный бор",
    description: "Морозные хвойные лапы под снегом",
    cssGradient: "linear-gradient(135deg, #051914 0%, #0c3128 50%, #081a20 100%)",
    accentColor: "#34d399",
    previewClass: "from-[#051914] via-[#0c3128] to-[#081a20]",
  },
  {
    id: "candy_cane",
    name: "Праздничный карнавал",
    description: "Яркий новогодний контраст и конфетти",
    cssGradient: "linear-gradient(135deg, #2a0b1e 0%, #471131 50%, #180924 100%)",
    accentColor: "#f43f5e",
    previewClass: "from-[#2a0b1e] via-[#471131] to-[#180924]",
  },
];

export interface PastGamePreset {
  id: string;
  title: string;
  category: string;
  players: Array<{
    name: string;
    email: string;
    wishlist: string;
    antiWishlist: string;
    wishlistItems: string[];
  }>;
}

export const PAST_GAMES_PRESETS: PastGamePreset[] = [
  {
    id: "office_2025",
    title: "Офис: Продуктовая команда",
    category: "Работа и коллеги",
    players: [
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
        wishlistItems: ["Блокнот с плотной бумагой", "Суккулент в глиняном горшке", "Чёрные линеры 0.38"],
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
        wishlistItems: ["Чехол AirPods Pro 2", "Чай сенча высший сорт", "Набор стикеров"],
      },
      {
        name: "Светлана Морозова",
        email: "sveta@company.ru",
        wishlist: "Шерстяной шарф спокойного бежевого цвета, диффузор для дома с цитрусовым ароматом.",
        antiWishlist: "Пластиковые сувениры, магнитики на холодильник и дешёвый алкоголь.",
        wishlistItems: ["Шарф бежевый шерсть", "Аромадиффузор мандарин"],
      },
    ],
  },
  {
    id: "friends_weekend",
    title: "Друзья с дачи и настолок",
    category: "Друзья",
    players: [
      {
        name: "Максим Орлов",
        email: "max@friends.net",
        wishlist: "Мангальные принадлежности, складной нож Victorinox, термос для долгих прогулок.",
        antiWishlist: "Книги по саморазвитию и носки со снеговиками — умоляю, нет :)",
        wishlistItems: ["Термос 0.75л", "Набор шампуров с деревянной ручкой"],
      },
      {
        name: "Ольга Новикова",
        email: "olga@friends.net",
        wishlist: "Мягкий плед крупной вязки, набор для глинтвейна со специями, гирлянда-роса на батарейках.",
        antiWishlist: "Ароматические палочки с резким запахом и рамки для фото.",
        wishlistItems: ["Плед крупной вязки", "Набор специй для глинтвейна", "Гирлянда роса 10м"],
      },
      {
        name: "Артём Белов",
        email: "artem@friends.net",
        wishlist: "Фонарик налобный светодиодный, пауэрбанк с быстрой зарядкой, забавный новогодний свитер (L).",
        antiWishlist: "Статуэтки, сладости с марципаном.",
        wishlistItems: ["Налобный фонарик", "Пауэрбанк 10000 mAh"],
      },
      {
        name: "Елена Кузнецова",
        email: "elena@friends.net",
        wishlist: "Форма для выпечки кексов, кондитерский мешок с насадками, ванильный экстракт.",
        antiWishlist: "Косметические маски и дешёвый растворимый кофе.",
        wishlistItems: ["Силиконовая форма для кекса", "Кондитерские насадки"],
      },
      {
        name: "Влад Романов",
        email: "vlad@friends.net",
        wishlist: "Держатель для телефона в авто с беспроводной зарядкой, перчатки для сенсорного экрана.",
        antiWishlist: "Брелоки, блокноты и ароматизаторы ёлочки в машину.",
        wishlistItems: ["Автодержатель MagSafe", "Кожаные перчатки touch"],
      },
    ],
  },
];
