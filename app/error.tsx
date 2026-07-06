"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 pb-12 pt-14 sm:px-10 md:pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-dim">
          Erro
        </p>
        <h1 className="max-w-[16ch] font-serif text-[clamp(1.9rem,5vw,3.25rem)] font-medium leading-[1.1] text-ink">
          Algo deu errado.
        </h1>
        <p className="max-w-prose font-serif text-lg leading-relaxed text-ink">
          {error.message || "Erro inesperado."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="group flex w-fit items-center gap-2 border-b border-ink pb-1 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-mark hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark"
        >
          Tentar novamente
        </button>
      </main>
    </div>
  );
}
