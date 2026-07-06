"use client";

import { useEffect, useState } from "react";
import type { Attempt } from "@prisma/client";
import LevelCard from "@/components/LevelCard";
import HistoryList from "@/components/HistoryList";
import { useSessionId } from "@/lib/session";
import { NIVEIS, NIVEL_LABELS, computeUnlockedLevels } from "@/lib/quiz";

export default function Home() {
  const sessionId = useSessionId();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    let cancelado = false;

    fetch(`/api/attempts?sessionId=${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar histórico.");
        return res.json();
      })
      .then((data: Attempt[]) => {
        if (cancelado) return;
        setAttempts(data);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelado) setErro(true);
      });

    return () => {
      cancelado = true;
    };
  }, [sessionId]);

  const unlocked = computeUnlockedLevels(attempts);

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-4 py-10 sm:py-14">
      <div className="text-center">
        <p className="cursor-blink text-sm text-accent">
          $ quiz-claude --iniciar
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-text">
          Quiz Claude Code
        </h1>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {NIVEIS.map((nivel) => {
          const attemptsDoNivel = attempts.filter((a) => a.nivel === nivel);
          const melhorPercentual = attemptsDoNivel.length
            ? Math.max(...attemptsDoNivel.map((a) => a.percentual))
            : undefined;
          const status = !loaded
            ? nivel === "iniciante"
              ? "available"
              : "locked"
            : !unlocked.has(nivel)
              ? "locked"
              : attemptsDoNivel.length
                ? "completed"
                : "available";

          return (
            <LevelCard
              key={nivel}
              nivel={nivel}
              label={NIVEL_LABELS[nivel]}
              status={status}
              melhorPercentual={melhorPercentual}
            />
          );
        })}
      </div>

      {erro && (
        <p className="max-w-sm text-center text-sm text-error">
          [ERRO] Não foi possível carregar seu histórico. Os níveis exibidos
          podem estar desatualizados.
        </p>
      )}

      <HistoryList attempts={attempts} />
    </main>
  );
}
