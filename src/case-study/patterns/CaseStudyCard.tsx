import Link from "next/link";
import type { CaseStudyAccent, CaseStudyEntry } from "../registry";
import { Pill } from "./Editorial";

const ACCENT: Record<CaseStudyAccent, string> = {
  amber: "var(--color-amber)",
  signal: "var(--color-signal)",
  ivory: "var(--color-ivory)",
  green: "var(--color-green)",
};

/** A cover drawn in code: one band per incident, a faint grid and the study's number. */
export function Cover({ study, n }: { study: CaseStudyEntry; n: string }) {
  const bands = study.accents.length;
  const w = 400 / bands;
  return (
    <svg viewBox="0 0 400 250" className="h-full w-full" aria-hidden="true">
      <rect width="400" height="250" fill="#0f0f0f" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="250" stroke="var(--color-rule)" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="var(--color-rule)" />
      ))}
      {study.accents.map((a, i) => (
        <g key={i}>
          <rect x={i * w} y={180} width={w} height={70} fill={ACCENT[a]} fillOpacity={0.9} />
          <circle cx={i * w + w / 2} cy={100} r={46} fill="none" stroke={ACCENT[a]} strokeWidth="1.5" />
          <circle cx={i * w + w / 2} cy={100} r={6} fill={ACCENT[a]} />
          <text x={i * w + 14} y={226} fontSize="20" fill="#0a0a0a" style={{ fontFamily: "var(--font-cs-serif), Georgia, serif" }}>
            {study.coverLabels[i]}
          </text>
        </g>
      ))}
      <text x="386" y="44" textAnchor="end" fontSize="40" fill="none" stroke="var(--color-ivory)" strokeOpacity="0.6" style={{ fontFamily: "var(--font-cs-serif), Georgia, serif" }}>
        {n}
      </text>
    </svg>
  );
}

export default function CaseStudyCard({ study, index }: { study: CaseStudyEntry; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  return (
    <li className="bg-paper">
      <Link href={`/case-study/${study.slug}`} className="group flex h-full flex-col p-6 sm:p-8">
        <div className="aspect-[8/5] overflow-hidden border border-rule transition-transform duration-500 group-hover:scale-[1.01]">
          <Cover study={study} n={n} />
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
          <span>{study.period}</span>
          <span aria-hidden="true">/</span>
          <span>{study.scope}</span>
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-[1] transition-colors group-hover:text-amber sm:text-5xl">{study.title}</h2>
        <p className="mt-4 max-w-xl text-dim">{study.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {study.tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
        <span className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.18em]">
          Read case <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </li>
  );
}
