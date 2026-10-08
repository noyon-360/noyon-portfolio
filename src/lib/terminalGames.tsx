import type { ReactNode } from "react";

// A line the terminal prints. `tone` maps to a theme colour in Terminal.tsx.
export type Tone = "text" | "muted" | "client" | "server" | "ops" | "craft";
export type Out = { text: ReactNode; tone?: Tone };

// Every game is a tiny state machine: start() prints the intro, input() handles one line.
export type Game = {
  prompt: string;
  start: () => Out[];
  input: (line: string) => { out: Out[]; done?: boolean };
  // Optional on-screen keyboard: the terminal draws these keys and submits one when tapped.
  keys?: () => { key: string; state: "unused" | "hit" | "miss" }[];
};

export type GameInfo = { id: string; title: string; blurb: string; create: () => Game };

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

/* ── flutter: a quiz on the things I use every day ───────────────────────── */

const quiz = [
  {
    q: "Which widget can rebuild itself when its own data changes?",
    options: ["StatelessWidget", "StatefulWidget", "Container"],
    answer: 1,
    why: "StatefulWidget owns a State object; setState() schedules a rebuild.",
  },
  {
    q: "What does hot reload keep that a hot restart throws away?",
    options: ["The app's current state", "Native plugin code", "Nothing — they're the same"],
    answer: 0,
    why: "Hot reload injects new code into the running Dart VM and keeps state.",
  },
  {
    q: "With Bloc, the UI sends ___ and listens for ___.",
    options: ["states, events", "events, states", "futures, streams"],
    answer: 1,
    why: "Events go in, states come out — the UI never mutates state directly.",
  },
  {
    q: "In Clean Architecture, which layer should never import Flutter?",
    options: ["Presentation", "Domain", "Data"],
    answer: 1,
    why: "The domain layer is pure Dart: entities, use cases and repository contracts.",
  },
  {
    q: "Which tool did I use to cut an app's startup from 3s to 1.5s?",
    options: ["Flutter DevTools", "Shorebird", "Codemagic"],
    answer: 0,
    why: "DevTools' CPU profiler and timeline showed what blocked the first frame.",
  },
  {
    q: "What does Shorebird add to a Flutter release pipeline?",
    options: ["State management", "Over-the-air code updates", "Golden tests"],
    answer: 1,
    why: "Shorebird patches Dart code over the air — urgent fixes skip store review.",
  },
  {
    q: "How do Flutter apps talk to Kotlin or Swift code?",
    options: ["Platform Channels", "WebSockets", "Isolates"],
    answer: 0,
    why: "MethodChannel / EventChannel pass messages across the platform boundary.",
  },
];

function flutterQuiz(): Game {
  const rounds = shuffle(quiz).slice(0, 5);
  let i = 0;
  let score = 0;
  const ask = (): Out[] => {
    const r = rounds[i];
    return [
      { text: `Q${i + 1}/${rounds.length}  ${r.q}`, tone: "client" },
      ...r.options.map((o, n) => ({ text: `  ${n + 1}) ${o}` })),
    ];
  };
  return {
    prompt: "answer [1-3]",
    start: () => [
      { text: "FLUTTER QUIZ — 5 questions from my day-to-day. Type 1, 2 or 3.", tone: "ops" },
      ...ask(),
    ],
    input(line) {
      const n = Number(line) - 1;
      const r = rounds[i];
      if (!Number.isInteger(n) || n < 0 || n >= r.options.length) {
        return { out: [{ text: `Pick 1–${r.options.length}.`, tone: "muted" }] };
      }
      const out: Out[] = [];
      if (n === r.answer) {
        score++;
        out.push({ text: "✔ correct", tone: "client" });
      } else {
        out.push({ text: `✘ it was ${r.answer + 1}) ${r.options[r.answer]}`, tone: "server" });
      }
      out.push({ text: `  ${r.why}`, tone: "muted" });
      i++;
      if (i < rounds.length) return { out: [...out, ...ask()] };
      const verdict =
        score === rounds.length ? "Senior material. Let's build something." : score >= 3 ? "Solid — you'd pass code review." : "Hot reload and try again.";
      return { out: [...out, { text: `Score ${score}/${rounds.length}. ${verdict}`, tone: "ops" }], done: true };
    },
  };
}

/* ── hack: a fictional word-deduction puzzle (Fallout-style terminal) ─────── */

const words = [
  "WIDGETS", "FLUTTER", "BACKEND", "GATEWAY", "PAYLOAD", "SOCKETS", "RUNTIME", "PACKAGE",
  "BUILDER", "NETWORK", "STREAMS", "PROFILE", "CONSOLE", "PROJECT", "DISPLAY", "CACHING",
  "ROUTING", "MODULES", "SCHEMAS", "STORAGE", "RELEASE", "BINDING",
];

const likeness = (a: string, b: string) => [...a].filter((c, i) => b[i] === c).length;

function hackPuzzle(): Game {
  const pool = shuffle(words).slice(0, 8);
  const secret = pick(pool);
  let tries = 4;
  const junk = "!@#$%^&*()[]{}<>?/|;:=+";
  const noise = (n: number) => Array.from({ length: n }, () => pick([...junk])).join("");
  return {
    prompt: "password",
    start: () => [
      { text: "ROBCO-ISH TERMLINK — fictional mainframe, nothing real is touched.", tone: "ops" },
      { text: "One of these words is the password. Guess one; I'll tell you how many", tone: "muted" },
      { text: "letters are correct AND in the right position. 4 attempts.", tone: "muted" },
      ...pool.map((w, n) => ({
        text: `0x${(0xf4a0 + n * 12).toString(16).toUpperCase()}  ${noise(4)} ${w} ${noise(4)}`,
      })),
    ],
    input(line) {
      const guess = line.trim().toUpperCase();
      if (!pool.includes(guess)) return { out: [{ text: "Not in the list. Type one of the words above.", tone: "muted" }] };
      if (guess === secret) {
        return {
          out: [
            { text: `> ${guess}  ·  Likeness 7/7`, tone: "client" },
            { text: "ACCESS GRANTED. Welcome, operator.", tone: "client" },
            { text: "Fun fact: my thesis built the other side — an ML detector that flags intrusions at 98% accuracy.", tone: "muted" },
          ],
          done: true,
        };
      }
      tries--;
      const out: Out[] = [
        { text: `> ${guess}  ·  Likeness ${likeness(guess, secret)}/7  ·  ${"■ ".repeat(tries)}${tries} left`, tone: "server" },
      ];
      if (tries === 0) {
        return { out: [...out, { text: `TERMINAL LOCKED. The password was ${secret}.`, tone: "server" }], done: true };
      }
      return { out };
    },
  };
}

/* ── design: guess a colour's hex code by eye ────────────────────────────── */

const hex = (n: number) => n.toString(16).padStart(2, "0");
const toHex = (c: number[]) => `#${c.map(hex).join("")}`;

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-6 w-14 rounded border border-line-strong align-middle" style={{ background: color }} />
      <span>{label}</span>
    </span>
  );
}

function hexGuess(): Game {
  const rounds = 3;
  let round = 0;
  let total = 0;
  let target: number[] = [];
  const next = (): Out[] => {
    target = [0, 0, 0].map(() => Math.floor(Math.random() * 256));
    return [{ text: <Swatch color={toHex(target)} label={`Round ${round + 1}/${rounds} — what's this colour's hex?`} />, tone: "craft" }];
  };
  return {
    prompt: "#rrggbb",
    start: () => [
      { text: "HEX EYE — designers learn to read colour as numbers. Type a guess like #3a7bd5.", tone: "ops" },
      ...next(),
    ],
    input(line) {
      const m = line.trim().replace(/^#/, "").match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
      if (!m) return { out: [{ text: "Use hex: #rrggbb or #rgb.", tone: "muted" }] };
      let s = m[1];
      if (s.length === 3) s = [...s].map((c) => c + c).join("");
      const guess = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
      const dist = Math.hypot(...guess.map((g, i) => g - target[i]));
      const score = Math.max(0, Math.round(100 - (dist / 441.7) * 100 * 1.6));
      total += score;
      round++;
      const out: Out[] = [
        { text: <Swatch color={toHex(guess)} label={`yours  ${toHex(guess)}`} /> },
        { text: <Swatch color={toHex(target)} label={`actual ${toHex(target)}  →  ${score}/100`} />, tone: score > 80 ? "client" : score > 55 ? "ops" : "server" },
      ];
      if (round < rounds) return { out: [...out, ...next()] };
      const avg = Math.round(total / rounds);
      const verdict = avg > 85 ? "Pantone would hire you." : avg > 65 ? "Good eye." : "Stick to the colour picker for now.";
      return { out: [...out, { text: `Average ${avg}/100. ${verdict}`, tone: "ops" }], done: true };
    },
  };
}

/* ── type: a typing race on real-looking Dart and TypeScript ─────────────── */

const snippets = [
  "final user = await repo.getUser(id);",
  "emit(state.copyWith(status: Status.loaded));",
  "return BlocProvider(create: (_) => AuthCubit());",
  "@Get(':id') findOne(@Param('id') id: string) {}",
  "await queue.add('transcode', { key, renditions: 4 });",
  "Navigator.of(context).push(route);",
];

function typeRace(): Game {
  const target = pick(snippets);
  let startedAt = 0;
  return {
    prompt: "type it",
    start: () => {
      startedAt = performance.now();
      return [
        { text: "TYPE RACE — type this line exactly, then press Enter. Clock is running.", tone: "ops" },
        { text: `  ${target}`, tone: "client" },
      ];
    },
    input(line) {
      const secs = (performance.now() - startedAt) / 1000;
      const correct = [...target].filter((c, i) => line[i] === c).length;
      const accuracy = Math.round((correct / Math.max(target.length, line.length)) * 100);
      const wpm = Math.round((line.length / 5 / secs) * 60 * (accuracy / 100));
      const verdict = wpm > 60 ? "Pair-programming speed." : wpm > 35 ? "Respectable." : "Autocomplete is your friend.";
      return {
        out: [
          { text: `${secs.toFixed(1)}s · ${accuracy}% accurate · ${wpm} WPM`, tone: accuracy === 100 ? "client" : "ops" },
          { text: verdict, tone: "muted" },
        ],
        done: true,
      };
    },
  };
}

/* ── hangman: guess the word, one letter at a time ───────────────────────── */

const hangWords = [
  { word: "FLUTTER", hint: "Google's UI toolkit — I've shipped 35+ apps with it" },
  { word: "WIDGET", hint: "In Flutter, everything is one" },
  { word: "FIRESTORE", hint: "Firebase's real-time NoSQL database" },
  { word: "SHOREBIRD", hint: "Pushes Flutter fixes over the air" },
  { word: "RIVERPOD", hint: "A state-management package (an anagram of Provider)" },
  { word: "STRIPE", hint: "Takes the payments in Exodus and SmilesTreats" },
  { word: "ARDUINO", hint: "The brain inside my waiter robot" },
  { word: "GEOFENCE", hint: "A 300 m virtual circle around each Envielite landmark" },
  { word: "EXOPLANET", hint: "A planet beyond our solar system — CosmoQuest's subject" },
  { word: "CALLIGRAPHY", hint: "Arabic lettering I paint on canvas" },
  { word: "TRANSCODE", hint: "What ffmpeg does to every BeatX upload" },
  { word: "RAINBOW", hint: "Colourful light display in the sky during rain" },
];

// Gallows, one frame per wrong guess (0–6).
const gallows = (wrong: number) => {
  const head = wrong > 0 ? "O" : " ";
  const body = wrong > 1 ? "|" : " ";
  const armL = wrong > 2 ? "/" : " ";
  const armR = wrong > 3 ? "\\" : " ";
  const legL = wrong > 4 ? "/" : " ";
  const legR = wrong > 5 ? "\\" : " ";
  return [
    "   ┌─────┐",
    "   │     │",
    `   │     ${head}`,
    `   │    ${armL}${body}${armR}`,
    `   │    ${legL} ${legR}`,
    "   │",
    " ──┴──────────",
  ].join("\n");
};

function hangman(): Game {
  const MAX = 6;
  const { word, hint } = pick(hangWords);
  const guessed = new Set<string>();
  let wrong = 0;

  const masked = () => [...word].map((c) => (guessed.has(c) ? c : "_")).join(" ");
  const status = (): Out[] => [
    { text: `   ${masked()}`, tone: "client" },
    { text: `   Incorrect guesses: ${wrong} / ${MAX}`, tone: wrong >= 4 ? "server" : "muted" },
  ];

  return {
    prompt: "letter",
    start: () => [
      { text: "HANGMAN — guess the word one letter at a time (or type the whole word).", tone: "ops" },
      { text: gallows(0), tone: "muted" },
      { text: `   Hint: ${hint}`, tone: "craft" },
      ...status(),
    ],
    input(line) {
      const g = line.trim().toUpperCase();
      if (!/^[A-Z]+$/.test(g)) return { out: [{ text: "Letters only.", tone: "muted" }] };

      // Whole-word guess: right wins outright, wrong costs one life.
      if (g.length > 1) {
        if (g === word) {
          [...word].forEach((c) => guessed.add(c));
          return { out: [...status(), { text: `You got it — ${word}! 🎉`, tone: "client" }], done: true };
        }
        wrong++;
      } else if (guessed.has(g)) {
        return { out: [{ text: `Already tried ${g}.`, tone: "muted" }] };
      } else {
        guessed.add(g);
        if (!word.includes(g)) wrong++;
      }

      const hit = g.length === 1 && word.includes(g);
      const out: Out[] = [
        { text: hit ? `✔ ${g} is in the word` : `✘ ${g.length > 1 ? `not "${g}"` : `no ${g}`}`, tone: hit ? "client" : "server" },
        ...(hit ? [] : [{ text: gallows(wrong), tone: "muted" as Tone }]),
        ...status(),
      ];
      if ([...word].every((c) => guessed.has(c))) {
        return { out: [...out, { text: `Saved! The word was ${word}. 🎉`, tone: "client" }], done: true };
      }
      if (wrong >= MAX) {
        return { out: [...out, { text: `Hanged. The word was ${word}.`, tone: "server" }], done: true };
      }
      return { out };
    },
    keys: () =>
      [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((key) => ({
        key,
        state: !guessed.has(key) ? "unused" : word.includes(key) ? "hit" : "miss",
      })),
  };
}

/* ── guess: binary search, the oldest algorithm interview there is ───────── */

function numberGuess(): Game {
  const secret = 1 + Math.floor(Math.random() * 100);
  let tries = 0;
  return {
    prompt: "1-100",
    start: () => [
      { text: "BINARY SEARCH — I picked a number from 1 to 100. Optimal play needs at most 7 guesses.", tone: "ops" },
    ],
    input(line) {
      const n = Number(line);
      if (!Number.isInteger(n) || n < 1 || n > 100) return { out: [{ text: "A whole number, 1–100.", tone: "muted" }] };
      tries++;
      if (n < secret) return { out: [{ text: `${n} → higher`, tone: "craft" }] };
      if (n > secret) return { out: [{ text: `${n} → lower`, tone: "craft" }] };
      return {
        out: [{ text: `${n} → found in ${tries} ${tries === 1 ? "guess" : "guesses"}. ${tries <= 7 ? "O(log n) achieved." : "Try halving the range each time."}`, tone: "client" }],
        done: true,
      };
    },
  };
}

export const GAMES: GameInfo[] = [
  { id: "hangman", title: "Hangman", blurb: "Guess the word — tap letters or type them", create: hangman },
  { id: "flutter", title: "Flutter quiz", blurb: "5 questions from my everyday Flutter work", create: flutterQuiz },
  { id: "hack", title: "Terminal hack", blurb: "Fictional password-deduction puzzle", create: hackPuzzle },
  { id: "design", title: "Hex eye", blurb: "Guess a colour's hex code by eye", create: hexGuess },
  { id: "type", title: "Type race", blurb: "Type a line of Dart/TS against the clock", create: typeRace },
  { id: "guess", title: "Binary search", blurb: "Find my number in 7 guesses or fewer", create: numberGuess },
];
