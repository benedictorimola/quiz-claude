"use client";

import { useState } from "react";
import type { Nivel } from "@prisma/client";
import { NIVEL_LABELS } from "@/lib/quiz";

type ShareButtonProps = {
  nivel: Nivel;
  acertos: number;
  total: number;
};

export default function ShareButton({ nivel, acertos, total }: ShareButtonProps) {
  const [copiado, setCopiado] = useState(false);

  async function handleClick() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const texto = `Acertei ${acertos}/${total} no nível ${NIVEL_LABELS[nivel]} do Quiz Claude Code! ${siteUrl}`;

    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      window.prompt("Copie o resultado:", texto);
    }

    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border-b border-ink pb-1 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-mark hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark"
    >
      {copiado ? "Copiado" : "Compartilhar resultado"}
    </button>
  );
}
