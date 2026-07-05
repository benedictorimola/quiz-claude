import Link from "next/link";
import type { Nivel } from "@prisma/client";

type LevelCardProps = {
  nivel: Nivel;
  label: string;
  status: "locked" | "available" | "completed";
  melhorPercentual?: number;
};

export default function LevelCard({
  nivel,
  label,
  status,
  melhorPercentual,
}: LevelCardProps) {
  const conteudo = (
    <div
      className={`w-full rounded-md border p-5 transition-colors ${
        status === "locked"
          ? "border-surface-2 bg-surface/50 text-text-dim"
          : "border-surface-2 bg-surface text-text hover:border-accent"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          <span className="text-accent" aria-hidden>
            {status === "locked" ? " " : ">"}{" "}
          </span>
          {label}/
        </span>
        {status === "locked" && (
          <span className="text-xs tracking-wide text-text-dim">
            [bloqueado]
          </span>
        )}
      </div>
      {status === "completed" && melhorPercentual !== undefined && (
        <p className="mt-1 pl-4 text-sm text-success">
          Melhor resultado: {Math.round(melhorPercentual * 100)}%
        </p>
      )}
      {status === "locked" && (
        <p className="mt-1 pl-4 text-sm">
          Desbloqueie completando o nível anterior com ≥70%.
        </p>
      )}
    </div>
  );

  if (status === "locked") {
    return conteudo;
  }

  return <Link href={`/quiz/${nivel}`}>{conteudo}</Link>;
}
