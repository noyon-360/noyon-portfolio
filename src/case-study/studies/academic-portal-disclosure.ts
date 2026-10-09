// Every word on /case-study/academic-portal-disclosure. This is the author's own first-person account of a
// responsible-disclosure experience (2026). Facts come only from the author's write-up. Anonymised on purpose:
// no organisation, URLs, record contents or personal data. It has no published sources, so no scene shows a tag.
// Wording keeps the write-up's own confidence: weaknesses "appeared" to exist; the email was drafted and the
// CERT notification planned. Nothing here says the issue was fixed, because the write-up does not say so.
import type { Card, Closing, Front, NavItem, QuestionScene, StudyNav } from "../content";

// ── Front page ──────────────────────────────────────────────────────────────

export const portalFront: Front = {
  caseId: "c5",
  kicker: "Cybersecurity Case Study",
  masthead: "Responsible Disclosure",
  edition: "Interactive edition · 2026",
  dateline: "First-person account · Academic web portal · 2026 · Ten questions",
  headline: "Knowing where to stop",
  deck: "An academic portal appeared to leave student records, admin pages and plaintext passwords within reach of the open web. I confirmed the problems at the minimum level, stopped, and prepared a responsible-disclosure report.",
  read: "#hook",
  globeAlt: "A slow wireframe network of connected boxes turns behind the masthead.",
  cover: "network",
  status: "Organisation, URLs and all personal data are intentionally withheld",
};

export const portalMarquees = {
  front: ["Laravel", "Directory listing", "Plaintext passwords", "Default credentials", "Sequential IDs", "Exposed dependency file", "Identity withheld", "2026"],
  middle: ["Confirm", "Stop", "Report", "Escalate", "Redact", "Document", "No payment asked", "National CERT"],
};

export const portalHook = {
  id: "hook",
  caseId: "c5" as const,
  eyebrow: "First-person account — Academic web portal",
  title: "The point to stop",
  text: "Student records and passwords sat a few clicks from the open web. The hard part was not finding the problem. It was knowing exactly where to stop.",
};

export const portalDefinitions = {
  idor: {
    term: "IDOR",
    say: "in·se·cure di·rect ob·ject ref·er·ence",
    pos: "noun · access-control flaw",
    meaning:
      "When a system finds a record by a simple number and never checks whether you are allowed to see it. Like a filing room where every drawer is numbered and unlocked: knowing one number tells you where the next one is.",
    synonyms: ["enumeration", "broken object-level authorisation"],
  },
  disclosure: {
    term: "Responsible disclosure",
    say: "re·spon·si·ble dis·clo·sure  /rɪˈspɒn.sə.bəl dɪsˈkləʊ.ʒə/",
    pos: "noun · security practice",
    meaning:
      "Telling an organisation privately about a weakness in its systems, giving it the chance to fix it before anyone else learns of it, and never using the weakness for anything beyond confirming it exists.",
    synonyms: ["coordinated disclosure", "vulnerability reporting"],
  },
};

// ── Questions ───────────────────────────────────────────────────────────────

export const portalScenes: QuestionScene[] = [
  {
    n: "01",
    id: "q01",
    caseId: "c5",
    label: "The incident",
    question: "What happened in this incident?",
    meta: { category: "Responsible disclosure", date: "2026", source: "Author's account" },
    steps: [
      {
        kicker: "Noticed",
        body: "While reviewing a publicly reachable academic web portal belonging to an educational and medical institution, I noticed administrative pages and sensitive records that appeared to be accessible in ways they should not be.",
      },
      {
        kicker: "Confirmed",
        body: "Rather than exploit anything, I confirmed each issue at the minimum level needed to know it was real.",
      },
      { kicker: "Stopped", body: "Then I stopped. No further probing once the problems were confirmed." },
      {
        kicker: "Reported",
        body: "I prepared a responsible-disclosure report for the organisation's technology team, with escalation to its director.",
      },
      { kicker: "Escalated", body: "In parallel, a notification to the national CERT, the country's computer emergency response team, for coordinated disclosure." },
    ],
    alt: "Five nodes on a line: noticed, confirmed, stopped, reported, escalated. A pulse travels along the line, lighting each in turn, and at the end splits toward three recipients: the technology team, the director and the national CERT.",
    refs: [],
    next: "So what kind of system was it?",
  },
  {
    n: "02",
    id: "q02",
    caseId: "c5",
    label: "The system",
    question: "What system was affected?",
    meta: { category: "Web application", date: "2026", source: "Author's account" },
    steps: [
      {
        kicker: "The portal",
        body: "A Laravel-based academic management portal. Laravel is a popular framework for building websites in the PHP programming language.",
      },
      {
        kicker: "What it held",
        body: "Student and staff records, user accounts, promotions, attendance and related administrative data for an educational institution.",
      },
      {
        kicker: "Withheld",
        body: "The institution's identity is withheld. The aim here is to document the findings and decisions, not to point at any system or person.",
      },
    ],
    alt: "A filing cabinet with five labelled drawers: students, staff, accounts, promotions and attendance. As you scroll, the drawers slide partly open on their own, with no lock on any of them. Illustrative.",
    refs: [],
    next: "What was wrong with it?",
  },
  {
    n: "03",
    id: "q03",
    caseId: "c5",
    label: "The weaknesses",
    question: "What types of weaknesses were found?",
    meta: { category: "Weaknesses", date: "2026", source: "Author's account" },
    steps: [
      {
        kicker: "Open folders",
        body: "Directory listing was switched on: the application's source files and folder structure could be browsed like an open file explorer. A dependency file was readable too, revealing the tech stack.",
      },
      {
        kicker: "Missing locks",
        body: "Some admin pages and record data appeared reachable without proper authorisation. It was not always clear whether a page needed a login, which is itself a sign of inconsistent access control.",
      },
      {
        kicker: "Plain sight",
        body: "Account passwords appeared to be stored and displayed in clear text, and simple default passwords, such as a trivial string of digits, appeared to be in use.",
      },
      {
        kicker: "Numbered drawers",
        body: "Student records were addressed by sequential numbers. Change the number by one and the next record appeared, so records could be stepped through one by one.",
      },
    ],
    alt: "A row of record cards numbered in sequence. A marker steps along the row and each card flips open as it arrives, one after another, with nothing checking who is asking. Record numbers are fictional.",
    refs: [],
    next: "Whose records were they?",
  },
  {
    n: "04",
    id: "q04",
    caseId: "c5",
    label: "The people",
    question: "Who could be affected by these weaknesses?",
    meta: { category: "Impact", date: "2026", source: "Author's assessment" },
    steps: [
      {
        kicker: "Students",
        body: "Students whose personal records were exposed: names, ID numbers and contact details, along with their account passwords.",
      },
      { kicker: "Staff", body: "Staff, whose records and accounts sat in the same system with the same weaknesses." },
      {
        kicker: "The institution",
        body: "The institution itself, exposed to data-integrity risk, reputational harm and regulatory consequences.",
      },
      {
        kicker: "Beyond the portal",
        body: "Because passwords were in plaintext and some were weak defaults, the risk reached anyone who reused one of those passwords on another site.",
      },
    ],
    alt: "Four groups of figures stand side by side: students, staff, the institution, and people who reuse their passwords elsewhere. A ripple spreads out from the students through the other groups. Group sizes are illustrative.",
    refs: [],
    next: "What could someone do with that access?",
  },
  {
    n: "05",
    id: "q05",
    caseId: "c5",
    label: "The risks",
    question: "What problems could the exposure cause?",
    meta: { category: "Risk", date: "2026", source: "Author's assessment" },
    steps: [
      {
        kicker: "Takeover",
        body: "Exposed and default passwords make account takeover trivial: no guessing needed when the password is on the screen.",
      },
      {
        kicker: "Harvesting",
        body: "Sequential numbers make bulk collection of student records a matter of patience, not skill.",
      },
      {
        kicker: "Compounding",
        body: "Each weakness makes the others worse. A readable codebase helps an attacker find the next flaw; real personal details make phishing convincing.",
      },
    ],
    alt: "",
    refs: [],
    next: "And what would it mean for the institution?",
  },
  {
    n: "06",
    id: "q06",
    caseId: "c5",
    label: "The organisation",
    question: "How could this affect the organisation?",
    meta: { category: "Organisational impact", date: "2026", source: "Author's assessment" },
    steps: [
      { kicker: "Trust", body: "Loss of trust from students, parents and staff, who handed over their details expecting them to be protected." },
      { kicker: "Regulators", body: "Possible regulatory scrutiny under data-protection expectations." },
      { kicker: "Cost", body: "The cost and disruption of emergency remediation: fixing under pressure is always more expensive than fixing by plan." },
      {
        kicker: "Timing",
        body: "Reputational damage, amplified if the exposure became public before it was fixed. For an institution handling health or education records, the sensitivity multiplies the impact.",
      },
    ],
    alt: "A trust dial drains from full toward empty while four cards stack beside it: students and parents lose trust; regulators take an interest; emergency fixes cost money; exposure goes public before the fix. Illustrative, not measured.",
    refs: [],
    next: "So what did I actually do?",
  },
  {
    n: "07",
    id: "q07",
    caseId: "c5",
    label: "My actions",
    question: "What actions did I take?",
    meta: { category: "Responsible disclosure", date: "2026", source: "Author's account" },
    steps: [
      {
        kicker: "Minimised",
        body: "I viewed only what was necessary to confirm each issue. I did not alter, delete, bulk-download or keep any personal data, and submitted no changes to the live system.",
      },
      { kicker: "Stopped early", body: "I stopped reviewing as soon as the issues were confirmed, rather than probing further." },
      {
        kicker: "Reported",
        body: "I drafted a clear, non-sensitive disclosure email to the organisation's technical unit, copying leadership for escalation. No raw records or passwords went in it; redacted evidence was offered through a secure channel on request.",
      },
      {
        kicker: "Paper trail",
        body: "I planned a parallel notification to the national CERT: a neutral record that supports coordinated disclosure and gives legal protection.",
      },
      { kicker: "No demands", body: "I asked for no payment or reward." },
    ],
    alt: "A letter whose lines are blacked out one by one as you scroll, leaving only the description of each weakness. It folds into an envelope that travels to three recipients: the technical unit, leadership and the national CERT.",
    refs: [],
    next: "What should other organisations take from it?",
  },
  {
    n: "08",
    id: "q08",
    caseId: "c5",
    label: "The lessons",
    question: "What lessons can other organisations learn?",
    meta: { category: "Lessons", date: "2026", source: "Author's recommendations" },
    steps: [
      {
        kicker: "Close the folders",
        body: "Turn off directory listing, and never expose source code or dependency files to the public web.",
      },
      {
        kicker: "Scramble passwords",
        body: "Never store passwords as plain text. Hash them with a strong, slow algorithm such as bcrypt or Argon2, and ban weak or default passwords.",
      },
      {
        kicker: "Check every request",
        body: "Enforce authorisation on the server for every page and every record. Hiding a link is not the same as locking a door.",
      },
      {
        kicker: "Stop the counting",
        body: "Replace sequential IDs, or add an ownership check to each one, so that knowing one record's number gets you nothing else.",
      },
    ],
    alt: "The same filing cabinet as before. As you scroll, each drawer slides shut and a lock lights up on its face, one by one, until all five are closed and locked. Illustrative.",
    refs: [],
    next: "And beyond these fixes?",
  },
  {
    n: "09",
    id: "q09",
    caseId: "c5",
    label: "My view",
    question: "What should organisations do to protect data?",
    meta: { category: "Opinion", date: "2026", source: "Author's opinion" },
    steps: [
      {
        kicker: "From the start",
        body: "Build security in from the start: hash credentials, give each account only the access it needs, and check authorisation on the server for every request.",
      },
      {
        kicker: "Keep it private",
        body: "Keep infrastructure files private, keep dependencies patched, and have authorised parties run regular audits and penetration tests.",
      },
      {
        kicker: "Open a door",
        body: "Just as important: create a clear, welcoming channel for responsible disclosure. The cheapest fix is the one a researcher hands you before an attacker finds it.",
      },
    ],
    alt: "",
    refs: [],
    next: "And what did I take away myself?",
  },
  {
    n: "10",
    id: "q10",
    caseId: "c5",
    label: "Personal lessons",
    question: "What are the key lessons I learned?",
    meta: { category: "Reflection", date: "2026", source: "Author's account" },
    steps: [
      {
        kicker: "Confirm, don't exploit",
        body: "Proving a problem exists at the minimum level is enough. Going further crosses legal and ethical lines.",
      },
      {
        kicker: "Permission over intent",
        body: "Good intentions don't substitute for permission. Route everything through responsible disclosure and, where appropriate, a national CERT.",
      },
      {
        kicker: "Keep data out",
        body: "Keep sensitive data out of reports. Describe categories, share redacted proof only through secure channels, and never widen the exposure you are trying to close.",
      },
      {
        kicker: "Write it down",
        body: "Document decisions as you go. A clear record of what you did and didn't touch protects both the organisation and the researcher.",
      },
    ],
    alt: "",
    refs: [],
    next: "Which comes down to one sentence.",
  },
];

// ── Scene extras ────────────────────────────────────────────────────────────

export const portalSystem: [string, string][] = [
  ["Application", "Academic management portal"],
  ["Framework", "Laravel"],
  ["Owner", "An educational / medical institution — identity withheld"],
  ["Records", "Students and staff, user accounts, promotions, attendance, administrative data"],
  ["Reachability", "Publicly reachable on the web"],
];

export const weaknesses: Card[] = [
  { pill: "Exposure", title: "Directory listing enabled", body: "Source files and the folder structure were publicly browsable." },
  { pill: "Access", title: "Weak access control", body: "Some admin pages and record data appeared reachable without proper authorisation." },
  { pill: "Credentials", title: "Plaintext passwords", body: "Account passwords appeared to be stored and displayed in clear text." },
  { pill: "Credentials", title: "Weak default passwords", body: "Simple default passwords, such as a trivial numeric string, appeared to be in use." },
  { pill: "Access", title: "IDOR / enumeration", body: "Student records were addressable by sequential numeric IDs." },
  { pill: "Exposure", title: "Exposed dependency file", body: "A package file was publicly readable, revealing the tech stack." },
];

export const problems: Card[] = [
  { pill: "Accounts", title: "Account takeover", body: "Using exposed or default passwords." },
  { pill: "Records", title: "Bulk data harvesting", body: "Stepping through student records by ID, one after another." },
  { pill: "People", title: "Targeted phishing", body: "Messages to students and staff that quote real, convincing personal details." },
  { pill: "Integrity", title: "Tampering risk", body: "Had the access-control gaps been combined with write actions, records could have been altered. Not attempted here." },
  { pill: "Code", title: "Source exposure", body: "A readable codebase makes it far easier for an attacker to find further flaws." },
];

/** The ledger between Q07 and Q08: what was done, and what was deliberately not done. */
export const portalLine = {
  id: "the-line",
  label: "The line",
  title: "What I did, and what I didn't",
  intro: "Every step of a disclosure is a choice about how far to go. These were mine.",
  did: {
    title: "Did",
    items: [
      "Viewed only what was needed to confirm each issue",
      "Stopped once the issues were confirmed",
      "Drafted a non-sensitive disclosure email to the technical unit",
      "Copied leadership for escalation",
      "Offered redacted evidence through a secure channel, on request",
      "Planned a parallel notification to the national CERT",
    ],
  },
  didnt: {
    title: "Did not",
    items: [
      "Alter or delete anything",
      "Download records in bulk",
      "Keep any personal data",
      "Submit any change to the live system",
      "Put raw records or passwords in the email",
      "Ask for payment or a reward",
    ],
  },
};

export const portalLessonCards: Card[] = [
  { pill: "Exposure", title: "Turn off directory listing", body: "And never expose source or dependency files publicly." },
  { pill: "Credentials", title: "Hash every password", body: "bcrypt or Argon2, never plain text. Ban weak and default passwords." },
  { pill: "Access", title: "Authorise on the server", body: "On every page and every record, not just by hiding links." },
  { pill: "Access", title: "End sequential IDs", body: "Or add ownership checks, so one number doesn't lead to the next." },
  { pill: "Process", title: "Review regularly", body: "Run periodic security reviews instead of waiting for an outsider to find problems." },
  { pill: "Process", title: "Publish a security contact", body: "A disclosure policy lets researchers report safely." },
];

export const portalLesson = {
  id: "lesson",
  quote: "Confirm, don't exploit. Proving a problem exists is enough.",
};

// ── Closing and references ──────────────────────────────────────────────────

export const portalClosing: Closing = {
  caseId: "c5",
  label: "Closing",
  title: "Where it went wrong",
  head: "The portal trusted that nobody would look.",
  body: "Open folders, missing server-side checks, plaintext passwords and numbered records are each common, well-understood mistakes. Together they put student and staff data a few clicks from the open web.",
  compare: {
    had: { title: "What was there", items: ["Browsable source folders", "Passwords in clear text", "Records by sequential number"] },
    needed: { title: "What was missing", items: ["A check on every request", "Hashed passwords", "A published security contact"] },
  },
  todayTitle: "What you can do today",
  today: [
    "Use a different password for every site, so one leak can't open the rest.",
    "Change any default password you were given the first time you sign in.",
    "If you run a website, check that its folders can't be browsed from a web browser.",
    "If you find a flaw in someone else's system, stop, don't keep the data, and report it privately.",
  ],
  quote: "The cheapest fix is the one a researcher hands you before an attacker finds it.",
};

export const portalRefsNote =
  "This study is documented from the author's own first-person account of a responsible-disclosure experience. It has no published sources, and the organisation, URLs and all personal data are intentionally withheld.";

// ── Text drawn inside the visuals ───────────────────────────────────────────

export const portalVisual = {
  path: {
    stages: ["Noticed", "Confirmed", "Stopped", "Reported", "Escalated"],
    recipients: ["Technology team", "Director", "National CERT"],
  },
  cabinet: { drawers: ["Students", "Staff", "Accounts", "Promotions", "Attendance"], open: "No lock", locked: "Locked", note: "Illustrative" },
  records: { label: "Record", note: "Fictional record numbers", check: "No ownership check" },
  crowd: ["Students", "Staff", "The institution", "Password reusers"],
  crowdNote: "Group sizes illustrative",
  gauge: {
    label: "Trust",
    cards: ["Students and parents lose trust", "Regulators take an interest", "Emergency fixes cost money", "Exposure goes public before the fix"],
    note: "Illustrative, not measured",
  },
  letter: { redacted: "Personal data redacted", recipients: ["Technical unit", "Leadership", "National CERT"] },
};

// ── Navigation ──────────────────────────────────────────────────────────────

const toNav = (s: QuestionScene): NavItem => ({ n: s.n, id: s.id, title: s.question, caseId: s.caseId });

const rail: NavItem[] = portalScenes.map(toNav);

export const portalNav: StudyNav = {
  rail,
  index: [
    { head: "Front", items: [{ n: "00", id: "front", title: "Front page" }] },
    {
      head: "The case",
      items: [{ n: "—", id: portalHook.id, title: "Hook", caseId: "c5" }, ...rail.slice(0, 7), { n: "—", id: portalLine.id, title: portalLine.title, caseId: "c5" }, ...rail.slice(7)],
    },
    {
      head: "Back matter",
      items: [
        { n: "—", id: portalLesson.id, title: "The lesson", caseId: "c5" },
        { n: "—", id: "closing", title: portalClosing.label },
        { n: "—", id: "references", title: "References" },
      ],
    },
  ],
};
