import { profile } from "@/data/content";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-display text-text">{profile.name}</span> · {profile.title}
        </p>
        <ul className="flex flex-wrap gap-5">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-text">{s.label} ↗</a>
            </li>
          ))}
          <li><a href={`mailto:${profile.email}`} className="hover:text-text">Email</a></li>
        </ul>
        <p className="font-mono text-xs">© 2026 · Client ⇄ Server</p>
      </div>
    </footer>
  );
}
