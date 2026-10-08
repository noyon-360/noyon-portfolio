"use client";

import { useState } from "react";
import { Section } from "./Section";

const endpoints = [
  { path: "/api/profile", note: "Who I am and how to reach me" },
  { path: "/api/skills", note: "The skills from the 3D tour" },
  { path: "/api/projects", note: "Selected work" },
  { path: "/api/health", note: "Service health check" },
];

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ApiDemo() {
  const [path, setPath] = useState(endpoints[0].path);
  const [out, setOut] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function send() {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch(base + path);
      const body = await res.json();
      setMeta(`${res.status} ${res.ok ? "OK" : "Error"} · ${Math.round(performance.now() - start)} ms`);
      setOut(JSON.stringify(body, null, 2));
    } catch {
      setMeta("Network error");
      setOut("");
    }
    setLoading(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`curl ${window.location.origin}${base}${path}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <Section
      id="api"
      index="09"
      eyebrow="Playground"
      title="This portfolio has an API."
      intro="Pick an endpoint and send a real request — the same data that renders this page."
    >
      <div className="grid overflow-hidden rounded-2xl border border-line bg-panel lg:grid-cols-5">
        <ul className="border-b border-line lg:col-span-2 lg:border-b-0 lg:border-r">
          {endpoints.map((e) => (
            <li key={e.path}>
              <button
                onClick={() => setPath(e.path)}
                aria-pressed={path === e.path}
                className={`flex w-full items-start gap-3 border-l-2 px-5 py-4 text-left transition-colors ${
                  path === e.path ? "border-client bg-panel-2" : "border-transparent hover:bg-panel-2/60"
                }`}
              >
                <span className="mt-0.5 rounded bg-emerald-400/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">GET</span>
                <span>
                  <span className="block font-mono text-sm">{e.path}</span>
                  <span className="block text-sm text-muted">{e.note}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex min-w-0 flex-col lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
            <code className="min-w-0 flex-1 truncate font-mono text-sm text-muted">GET {path}</code>
            <button onClick={copy} className="rounded-full border border-line-strong px-3 py-1 text-sm hover:bg-panel-2">
              {copied ? "Copied" : "Copy curl"}
            </button>
            <button
              onClick={send}
              disabled={loading}
              className="rounded-full bg-text px-4 py-1 text-sm font-medium text-ink hover:opacity-85 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send"}
            </button>
          </div>
          <p className="border-b border-line px-4 py-2 font-mono text-xs text-muted" aria-live="polite">
            {meta || "Response"}
          </p>
          <pre className="h-80 overflow-auto bg-ink p-4 font-mono text-xs leading-relaxed text-client sm:text-sm">
            {out || "Press Send to see the response."}
          </pre>
        </div>
      </div>
    </Section>
  );
}
