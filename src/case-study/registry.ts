// Every case study listed on /case-study. To add one: create src/app/case-study/<slug>/page.tsx,
// then add an entry here. Newest first is not enforced; the list renders in this order.

export type CaseStudyAccent = "amber" | "signal" | "ivory" | "green" | "ice" | "violet";

export type CaseStudyEntry = {
  /** URL segment: the page lives at /case-study/<slug>. Must match the folder name under src/app/case-study. */
  slug: string;
  title: string;
  summary: string;
  /** Shown on the card, e.g. "2025–26 · 2017". */
  period: string;
  /** Category pills. */
  tags: string[];
  /** One colour per incident covered; drives the card's cover. */
  accents: CaseStudyAccent[];
  /** Short labels drawn on the cover, one per accent. */
  coverLabels: string[];
  /** Reading time or scope, e.g. "19 questions". */
  scope: string;
};

export const caseStudies: CaseStudyEntry[] = [
  {
    slug: "academic-portal-disclosure",
    title: "Knowing where to stop",
    summary:
      "An academic portal appeared to leave student records, admin pages and plaintext passwords within reach of the open web. A first-person account of confirming the problems, stopping, and disclosing them responsibly.",
    period: "2026 · Identity withheld",
    tags: ["Responsible disclosure", "Access control", "Ethics"],
    accents: ["violet"],
    coverLabels: ["Disclosure"],
    scope: "10 questions · interactive 3D",
  },
  {
    slug: "npm-supply-chain-attack",
    title: "One install command, four servers",
    summary:
      "A poisoned npm package slipped into routine installs and spread a hidden remote-control program across four client servers at a small Dhaka software agency. A first-hand account, still under investigation.",
    period: "2026 · Dhaka",
    tags: ["Supply chain", "npm", "Incident response"],
    accents: ["signal", "amber", "green"],
    coverLabels: ["Attack", "Response", "Fix"],
    scope: "18 questions · interactive 3D",
  },
  {
    slug: "mongodb-ransomware-attack",
    title: "Nineteen months with the door open",
    summary:
      "A production MongoDB database sat on the open internet with authentication switched off. Scanners found it, planted a backdoor account, then wiped every collection and left a ransom note. There was no backup.",
    period: "2025–26 · UK business",
    tags: ["Ransomware", "Misconfiguration", "Incident response"],
    accents: ["ice"],
    coverLabels: ["MongoDB"],
    scope: "10 questions · interactive 3D",
  },
  {
    slug: "shwapno-data-breach",
    title: "The Shwapno data breach",
    summary:
      "Attackers took a Bangladeshi supermarket chain's customer database and demanded a ransom. The company refused, and told no one. Seven months later the data was public.",
    period: "2025–26 · Bangladesh",
    tags: ["Data breach", "Incident response"],
    accents: ["amber"],
    coverLabels: ["Shwapno"],
    scope: "10 questions · interactive 3D",
  },
  {
    slug: "wannacry-eternalblue",
    title: "WannaCry and EternalBlue",
    summary:
      "A leaked exploit turned ransomware into a worm that locked 200,000+ computers in 150 countries — two months after the fix was released.",
    period: "2017 · Worldwide",
    tags: ["Ransomware", "Patching"],
    accents: ["signal"],
    coverLabels: ["WannaCry"],
    scope: "9 questions · interactive 3D",
  },
];

export const caseStudyIndex = {
  eyebrow: "Investigations",
  title: "Case studies",
  intro: "Scroll-driven investigations of real security incidents, written for readers who aren't security specialists.",
};
