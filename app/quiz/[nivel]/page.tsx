import { notFound } from "next/navigation";
import type { Nivel } from "@prisma/client";
import { NIVEIS } from "@/lib/quiz";
import QuizClient from "./QuizClient";

type Props = {
  params: Promise<{ nivel: string }>;
};

export default async function QuizPage({ params }: Props) {
  const { nivel } = await params;

  if (!NIVEIS.includes(nivel as Nivel)) {
    notFound();
  }

  return <QuizClient nivel={nivel as Nivel} />;
}
