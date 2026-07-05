import type { Nivel, Topico } from "@prisma/client";

export type SeedQuestion = {
  nivel: Nivel;
  topico: Topico;
  enunciado: string;
  respostaCorreta: boolean;
  explicacao: string;
};

/**
 * Subconjunto inicial (~12 perguntas) usado para destravar as Fases 1-4.
 * O banco completo de 60 perguntas (20 por nível) é uma tarefa de curadoria
 * de conteúdo separada que substitui este arquivo antes do deploy final.
 */
export const questions: SeedQuestion[] = [
  {
    nivel: "iniciante",
    topico: "cli",
    enunciado:
      "O Claude Code é uma ferramenta de linha de comando (CLI) da Anthropic, pensada para ajudar em tarefas de engenharia de software diretamente no terminal.",
    respostaCorreta: true,
    explicacao:
      "O Claude Code é oferecido como uma CLI oficial da Anthropic, integrada ao terminal para tarefas de desenvolvimento.",
  },
  {
    nivel: "iniciante",
    topico: "cli",
    enunciado:
      "No Claude Code, comandos como /help e /clear são digitados sem a barra inicial, apenas como 'help' e 'clear'.",
    respostaCorreta: false,
    explicacao:
      "Os comandos especiais do Claude Code são chamados de 'slash commands' e exigem a barra inicial (ex.: /help, /clear).",
  },
  {
    nivel: "iniciante",
    topico: "configuracao",
    enunciado:
      "O arquivo CLAUDE.md serve para fornecer contexto e instruções persistentes sobre o projeto para o Claude Code.",
    respostaCorreta: true,
    explicacao:
      "O CLAUDE.md é lido pelo Claude Code para entender convenções, comandos e arquitetura do projeto em cada sessão.",
  },
  {
    nivel: "iniciante",
    topico: "integracoes",
    enunciado:
      "O Claude Code possui extensões/integrações oficiais para editores como VS Code e JetBrains.",
    respostaCorreta: true,
    explicacao:
      "Existem integrações oficiais de IDE (VS Code e JetBrains, entre outras) que permitem usar o Claude Code dentro do editor.",
  },
  {
    nivel: "intermediario",
    topico: "configuracao",
    enunciado:
      "O arquivo settings.json do Claude Code pode ser usado para configurar permissões de ferramentas, como permitir ou negar comandos automaticamente.",
    respostaCorreta: true,
    explicacao:
      "O settings.json permite definir regras de permissão para ferramentas e comandos, evitando confirmações manuais repetidas.",
  },
  {
    nivel: "intermediario",
    topico: "configuracao",
    enunciado:
      "Hooks no Claude Code são scripts que só podem ser executados manualmente pelo usuário, nunca de forma automática em resposta a eventos.",
    respostaCorreta: false,
    explicacao:
      "Hooks são disparados automaticamente em resposta a eventos do Claude Code (ex.: antes/depois do uso de uma ferramenta), não apenas manualmente.",
  },
  {
    nivel: "intermediario",
    topico: "agent_sdk",
    enunciado:
      "O Claude Code oferece suporte a subagentes, que podem ser invocados para realizar tarefas específicas de forma isolada do contexto principal.",
    respostaCorreta: true,
    explicacao:
      "Subagentes (via Task tool) rodam com seu próprio contexto, permitindo delegar tarefas específicas sem poluir a conversa principal.",
  },
  {
    nivel: "intermediario",
    topico: "integracoes",
    enunciado:
      "O Claude Code pode ser integrado a fluxos de CI/CD através do GitHub Actions.",
    respostaCorreta: true,
    explicacao:
      "Há uma GitHub Action oficial que permite rodar o Claude Code em pipelines de CI/CD, como em pull requests.",
  },
  {
    nivel: "avancado",
    topico: "agent_sdk",
    enunciado:
      "O Claude Agent SDK permite que desenvolvedores construam seus próprios agentes personalizados utilizando os mesmos princípios usados internamente pelo Claude Code.",
    respostaCorreta: true,
    explicacao:
      "O Agent SDK expõe a infraestrutura usada pelo próprio Claude Code para quem quiser construir agentes customizados.",
  },
  {
    nivel: "avancado",
    topico: "integracoes",
    enunciado:
      "O MCP (Model Context Protocol) é um protocolo que permite conectar o Claude Code a ferramentas e fontes de dados externas, incluindo servidores de terceiros.",
    respostaCorreta: true,
    explicacao:
      "O MCP padroniza a conexão entre modelos de IA e fontes de dados/ferramentas externas, incluindo servidores mantidos por terceiros.",
  },
  {
    nivel: "avancado",
    topico: "configuracao",
    enunciado:
      "As permissões de ferramentas no Claude Code não podem ser configuradas por projeto, apenas globalmente para todos os projetos do usuário.",
    respostaCorreta: false,
    explicacao:
      "É possível configurar permissões por projeto (ex.: em .claude/settings.json dentro do repositório), além de configurações globais do usuário.",
  },
  {
    nivel: "avancado",
    topico: "cli",
    enunciado:
      "O Claude Code não é capaz de executar múltiplas chamadas de ferramentas em paralelo em uma mesma resposta.",
    respostaCorreta: false,
    explicacao:
      "O Claude Code pode disparar múltiplas chamadas de ferramentas independentes em paralelo dentro de uma mesma resposta, quando não há dependência entre elas.",
  },
];
