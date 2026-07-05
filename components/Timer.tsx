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
    <div className="w-full max-w-sm">
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            low ? "bg-error" : "bg-accent"
          }`}
          style={{ width: `${(remaining / seconds) * 100}%` }}
        />
      </div>
      <p
        className={`mt-1 text-sm ${low ? "text-error" : "text-text-dim"}`}
      >
        {remaining}s
      </p>
    </div>
  );
}
