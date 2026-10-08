// Every word on /case-study lives here. Facts come only from the assignment brief; anything the
// brief did not supply is a visible "TODO:" string so it can't slip through as an invented fact.

export type CaseId = "c1" | "c2";

/** Reference ids — source tags on the page link to #ref-<id>. */
export type RefId =
  | "tbs"
  | "dailystar"
  | "fe"
  | "unb"
  | "jago"
  | "dhakatribune"
  | "ann"
  | "nao"
  | "ms"
  | "voa"
  | "malwaretech"
  | "doj"
  | "fbi"
  | "qilinlisting"
  | "cybelangel"
  | "s2w"
  | "dexposelockbit"
  | "dexposeqilin"
  | "arete";

export type Step = {
  /** Short label for the step index (pattern B) and the steps' mono kicker. */
  kicker: string;
  /** Max 40 words. */
  body: string;
};

export type Meta = { category: string; date: string; source: string };

export type QuestionScene = {
  /** Two-digit number shown in the rail, headline and index. */
  n: string;
  id: string;
  caseId: CaseId;
  /** Section label, rendered in parentheses. */
  label: string;
  question: string;
  meta: Meta;
  steps: Step[];
  /** Plain-language description of the visual, used as alt text on both the 3D and SVG versions. */
  alt: string;
  refs: RefId[];
  /** One line that tees up the next question (pattern E). */
  next: string;
};

export type Stat = { value: number; prefix?: string; suffix?: string; label: string; note?: string };

export type Card = { title: string; body: string; pill?: string };

// ── Front pages (one per study) ─────────────────────────────────────────────

export type Front = {
  caseId: CaseId;
  kicker: string;
  masthead: string;
  edition: string;
  dateline: string;
  headline: string;
  deck: string;
  read: string;
  globeAlt: string;
};

export const shwapnoFront: Front = {
  caseId: "c1",
  kicker: "Cybersecurity Incident Case Study",
  masthead: "Shwapno Data Breach",
  edition: "Interactive edition",
  dateline: "Special report · Bangladesh · 2025–26 · Ten questions",
  headline: "The supermarket that stayed silent",
  deck: "Attackers took Shwapno's customer database and demanded a ransom. The company refused, and told no one. Seven months later the data was public.",
  read: "#case-01",
  globeAlt: "A slowly turning wireframe globe behind the masthead.",
};

export const wannacryFront: Front = {
  caseId: "c2",
  kicker: "Cybersecurity Incident Case Study",
  masthead: "WannaCry & EternalBlue",
  edition: "Interactive edition",
  dateline: "Special report · Worldwide · 2017 · Nine questions",
  headline: "The worm that a two-month-old patch could have stopped",
  deck: "WannaCry used a leaked exploit called EternalBlue to lock 200,000+ computers in 150 countries, from English hospitals to car plants.",
  read: "#case-02",
  globeAlt: "A slowly turning wireframe globe behind the masthead.",
};

// ── Case 01 — Shwapno ───────────────────────────────────────────────────────

export const case1 = {
  id: "case-01",
  eyebrow: "Special report — Bangladesh",
  title: "Shwapno data breach",
  year: "2025",
  spellingNote:
    "A note on spelling: the assignment brief writes “Shapno”; the company spells its name “Shwapno”, which is used throughout.",
  hook: "You bought rice, eggs and medicine. Seven months later, a stranger could type your phone number and read the receipt.",
};

export const c1Scenes: QuestionScene[] = [
  {
    n: "01",
    id: "q01",
    caseId: "c1",
    label: "The breach",
    question: "What happened in this incident?",
    meta: { category: "Data breach", date: "Aug 2025 – Mar 2026", source: "Bangladeshi press" },
    steps: [
      {
        kicker: "Aug 2025",
        body: "Attackers get into Shwapno's customer database. They email a ransom demand: $1.5 million (over Tk 18 crore), with a deadline of December 2025.",
      },
      {
        kicker: "The refusal",
        body: "Shwapno refuses to pay. It says its systems are secured. It tells no customers that their data was taken.",
      },
      {
        kicker: "Late Mar 2026",
        body: "The data is published. Names, phone numbers and purchase records spread on Facebook, and a website appears where anyone can look people up by phone number.",
      },
      {
        kicker: "28–30 Mar 2026",
        body: "On 28–29 March the company confirms the breach. On 30 March a legal notice is sent to its parent company, ACI.",
      },
      {
        kicker: "A caveat",
        body: "Reports differ on one date: one report places the takeover of the systems in December 2025 rather than August.",
      },
    ],
    alt: "A calendar flips page by page from August 2025 to March 2026 while a counter tallies the months of silence: seven.",
    refs: ["tbs", "dailystar", "fe", "unb"],
    next: "So whose database was it?",
  },
  {
    n: "02",
    id: "q02",
    caseId: "c1",
    label: "The target",
    question: "Which organization was affected?",
    meta: { category: "Retail", date: "2025", source: "Company figures via press" },
    steps: [
      {
        kicker: "The company",
        body: "Shwapno, Bangladesh's largest supermarket chain. It belongs to ACI Limited, a large listed company.",
      },
      {
        kicker: "The reach",
        body: "812 outlets across 63 districts, and more than 40 lakh (4 million) registered customers in its loyalty database.",
      },
    ],
    alt: "A stylised map of Bangladesh, raised in 3D, with small dots lighting up across it. The dots are illustrative, not real outlet locations.",
    refs: ["dailystar", "dhakatribune"],
    next: "What exactly was inside that database?",
  },
  {
    n: "03",
    id: "q03",
    caseId: "c1",
    label: "The data",
    question: "What types of information were exposed or stolen?",
    meta: { category: "Personal data", date: "Mar 2026", source: "Press reports" },
    steps: [
      { kicker: "Names", body: "Customers' full names, as registered with the loyalty programme." },
      { kicker: "Mobile numbers", body: "The phone numbers customers gave at the till. In Bangladesh a number is often also a mobile-wallet account." },
      {
        kicker: "Purchase histories",
        body: "What each person bought, and when. A shopping list can reveal health, income and daily habits.",
      },
      {
        kicker: "Company claim",
        body: "Shwapno says no financial data was taken. That is the company's claim; it has not been independently confirmed in the sources used here.",
      },
    ],
    alt: "A shop receipt unrolls; each printed line turns into a data tag reading name, mobile number and purchase history.",
    refs: ["tbs", "jago"],
    next: "Whose names, and who else got hurt?",
  },
  {
    n: "04",
    id: "q04",
    caseId: "c1",
    label: "The people",
    question: "Who were affected by this incident?",
    meta: { category: "Impact", date: "2025–26", source: "Press reports" },
    steps: [
      { kicker: "Customers", body: "Registered shoppers whose details were published without warning." },
      { kicker: "The company", body: "Shwapno and its parent, ACI, facing legal notices, costs and lost trust." },
      { kicker: "Frontline staff", body: "Cashiers and store staff who had not been told, and faced worried customers without answers." },
      {
        kicker: "Banks and wallets",
        body: "Indirectly, banks and mobile-wallet providers, whose customers became easier targets for fraud.",
      },
    ],
    alt: "Four groups of silhouettes — customers, the company, staff, banks and wallets — with a ripple passing from one to the next.",
    refs: ["dailystar", "ann"],
    next: "What can actually go wrong for a customer?",
  },
  {
    n: "05",
    id: "q05",
    caseId: "c1",
    label: "The risk",
    question: "What problems could customers face?",
    meta: { category: "Consumer risk", date: "2026 onward", source: "Analysis" },
    steps: [
      {
        kicker: "The call",
        body: "A caller who knows your name and your last purchase sounds like the shop, or your bank. That is what makes a scam believable.",
      },
      {
        kicker: "The ask",
        body: "The caller asks for a one-time password (OTP). With it, they can take over a mobile-wallet account in minutes.",
      },
    ],
    alt: "A phone rings. On screen, a scammer's script fills in with the customer's name and their last purchase.",
    refs: ["dailystar", "ann"],
    next: "And what does all this cost the company?",
  },
  {
    n: "06",
    id: "q06",
    caseId: "c1",
    label: "The fallout",
    question: "How might it affect reputation and business?",
    meta: { category: "Business", date: "2026", source: "Analysis" },
    steps: [
      {
        kicker: "Trust",
        body: "Trust is lost mainly through the seven months of silence, not only through the hack itself.",
      },
      {
        kicker: "Law and costs",
        body: "Legal exposure, starting with the 30 March notice; plus the costs of investigation and new security.",
      },
      {
        kicker: "Customers",
        body: "Shoppers refuse to sign up for loyalty cards, and some switch to rival shops.",
      },
      {
        kicker: "The parent",
        body: "Pressure lands on ACI, a listed company, where investors watch how the crisis is handled.",
      },
    ],
    alt: "A trust gauge drains from full towards empty while newspaper-style headline cards stack up beside it.",
    refs: ["fe", "dhakatribune"],
    next: "So what did Shwapno actually do?",
  },
  {
    n: "07",
    id: "q07",
    caseId: "c1",
    label: "The response",
    question: "What actions did the company take?",
    meta: { category: "Incident response", date: "2025–26", source: "Company statements via press" },
    steps: [
      { kicker: "Ransom", body: "Refused to pay the $1.5 million ransom." },
      {
        kicker: "Audit and defences",
        body: "Ran an internal audit under ACI's MIS division. Added new firewalls, server protection and 24/7 monitoring.",
      },
      {
        kicker: "Experts and police",
        body: "Brought in local and international forensic experts, worked with the police CTTC unit, and moved to file a case.",
      },
      {
        kicker: "Advisory",
        body: "Published a public advisory: “we never ask for passwords or OTPs.”",
      },
      {
        kicker: "Not done",
        body: "What it did not do: tell customers early. Notification came only after the data was already public.",
      },
    ],
    alt: "A checklist fills with green ticks, then a red stamp reading “too late” lands across the line about notifying customers.",
    refs: ["tbs", "unb", "jago"],
    next: "What should every other company take from this?",
  },
  {
    n: "08",
    id: "q08",
    caseId: "c1",
    label: "The takeaways",
    question: "What lessons can other organizations learn?",
    meta: { category: "Lessons", date: "—", source: "Analysis" },
    steps: [
      { kicker: "Control ≠ recovery", body: "Regaining control of your systems does not undo the theft. The data is already gone." },
      { kicker: "Notify early", body: "Tell affected people early, so they can protect themselves before criminals use their data." },
      {
        kicker: "Have a plan",
        body: "Refusing a ransom is a decision, not a response plan. Rehearse what happens next before it happens.",
      },
      {
        kicker: "Collect less",
        body: "Retail data is sensitive data. Collect less of it, and you have less to lose.",
      },
    ],
    alt: "Four numbered lessons set as large typography.",
    refs: ["dailystar"],
    next: "So, in practice, how should customer data be protected?",
  },
  {
    n: "09",
    id: "q09",
    caseId: "c1",
    label: "The defence",
    question: "In your opinion, how should organizations protect customer information?",
    meta: { category: "Opinion", date: "—", source: "Author" },
    steps: [
      {
        kicker: "Hold less, lock it",
        body: "Data minimisation: keep only what you need. Encrypt what you keep. Give staff least-privilege access, protected by multi-factor authentication (MFA).",
      },
      {
        kicker: "Find holes first",
        body: "Patch regularly and run penetration tests. Set alerts on bulk exports, so a whole database leaving at once is noticed.",
      },
      {
        kicker: "People and partners",
        body: "Control what vendors can reach. Train staff to spot phishing and social engineering.",
      },
      {
        kicker: "When it happens",
        body: "Have an incident response and notification plan, and be honest with customers.",
      },
    ],
    alt: "A shield assembles from nine labelled layers: minimisation, encryption, least privilege and MFA, patching and pen tests, bulk-export alerts, vendor control, training, response plan, honesty.",
    refs: [],
    next: "Which brings us to the one lesson that sums it up.",
  },
];

export const c1Problems: Card[] = [
  { pill: "Fraud", title: "Targeted phishing and OTP calls", body: "Scammers use your name and purchases to sound genuine and ask for one-time passwords." },
  { pill: "Fraud", title: "Mobile-wallet takeover", body: "Your phone number is often your wallet. An OTP handed over can empty it." },
  { pill: "Privacy", title: "Loss of privacy", body: "Shopping reveals health, income and habits — medicine, baby food, how much you spend." },
  { pill: "Nuisance", title: "Spam", body: "Marketing and junk calls and messages, from anyone who bought the list." },
  { pill: "Safety", title: "Harassment", body: "Anyone who knows your number can find your name and contact you." },
  { pill: "Forever", title: "Permanent exposure", body: "Leaked data cannot be recalled. Copies stay online for years." },
];

export const c1Stats: Stat[] = [
  { value: 812, label: "outlets" },
  { value: 63, label: "districts" },
  { value: 40, suffix: " lakh+", label: "registered customers", note: "over 4 million" },
];

export const c1Shield = [
  "Data minimisation",
  "Encryption",
  "Least privilege + MFA",
  "Patching + pen tests",
  "Bulk-export alerts",
  "Vendor control",
  "Staff training",
  "Response + notification plan",
  "Honesty with customers",
];

export const c1Checklist = [
  { done: true, text: "Refused the ransom" },
  { done: true, text: "Internal audit (ACI MIS division)" },
  { done: true, text: "Firewalls, server protection, 24/7 monitoring" },
  { done: true, text: "Local and international forensic experts" },
  { done: true, text: "Police CTTC unit; case filed" },
  { done: true, text: "Public advisory on passwords and OTPs" },
  { done: false, text: "Notify customers early" },
];

// Attribution feature, placed between questions 07 and 08. Two groups have claimed the attack; every
// mention is phrased as a claim — "claimed by Qilin and LockBit 5.0 (unverified)" — and neither is
// presented as the one that "really" did it.
export type GroupProfile = {
  name: string;
  icon: "hex" | "grid";
  alt: string;
  facts: [string, string][];
  refs: RefId[];
};

export const c1Claim = {
  id: "claimed-by",
  label: "The claims",
  title: "Who was behind the attack?",
  meta: { category: "Attribution", date: "Dec 2025 – Mar 2026", source: "Leak-site trackers" },
  stamp: "CLAIMED – UNVERIFIED",
  claims: {
    kicker: "The claims",
    body: [
      "Two ransomware groups have claimed the attack. LockBit 5.0 listed Shwapno on its leak site on 26 December 2025.",
      "Qilin also listed Shwapno. Trackers recorded it on 17 March 2026, with a post date of 25 December 2025.",
      "Both dates fall at the December ransom deadline Shwapno described.",
    ],
    caveat:
      "These are the groups' own claims. Shwapno, the police and the news reports reviewed have not confirmed either. Throughout this report the attack is described as claimed by Qilin and LockBit 5.0 (unverified).",
    refs: ["dexposelockbit", "dexposeqilin", "qilinlisting"] as RefId[],
  },
  profiles: [
    {
      name: "Qilin",
      icon: "hex",
      alt: "An abstract hexagonal icon standing in for the Qilin ransomware group, stamped Claimed – unverified.",
      facts: [
        ["Also known as", "Agenda"],
        ["First detected", "June 2022"],
        ["Model", "Ransomware-as-a-service: the core group builds the tools, and affiliates carry out attacks for a share of the ransom."],
        ["Linked to", "Russian-speaking criminals, despite the Chinese name."],
        ["Tactic", "Double extortion: steal the data, then threaten to publish it."],
        ["Scale", "Most active ransomware group in the world by victim count in 2025 and the first half of 2026."],
      ],
      refs: ["cybelangel"],
    },
    {
      name: "LockBit 5.0",
      icon: "grid",
      alt: "An abstract grid icon standing in for the LockBit 5.0 ransomware group, stamped Claimed – unverified.",
      facts: [
        ["Also known as", "LockBit; started in 2019 under the name ABCD"],
        ["Version 5.0 released", "September 2025"],
        ["Model", "Ransomware-as-a-service; affiliates carry out the attacks."],
        ["Background", "Police disrupted the group in February 2024 (Operation Cronos); 5.0 is its comeback."],
        ["Targets", "Windows, Linux and VMware ESXi systems."],
        ["Tactic", "Double extortion, with a countdown before data is published."],
      ],
      refs: ["arete", "s2w"],
    },
  ] as GroupProfile[],
  twoGroups: {
    kicker: "Why two groups?",
    label: "Open question",
    body: [
      "In September 2025 DragonForce announced a coalition with Qilin and LockBit.",
      "Both groups work through affiliates, so the same attacker could have posted to both. This is not confirmed.",
    ],
    refs: ["s2w"] as RefId[],
  },
  pattern: {
    kicker: "The pattern",
    intro: "The Shwapno case fits the double-extortion pattern, claimed by Qilin and LockBit 5.0 (unverified):",
    alt: "A three-step diagram: steal data, then demand a ransom, then publish if unpaid — with the matching Shwapno events under each step.",
    steps: [
      { title: "Steal data", shwapno: "Customer database taken (Aug 2025)" },
      { title: "Demand ransom", shwapno: "$1.5 million demanded; Shwapno refuses" },
      { title: "Publish if unpaid", shwapno: "Data spreads online (late Mar 2026)" },
    ],
  },
  why: {
    kicker: "Why it matters",
    body: "If either claim is true, the attacker was likely an affiliate of a global criminal service, not someone targeting Shwapno specifically. Any company holding customer data is a possible target.",
  },
  next: "So what should other organizations learn?",
};

export const c1Who = {
  label: "Sidebar",
  title: "Who did it?",
  body: "The attackers have not been publicly identified. No group has been named in the sources used for this report, and none is suggested here.",
  silhouette: "Unknown",
};

export const c1Lesson = {
  n: "10",
  id: "q10",
  label: "The lesson",
  question: "The lesson learned",
  quote: "How a company responds matters as much as the attack itself.",
};

// ── Marquee ─────────────────────────────────────────────────────────────────

export const marqueeC2 = ["Telefonica", "NHS", "Renault", "Nissan", "FedEx", "Deutsche Bahn", "MegaFon", "PetroChina", "12 May 2017", "150 countries"];
export const marqueeC1 = ["Shwapno", "ACI", "812 outlets", "63 districts", "Aug 2025", "Mar 2026", "$1.5 million", "40 lakh+ customers"];

// ── Case 02 — EternalBlue / WannaCry ────────────────────────────────────────

export const case2 = {
  id: "case-02",
  eyebrow: "Special report — Worldwide",
  title: "EternalBlue and the WannaCry attack",
  year: "2017",
  hook: "Friday, 12 May 2017. In an English hospital, every screen in the building turns red.",
};

export const definitions = {
  wannacry: {
    term: "WannaCry",
    say: "wan·na·cry  /ˈwɒn.ə.kraɪ/",
    pos: "noun · malware",
    meaning:
      "Ransomware with a worm built in: it locks your files, demands about $300 in Bitcoin (rising to $600), and copies itself to other computers with no click needed.",
    synonyms: ["ransomworm", "crypto-worm"],
  },
  eternalblue: {
    term: "EternalBlue",
    say: "e·ter·nal·blue  /ɪˈtɜː.nəl bluː/",
    pos: "noun · exploit",
    meaning:
      "A break-in tool for a flaw (CVE-2017-0144) in the way older Windows computers share files (SMBv1, network port 445).",
    synonyms: ["SMBv1 exploit", "the MS17-010 flaw"],
  },
};

export const c2Scenes: QuestionScene[] = [
  {
    n: "01",
    id: "q11",
    caseId: "c2",
    label: "The malware",
    question: "What is WannaCry?",
    meta: { category: "Ransomware", date: "12 May 2017", source: "Europol / press" },
    steps: [
      { kicker: "Ransomware", body: "It encrypts your files — scrambles them so only the attacker's key can unlock them." },
      { kicker: "The demand", body: "A red window demands about $300 in Bitcoin, rising to $600 if you wait." },
      {
        kicker: "The worm",
        body: "Then it spreads by itself to other computers on the network. Nobody has to click anything.",
      },
    ],
    alt: "A recreation of the WannaCry ransom window: red frame, countdown timers and a payment demand. The Bitcoin address is redacted.",
    refs: ["voa"],
    next: "How could it spread without a click?",
  },
  {
    n: "02",
    id: "q12",
    caseId: "c2",
    label: "The exploit",
    question: "What is EternalBlue?",
    meta: { category: "Exploit", date: "Mar–Apr 2017", source: "Microsoft / press" },
    steps: [
      {
        kicker: "The analogy",
        body: "Picture a parcel bigger than its label says. The warehouse reserves a small shelf, the parcel spills onto the next one, and whatever is written there gets overwritten.",
      },
      {
        kicker: "In Windows",
        body: "A size miscalculation in SMBv1 does the same inside the system's core (the kernel): a buffer overflow that lets a stranger run their own code remotely.",
      },
      {
        kicker: "Who made it",
        body: "It was reportedly built by the US National Security Agency (NSA), then leaked by a group called the Shadow Brokers on 14 April 2017.",
      },
      {
        kicker: "The fix",
        body: "Microsoft had already shipped the fix, MS17-010, on 14 March 2017 — a month before the leak and two months before the attack.",
      },
    ],
    alt: "Two glass boxes side by side. Blocks pour into the first, overflow its rim and spill into its neighbour.",
    refs: ["ms", "voa"],
    next: "Once inside one computer, how did it reach 150 countries?",
  },
  {
    n: "03",
    id: "q13",
    caseId: "c2",
    label: "The spread",
    question: "How did WannaCry spread around the world?",
    meta: { category: "Worm", date: "12 May 2017, from 07:44 UTC", source: "Europol / MalwareTech" },
    steps: [
      { kicker: "Scan", body: "An infected computer scans the internet and its own network for machines with port 445 open." },
      { kicker: "Break in", body: "It uses EternalBlue to get into any unpatched machine it finds." },
      { kicker: "Backdoor", body: "A backdoor called DoublePulsar loads the ransomware onto the new victim." },
      {
        kicker: "Repeat",
        body: "Files are encrypted, and the new victim starts scanning too. It began about 07:44 UTC; within a day it had reached 150 countries.",
      },
    ],
    alt: "A globe with red arcs jumping from node to node. A UTC clock and a country counter advance as you scroll.",
    refs: ["voa", "malwaretech"],
    next: "Where did it hit hardest?",
  },
  {
    n: "04",
    id: "q14",
    caseId: "c2",
    label: "The map",
    question: "Which countries or organizations were significantly affected?",
    meta: { category: "Victims", date: "May 2017", source: "Press / NAO" },
    steps: [
      { kicker: "Europe", body: "The UK's NHS. Telefonica in Spain. Deutsche Bahn in Germany. Car makers Renault and Nissan." },
      { kicker: "Americas and Asia", body: "FedEx. Chinese universities and PetroChina petrol stations. Police in India." },
      {
        kicker: "Russia",
        body: "Russia's Interior Ministry and the mobile operator MegaFon. Most infection attempts were seen in Russia, Ukraine and Taiwan.",
      },
    ],
    alt: "A globe with pins on the places named in the text — the NHS, Telefonica, Renault and Nissan, Deutsche Bahn, FedEx, China, India, Russia, Ukraine and Taiwan — each with a short text card. Pin positions are approximate.",
    refs: ["nao", "voa"],
    next: "What did it all add up to?",
  },
  {
    n: "05",
    id: "q15",
    caseId: "c2",
    label: "The bill",
    question: "What were the major consequences?",
    meta: { category: "Impact", date: "2017", source: "NAO / Europol" },
    steps: [
      {
        kicker: "Scale",
        body: "More than 200,000 computers in 150 countries. Damage worldwide is estimated in the billions of dollars.",
      },
      {
        kicker: "The irony",
        body: "The attackers collected only about $140,000. The NHS alone counted about £92 million in costs.",
      },
    ],
    alt: "A tiny pile of coins labelled $140,000 beside a towering bar labelled billions in damage. Not to scale.",
    refs: ["nao", "voa"],
    next: "What did that look like on the ground?",
  },
  {
    n: "06",
    id: "q16",
    caseId: "c2",
    label: "The ground",
    question: "How did it affect businesses and public services?",
    meta: { category: "Public services", date: "12–19 May 2017", source: "UK National Audit Office" },
    steps: [
      {
        kicker: "Hospitals",
        body: "In the NHS, 80 of 236 trusts were affected, plus 595 GP practices. About 19,000 appointments were cancelled.",
      },
      {
        kicker: "Emergencies",
        body: "Five hospitals diverted ambulances. Staff went back to pen and paper.",
      },
      {
        kicker: "Industry",
        body: "Car plants halted production. Railway station boards in Germany showed the ransom note.",
      },
    ],
    alt: "A low-poly hospital corridor. One by one, the screens along the wall flip to red.",
    refs: ["nao"],
    next: "So what finally stopped it?",
  },
  {
    n: "07",
    id: "q17",
    caseId: "c2",
    label: "The stop",
    question: "What actions stopped or reduced the spread?",
    meta: { category: "Response", date: "12 May 2017, 15:03 UTC onward", source: "MalwareTech / Microsoft" },
    steps: [
      {
        kicker: "Kill switch",
        body: "Researcher Marcus Hutchins registers a web domain the malware checked before running. Once it exists, new infections stop. 15:03 UTC, 12 May.",
      },
      {
        kicker: "Emergency patch",
        body: "Microsoft releases emergency patches even for systems it no longer supported: Windows XP, Windows 8, Server 2003.",
      },
      { kicker: "Mass patching", body: "Organisations rush to install MS17-010 everywhere." },
      {
        kicker: "Close the door",
        body: "SMBv1 is disabled and port 445 blocked. Antivirus gets new signatures. Victims restore files from backups.",
      },
    ],
    alt: "A switch is thrown, and the red arcs on the globe fade out one by one.",
    refs: ["malwaretech", "ms"],
    next: "What should the rest of us do differently?",
  },
];

export const c2Stats: Stat[] = [
  { value: 200000, suffix: "+", label: "computers" },
  { value: 150, label: "countries" },
  { value: 92, prefix: "£", suffix: "m", label: "cost to the NHS", note: "about" },
  { value: 140000, prefix: "$", label: "collected by the attackers", note: "about" },
];

export const c2Pins = [
  { name: "NHS", place: "United Kingdom", lat: 52.5, lon: -1.5 },
  { name: "Telefonica", place: "Spain", lat: 40.4, lon: -3.7 },
  { name: "Renault and Nissan", place: "Car plants", lat: 48.8, lon: 2.3 },
  { name: "Deutsche Bahn", place: "Germany", lat: 51, lon: 10 },
  { name: "FedEx", place: "Parcel delivery", lat: 35.1, lon: -90 },
  { name: "Universities, PetroChina", place: "China", lat: 35, lon: 104 },
  { name: "Police", place: "India", lat: 21, lon: 78 },
  { name: "Interior Ministry, MegaFon", place: "Russia", lat: 55.7, lon: 37.6 },
  { name: "Most attempts", place: "Ukraine", lat: 49, lon: 31 },
  { name: "Most attempts", place: "Taiwan", lat: 23.7, lon: 121 },
];

export const c2Lessons = {
  label: "The lessons",
  title: "Lessons for individuals and organizations",
  individuals: [
    "Turn on automatic updates.",
    "Move off systems that no longer get updates.",
    "Keep offline backups.",
    "Do not count on paying: payment does not guarantee your files back.",
  ],
  organizations: [
    "Set deadlines for applying patches.",
    "Keep an inventory of every device and system.",
    "Segment the network so one infection cannot reach everything.",
    "Disable SMBv1.",
    "Keep backups, and test restoring them.",
    "Rehearse the incident response plan.",
    "Treat security as a management duty, not just an IT task.",
  ],
};

export const q18: QuestionScene = {
  n: "08",
  id: "q18",
  caseId: "c2",
  label: "The update",
  question: "Why is it important to keep computer systems updated?",
  meta: { category: "Patching", date: "14 Mar – 12 May 2017", source: "Microsoft MS17-010" },
  steps: [
    {
      kicker: "Two months",
      body: "The fix existed two months before the attack. Microsoft shipped MS17-010 on 14 March; WannaCry arrived on 12 May.",
    },
    {
      kicker: "Every victim",
      body: "Every victim was unpatched, or running a system too old to receive the patch. An update is a lock someone already made for you.",
    },
  ],
  alt: "Two identical computers. A red wave passes over both; the patched one stays clear, the unpatched one turns red.",
  refs: ["ms"],
  next: "Which leaves one lesson.",
};

export const c2Lesson = {
  n: "09",
  id: "q19",
  label: "The lesson",
  question: "The lesson learned",
  quote: "WannaCry was preventable. Basic hygiene beats a global worm.",
};

// ── People ──────────────────────────────────────────────────────────────────

export const people = {
  label: "The people behind it",
  title: "Who's who",
  cards: [
    {
      name: "The Shadow Brokers",
      role: "Leakers",
      body: "An anonymous group that appeared in August 2016 and leaked NSA hacking tools, including EternalBlue. Its identity has never been established.",
    },
    {
      name: "Equation Group",
      role: "Builders",
      body: "Researchers' name for the NSA-linked team believed to have built EternalBlue.",
    },
    {
      name: "Lazarus Group",
      role: "Attackers",
      body: "Linked to North Korea's Reconnaissance General Bureau. The US and UK blamed it for WannaCry in December 2017.",
    },
    {
      name: "Park Jin Hyok",
      role: "Charged",
      body: "A North Korean programmer charged by the US Justice Department in 2018 over WannaCry, the Sony hack and the Bangladesh Bank heist.",
      link: { label: "FBI wanted notice (external)", href: "https://www.fbi.gov/wanted/cyber/park-jin-hyok" },
    },
    {
      name: "Marcus Hutchins",
      role: "Stopper",
      body: "The researcher who registered the kill-switch domain and stopped the outbreak.",
    },
  ],
};

// ── Other attacks ───────────────────────────────────────────────────────────

export const otherAttacks = {
  label: "Other attacks",
  title: "The same names, again and again",
  items: [
    { date: "2014", title: "Sony Pictures hack", pill: "Lazarus", body: "A hack of the film studio, attributed to Lazarus." },
    {
      date: "Feb 2016",
      title: "Bangladesh Bank heist",
      pill: "Lazarus",
      body: "$81 million stolen through the SWIFT banking network; nearly $1 billion was attempted.",
      featured: true,
    },
    { date: "May 2017", title: "WannaCry", pill: "Lazarus", body: "The ransomworm in this report." },
    {
      date: "Jun 2017",
      title: "NotPetya",
      pill: "Russian military intelligence",
      body: "Reused EternalBlue; about $10 billion in damage. Attributed to Russian military intelligence, not Lazarus.",
    },
    { date: "2022", title: "Ronin bridge theft", pill: "Lazarus", body: "About $620 million in cryptocurrency stolen." },
    { date: "2025", title: "Bybit theft", pill: "Lazarus (attributed)", body: "About $1.5 billion in cryptocurrency stolen." },
  ],
};

// ── Closings (one per study) ────────────────────────────────────────────────

export type Closing = {
  caseId: CaseId;
  label: string;
  title: string;
  head: string;
  body: string;
  todayTitle: string;
  today: string[];
  quote: string;
};

export const shwapnoClosing: Closing = {
  caseId: "c1",
  label: "Closing",
  title: "Where it went wrong",
  head: "Shwapno failed at telling people.",
  body: "It secured its systems but kept customers in the dark for seven months, until the data surfaced on its own.",
  todayTitle: "What you can do today",
  today: [
    "Never share an OTP or password with a caller — no real shop or bank asks.",
    "Turn on two-step verification for your mobile wallet and email.",
    "Give shops only the details they truly need.",
  ],
  quote: "Tell the people you serve.",
};

export const wannacryClosing: Closing = {
  caseId: "c2",
  label: "Closing",
  title: "Where it went wrong",
  head: "WannaCry's victims failed at patching.",
  body: "The fix for EternalBlue was public two months before WannaCry. Every victim was unpatched or unpatchable.",
  todayTitle: "What you can do today",
  today: ["Turn on automatic updates on your phone and computer.", "Back up your important files somewhere offline."],
  quote: "Patch what you run.",
};

// ── References ──────────────────────────────────────────────────────────────

// Exact article URLs were not supplied with the brief. Where one is unknown, the outlet's home
// page is linked and the entry carries a TODO so it is replaced before submission.
// `tag` is the short label on in-page source tags, for outlets cited more than once.
export const references: { id: RefId; outlet: string; title: string; href: string; todo?: boolean; tag?: string }[] = [
  { id: "tbs", outlet: "The Business Standard", title: "Coverage of the Shwapno data breach", href: "https://www.tbsnews.net/", todo: true },
  { id: "dailystar", outlet: "The Daily Star", title: "Coverage of the Shwapno data breach", href: "https://www.thedailystar.net/", todo: true },
  { id: "fe", outlet: "The Financial Express", title: "Coverage of the Shwapno data breach", href: "https://thefinancialexpress.com.bd/", todo: true },
  { id: "unb", outlet: "UNB", title: "Coverage of the Shwapno data breach", href: "https://unb.com.bd/", todo: true },
  { id: "jago", outlet: "Jago News", title: "Coverage of the Shwapno data breach", href: "https://www.jagonews24.com/", todo: true },
  { id: "dhakatribune", outlet: "Dhaka Tribune", title: "Coverage of the Shwapno data breach", href: "https://www.dhakatribune.com/", todo: true },
  { id: "ann", outlet: "Asia News Network", title: "Coverage of the Shwapno data breach", href: "https://asianews.network/", todo: true },
  {
    id: "nao",
    outlet: "UK National Audit Office",
    title: "Investigation: WannaCry cyber attack and the NHS",
    href: "https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/",
  },
  {
    id: "ms",
    outlet: "Microsoft",
    title: "Security Bulletin MS17-010",
    href: "https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010",
  },
  { id: "voa", outlet: "VOA / Europol", title: "WannaCry reach and ransom figures", href: "https://www.voanews.com/", todo: true },
  {
    id: "malwaretech",
    outlet: "MalwareTech blog",
    title: "How to accidentally stop a global cyber attack",
    href: "https://www.malwaretech.com/2017/05/how-to-accidentally-stop-a-global-cyber-attacks.html",
  },
  {
    id: "doj",
    outlet: "US Department of Justice",
    title: "North Korean regime-backed programmer charged",
    href: "https://www.justice.gov/opa/pr/north-korean-regime-backed-programmer-charged-conspiracy-conduct-multiple-cyber-attacks-and",
  },
  { id: "fbi", outlet: "FBI", title: "Wanted: Park Jin Hyok", href: "https://www.fbi.gov/wanted/cyber/park-jin-hyok" },
  {
    id: "qilinlisting",
    outlet: "ransomware.live listing via hendryadrian.com",
    title: "Ransom! Shwapno, MAR-2026",
    href: "https://www.hendryadrian.com/",
    todo: true,
  },
  { id: "cybelangel", outlet: "CybelAngel", title: "Qilin Ransomware: Attack Methods and 2026 Status", href: "https://cybelangel.com/", todo: true },
  { id: "s2w", outlet: "S2W", title: "Threat Group Profiling: LockBit 5.0", href: "https://s2w.inc/", todo: true },
  {
    id: "dexposelockbit",
    outlet: "DeXpose",
    tag: "DeXpose · LockBit 5.0",
    title: "LockBit 5.0 Targets Shwapno in Bangladesh Ransomware Attack",
    href: "https://www.dexpose.io/",
    todo: true,
  },
  { id: "dexposeqilin", outlet: "DeXpose", tag: "DeXpose · Qilin", title: "Qilin Targets Retailer Shwapno in Ransomware Attack", href: "https://www.dexpose.io/", todo: true },
  { id: "arete", outlet: "Arete", title: "LockBit 5.0: The RaaS That Refuses to Go Away", href: "https://areteir.com/", todo: true },
];

// Which references each study lists, in order.
export const shwapnoRefs: RefId[] = ["tbs", "dailystar", "fe", "unb", "jago", "dhakatribune", "ann", "dexposelockbit", "dexposeqilin", "qilinlisting", "cybelangel", "arete", "s2w"];
export const wannacryRefs: RefId[] = ["nao", "ms", "voa", "malwaretech", "doj", "fbi"];

// ── Navigation: rail and index overlay (one set per study) ──────────────────

export type NavItem = { n: string; id: string; title: string; caseId?: CaseId };
export type StudyNav = { rail: NavItem[]; index: { head: string; items: NavItem[] }[] };

const toNav = (s: QuestionScene): NavItem => ({ n: s.n, id: s.id, title: s.question, caseId: s.caseId });

const shwapnoRail: NavItem[] = [...c1Scenes.map(toNav), { n: c1Lesson.n, id: c1Lesson.id, title: "Lesson: how a company responds", caseId: "c1" }];

export const shwapnoNav: StudyNav = {
  rail: shwapnoRail,
  index: [
    { head: "Front", items: [{ n: "00", id: "front", title: "Front page" }] },
    {
      head: "The case",
      items: [
        { n: "—", id: "case-01", title: "Hook", caseId: "c1" },
        ...shwapnoRail.slice(0, 7),
        { n: "—", id: "claimed-by", title: "Who was behind the attack?", caseId: "c1" },
        ...shwapnoRail.slice(7),
        { n: "—", id: "who-did-it", title: "Sidebar: who did it?", caseId: "c1" },
      ],
    },
    {
      head: "Back matter",
      items: [
        { n: "—", id: "closing", title: shwapnoClosing.label },
        { n: "—", id: "references", title: "References" },
      ],
    },
  ],
};

const wannacryRail: NavItem[] = [
  ...c2Scenes.map(toNav),
  toNav(q18),
  { n: c2Lesson.n, id: c2Lesson.id, title: "Lesson: WannaCry was preventable", caseId: "c2" },
];

export const wannacryNav: StudyNav = {
  rail: wannacryRail,
  index: [
    { head: "Front", items: [{ n: "00", id: "front", title: "Front page" }] },
    {
      head: "The case",
      items: [
        { n: "—", id: "case-02", title: "Hook", caseId: "c2" },
        ...wannacryRail.slice(0, c2Scenes.length),
        { n: "—", id: "lessons", title: c2Lessons.title, caseId: "c2" },
        ...wannacryRail.slice(c2Scenes.length),
      ],
    },
    {
      head: "Back matter",
      items: [
        { n: "—", id: "people", title: people.label },
        { n: "—", id: "other-attacks", title: otherAttacks.label },
        { n: "—", id: "closing", title: wannacryClosing.label },
        { n: "—", id: "references", title: "References" },
      ],
    },
  ],
};

// ── Text drawn inside the visuals (labels, HUDs, textures) ──────────────────

export const visualText = {
  calendar: {
    months: ["Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"],
    counter: "Months of silence",
    first: "Ransom email",
    last: "Data published",
  },
  map: { caption: "Stylised outline. Dots are illustrative, not real outlet locations.", place: "Bangladesh" },
  receipt: {
    header: "SUPERMARKET RECEIPT",
    lines: ["Customer: ████████", "Mobile: 01█████████", "Rice", "Eggs", "Medicine"],
    tags: ["Name", "Mobile number", "Purchase history"],
    claim: "Financial data: not taken (company claim)",
  },
  crowd: ["Customers", "Shwapno and ACI", "Frontline staff", "Banks and wallets"],
  phone: {
    caller: "Unknown number",
    status: "Incoming call",
    script: ["Hello, {name}?", "Calling about your {purchase} order.", "Please read me the OTP we just sent."],
    fills: { name: "Nasrin", purchase: "rice and eggs" },
    note: "Fictional example",
  },
  gauge: {
    label: "Customer trust",
    cards: ["7 months of silence", "Legal notice, 30 March", "Investigation and security costs", "Loyalty sign-ups refused", "Shoppers switch to rivals"],
    note: "Illustrative, not measured",
  },
  checklist: { title: "Response checklist", stamp: "TOO LATE" },
  ransom: {
    title: "Wana Decrypt0r 2.0",
    headline: "Ooops, your files have been encrypted!",
    raise: "Payment will be raised on",
    lost: "Your files will be lost on",
    demand: "Send $300 worth of bitcoin to this address:",
    address: "████████████████ (redacted)",
    buttons: ["Check Payment", "Decrypt"],
    note: "Recreation for illustration. Not the real program; the address is redacted.",
  },
  glass: { a: "Space reserved", b: "Next shelf (kernel memory)" },
  spread: { clock: "UTC", counter: "Countries reached", note: "Pacing illustrative: about 150 countries within a day" },
  pins: { note: "Pin positions are approximate" },
  coins: { coins: "$140,000 collected", bar: "Billions in damage", note: "Not to scale" },
  corridor: { note: "Screens turn to the ransom note" },
  stop: { off: "Kill switch: off", on: "Kill switch: domain registered, 15:03 UTC" },
  pcs: { a: "Patched (MS17-010)", b: "Unpatched", wave: "WannaCry" },
};
