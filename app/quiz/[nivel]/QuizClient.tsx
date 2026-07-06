"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Attempt, Nivel, Question } from "@prisma/client";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import FeedbackPanel from "@/components/FeedbackPanel";
import ResultScreen from "@/components/ResultScreen";
import { useSessionId } from "@/lib/session";
import { NIVEL_LABELS, computeUnlockedLevels } from "@/lib/quiz";

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

  const total = perguntas.length;
  const progressPct =
    fase === "resultado"
      ? 100
      : total === 0
        ? 0
        : ((indice + (fase === "feedback" ? 1 : 0)) / total) * 100;

  const desempenho = perguntas.map(
    (p, i) => respostas[i]?.resposta === p.respostaCorreta,
  );

  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <div className="fixed inset-x-0 top-0 z-10 h-[3px] bg-line">
        <div
          className="h-full bg-mark transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <main className="mx-auto grid max-w-5xl grid-cols-1 content-start gap-8 px-6 pb-12 pt-14 sm:px-10 md:grid-cols-[200px_1fr] md:gap-16 md:pt-20">
        <aside className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-ink-dim md:flex-col md:items-start md:gap-3">
          <span>Nível {NIVEL_LABELS[nivel]}</span>
          {fase === "resultado" ? (
            <span>Resultado</span>
          ) : (
            total > 0 && (
              <span>
                {String(indice + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
            )
          )}
          {fase === "respondendo" && perguntaAtual && (
            <Timer
              key={perguntaAtual.id}
              seconds={TEMPO_POR_PERGUNTA}
              onExpire={() => registrarResposta(null)}
            />
          )}
        </aside>

        <div
          key={`${fase}-${perguntaAtual?.id ?? "fim"}`}
          className="q-enter flex flex-col gap-8 md:gap-10"
        >
          {fase === "carregando" && (
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-dim">
              Carregando…
            </p>
          )}

          {fase === "erro" && (
            <div className="flex flex-col gap-6">
              <p className="max-w-prose font-serif text-xl text-ink">
                {erro}
              </p>
              <button
                type="button"
                onClick={tentarNovamente}
                className="group flex w-fit items-center gap-2 border-b border-ink pb-1 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:border-mark hover:text-mark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mark"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {fase === "respondendo" && perguntaAtual && (
            <>
              <h1 className="max-w-[18ch] font-serif text-[clamp(1.9rem,5vw,3.25rem)] font-medium leading-[1.1] text-ink">
                {perguntaAtual.enunciado}
              </h1>
              <QuestionCard onAnswer={registrarResposta} />
            </>
          )}

          {fase === "feedback" && ultimaResposta && perguntaAtual && (
            <FeedbackPanel
              acertou={ultimaResposta.acertou}
              explicacao={perguntaAtual.explicacao}
              onContinuar={handleContinuar}
              ultimaPergunta={indice === total - 1}
            />
          )}

          {fase === "resultado" && (
            <ResultScreen
              nivel={nivel}
              acertos={acertos}
              total={total}
              desbloqueouProximo={desbloqueouProximo}
              enviando={enviandoResultado}
              duracaoSegundos={duracaoFinal}
              erroEnvio={erroEnvio}
              onRetryEnvio={handleContinuar}
              desempenho={desempenho}
            />
          )}
        </div>
      </main>
    </div>
  );
}
