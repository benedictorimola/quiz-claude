# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains only `prd.md` (the product spec, in Portuguese) and `README.md`. No application code, `package.json`, or scaffolding exists yet — this is a greenfield project. When implementing features, you'll likely need to bootstrap the Next.js project structure first (there is no existing convention to follow yet).

Read `prd.md` in full before starting implementation work; it is the source of truth for scope, data model, and business rules. The summary below only covers what's needed to orient quickly — the PRD has the full detail (validation rules, UX states, acceptance criteria).

## What this project is

A Portuguese-language (pt-BR) True/False quiz web app about Claude Code, used as a personal-study/portfolio project. Players answer questions across three sequential difficulty levels, unlocked by score.

## Planned architecture (per PRD section 10)

- **Framework**: Next.js (App Router) + TypeScript
- **Database**: Supabase (managed Postgres)
- **ORM**: Prisma, connected via `DATABASE_URL`
- **Hosting**: Vercel, auto-deploy from GitHub
- **Anonymous session**: client-generated UUID stored in cookie/localStorage, sent to the backend to associate `Attempt` records without requiring login/auth

### Data model (draft, PRD 10.1)

Two Prisma models: `Question` (id, `nivel` enum, `topico` enum, `enunciado`, `respostaCorreta`, `explicacao`) and `Attempt` (sessionId, nivel, acertos, totalPerguntas, percentual, desbloqueouProximo, duracaoSegundos). Enums: `Nivel` (`iniciante` | `intermediario` | `avancado`), `Topico` (`cli` | `configuracao` | `agent_sdk` | `integracoes`).

### API routes (draft, PRD 10.2)

- `GET /api/questions?nivel=` — returns 10 randomly-sampled questions from that level's pool of 20; avoid leaking `respostaCorreta` before the user answers (trivial devtools cheating is accepted as a known limitation for this personal project).
- `POST /api/attempts` — records an attempt result, returns whether the next level was unlocked.
- `GET /api/attempts?sessionId=` — returns attempt history for a session.

### Content seeding

60 questions total (20 per level) are seeded once via `prisma/seed.ts`, versioned in the repo — there is no admin UI for question CRUD in the MVP.

## Core business rules (PRD section 6)

- Levels are always played in order: `iniciante` → `intermediario` → `avancado`.
- A level unlocks the next only after scoring ≥70% (7/10) in the current session; the unlock state is per anonymous session (localStorage + Supabase mirror).
- Each attempt draws 10 questions at random (no repeats within the attempt) from that level's 20-question pool — re-attempts get a fresh draw.
- Score = correct answers / 10.

## UX constraints worth preserving in implementation

- Dark, terminal-style theme: near-black background, monospace font, orange/terracotta accents (Anthropic/Claude Code inspired).
- Mobile-first, single-column layout, large tap targets.
- 60-second per-question timer.
- Immediate per-question feedback (correct/incorrect + short explanation).
- Share button producing copyable result text (e.g., "Acertei 9/10 no nível Avançado do Quiz Claude Code!").
- No login of any kind — out of scope for MVP, along with global ranking and an admin panel.

## Environment variables (PRD section 12)

```
DATABASE_URL=            # Supabase Postgres connection string
NEXT_PUBLIC_SITE_URL=    # used to build share links
```

Never commit real values for these; they're configured via Vercel env vars.
