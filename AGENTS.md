# Software name poll

## Stack and commands

Static HTML/CSS/JavaScript; Supabase Postgres and Data API; GitHub Pages from `main` root. No runtime dependencies or build.

- Local server: `python3 -m http.server 8000`
- Lint: `npm run lint`
- Tests: `npm test`
- Typecheck: not applicable (no TypeScript).
- Database validation: run `tests/database.sql` in Supabase SQL Editor.

## Conventions

Use one feature branch/PR at a time and squash merge after checks and owner review. Keep README, ARCHITECTURE and deployment notes current. Never add privileged keys or database passwords. Browser configuration contains only project URL and publishable key. Keep SQL and client name validation aligned. Do not weaken RLS to troubleshoot a failed submission.

## Decisions log (newest first)

- 2026-09-13 — Publish the owner-tested poll through protected `main` on GitHub Pages, backed by Supabase project `vujrrskdxtskmkldvnkj` — database and API permission tests pass — public visitors can submit valid votes but cannot read results; repeat voting is still possible. Owner approved squash merge of PR #1.

- 2026-09-13 — Keep the existing static page, use publishable-key REST calls and anonymous column-level INSERT plus RLS — minimal dependencies and private results — repeat votes remain possible; see `docs/001-static-poll.md`.
