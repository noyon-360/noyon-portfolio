import { profile } from "@/data/content";

const links = [
  ["Expertise", "#expertise"],
  ["Work", "#work"],
  ["Craft", "#craft"],
  ["Experience", "#experience"],
  ["Skills", "#skills"],
  ["API", "#api"],
  ["Contact", "#contact"],
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-display font-semibold">
          <span className="flex h-6 w-6 overflow-hidden rounded" aria-hidden="true">
            <span className="w-1/2 bg-client" />
            <span className="w-1/2 bg-server" />
          </span>
          {profile.name}
        </a>
        <ul className="hidden gap-6 text-sm text-muted lg:flex">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="transition-colors hover:text-text">{label}</a>
            </li>
          ))}
        </ul>
        <a
          href={profile.cv}
          download
          className="rounded-full border border-line-strong px-4 py-1.5 text-sm transition-colors hover:bg-text hover:text-ink"
        >
          Résumé
        </a>
      </nav>
    </header>
  );
}
