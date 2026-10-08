---
name: new-case-study
description: Add a new cybersecurity case study to the portfolio (a scroll-driven, 3D editorial page at /case-study/<slug>), following the same structure, content rules and checks as the existing Shwapno and WannaCry studies. Use when the user asks to add, create or build a new case study, or runs /new-case-study.
argument-hint: "<incident name> + the brief / facts / sources"
---

# Add a new case study

Build the new study exactly like the existing ones (`/case-study/shwapno-data-breach`, `/case-study/wannacry-eternalblue`)
unless the user's request says otherwise. **Anything the user specifies for this study overrides this guide.**

Before writing code, read `AGENTS.md` (this Next.js version differs from training data) and skim
`src/case-study/README.md`, `src/case-study/content.ts`, one existing page in `src/app/case-study/*/page.tsx`, and the
scene components it imports. Copy their patterns; don't invent new ones.

## 1. What to get from the user

If any of these are missing and can't be taken from what they gave you, ask once, briefly:

- Incident name and a URL **slug** (kebab-case, e.g. `medibank-data-breach`).
- The facts (a brief, notes, or articles) and the questions the study should answer.
- Sources with **exact article URLs** (titles and dates if known).
- Accent colour if they care (default: pick one not used by the newest existing study).

Never fill gaps with facts from memory. If a value is missing, use a visible `TODO:` string.

## 2. Files to create / touch

| What | Where |
|---|---|
| Route page (scene order, metadata) | `src/app/case-study/<slug>/page.tsx` |
| All text for the study | `src/case-study/studies/<slug>.ts` (new file; import shared types from `../content`) |
| One component per scene | `src/case-study/scenes/<slug>/*.tsx` |
| 3D objects (one per file) + SVG fallback | `src/case-study/three/<Name>.tsx` + add `<Name>Svg` to `three/fallbacks.tsx` |
| References | add entries to `references` in `content.ts` (shared list), list the ids in the study file |
| Card on /case-study and home page | add an entry to `caseStudies` in `src/case-study/registry.ts` — **newest first** |
| New accent (only if needed) | extend `CaseId` in `content.ts`, add `[data-case="cN"] { --acc: … }` in `case-study.css`, add the colour to `@theme static` in `src/app/globals.css` and to `CaseStudyAccent`/`ACCENT` in the registry/card |

Do not touch the other studies' content or pages. The layout (`src/app/case-study/layout.tsx`), list page and home
section (`src/components/CaseStudies.tsx`) pick the new study up from the registry automatically.

## 3. Page structure (same order as existing studies)

1. `<SmoothScroll />` and `<Chrome title=… nav=… />` (top bar, 01–nn rail, Index overlay) — build a `StudyNav`.
2. `<FrontPage front=… />` — kicker, masthead, edition, dateline, headline, deck, `read` anchor, globe alt text. **No byline / student block.**
3. `<Marquee items=… caseId=… />` — names, places, dates from the facts.
4. Hook — `WordReveal` with one plain-language sentence that puts the reader in the incident.
5. Question scenes, numbered **01, 02, …** per page (each page starts at 01).
6. Optional features between questions (e.g. attribution / claims section), un-numbered, added to the Index.
7. Lesson pull quote (`PullQuote`) — one sentence.
8. `<Closing closing=… related="<other-slug>" />` — where it went wrong, "What you can do today" checklist, final quote, "Read next" card.
9. `<References ids=… caseId=… />` — per-study list; rows blink when a source tag is clicked.

### Scene anatomy (use `patterns/Scene.tsx`)

`(label)` → outlined number + **question as headline** → meta line (`category / date / source`) → **2–5 steps, max 40
words each** → one visual → source tags → one-line lead-in to the next question (`next`).

Pick patterns per scene, as in the existing studies: `indexed` sticky steps (B) for timelines/processes, `Stats`
count-up (C) for numbers, `DefinitionCard` (D) for jargon, `CardGrid` for lists of 4–6 items, `PullQuote` (H) for lessons.

### Visuals (pattern I)

- One focal object per scene, made in code: R3F primitives, canvas textures, or inline SVG. Wrap in `<Stage alt=… object=… fallback=… hud=… />`.
- Each 3D object: its own file in `three/`, loaded with `next/dynamic(..., { ssr: false })`, driven by the scene's `progress` ref, disposes what it creates.
- Every 3D object needs a static SVG fallback (phones, reduced motion, no WebGL, server render) showing its end state, and alt text in the scene's `alt`.
- Round trig-derived SVG coordinates (`r2`) to avoid hydration mismatches.
- Label illustrative visuals on the page ("illustrative", "not to scale", "fictional example").

## 4. Content rules (non-negotiable unless the user overrides)

- **Facts only from the user's material.** No invented names, numbers, quotes, dates or attacker identities.
- **Attribution:** a group that *claims* an attack is always written as "claimed by X (unverified)", stamped
  `CLAIMED – UNVERIFIED`, never "X hacked Y". Never say which group "really" did it. If there is a "Who did it?" sidebar,
  it must agree with the claims section (confirmed vs claimed).
- **Company statements** that aren't independently confirmed are labelled as the company's claim.
- **Educational only:** no exploit code, packet details, malware samples, or how-to. Explain technical flaws by analogy.
- **No** real photos of people, company or group logos, hotlinked images, leak-site links or `.onion` addresses.
- **References:** exact article URLs. If a source can't be found, **remove it entirely** (from `references`, every
  scene's `refs`, and any meta-line `source` text) rather than linking a home page. Use `tag` when one outlet is cited
  twice so source tags stay distinguishable. A scene with no sources shows no tag; only opinion scenes
  (`meta.category: "Opinion"`) show "Source: author's opinion".
- Plain language for non-technical readers; spell out acronyms on first use.

## 5. Verify before saying it's done

1. `npx eslint src/case-study src/app src/components` and `npx tsc --noEmit -p .` — both clean.
2. `npx next build` — the new route appears as `○ /case-study/<slug>` and `out/case-study/<slug>/index.html` exists.
3. Browser check of the **static export** (the sandbox may block new ports; use Playwright with `page.route` to serve
   `out/`): page loads with no console errors; rail shows 01–nn; every `#ref-…` source tag resolves; no `TODO` left unless
   intended; desktop (1440px) and phone (390px) screenshots of the front page and a few scenes look right.
4. The new card appears on `/case-study` and in the home page "Case studies" section.
5. If the user's `next dev` server shows stale errors after routes/exports change, tell them to stop it, `rm -rf .next`,
   and restart — don't kill their process.

Report what was added, anything left as `TODO`, and any judgement calls (e.g. facts you labelled illustrative). Don't
commit unless asked.

## 6. Quick template for the user

> /new-case-study **<Incident name>** — slug `<slug>`, accent `<colour or "any">`.
> Questions: 1) … 2) … 3) …
> Facts: …
> Sources: `<id> | <outlet> | <exact URL> | <date> | <headline>` …
> Different from usual: … (optional)
