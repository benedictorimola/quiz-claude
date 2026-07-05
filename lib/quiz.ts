import type { Attempt, Nivel, Question } from "@prisma/client";

export const NIVEIS: Nivel[] = ["iniciante", "intermediario", "avancado"];

export const NIVEL_LABELS: Record<Nivel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const PROXIMO_NIVEL: Record<Nivel, Nivel | null> = {
  iniciante: "intermediario",
  intermediario: "avancado",
  avancado: null,
};

const NIVEL_ANTERIOR: Record<Nivel, Nivel | null> = {
  iniciante: null,
  intermediario: "iniciante",
  avancado: "intermediario",
};

export function nivelAnterior(nivel: Nivel): Nivel | null {
  return NIVEL_ANTERIOR[nivel];
}

export const QUESTOES_POR_TENTATIVA = 10;
export const PERCENTUAL_APROVACAO = 0.7;

export function embaralhar<T>(itens: T[]): T[] {
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

export function sortearPerguntas(
  perguntas: Question[],
  quantidade = QUESTOES_POR_TENTATIVA,
): Question[] {
  return embaralhar(perguntas).slice(0, quantidade);
}

export function calcularPercentual(acertos: number, total: number): number {
  if (total <= 0) return 0;
  return acertos / total;
}

export function desbloqueouProximoNivel(percentual: number): boolean {
  return percentual >= PERCENTUAL_APROVACAO;
}

export function computeUnlockedLevels(
  attempts: Pick<Attempt, "nivel" | "percentual">[],
): Set<Nivel> {
  const unlocked = new Set<Nivel>(["iniciante"]);
  for (const nivel of NIVEIS) {
    const proximo = PROXIMO_NIVEL[nivel];
    if (!proximo) continue;
    const passou = attempts.some(
      (a) => a.nivel === nivel && a.percentual >= PERCENTUAL_APROVACAO,
    );
    if (passou) unlocked.add(proximo);
  }
  return unlocked;
}
