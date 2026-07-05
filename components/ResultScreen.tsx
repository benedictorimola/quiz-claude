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
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">
        Resultado — {NIVEL_LABELS[nivel]}
      </h2>
      <p className="text-lg">
        {acertos}/{total} ({percentual}%)
      </p>
      {duracaoSegundos !== null && (
        <p className="text-text-dim">Tempo: {duracaoSegundos}s</p>
      )}
      {enviando ? (
        <p className="text-text-dim">Salvando resultado…</p>
      ) : (
        <p className={desbloqueouProximo ? "text-success" : "text-error"}>
          {desbloqueouProximo
            ? "Próximo nível desbloqueado!"
            : "Você precisa de pelo menos 70% para desbloquear o próximo nível."}
        </p>
      )}
      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
        <ShareButton nivel={nivel} acertos={acertos} total={total} />
        <Link href="/" className="text-accent underline">
          Voltar para o início
        </Link>
      </div>
    </main>
  );
}
