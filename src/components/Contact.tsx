"use client";

import { profile } from "@/data/content";
import { Section } from "./Section";

const needs = ["Flutter app", "NestJS backend", "Full-stack product", "Team lead / hiring", "Something else"];
const field =
  "w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-text placeholder:text-muted outline-none transition-colors focus:border-client";

export default function Contact() {
  // Opens the visitor's mail client with the brief filled in, so no message can get lost in transit.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `${data.get("need")} — ${data.get("name")}`;
    const body = `${data.get("message")}\n\n— ${data.get("name")}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <Section id="contact" index="10" eyebrow="Contact" title="Have an app to ship? Let's talk.">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <p className="text-muted md:text-lg">
            Tell me what you&apos;re building, your timeline and anything that already exists. I&apos;ll reply with questions and a plan.
          </p>
          <dl className="space-y-4">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">Email</dt>
              <dd><a href={`mailto:${profile.email}`} className="break-all font-display text-lg hover:text-client">{profile.email}</a></dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">Phone</dt>
              <dd><a href={`tel:${profile.phone}`} className="font-display text-lg hover:text-client">{profile.phone}</a></dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">Based in</dt>
              <dd className="font-display text-lg">{profile.location} · {profile.timezone}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">Your name</span>
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted">What do you need?</span>
              <select name="need" required defaultValue={needs[0]} className={field}>
                {needs.map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">About the project</span>
            <textarea name="message" required rows={6} className={field} />
          </label>
          <button className="w-full rounded-full bg-text py-3 font-medium text-ink transition-opacity hover:opacity-85">
            Write the email →
          </button>
          <p className="text-center text-xs text-muted">Opens your email app with this message ready to send.</p>
        </form>
      </div>
    </Section>
  );
}
