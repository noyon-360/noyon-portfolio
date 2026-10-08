import { faqs } from "@/data/content";
import { Section } from "./Section";

export default function Faq() {
  return (
    <Section id="faq" index="09" eyebrow="FAQ" title="Before you ask.">
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg">
              {f.q}
              <span className="text-2xl leading-none text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mt-3 max-w-3xl text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
