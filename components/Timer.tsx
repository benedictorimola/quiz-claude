"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  seconds: number;
  paused?: boolean;
  onExpire: () => void;
};

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
    <p
      role="timer"
      aria-live="polite"
      className={`font-mono text-xs tracking-[0.14em] ${low ? "text-mark" : "text-ink-dim"}`}
    >
      {String(remaining).padStart(2, "0")}s
    </p>
  );
}
