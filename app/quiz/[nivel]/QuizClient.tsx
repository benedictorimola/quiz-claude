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

type Fase = "carregando" | "respondendo" | "feedback" | "resultado" | "erro";

export default function QuizClient({ nivel }: { nivel: Nivel }) {
  const router = useRouter();
  const sessionId = useSessionId();

  const [fase, setFase] = useState<Fase>("carregando");
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
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
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [duracaoFinal, setDuracaoFinal] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelado = false;

    async function iniciar() {
      try {
        if (nivel !== "iniciante") {
          const res = await fetch(`/api/attempts?sessionId=${sessionId}`);
          if (!res.ok) throw new Error("Falha ao verificar níveis desbloqueados.");
          const attempts: Attempt[] = await res.json();
          const unlocked = computeUnlockedLevels(attempts);
          if (!unlocked.has(nivel)) {
            router.replace("/");
            return;
          }
        }

        const res = await fetch(`/api/questions?nivel=${nivel}`);
        if (!res.ok) throw new Error("Falha ao carregar perguntas.");
        const data: Question[] = await res.json();
        if (cancelado) return;

        setPerguntas(data);
        setInicio(Date.now());
        setFase("respondendo");
      } catch (err) {
        if (cancelado) return;
        setErro(err instanceof Error ? err.message : "Erro desconhecido.");
        setFase("erro");
      }
    }

    iniciar();

    return () => {
      cancelado = true;
    };
  }, [sessionId, nivel, router, tentativa]);

  function tentarNovamente() {
    setErro(null);
    setFase("carregando");
    setTentativa((t) => t + 1);
  }

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
    setErroEnvio(null);

    const duracaoSegundos = inicio
      ? Math.round((Date.now() - inicio) / 1000)
      : undefined;
    setDuracaoFinal(duracaoSegundos ?? null);

    try {
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
      if (!res.ok) throw new Error("Falha ao salvar o resultado.");
      const data = await res.json();
      setDesbloqueouProximo(data.desbloqueouProximo);
    } catch (err) {
      setErroEnvio(
        err instanceof Error ? err.message : "Erro ao salvar resultado.",
      );
    } finally {
      setEnviandoResultado(false);
    }
  }

  if (fase === "carregando") {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-text-dim">Carregando…</p>
      </main>
    );
  }

  if (fase === "erro") {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-full max-w-lg rounded-md border border-surface-2 bg-surface p-6">
          <p className="text-lg font-semibold text-error">[ERRO] {erro}</p>
          <button
            type="button"
            onClick={tentarNovamente}
            className="mt-6 w-full rounded-md bg-accent py-3 font-semibold text-bg transition-colors hover:bg-accent-muted"
          >
            Tentar novamente
          </button>
        </div>
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
        erroEnvio={erroEnvio}
        onRetryEnvio={handleContinuar}
      />
    );
  }

  if (!perguntaAtual) {
    return null;
  }

  const passos = perguntas
    .map((_, i) =>
      i < indice || (i === indice && fase === "feedback") ? "■" : "□",
    )
    .join(" ");

  return (
    <main className="flex flex-1 flex-col items-center gap-6 p-6">
      <p className="text-text-dim">
        Pergunta {indice + 1} de {perguntas.length}{" "}
        <span className="text-accent" aria-hidden>
          [{passos}]
        </span>
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
