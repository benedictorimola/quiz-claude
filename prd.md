# PRD — Quiz Web sobre Claude Code

## 1. Visão Geral

Aplicação web de quiz de perguntas **Verdadeiro ou Falso** sobre o **Claude Code**, com perguntas organizadas por nível de dificuldade (Iniciante, Intermediário, Avançado). Projeto de estudo pessoal / portfólio, construído com apoio do próprio Claude Code, servindo também como demonstração prática de uma aplicação full-stack simples (Next.js + Supabase + Vercel).

## 2. Objetivos de Negócio

- Consolidar o próprio aprendizado sobre Claude Code através da criação do banco de perguntas.
- Servir como peça de portfólio demonstrando uma aplicação full-stack completa (frontend, backend/API, banco de dados, deploy).
- Oferecer uma experiência lúdica e rápida (poucos minutos por sessão) que motive o usuário a rejogar e aprender mais sobre a ferramenta.

### Métricas de sucesso (MVP)
- Aplicação publicada e acessível via URL pública (Vercel).
- Usuário consegue completar os 3 níveis em uma sessão sem erros de fluxo.
- Banco de 60 perguntas (20 por nível) revisado e correto tecnicamente.

## 3. Público-alvo

- Usuário primário: o próprio autor do projeto (estudante da jornada Claude Code) e colegas de curso.
- Usuário secundário: qualquer desenvolvedor curioso sobre Claude Code que encontre o link do quiz.
- Não requer conhecimento prévio de programação para jogar — só familiaridade básica com web.

## 4. Escopo do MVP

1. **Quiz Verdadeiro/Falso** com 3 níveis sequenciais: Iniciante → Intermediário → Avançado.
2. **Banco de perguntas**: 60 perguntas no total, 20 por nível, cobrindo os tópicos:
   - Uso básico do CLI e comandos (instalação, comandos slash, fluxo de uso).
   - Configuração e settings (CLAUDE.md, settings.json, permissões, hooks, MCP).
   - Agent SDK e subagentes (conceitos de agentes, Task tool, orquestração).
   - Integrações e ecossistema (IDE extensions, GitHub Actions, API/Anthropic SDK, MCP de terceiros).
3. **Sessão de jogo**: a cada tentativa de um nível, sorteia um subconjunto aleatório de **10 das 20** perguntas daquele nível (evita repetição sempre igual, incentiva rejogar).
4. **Regra de progressão**: usuário só desbloqueia o próximo nível se acertar **≥ 70%** das perguntas do nível atual (7 de 10). Se não atingir, pode tentar o nível novamente (novo sorteio de perguntas).
5. **Feedback imediato**: ao responder cada pergunta, o app mostra se acertou/errou e uma breve explicação da resposta correta.
6. **Cronômetro**: contagem de tempo de 60 segundos por pergunta .
7. **Placar e histórico**: pontuação da sessão salva em `localStorage` do navegador, com espelhamento anônimo no Supabase (sem exigir login) para fins de histórico/estatísticas simples.
8. **Compartilhamento de resultado**: botão para copiar um texto/link com o resultado final (ex.: "Acertei 9/10 no nível Avançado do Quiz Claude Code!").
9. **Sem login**: identificação do jogador é anônima, via identificador de sessão (UUID) gerado no primeiro acesso e persistido em cookie/localStorage.
10. **Idioma**: interface e perguntas 100% em português (pt-BR).
11. **Responsivo mobile-first**: layout funcional e agradável tanto em celular quanto desktop.
12. **Tema visual**: dark mode estilo terminal — fundo escuro, fonte monoespaçada, acentos em tons de laranja/terracota (inspirado na identidade visual da Anthropic/Claude Code).

## 5. Fora de Escopo (MVP)

- Login/autenticação real de usuários (email, OAuth, senha).
- Ranking global/comparação entre jogadores.
- Painel administrativo web para CRUD de perguntas (a curadoria do banco inicial é feita via seed script/migration, não via UI).
- Suporte multi-idioma (apenas pt-BR nesta fase).
- Categorias/tópicos filtráveis pelo usuário (os tópicos existem como metadado da pergunta, mas não há tela de seleção de tópico no MVP).

## 6. Regras de Negócio / Lógica do Quiz

- **Estrutura de níveis**: `iniciante`, `intermediario`, `avancado`, jogados sempre nessa ordem.
- **Bloqueio de nível**: intermediário só é jogável após atingir ≥70% no iniciante na sessão atual; avançado só após ≥70% no intermediário. O estado de desbloqueio é por sessão anônima (persistido via `localStorage` + espelho no Supabase).
- **Sorteio de perguntas**: 10 perguntas aleatórias (sem repetição dentro da mesma tentativa) sorteadas do pool de 20 daquele nível.
- **Pontuação**: 1 ponto por resposta correta; percentual de acerto = acertos / 10.
- **Resultado da tentativa**: registrado como um "attempt" (nível, pontuação, percentual, data/hora, se desbloqueou o próximo nível).

## 7. Modelo de Conteúdo (Pergunta)

Cada pergunta possui:
- `id`
- `nivel` (`iniciante` | `intermediario` | `avancado`)
- `topico` (ex.: `cli`, `configuracao`, `agent_sdk`, `integracoes`)
- `enunciado` (texto da afirmação a ser julgada V/F)
- `resposta_correta` (boolean)
- `explicacao` (texto curto justificando a resposta correta, exibido no feedback imediato)

> Observação de conteúdo: o material das aulas do curso (ex.: "Aula 02 Claude Code") pode ser usado como fonte de referência para redigir e validar tecnicamente as perguntas.

## 8. Fluxo de Usuário (alto nível)

1. Usuário acessa o site → recebe/recupera `session_id` anônimo.
2. Tela inicial exibe os 3 níveis, com Iniciante disponível e os demais bloqueados (cadeado) até serem desbloqueados.
3. Usuário inicia o nível Iniciante → app sorteia 10 perguntas → responde uma a uma com feedback imediato e cronômetro.
4. Ao final do nível: tela de resultado (pontuação, % de acerto, tempo total) + botão de compartilhar + indicação se o próximo nível foi desbloqueado.
5. Fluxo se repete para Intermediário e Avançado.
6. Histórico de tentativas anteriores acessível na tela inicial (via dados salvos no Supabase/localStorage para aquele `session_id`).

## 9. Requisitos de UX/UI

- Tema escuro estilo terminal: paleta de fundo escuro (quase preto/cinza-chumbo), texto claro, destaques em laranja/terracota, fonte monoespaçada para blocos de "código"/pergunta.
- Componentes principais: tela inicial (seleção/estado dos níveis), tela de pergunta (enunciado + botões Verdadeiro/Falso + cronômetro), tela de feedback por pergunta, tela de resultado do nível.
- Mobile-first: botões grandes o suficiente para toque, layout em coluna única em telas pequenas.
- Estados visuais claros para: nível bloqueado, nível disponível, nível concluído (com % de acerto).

## 10. Arquitetura Técnica

- **Framework**: Next.js (App Router) + TypeScript.
- **Banco de dados**: Supabase (Postgres gerenciado).
- **ORM**: Prisma, conectado ao Postgres do Supabase via `DATABASE_URL`.
- **Hospedagem**: Vercel, com deploy automático a partir do repositório GitHub.
- **Controle de versão**: GitHub.
- **Persistência de sessão anônima**: UUID gerado no client, salvo em cookie/localStorage e enviado ao backend para associar tentativas (`attempts`) ao jogador sem exigir cadastro.

### 10.1 Modelo de Dados (Prisma – rascunho)

```prisma
model Question {
  id              String   @id @default(cuid())
  nivel           Nivel
  topico          Topico
  enunciado       String
  respostaCorreta Boolean
  explicacao      String
  createdAt       DateTime @default(now())
}

model Attempt {
  id            String   @id @default(cuid())
  sessionId     String
  nivel         Nivel
  acertos       Int
  totalPerguntas Int
  percentual    Float
  desbloqueouProximo Boolean
  duracaoSegundos Int?
  createdAt     DateTime @default(now())
}

enum Nivel {
  iniciante
  intermediario
  avancado
}

enum Topico {
  cli
  configuracao
  agent_sdk
  integracoes
}
```

### 10.2 Rotas de API (rascunho)

- `GET /api/questions?nivel=iniciante` → retorna 10 perguntas sorteadas daquele nível (sem expor `respostaCorreta` diretamente no payload inicial, ou expor apenas após resposta — a definir na implementação para evitar trapaça trivial via devtools, aceitável para um projeto pessoal).
- `POST /api/attempts` → registra o resultado de uma tentativa (`sessionId`, `nivel`, `acertos`, `totalPerguntas`, `duracaoSegundos`) e retorna se o próximo nível foi desbloqueado.
- `GET /api/attempts?sessionId=...` → retorna histórico de tentativas daquela sessão anônima (para exibir estado de progresso na tela inicial).

### 10.3 Seed de Dados

- Script de seed (`prisma/seed.ts`) popula as 60 perguntas iniciais (20 por nível) no banco Supabase — curadoria de conteúdo feita uma vez, versionada no repositório.

## 11. Requisitos Não Funcionais

- Aplicação deve carregar e responder rapidamente (poucas perguntas por vez, sem payloads pesados).
- Deploy simples via `git push` → Vercel build automático.
- Variáveis sensíveis (`DATABASE_URL`, chaves do Supabase) configuradas via variáveis de ambiente na Vercel, nunca commitadas no repositório.
- Código em TypeScript com tipagem de ponta a ponta (Prisma gera tipos usados no frontend/backend).

## 12. Variáveis de Ambiente Necessárias

```
DATABASE_URL=            # connection string do Supabase (Postgres)
NEXT_PUBLIC_SITE_URL=    # usada para montar links de compartilhamento
```

## 13. Critérios de Aceite (Definition of Done — MVP)

- [ ] Usuário consegue jogar o nível Iniciante do início ao fim, com sorteio de 10 perguntas, feedback imediato e cronômetro visível.
- [ ] Progressão bloqueia Intermediário/Avançado corretamente conforme regra de 70%.
- [ ] Resultado final de cada nível é salvo no Supabase e refletido em `localStorage`.
- [ ] Botão de compartilhamento gera texto/link com o resultado.
- [ ] Layout funcional e legível em viewport mobile (ex.: 375px) e desktop.
- [ ] Banco de 60 perguntas revisado tecnicamente (sem erros de conteúdo sobre Claude Code).
- [ ] Aplicação publicada em URL da Vercel, funcionando de ponta a ponta (frontend + Supabase).

## 14. Roadmap Futuro (Pós-MVP, fora do escopo atual)

- Login opcional para ranking persistente entre dispositivos.
- Ranking global de jogadores.
- Painel admin para gerenciar perguntas via UI.
- Suporte a outros idiomas (i18n).
- Novas categorias/tópicos e ampliação do banco de perguntas.
