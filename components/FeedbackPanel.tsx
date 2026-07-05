"use client";

type FeedbackPanelProps = {
  acertou: boolean;
  explicacao: string;
  onContinuar: () => void;
  ultimaPergunta: boolean;
};

export default function FeedbackPanel({
  acertou,
  explicacao,
  onContinuar,
  ultimaPergunta,
}: FeedbackPanelProps) {
  return (
    <div className="w-full max-w-lg rounded-md border border-surface-2 bg-surface p-6">
      <p
        className={`text-lg font-semibold ${acertou ? "text-success" : "text-error"}`}
      >
        [{acertou ? "OK" : "ERRO"}] {acertou ? "Você acertou!" : "Você errou."}
      </p>
      <p className="mt-2 text-text-dim"># {explicacao}</p>
      <button
        type="button"
        onClick={onContinuar}
        className="mt-6 w-full rounded-md bg-accent py-3 font-semibold text-bg transition-colors hover:bg-accent-muted"
      >
        {ultimaPergunta ? "Ver resultado" : "Continuar"}
      </button>
    </div>
  );
}
