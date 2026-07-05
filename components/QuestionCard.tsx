"use client";

import { useEffect } from "react";
import type { Question } from "@prisma/client";

type QuestionCardProps = {
  question: Question;
  onAnswer: (resposta: boolean) => void;
  disabled?: boolean;
};

export default function QuestionCard({
  question,
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
    <div className="w-full max-w-lg rounded-md border border-surface-2 bg-surface p-6">
      <p className="text-lg leading-relaxed text-text">
        <span className="text-accent" aria-hidden>
          &gt;{" "}
        </span>
        {question.enunciado}
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(true)}
          className="flex-1 rounded-md bg-success/20 py-4 text-lg font-semibold text-success transition-colors hover:bg-success/30 disabled:opacity-50"
        >
          <span className="text-sm opacity-70">[V]</span> Verdadeiro
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(false)}
          className="flex-1 rounded-md bg-error/20 py-4 text-lg font-semibold text-error transition-colors hover:bg-error/30 disabled:opacity-50"
        >
          <span className="text-sm opacity-70">[F]</span> Falso
        </button>
      </div>
    </div>
  );
}
