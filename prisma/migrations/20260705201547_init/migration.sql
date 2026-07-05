-- CreateEnum
CREATE TYPE "Nivel" AS ENUM ('iniciante', 'intermediario', 'avancado');

-- CreateEnum
CREATE TYPE "Topico" AS ENUM ('cli', 'configuracao', 'agent_sdk', 'integracoes');

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "topico" "Topico" NOT NULL,
    "enunciado" TEXT NOT NULL,
    "respostaCorreta" BOOLEAN NOT NULL,
    "explicacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "nivel" "Nivel" NOT NULL,
    "acertos" INTEGER NOT NULL,
    "totalPerguntas" INTEGER NOT NULL,
    "percentual" DOUBLE PRECISION NOT NULL,
    "desbloqueouProximo" BOOLEAN NOT NULL,
    "duracaoSegundos" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Question_nivel_idx" ON "Question"("nivel");

-- CreateIndex
CREATE INDEX "Attempt_sessionId_nivel_idx" ON "Attempt"("sessionId", "nivel");

-- CreateIndex
CREATE INDEX "Attempt_sessionId_createdAt_idx" ON "Attempt"("sessionId", "createdAt");
