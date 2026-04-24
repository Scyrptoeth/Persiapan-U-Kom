# Project Instructions for Persiapan U-Kom

## Communication

- Communicate with the user in Bahasa Indonesia.
- Code, identifiers, comments, and commit messages use English unless project context requires Indonesian content.
- Ask clarification questions one at a time. For each question, provide options, mark one option as `Recommended`, explain the reason briefly, and allow a manual answer.
- Do not claim work is complete without relevant verification evidence.

## Product Guardrails

- Persiapan U-Kom is a personal/internal learning website for Ujian Kompetensi DJP.
- MVP pilot focuses on PPN.
- Flipcard and Tes must use the same question bank.
- Packages are generated automatically by category/source order with a maximum of 20 questions per package.
- Never randomize question order or option order.
- Store MVP progress in browser `localStorage`.
- Use only user-provided source references for learning content. Do not use internet search to create questions unless the user explicitly changes this rule.
- Preserve source metadata per question.

## Engineering

- Use Next.js App Router and TypeScript.
- Default to Server Components; use client components only for state, browser APIs, and event handlers.
- Keep UI accessible: semantic HTML, focus states, keyboard-reachable controls, readable contrast, and mobile-friendly tap targets.
- Do not commit, push, deploy, reset, or change remotes unless the user explicitly requests it.
- Never put tokens, passwords, PATs, or credentials in files, remote URLs, shell history, logs, or final responses.

## Verification

- Run `npm run typecheck` and `npm run build 2>&1 | tail -25` before claiming code completion.
- For visual changes, run the app locally and inspect the rendered UI when feasible.
