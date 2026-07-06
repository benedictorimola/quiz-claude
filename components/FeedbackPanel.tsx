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
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="font-serif text-4xl leading-none text-mark sm:text-5xl"
        >
          {acertou ? "✓" : "✕"}
        </span>
        <div className="flex flex-col gap-3 pt-1">
          <p className="font-serif text-2xl italic text-ink sm:text-3xl">
            {acertou ? "Correto." : "Incorreto."}
          </p>
          <p className="max-w-prose font-serif text-lg leading-relaxed text-ink">
            {explicacao}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onContinuar}
        className="group flex items-center justify-between border-t border-line py-5 text-left font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark"
      >
        <span>{ultimaPergunta ? "Ver resultado" : "Continuar"}</span>
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
        >
          →
        </span>
      </button>
    </div>
  );
}
