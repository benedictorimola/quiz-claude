import { NextRequest, NextResponse } from "next/server";
import type { Nivel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NIVEIS, sortearPerguntas } from "@/lib/quiz";

export async function GET(request: NextRequest) {
  const nivel = request.nextUrl.searchParams.get("nivel");

  if (!nivel || !NIVEIS.includes(nivel as Nivel)) {
    return NextResponse.json(
      { error: "Parâmetro 'nivel' inválido ou ausente." },
      { status: 400 },
    );
  }

  const perguntas = await prisma.question.findMany({
    where: { nivel: nivel as Nivel },
  });

  return NextResponse.json(sortearPerguntas(perguntas));
}
