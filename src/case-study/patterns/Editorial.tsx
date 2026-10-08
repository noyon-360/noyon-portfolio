// Small typographic pieces shared across scenes: meta line, pills, source tags, the next-question line.
import { references, type Meta, type RefId } from "../content";

export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-acc/60 px-3 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-acc ${className}`}>
      {children}
    </span>
  );
}

/** "Category pill / date / source" under every headline. */
export function MetaLine({ meta, className = "" }: { meta: Meta; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.14em] text-dim ${className}`}>
      <Pill>{meta.category}</Pill>
      <span aria-hidden="true">/</span>
      <span>{meta.date}</span>
      <span aria-hidden="true">/</span>
      <span>{meta.source}</span>
    </p>
  );
}

/** A visible status stamp for statements that are not confirmed ("To verify", "Unconfirmed"). */
export function Stamp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center border border-dashed border-amber px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber ${className}`}>
      {children}
    </span>
  );
}

/**
 * Links each source to its entry under References, and each evidence id to #ev-<id>.
 * Opinion scenes say so; others with no sources show nothing.
 */
export function SourceTags({ refs, evidence = [], opinion = false }: { refs: RefId[]; evidence?: string[]; opinion?: boolean }) {
  if (!refs.length && !evidence.length) {
    return opinion ? <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">Source: author&apos;s opinion</p> : <span />;
  }
  return (
    <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
      <span>Sources</span>
      {evidence.map((id) => (
        <a key={id} href={`#ev-${id}`} className="rounded border border-rule px-2 py-0.5 transition-colors hover:border-acc hover:text-ivory">
          Evidence {id.toUpperCase()}
        </a>
      ))}
      {refs.map((id) => (
        <a key={id} href={`#ref-${id}`} className="rounded border border-rule px-2 py-0.5 transition-colors hover:border-acc hover:text-ivory">
          {(() => {
            const r = references.find((x) => x.id === id);
            return r?.tag ?? r?.outlet;
          })()}
        </a>
      ))}
    </p>
  );
}

/** Pattern E — the one line that tees up the next question. */
export function NextLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-2xl italic text-ivory md:text-3xl">
      <span aria-hidden="true" className="mr-3 not-italic text-acc">
        →
      </span>
      {children}
    </p>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono text-xs uppercase tracking-[0.22em] text-dim ${className}`}>{children}</p>;
}
