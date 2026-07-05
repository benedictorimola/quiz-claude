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
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-full max-w-lg rounded-md border border-surface-2 bg-surface p-6">
        <p className="text-lg font-semibold text-error">
          [ERRO] Algo deu errado.
        </p>
        <p className="mt-2 text-text-dim">
          # {error.message || "Erro inesperado."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 w-full rounded-md bg-accent py-3 font-semibold text-bg transition-colors hover:bg-accent-muted"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
