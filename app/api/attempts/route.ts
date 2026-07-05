import { NextRequest, NextResponse } from "next/server";
import type { Nivel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NIVEIS, calcularPercentual, desbloqueouProximoNivel } from "@/lib/quiz";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { sessionId, nivel, acertos, totalPerguntas, duracaoSegundos } =
    body ?? {};

  const payloadValido =
    typeof sessionId === "string" &&
    sessionId.length > 0 &&
    typeof nivel === "string" &&
    NIVEIS.includes(nivel as Nivel) &&
    Number.isInteger(acertos) &&
    acertos >= 0 &&
    Number.isInteger(totalPerguntas) &&
    totalPerguntas > 0 &&
    acertos <= totalPerguntas;

  if (!payloadValido) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const percentual = calcularPercentual(acertos, totalPerguntas);
  const desbloqueouProximo = desbloqueouProximoNivel(percentual);

  const attempt = await prisma.attempt.create({
    data: {
      sessionId,
      nivel: nivel as Nivel,
      acertos,
      totalPerguntas,
      percentual,
      desbloqueouProximo,
      duracaoSegundos:
        typeof duracaoSegundos === "number"
          ? Math.round(duracaoSegundos)
          : null,
    },
  });

  return NextResponse.json({ attempt, desbloqueouProximo });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Parâmetro 'sessionId' é obrigatório." },
      { status: 400 },
    );
  }

  const attempts = await prisma.attempt.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(attempts);
}
