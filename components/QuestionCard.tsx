"use client";

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
  return (
    <div className="w-full max-w-lg rounded-lg border border-surface-2 bg-surface p-6">
      <p className="text-lg leading-relaxed text-text">{question.enunciado}</p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(true)}
          className="flex-1 rounded-md bg-success/20 py-4 text-lg font-semibold text-success transition-colors hover:bg-success/30 disabled:opacity-50"
        >
          Verdadeiro
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(false)}
          className="flex-1 rounded-md bg-error/20 py-4 text-lg font-semibold text-error transition-colors hover:bg-error/30 disabled:opacity-50"
        >
          Falso
        </button>
      </div>
    </div>
  );
}
