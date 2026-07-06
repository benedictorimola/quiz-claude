import Link from "next/link";
import type { Nivel } from "@prisma/client";
import ShareButton from "@/components/ShareButton";
import { NIVEL_LABELS, PERCENTUAL_APROVACAO } from "@/lib/quiz";

type ResultScreenProps = {
  nivel: Nivel;
  acertos: number;
  total: number;
  desbloqueouProximo: boolean;
  enviando: boolean;
  duracaoSegundos: number | null;
  erroEnvio?: string | null;
  onRetryEnvio?: () => void;
  desempenho?: boolean[];
};

function formatarDuracao(segundos: number): string {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return min > 0 ? `${min}min${String(seg).padStart(2, "0")}` : `${seg}s`;
}

function construirNarrativa(
  nivelLabel: string,
  percentual: number,
  aprovou: boolean,
  ultimoNivel: boolean,
) {
  const pct = Math.round(percentual * 100);

  if (aprovou) {
    const headline =
      percentual >= 0.9
        ? "Você não decorou — você entende."
        : "Você lê o manual antes do primeiro comando.";
    const corpo = ultimoNivel
      ? `${pct}% de acerto no nível ${nivelLabel}. Você concluiu os três níveis do quiz.`
      : `${pct}% de acerto no nível ${nivelLabel} — acima dos 70% necessários. O próximo nível já está liberado.`;
    return { headline, corpo };
  }

  const headline =
    percentual >= 0.4
      ? "Você já usou o Claude Code. Falta ler os detalhes."
      : "Hora de abrir a documentação de novo.";
  const corpo = `${pct}% de acerto no nível ${nivelLabel}. É preciso pelo menos ${Math.round(
    PERCENTUAL_APROVACAO * 100,
  )}% para liberar o próximo — vale revisar e tentar de novo.`;
  return { headline, corpo };
}

export default function ResultScreen({
  nivel,
  acertos,
  total,
  desbloqueouProximo,
  enviando,
  duracaoSegundos,
  erroEnvio,
  onRetryEnvio,
  desempenho,
}: ResultScreenProps) {
  const percentual = acertos / total;
  const nivelLabel = NIVEL_LABELS[nivel];
  const { headline, corpo } = construirNarrativa(
    nivelLabel,
    percentual,
    desbloqueouProximo,
    nivel === "avancado",
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="max-w-[20ch] font-serif text-[clamp(1.9rem,5vw,3.25rem)] font-medium leading-[1.1] text-ink">
          {headline}
        </h1>
        <p className="font-mono text-xs tracking-[0.14em] text-ink-dim">
          {acertos}/{total} · {Math.round(percentual * 100)}%
          {duracaoSegundos !== null && ` · ${formatarDuracao(duracaoSegundos)}`}
        </p>
      </div>

      <p className="max-w-prose font-serif text-lg leading-relaxed text-ink">
        {corpo}
      </p>

      {desempenho && desempenho.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          aria-label={`Detalhe por pergunta: ${desempenho.filter(Boolean).length} de ${desempenho.length} corretas`}
        >
          {desempenho.map((certo, i) => (
            <span
              key={i}
              aria-hidden
              className={`font-serif text-lg ${certo ? "text-mark" : "text-ink-dim"}`}
            >
              {certo ? "✓" : "✕"}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-line pt-6">
        {enviando ? (
          <p className="font-mono text-xs tracking-[0.14em] text-ink-dim">
            Salvando resultado…
          </p>
        ) : (
          erroEnvio && (
            <div className="flex flex-col items-start gap-3">
              <p className="font-mono text-xs tracking-[0.14em] text-mark">
                {erroEnvio}
              </p>
              {onRetryEnvio && (
                <button
                  type="button"
                  onClick={onRetryEnvio}
                  className="border-b border-ink pb-1 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-mark hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          )
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <ShareButton nivel={nivel} acertos={acertos} total={total} />
        <Link
          href="/"
          className="border-b border-ink pb-1 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-mark hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
