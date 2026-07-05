import type { Attempt } from "@prisma/client";
import { NIVEL_LABELS } from "@/lib/quiz";

export default function HistoryList({ attempts }: { attempts: Attempt[] }) {
  if (attempts.length === 0) return null;

  return (
    <div className="w-full max-w-sm">
      <h2 className="mb-2 text-sm text-text-dim">Histórico de tentativas</h2>
      <ul className="flex flex-col gap-2">
        {attempts.map((attempt) => (
          <li
            key={attempt.id}
            className="flex items-center justify-between rounded-md border border-surface-2 bg-surface px-3 py-2 text-sm"
          >
            <span>{NIVEL_LABELS[attempt.nivel]}</span>
            <span
              className={
                attempt.desbloqueouProximo ? "text-success" : "text-text-dim"
              }
            >
              {attempt.acertos}/{attempt.totalPerguntas} (
              {Math.round(attempt.percentual * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
