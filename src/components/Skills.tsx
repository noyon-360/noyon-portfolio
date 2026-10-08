import { skills } from "@/data/content";
import { Section, Tag } from "./Section";

export default function Skills() {
  return (
    <Section id="skills" index="06" eyebrow="Toolkit" title="The full stack, client to cloud.">
      <dl className="divide-y divide-line border-y border-line">
        {skills.map((s) => (
          <div key={s.group} className="grid gap-3 py-5 md:grid-cols-4">
            <dt className="font-mono text-xs uppercase tracking-widest text-muted md:pt-1">{s.group}</dt>
            <dd className="flex flex-wrap gap-1.5 md:col-span-3">
              {s.items.map((t) => <Tag key={t}>{t}</Tag>)}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
