"use client";

import { useEffect, useState } from "react";

export function Snowfall() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !enabled) {
    return (
      <button
        type="button"
        onClick={() => setEnabled(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full border border-white/20 bg-winter-900/80 p-2.5 text-xs text-white/70 backdrop-blur-md transition hover:text-white"
        title="Включить снегопад"
      >
        ❄️ Вкл. снег
      </button>
    );
  }

  // Generate 28 flakes with varied speeds, sizes and positions
  const flakes = Array.from({ length: 28 }).map((_, i) => {
    const left = `${(i * 3.5 + (i % 5) * 1.5) % 100}%`;
    const duration = `${7 + (i % 8) * 1.8}s`;
    const delay = `${(i * 0.4) % 6}s`;
    const size = 10 + (i % 5) * 3;
    const opacity = 0.25 + (i % 6) * 0.12;
    const char = i % 4 === 0 ? "❄" : i % 3 === 0 ? "❅" : i % 2 === 0 ? "•" : "❆";

    return (
      <span
        key={i}
        className="snowflake"
        style={{
          left,
          animationDuration: duration,
          animationDelay: delay,
          fontSize: `${size}px`,
          opacity,
        }}
      >
        {char}
      </span>
    );
  });

  return (
    <>
      <div aria-hidden="true">{flakes}</div>
      <button
        type="button"
        onClick={() => setEnabled(false)}
        className="fixed bottom-4 right-4 z-40 rounded-full border border-white/10 bg-winter-900/60 px-3 py-1.5 text-xs text-white/50 backdrop-blur-md transition hover:bg-winter-900/90 hover:text-white"
        title="Выключить снегопад"
      >
        ❄️ Выкл. снег
      </button>
    </>
  );
}
