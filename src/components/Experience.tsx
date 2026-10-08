import { education, experience } from "@/data/content";
import { Section } from "./Section";

export default function Experience() {
  return (
    <Section id="experience" index="05" eyebrow="Experience" title="Where the work happened.">
      <div className="grid gap-10 lg:grid-cols-3">
        <ol className="relative space-y-10 border-l border-line pl-6 sm:pl-8 lg:col-span-2">
          {experience.map((e, i) => (
            <li key={e.company} className="relative">
              <span
                className={`absolute -left-[29px] top-2 h-2.5 w-2.5 rounded-full sm:-left-[37px] ${i === 0 ? "bg-client" : "bg-muted"}`}
                aria-hidden="true"
              />
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {e.period} · {e.place}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{e.role}</h3>
              <p className="text-muted">{e.company}</p>
              <ul className="mt-4 space-y-2">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm sm:text-base">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-line-strong" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <aside className="h-fit rounded-2xl border border-line bg-panel p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Education</p>
          <h3 className="mt-3 font-display text-xl font-semibold">{education.degree}</h3>
          <p className="mt-1 text-muted">{education.school}</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
            {education.period} · {education.place}
          </p>
          <p className="mt-2 font-display text-2xl">{education.note}</p>
        </aside>
      </div>
    </Section>
  );
}
