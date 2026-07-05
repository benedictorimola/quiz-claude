"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Attempt, Nivel, Question } from "@prisma/client";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import FeedbackPanel from "@/components/FeedbackPanel";
import ResultScreen from "@/components/ResultScreen";
import { useSessionId } from "@/lib/session";
import { computeUnlockedLevels } from "@/lib/quiz";

const TEMPO_POR_PERGUNTA = 60;

type Fase = "carregando" | "respondendo" | "feedback" | "resultado";

export default function QuizClient({ nivel }: { nivel: Nivel }) {
  const router = useRouter();
  const sessionId = useSessionId();

  const [fase, setFase] = useState<Fase>("carregando");
  const [perguntas, setPerguntas] = useState<Question[]>([]);
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respostas, setRespostas] = useState<
    { questionId: string; resposta: boolean | null }[]
  >([]);
  const [ultimaResposta, setUltimaResposta] = useState<{
    acertou: boolean;
  } | null>(null);
  const [inicio, setInicio] = useState<number | null>(null);
  const [desbloqueouProximo, setDesbloqueouProximo] = useState(false);
  const [enviandoResultado, setEnviandoResultado] = useState(false);
  const [duracaoFinal, setDuracaoFinal] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelado = false;

    async function iniciar() {
      if (nivel !== "iniciante") {
        const res = await fetch(`/api/attempts?sessionId=${sessionId}`);
        const attempts: Attempt[] = await res.json();
        const unlocked = computeUnlockedLevels(attempts);
        if (!unlocked.has(nivel)) {
          router.replace("/");
          return;
        }
      }

      const res = await fetch(`/api/questions?nivel=${nivel}`);
      const data: Question[] = await res.json();
      if (cancelado) return;

      setPerguntas(data);
      setInicio(Date.now());
      setFase("respondendo");
    }

    iniciar();

    return () => {
      cancelado = true;
    };
  }, [sessionId, nivel, router]);

  const perguntaAtual = perguntas[indice];

  function registrarResposta(resposta: boolean | null) {
    const acertou =
      resposta !== null && resposta === perguntaAtual.respostaCorreta;
    if (acertou) setAcertos((a) => a + 1);
    setRespostas((r) => [...r, { questionId: perguntaAtual.id, resposta }]);
    setUltimaResposta({ acertou });
    setFase("feedback");
  }

  async function handleContinuar() {
    const ultima = indice === perguntas.length - 1;

    if (!ultima) {
      setIndice((i) => i + 1);
      setFase("respondendo");
      return;
    }

    setFase("resultado");
    setEnviandoResultado(true);

    const duracaoSegundos = inicio
      ? Math.round((Date.now() - inicio) / 1000)
      : undefined;
    setDuracaoFinal(duracaoSegundos ?? null);

    const res = await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        nivel,
        respostas,
        duracaoSegundos,
      }),
    });
    const data = await res.json();
    setDesbloqueouProximo(data.desbloqueouProximo);
    setEnviandoResultado(false);
  }

  if (fase === "carregando") {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-text-dim">Carregando…</p>
      </main>
    );
  }

  if (fase === "resultado") {
    return (
      <ResultScreen
        nivel={nivel}
        acertos={acertos}
        total={perguntas.length}
        desbloqueouProximo={desbloqueouProximo}
        enviando={enviandoResultado}
        duracaoSegundos={duracaoFinal}
      />
    );
  }

  if (!perguntaAtual) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-6">
      <p className="text-text-dim">
        Pergunta {indice + 1} de {perguntas.length}
      </p>
      {fase === "respondendo" && (
        <>
          <Timer
            key={perguntaAtual.id}
            seconds={TEMPO_POR_PERGUNTA}
            onExpire={() => registrarResposta(null)}
          />
          <QuestionCard
            question={perguntaAtual}
            onAnswer={(resposta) => registrarResposta(resposta)}
          />
        </>
      )}
      {fase === "feedback" && ultimaResposta && (
        <FeedbackPanel
          acertou={ultimaResposta.acertou}
          explicacao={perguntaAtual.explicacao}
          onContinuar={handleContinuar}
          ultimaPergunta={indice === perguntas.length - 1}
        />
      )}
    </main>
  );
}
