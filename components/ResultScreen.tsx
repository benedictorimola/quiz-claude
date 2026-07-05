import Link from "next/link";
import type { Nivel } from "@prisma/client";
import ShareButton from "@/components/ShareButton";
import { NIVEL_LABELS } from "@/lib/quiz";

type ResultScreenProps = {
  nivel: Nivel;
  acertos: number;
  total: number;
  desbloqueouProximo: boolean;
  enviando: boolean;
  duracaoSegundos: number | null;
};

export default function ResultScreen({
  nivel,
  acertos,
  total,
  desbloqueouProximo,
  enviando,
  duracaoSegundos,
}: ResultScreenProps) {
  const percentual = Math.round((acertos / total) * 100);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center sm:p-8">
      <div className="w-full max-w-lg rounded-md border border-surface-2 bg-surface p-8">
        <p className="text-sm text-accent">
          &gt; resultado --nivel={NIVEL_LABELS[nivel]}
        </p>
        <p
          className={`mt-4 text-5xl font-bold sm:text-6xl ${
            desbloqueouProximo ? "text-success" : "text-error"
          }`}
        >
          {acertos}/{total}
        </p>
        <p className="mt-1 text-text-dim">{percentual}% de acerto</p>
        {duracaoSegundos !== null && (
          <p className="mt-1 text-sm text-text-dim">
            Tempo: {duracaoSegundos}s
          </p>
        )}
        <div className="mt-4 border-t border-surface-2 pt-4">
          {enviando ? (
            <p className="text-text-dim">Salvando resultado…</p>
          ) : (
            <p className={desbloqueouProximo ? "text-success" : "text-error"}>
              {desbloqueouProximo
                ? "Próximo nível desbloqueado!"
                : "Você precisa de pelo menos 70% para desbloquear o próximo nível."}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <ShareButton nivel={nivel} acertos={acertos} total={total} />
        <Link href="/" className="text-accent underline">
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
