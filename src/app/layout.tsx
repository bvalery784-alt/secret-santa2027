import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "@fontsource-variable/playfair-display";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#071026",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "Тайный Санта — Новогодний обмен подарками",
    template: "%s · Тайный Санта",
  },
  description:
    "Интерактивный сервис для организации новогодней игры «Тайный Санта» в офисе или с друзьями: выбор формата, честная жеребьёвка, вишлисты и секретные открытки.",
  keywords: ["тайный санта", "секретный санта", "обмен подарками", "новый год", "жеребьевка", "вишлист"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-winter-950 text-snow-100 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
