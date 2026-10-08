# Case studies (`/case-study`)

`/case-study` lists every case study as a card (from `registry.ts`); each study is its own page at `/case-study/<slug>`.

## Adding a case study

1. Create `src/app/case-study/<slug>/page.tsx` (and its scenes/content). The shared layout in `src/app/case-study/layout.tsx`
   already gives it the serif font and the dark editorial palette; the pattern components in `patterns/` can be reused.
2. Add an entry to `caseStudies` in `registry.ts` with the same `slug`, a title, summary, tags and one accent per incident
   (the card cover is drawn from those).

That's it: the list page, the card and the static export pick it up on the next build.

With Claude Code, run `/new-case-study` (see `.claude/skills/new-case-study/SKILL.md`) to follow the full checklist:
file layout, scene anatomy, content and sourcing rules, and verification.

It also appears on the portfolio home page (`src/components/CaseStudies.tsx`, the first three entries) with a
"See more case studies" link to `/case-study`.

## Current studies

Three scroll-driven "interactive news investigations" for a non-technical reader, each a page of its own:

- **`/case-study/npm-supply-chain-attack`** — a poisoned npm package that spread across four client servers at a small Dhaka
  software agency (2026). The author's own incident, still under investigation. Three parts with their own accents: attack
  (signal red), response (amber), fix (green). Questions 01–18, plus Gap, Timeline, Evidence. Text lives in
  `studies/npm-supply-chain-attack.ts`; open values are visible `TODO:` strings, unconfirmed claims carry a stamp.
- **`/case-study/shwapno-data-breach`** — the Shwapno customer-data breach (Bangladesh, 2025–26). Accent: amber. Questions 01–10.
- **`/case-study/wannacry-eternalblue`** — EternalBlue and the WannaCry attack (worldwide, 2017). Accent: signal red. Questions 01–09.

Both share the layout, pattern components and 3D objects, and nothing visual with the portfolio's theme switcher.

## Run

```bash
npm install
npm run dev          # http://localhost:3000/case-study (list) → /case-study/<slug>
```

Production build (static export, same as the rest of the site):

```bash
npm run build        # writes ./out, including ./out/case-study/index.html and ./out/case-study/<slug>/index.html
npx serve out        # optional: preview the export locally
```

## Deploy

The portfolio deploys to GitHub Pages through `.github/workflows/nextjs.yml` on every push to `main`. The case study is part of
the same static export, so it goes live at `https://<your-domain>/case-study/` with no extra steps. `trailingSlash: true` in
`next.config.ts` exports every page as `<path>/index.html`, which GitHub Pages always resolves for nested routes.

To deploy somewhere else, upload the `out/` folder to any static host. If the site is served from a sub-path (for example
`/noyon-portfolio`), build with `PAGES_BASE_PATH=/noyon-portfolio npm run build`.

## Before submitting

Every reference links to its exact article. If you add a source without one, set `todo: true` on its entry in
`references` (in `content.ts`) and it shows an amber TODO on the page until it's filled in.

## Structure

```
src/app/case-study/
  layout.tsx          Instrument Serif + the .cs-root wrapper (shared by every study)
  page.tsx            The card list
  shwapno-data-breach/page.tsx    Scene order for the Shwapno study
  wannacry-eternalblue/page.tsx   Scene order for the WannaCry study
  npm-supply-chain-attack/page.tsx  Scene order for the npm supply-chain study
src/case-study/
  registry.ts         The list of studies shown as cards
  studies/            One content file per newer study (npm-supply-chain-attack.ts)
  content.ts          Shared types, references, and every word on the Shwapno and WannaCry pages, typed (front, nav, closing, refs per study). Facts come only from the brief.
  case-study.css      Accents per case, word reveal, marquee, step fade, ransom window
  lib/scroll.tsx      Lenis ↔ GSAP ScrollTrigger, scrollToId, useReducedMotion, useCan3D
  patterns/           Shared components for patterns A–I
    WordReveal.tsx    A  hook sentence lights up word by word
    Scene.tsx         B  sticky numbered steps · E question chain · the scene anatomy
    CountUp.tsx       C  "By the numbers" rows
    Blocks.tsx        D  definition card · H pull quote · marquee · card grid
    Chrome.tsx        F  case rail + top progress bar · G index overlay
    Stage.tsx         I  one focal object: lazy 3D or static SVG
    Editorial.tsx        meta line, pills, source tags, next-question line
    CaseStudyCard.tsx    card + code-drawn cover on the list page
  scenes/             One component per scene (FrontPage, Case1Hook, Q01…Q19, WhoDidIt, Lessons, People, …)
    huds.tsx          DOM overlays (clock, counters, labels) drawn over the live 3D
  three/              One R3F object per file, plus fallbacks.tsx (an SVG for each)
```

### How a scene works

`Scene` renders the shared anatomy: `(label)` → outlined number + question → meta line → 2–5 steps (≤ 40 words each) beside one
visual → source tags linking to References → one line that tees up the next question. It measures scroll progress through its
steps with ScrollTrigger and shares it through context: a ref for the 3D objects (read every frame) and a 1%-quantised value
for DOM overlays.

### 3D, performance and accessibility

- Each 3D object is a separate `next/dynamic` chunk; three.js itself loads only once a `Stage` decides to draw in 3D.
- A canvas mounts only while its scene is within ~60% of a viewport of the screen, and unmounts (releasing the WebGL context
  and GPU memory) once it scrolls away. Textures and swapped geometries are disposed explicitly.
- Phones (< 768px), `prefers-reduced-motion`, no-WebGL browsers and the server render all get the static SVG. Every visual
  has alt text (`QuestionScene.alt`) on a `role="img"` figure; canvases and overlays are `aria-hidden`.
- Reduced motion also turns off Lenis, the marquee, word dimming and count-ups; all text is readable by scrolling alone.
- The index overlay is a native `<dialog>` (focus trap, Escape to close). The rail is hidden below `lg`; the index covers it.

### Content rules

- Educational only: no exploit code, packet detail or malware samples. EternalBlue is explained by analogy.
- No invented facts, quotes, numbers or attacker identities. Illustrative visuals say so on the page (map dots, pacing,
  "not to scale", the fictional caller).
- No photos, logos or hotlinked images; every visual is drawn in code.
