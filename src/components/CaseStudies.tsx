import Link from "next/link";
import { Cover } from "@/case-study/patterns/CaseStudyCard";
import { caseStudies } from "@/case-study/registry";
import { Section, Tag } from "./Section";

const SHOWN = 3; // newest first, as ordered in the registry

export default function CaseStudies() {
  return (
    <Section
      id="case-studies"
      index="06"
      eyebrow="Case studies"
      title="Security incidents, investigated."
      intro="Scroll-driven, interactive write-ups of real breaches and attacks — what happened, why, and what it should teach the rest of us."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.slice(0, SHOWN).map((s, i) => (
          <Link
            key={s.slug}
            href={`/case-study/${s.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors hover:border-line-strong"
          >
            <div className="aspect-[8/5] overflow-hidden border-b border-line">
              <Cover study={s} n={String(i + 1).padStart(2, "0")} />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{s.period}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold transition-colors group-hover:text-client">{s.title}</h3>
              <p className="mt-3 text-muted">{s.summary}</p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <span className="mt-auto pt-6 font-mono text-xs uppercase tracking-widest text-text">
                Read case <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/case-study"
          className="rounded-full border border-line-strong px-6 py-2.5 text-sm transition-colors hover:bg-text hover:text-ink"
        >
          See more case studies →
        </Link>
      </div>
    </Section>
  );
}
