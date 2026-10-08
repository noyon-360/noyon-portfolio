import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyCard from "@/case-study/patterns/CaseStudyCard";
import { caseStudies, caseStudyIndex } from "@/case-study/registry";

export const metadata: Metadata = {
  title: "Case studies — Nazibullah Noyon",
  description: caseStudyIndex.intro,
};

export default function CaseStudiesPage() {
  return (
    <>
      <header className="border-b border-rule">
        <nav aria-label="Case studies" className="flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim transition-colors hover:text-ivory">
            ← Portfolio
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            {String(caseStudies.length).padStart(2, "0")} {caseStudies.length === 1 ? "study" : "studies"}
          </span>
        </nav>
      </header>
      <main className="px-4 pb-24 pt-16 sm:px-8 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">({caseStudyIndex.eyebrow})</p>
          <h1 className="mt-6 font-serif text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] tracking-[-0.02em]">{caseStudyIndex.title}</h1>
          <p className="mt-8 max-w-xl text-lg text-dim">{caseStudyIndex.intro}</p>

          <ul className="mt-16 grid gap-px border border-rule bg-rule md:grid-cols-2">
            {caseStudies.map((s, i) => (
              <CaseStudyCard key={s.slug} study={s} index={i} />
            ))}
            {/* Keeps the 1px rule background from showing through an empty last cell. */}
            {caseStudies.length % 2 === 1 && <li aria-hidden="true" className="hidden bg-paper md:block" />}
          </ul>
        </div>
      </main>
    </>
  );
}
