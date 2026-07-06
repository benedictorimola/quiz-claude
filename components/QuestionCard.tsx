"use client";

import { useEffect } from "react";

type QuestionCardProps = {
  onAnswer: (resposta: boolean) => void;
  disabled?: boolean;
};

const OPCOES = [
  { label: "Verdadeiro", valor: true, atalho: "V" },
  { label: "Falso", valor: false, atalho: "F" },
] as const;

export default function QuestionCard({
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
  useEffect(() => {
    if (disabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "v") onAnswer(true);
      if (event.key.toLowerCase() === "f") onAnswer(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, onAnswer]);

  return (
    <div className="flex flex-col border-t border-line">
      {OPCOES.map(({ label, valor, atalho }) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(valor)}
          className="group flex items-center justify-between gap-4 border-b border-line py-5 text-left transition-colors hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="font-serif text-xl text-ink transition-colors group-hover:text-mark sm:text-2xl">
            {label}
          </span>
          <span className="font-mono text-xs tracking-[0.14em] text-ink-dim transition-colors group-hover:text-mark">
            [{atalho}]
          </span>
        </button>
      ))}
    </div>
  );
}
