import { NextRequest, NextResponse } from "next/server";
import type { Nivel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  NIVEIS,
  PERCENTUAL_APROVACAO,
  QUESTOES_POR_TENTATIVA,
  calcularPercentual,
  desbloqueouProximoNivel,
  nivelAnterior,
} from "@/lib/quiz";

type RespostaPayload = { questionId: string; resposta: boolean | null };

function ehRespostaPayload(valor: unknown): valor is RespostaPayload {
  return (
    typeof valor === "object" &&
    valor !== null &&
    typeof (valor as RespostaPayload).questionId === "string" &&
    (typeof (valor as RespostaPayload).resposta === "boolean" ||
      (valor as RespostaPayload).resposta === null)
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { sessionId, nivel, respostas, duracaoSegundos } = body ?? {};

  const payloadValido =
    typeof sessionId === "string" &&
    sessionId.length > 0 &&
    typeof nivel === "string" &&
    NIVEIS.includes(nivel as Nivel) &&
    Array.isArray(respostas) &&
    respostas.length > 0 &&
    respostas.every(ehRespostaPayload);

  if (!payloadValido) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const idsUnicos = new Set(
    (respostas as RespostaPayload[]).map((r) => r.questionId),
  );
  if (idsUnicos.size !== respostas.length) {
    return NextResponse.json(
      { error: "Perguntas repetidas na mesma tentativa." },
      { status: 400 },
    );
  }

  // O nível anterior precisa ter sido aprovado antes de aceitar uma tentativa
  // deste nível — evita pular direto para um nível ainda bloqueado via API.
  const anterior = nivelAnterior(nivel as Nivel);
  if (anterior) {
    const aprovouAnterior = await prisma.attempt.findFirst({
      where: {
        sessionId,
        nivel: anterior,
        percentual: { gte: PERCENTUAL_APROVACAO },
      },
    });
    if (!aprovouAnterior) {
      return NextResponse.json(
        { error: "Nível anterior ainda não foi aprovado." },
        { status: 403 },
      );
    }
  }

  const totalDisponivel = await prisma.question.count({
    where: { nivel: nivel as Nivel },
  });
  const esperado = Math.min(totalDisponivel, QUESTOES_POR_TENTATIVA);
  if (respostas.length !== esperado) {
    return NextResponse.json(
      { error: "Quantidade de respostas não corresponde à tentativa." },
      { status: 400 },
    );
  }

  const perguntas = await prisma.question.findMany({
    where: { id: { in: Array.from(idsUnicos) } },
  });

  const todasDoNivel =
    perguntas.length === idsUnicos.size &&
    perguntas.every((q) => q.nivel === nivel);
  if (!todasDoNivel) {
    return NextResponse.json(
      { error: "Perguntas inválidas para este nível." },
      { status: 400 },
    );
  }

  const respostaCorretaPorId = new Map(
    perguntas.map((q) => [q.id, q.respostaCorreta]),
  );
  const acertos = (respostas as RespostaPayload[]).filter(
    (r) => respostaCorretaPorId.get(r.questionId) === r.resposta,
  ).length;
  const totalPerguntas = respostas.length;

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
