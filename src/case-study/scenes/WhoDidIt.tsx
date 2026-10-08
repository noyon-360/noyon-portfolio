import { c1Who } from "../content";

/** Sidebar: no attacker is confirmed — an empty silhouette, pointing back to the unverified claims. */
export default function WhoDidIt() {
  return (
    <aside id="who-did-it" data-case="c1" aria-labelledby="who-did-it-h" className="border-t border-rule px-4 py-24 sm:px-8 lg:pr-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <figure className="mx-auto w-full max-w-xs" role="img" aria-label="An empty, dashed silhouette labelled Unconfirmed.">
          <svg viewBox="0 0 200 240" className="w-full" fill="none" aria-hidden="true">
            <circle cx="100" cy="70" r="40" stroke="var(--color-dim)" strokeDasharray="5 6" />
            <path d="M30,230 C30,160 60,128 100,128 C140,128 170,160 170,230" stroke="var(--color-dim)" strokeDasharray="5 6" />
            <text x="100" y="78" textAnchor="middle" fontSize="28" fill="var(--color-acc)" style={{ fontFamily: "var(--font-cs-serif), Georgia, serif" }}>
              ?
            </text>
          </svg>
          <figcaption className="mt-4 text-center font-mono text-xs uppercase tracking-[0.22em] text-acc">{c1Who.silhouette}</figcaption>
        </figure>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">({c1Who.label})</p>
          <h2 id="who-did-it-h" className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
            {c1Who.title}
          </h2>
          <p className="mt-6 max-w-xl text-xl leading-snug">{c1Who.body}</p>
          <a href={c1Who.link.href} className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ivory hover:text-acc">
            <span aria-hidden="true">←</span> {c1Who.link.label}
          </a>
        </div>
      </div>
    </aside>
  );
}
