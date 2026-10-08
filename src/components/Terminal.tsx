"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { education, experience, profile, projects, skills } from "@/data/content";
import { THEMES, type ThemeId } from "@/lib/themes";
import { GAMES, type Game, type Out, type Tone } from "@/lib/terminalGames";
import { setTheme } from "@/lib/useTheme";
import { Section } from "./Section";

// `input` marks an echoed command; `game` is the game that was running when it was typed.
type Line = Out & { id: number; input?: string; game?: string };

const toneClass: Record<Tone, string> = {
  text: "text-text",
  muted: "text-muted",
  client: "text-client",
  server: "text-server",
  ops: "text-ops",
  craft: "text-craft",
};

const banner: Out[] = [
  { text: `${profile.shortName.toLowerCase()}@portfolio — ${profile.title}`, tone: "client" },
  { text: "Type `help` to see commands, or `games` to play something.", tone: "muted" },
];

const commandHelp: [string, string][] = [
  ["help", "list commands"],
  ["about", "who I am"],
  ["skills", "the full toolkit"],
  ["projects", "selected work · `projects <name>` for details"],
  ["experience", "where I've worked"],
  ["education", "degree and thesis"],
  ["contact", "how to reach me"],
  ["theme [name]", "list or switch the site theme"],
  ["games", "list games · `play <game>` to start"],
  ["history", "commands you've run"],
  ["clear", "clear the screen"],
];

const COMMANDS = [...commandHelp.map(([c]) => c.split(" ")[0]), "play", "whoami", "date", "echo", "sudo", "ls"];

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="underline decoration-dotted underline-offset-4 hover:text-client">
    {children}
  </a>
);

// Runs one shell command. Returns lines to print and, for `play`, a game to hand input to.
function run(raw: string, history: string[]): { out: Out[]; game?: Game; clear?: boolean } {
  const [cmd = "", ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ").toLowerCase();

  switch (cmd.toLowerCase()) {
    case "":
      return { out: [] };
    case "help":
      return {
        out: commandHelp.map(([c, d]) => ({
          text: (
            <>
              <span className="inline-block w-36 text-client">{c}</span>
              <span className="text-muted">{d}</span>
            </>
          ),
        })),
      };
    case "about":
    case "whoami":
      return {
        out: [
          { text: `${profile.name} — ${profile.title}`, tone: "client" },
          { text: profile.roles.join(" · "), tone: "ops" },
          { text: `${profile.location} (${profile.timezone})`, tone: "muted" },
          { text: profile.summary },
        ],
      };
    case "skills":
      return {
        out: skills.map((g) => ({
          text: (
            <>
              <span className="text-craft">{g.group}: </span>
              {g.items.join(", ")}
            </>
          ),
        })),
      };
    case "ls":
    case "projects": {
      if (arg) {
        const p = projects.find((p) => p.slug === arg || p.title.toLowerCase() === arg);
        if (!p) return { out: [{ text: `No project "${arg}". Try: ${projects.map((p) => p.slug).join(", ")}`, tone: "server" }] };
        return {
          out: [
            { text: `${p.title} — ${p.kind} · ${p.category}`, tone: "client" },
            { text: p.summary },
            { text: `challenge: ${p.challenge}`, tone: "ops" },
            { text: `solution:  ${p.solution}`, tone: "muted" },
            { text: `stack:     ${p.stack.join(", ")}`, tone: "craft" },
            ...p.links.map((l) => ({ text: <Link href={l.href}>{`${l.label} ↗`}</Link> })),
          ],
        };
      }
      return {
        out: [
          ...projects.map((p) => ({
            text: (
              <>
                <span className="inline-block w-36 text-client">{p.slug}</span>
                <span className="text-muted">{p.category}</span>
              </>
            ),
          })),
          { text: "Run `projects <name>` for the full story.", tone: "muted" },
        ],
      };
    }
    case "experience":
      return {
        out: experience.flatMap((e) => [
          { text: `${e.role} @ ${e.company}  (${e.period})`, tone: "client" as Tone },
          ...e.points.map((pt) => ({ text: `  • ${pt}`, tone: "muted" as Tone })),
        ]),
      };
    case "education":
      return {
        out: [
          { text: `${education.degree} — ${education.school} (${education.period})`, tone: "client" },
          { text: `Thesis: ${education.thesis.title}`, tone: "ops" },
          ...education.thesis.results.map((r) => ({
            text: `  ${r.model.padEnd(17)} ${"█".repeat(Math.round(r.score / 5)).padEnd(20, "░")} ${r.score}%`,
            tone: (r.score > 90 ? "client" : "muted") as Tone,
          })),
          { text: <Link href={education.thesis.href}>View on GitHub ↗</Link> },
        ],
      };
    case "contact":
      return {
        out: [
          { text: <>email   <Link href={`mailto:${profile.email}`}>{profile.email}</Link></> },
          { text: <>phone   <Link href={`tel:${profile.phone}`}>{profile.phone}</Link></> },
          ...profile.socials.map((s) => ({ text: <>{s.label.toLowerCase().padEnd(8)}<Link href={s.href}>{s.href}</Link></> })),
        ],
      };
    case "theme": {
      if (!arg) {
        return {
          out: [
            ...THEMES.map((t) => ({ text: `${t.id.padEnd(11)} ${t.mood}` })),
            { text: "Run `theme <name>` to switch.", tone: "muted" },
          ],
        };
      }
      const t = THEMES.find((t) => t.id === arg || t.name.toLowerCase() === arg);
      if (!t) return { out: [{ text: `Unknown theme "${arg}".`, tone: "server" }] };
      setTheme(t.id as ThemeId);
      return { out: [{ text: `Theme set to ${t.name}.`, tone: "client" }] };
    }
    case "games":
      return {
        out: [
          ...GAMES.map((g) => ({
            text: (
              <>
                <span className="inline-block w-36 text-client">play {g.id}</span>
                <span className="text-muted">{g.blurb}</span>
              </>
            ),
          })),
          { text: "Type `quit` any time to leave a game.", tone: "muted" },
        ],
      };
    case "play": {
      const g = GAMES.find((g) => g.id === arg);
      if (!g) return { out: [{ text: `Usage: play <${GAMES.map((g) => g.id).join("|")}>`, tone: "server" }] };
      const game = g.create();
      return { out: game.start(), game };
    }
    case "history":
      return { out: history.map((h, i) => ({ text: `${String(i + 1).padStart(3)}  ${h}`, tone: "muted" })) };
    case "clear":
      return { out: [], clear: true };
    case "date":
      return { out: [{ text: new Date().toString() }] };
    case "echo":
      return { out: [{ text: args.join(" ") }] };
    case "sudo":
      return { out: [{ text: "Permission denied. But I'm open to a conversation — try `contact`.", tone: "server" }] };
    default:
      return { out: [{ text: `command not found: ${cmd}. Type \`help\`.`, tone: "server" }] };
  }
}

// macOS greets every new shell with "Last login: Thu Oct  8 02:16:10 on ttys000".
// Read once on the client so the server render and hydration agree.
let loginStamp: string | null = null;
const noop = () => () => {};
function useLastLogin() {
  return useSyncExternalStore(
    noop,
    () => {
      if (loginStamp) return loginStamp;
      const d = new Date();
      const [day, mon] = d.toDateString().split(" ");
      loginStamp = `Last login: ${day} ${mon} ${String(d.getDate()).padStart(2, " ")} ${d.toTimeString().slice(0, 8)} on ttys000`;
      return loginStamp;
    },
    () => "",
  );
}

const user = profile.shortName.toLowerCase();

// zsh-style prompt: `noyon@portfolio ~ %`, or `hack ❯` while a game is running.
function Prompt({ game }: { game?: string }) {
  if (game) return <span className="shrink-0 font-semibold text-craft">{game} ❯</span>;
  return (
    <span className="shrink-0">
      <span className="font-semibold text-client">{user}@portfolio</span> <span className="text-ops">~</span>{" "}
      <span className="text-text">%</span>
    </span>
  );
}

type WindowState = "open" | "minimized" | "closed";

export default function Terminal() {
  const nextId = useRef(banner.length);
  const withIds = (out: Out[]): Line[] => out.map((o) => ({ ...o, id: nextId.current++ }));
  const fresh = () => banner.map((o, id) => ({ ...o, id }));

  const [lines, setLines] = useState<Line[]>(fresh);
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [game, setGame] = useState<{ id: string; run: Game } | null>(null);
  const [win, setWin] = useState<WindowState>("open");
  const [maximized, setMaximized] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const lastLogin = useLastLogin();

  // Keep the newest line in view — scroll the terminal, never the page.
  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, win, maximized]);

  // Esc leaves full screen, like the green button.
  useEffect(() => {
    if (!maximized) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMaximized(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [maximized]);

  const focusInput = () => input.current?.focus({ preventScroll: true });

  function edit(next: string) {
    setValue(next);
    setCaret(next.length);
  }

  function submit(raw: string) {
    const echo: Line = { id: nextId.current++, text: "", input: raw, game: game?.id };
    edit("");
    setCursor(-1);

    if (game) {
      if (/^(quit|exit|q)$/i.test(raw.trim())) {
        setGame(null);
        setLines((l) => [...l, echo, ...withIds([{ text: "Left the game.", tone: "muted" }])]);
        return;
      }
      const res = game.run.input(raw);
      if (res.done) setGame(null);
      const tail: Out[] = res.done ? [{ text: "Type `games` to play another.", tone: "muted" }] : [];
      setLines((l) => [...l, echo, ...withIds([...res.out, ...tail])]);
      return;
    }

    const nextHistory = raw.trim() ? [...history, raw.trim()] : history;
    setHistory(nextHistory);
    if (/^exit$/i.test(raw.trim())) return setWin("closed");
    const res = run(raw, nextHistory);
    if (res.clear) return setLines([]);
    if (res.game) setGame({ id: raw.trim().split(/\s+/)[1].toLowerCase(), run: res.game });
    setLines((l) => [...l, echo, ...withIds(res.out)]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(value);
    } else if (e.key === "ArrowUp" && !game && history.length) {
      e.preventDefault();
      const i = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      edit(history[i]);
    } else if (e.key === "ArrowDown" && !game && cursor !== -1) {
      e.preventDefault();
      const i = cursor + 1;
      setCursor(i >= history.length ? -1 : i);
      edit(i >= history.length ? "" : history[i]);
    } else if (e.key === "Tab" && !game && value) {
      e.preventDefault();
      const [head, ...rest] = value.split(" ");
      const pool = head === "play" ? GAMES.map((g) => g.id) : head === "theme" ? THEMES.map((t) => t.id) : head === "projects" ? projects.map((p) => p.slug) : null;
      if (pool && rest.length) {
        const match = pool.filter((p) => p.startsWith(rest.join(" ")));
        if (match.length === 1) edit(`${head} ${match[0]}`);
      } else if (!rest.length) {
        const match = COMMANDS.filter((c) => c.startsWith(head));
        if (match.length === 1) edit(match[0] + " ");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    } else if (e.key === "c" && e.ctrlKey && game) {
      e.preventDefault();
      submit("quit");
    }
  }

  function reopen() {
    setLines(fresh());
    setGame(null);
    edit("");
    setWin("open");
  }

  const quick = game ? ["quit"] : ["help", "about", "projects", "games", "play hangman", "play hack", "play flutter", "play design"];
  const title = `${user} — ${game ? `play ${game.id}` : "-zsh"} — 80×24`;
  const sync = (el: HTMLInputElement) => setCaret(el.selectionStart ?? el.value.length);

  return (
    <Section
      id="terminal"
      index="09"
      eyebrow="Terminal"
      title="Explore by command line."
      intro="A working shell for this portfolio. Read about my work, switch themes, or play a game — Flutter, hacking, design and more."
    >
      {win === "closed" ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-panel/60 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line-strong bg-ink font-mono text-lg text-client shadow-lg">
            &gt;_
          </span>
          <p className="font-mono text-sm text-muted">[Process completed]</p>
          <button
            type="button"
            onClick={reopen}
            className="rounded-full bg-text px-4 py-1.5 text-sm font-medium text-ink hover:opacity-85"
          >
            Open Terminal
          </button>
        </div>
      ) : (
        <>
          {maximized && <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setMaximized(false)} />}
          <div
            className={`term-window flex flex-col overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-black/60 ${
              maximized ? "fixed inset-3 z-[61] sm:inset-8" : "relative"
            }`}
          >
            {/* Title bar */}
            <div
              className="term-titlebar relative flex h-9 shrink-0 select-none items-center border-b border-black/60 px-3"
              onDoubleClick={() => setMaximized((m) => !m)}
            >
              <div className="group z-10 flex items-center gap-2">
                <button type="button" aria-label="Close terminal" onClick={() => setWin("closed")} className="term-light bg-[#ff5f57]">
                  <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5" /></svg>
                </button>
                <button
                  type="button"
                  aria-label={win === "minimized" ? "Restore terminal" : "Minimize terminal"}
                  onClick={() => setWin((w) => (w === "minimized" ? "open" : "minimized"))}
                  className="term-light bg-[#febc2e]"
                >
                  <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M1.2 4h5.6" /></svg>
                </button>
                <button
                  type="button"
                  aria-label={maximized ? "Exit full screen" : "Enter full screen"}
                  onClick={() => {
                    setWin("open");
                    setMaximized((m) => !m);
                  }}
                  className="term-light bg-[#28c840]"
                >
                  <svg viewBox="0 0 8 8" aria-hidden="true"><path d="M2 2h3.2L2 5.2zM6 6H2.8L6 2.8z" fill="currentColor" stroke="none" /></svg>
                </button>
              </div>
              <p className="pointer-events-none absolute inset-x-24 flex items-center justify-center gap-1.5 truncate text-[13px] font-medium text-white/70">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true">
                  <path d="M1.5 3.5A1.5 1.5 0 013 2h3l1.5 1.5H13A1.5 1.5 0 0114.5 5v7A1.5 1.5 0 0113 13.5H3A1.5 1.5 0 011.5 12z" fill="currentColor" />
                </svg>
                <span className="truncate">{title}</span>
              </p>
            </div>

            {/* Screen */}
            <div
              ref={screen}
              onClick={() => window.getSelection()?.isCollapsed && focusInput()}
              className={`term-screen term-font overflow-y-auto px-3 py-2 text-[13px] leading-[1.45] ${
                win === "minimized" ? "hidden" : maximized ? "flex-1" : "h-[28rem]"
              }`}
              role="log"
              aria-live="polite"
            >
              <p className="text-text/90">{lastLogin}</p>
              {lines.map((l) =>
                l.input !== undefined ? (
                  <p key={l.id} className="mt-1.5 flex flex-wrap gap-x-2 break-all">
                    <Prompt game={l.game} />
                    <span className="text-text">{l.input}</span>
                  </p>
                ) : (
                  <p key={l.id} className={`whitespace-pre-wrap break-words ${toneClass[l.tone ?? "text"]}`}>
                    {l.text}
                  </p>
                ),
              )}

              {/* Live prompt: the real input is invisible; a mirror draws the text and a block cursor. */}
              <label className="mt-1.5 flex gap-x-2">
                <Prompt game={game?.id} />
                <span className="relative min-w-0 flex-1">
                  <span aria-hidden="true" className="whitespace-pre-wrap break-all text-text">
                    {value.slice(0, caret)}
                    <span className={focused ? "term-cursor" : "term-cursor-idle"}>{value[caret] ?? "\u00a0"}</span>
                    {value.slice(caret + 1)}
                  </span>
                  <input
                    ref={input}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      sync(e.target);
                    }}
                    onSelect={(e) => sync(e.currentTarget)}
                    onKeyDown={onKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label="Terminal input"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0 outline-none focus-visible:outline-none"
                  />
                </span>
              </label>

              {/* On-screen keyboard for games that offer one (hangman). */}
              {game?.run.keys && (
                <div className="mt-3 flex max-w-md flex-wrap gap-1.5">
                  {game.run.keys().map(({ key, state }) => (
                    <button
                      key={key}
                      type="button"
                      disabled={state !== "unused"}
                      onClick={(e) => {
                        e.stopPropagation();
                        submit(key);
                      }}
                      className={`h-8 w-8 rounded-md border text-xs font-semibold transition-colors ${
                        state === "hit"
                          ? "border-client/40 bg-client/20 text-client"
                          : state === "miss"
                            ? "border-line bg-transparent text-muted/40 line-through"
                            : "border-line-strong bg-panel-2 text-text hover:border-client hover:text-client"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-xs text-muted">Try:</span>
            {quick.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  if (win === "minimized") setWin("open");
                  submit(q);
                  focusInput();
                }}
                className="rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-text"
              >
                {q}
              </button>
            ))}
            <span className="ml-auto hidden font-mono text-[11px] text-muted sm:inline">tab complete · ↑↓ history · ⌃L clear · ⌃C quit game</span>
          </div>
        </>
      )}
    </Section>
  );
}
