"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  seconds: number;
  paused?: boolean;
  onExpire: () => void;
};

const LARGURA_MEDIDOR = 20;

function medidorAscii(remaining: number, total: number, largura = LARGURA_MEDIDOR) {
  const preenchido = Math.max(
    0,
    Math.min(largura, Math.round((remaining / total) * largura)),
  );
  return "█".repeat(preenchido) + "·".repeat(largura - preenchido);
}

export default function Timer({ seconds, paused = false, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (paused) return;

    if (remaining <= 0) {
      onExpire();
      return;
    }

    const timeout = setTimeout(() => {
      setRemaining((r) => r - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [remaining, paused, onExpire]);

  const low = remaining <= 10;

  return (
    <div className="w-full max-w-sm">
      <p
        className={`text-sm leading-relaxed ${low ? "text-error" : "text-accent"}`}
        role="timer"
        aria-live="polite"
      >
        [{medidorAscii(remaining, seconds)}] {String(remaining).padStart(2, "0")}s
      </p>
    </div>
  );
}
