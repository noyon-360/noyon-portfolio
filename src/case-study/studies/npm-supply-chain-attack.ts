// Every word on /case-study/npm-supply-chain-attack. This is the author's own incident, still under
// investigation. Facts come only from the author's brief; anything it did not supply is a visible "TODO:"
// string, and anything not yet confirmed carries a "To verify" / "Unconfirmed" stamp.
// Anonymised: no client names, project names, hostnames, server IPs, keys or emails. Only the two
// control-server addresses are shown.
import type { Card, Closing, Front, NavItem, QuestionScene, RefId, Stat, StudyNav } from "../content";

const TO_VERIFY = "To verify";

// ── Front page ──────────────────────────────────────────────────────────────

export const npmFront: Front = {
  caseId: "c3a",
  kicker: "Special report · First-hand account",
  masthead: "Supply-Chain Incident Case Study",
  edition: "Interactive edition",
  dateline: "Dhaka · 2026 · Eighteen questions",
  headline: "One install command, four servers",
  deck: "A poisoned npm package slipped into routine installs and started a hidden remote-control program. Over several weeks it surfaced on four client servers at a small software agency.",
  read: "#part-01",
  globeAlt: "A slow wireframe network of connected boxes turns behind the masthead.",
  cover: "network",
  byline: [
    { label: "Author", value: "TODO: author" },
    { label: "Role", value: "TODO: role" },
    { label: "Organisation", value: "TODO: organisation" },
    { label: "Date", value: "TODO: date" },
  ],
  status: "Investigation ongoing",
};

export const npmMarquees = {
  front: ["npm install", "Server A", "Server B", "Server C", "Server D", "Dhaka", "2026", "0 security staff"],
  attack: ["Server A", "Server B", "Server C", "Server D", "port 443", "166.88.134.62", "136.0.9.8", "axios", "socket.io-client"],
  response: ["48% → 8%", "Server A", "Server B", "Server C", "Server D", "Rotate every secret", "Weeks of exposure"],
};

// ── Parts ───────────────────────────────────────────────────────────────────

export const npmParts = {
  attack: {
    id: "part-01",
    caseId: "c3a" as const,
    eyebrow: "Special report — Part 01",
    title: "The attack",
    label: "The infection",
    hook: "Nobody clicked a bad link. Nobody opened an attachment. A developer typed npm install, as developers do a hundred times a week.",
  },
  response: {
    id: "part-02",
    caseId: "c3b" as const,
    eyebrow: "Special report — Part 02",
    title: "The response",
    label: "The hunt",
    hook: "There was no security team to call. The developer who wrote the apps was also the one who had to hunt the intruder.",
  },
  fix: {
    id: "part-03",
    caseId: "c3c" as const,
    eyebrow: "Special report — Part 03",
    title: "The fix",
    label: "The lesson",
  },
};

// ── Part 01 — the attack ────────────────────────────────────────────────────

export const npmDefinitions = {
  supplyChain: {
    term: "Supply-chain attack",
    say: "sup·ply-chain at·tack  /səˈplaɪ tʃeɪn əˈtæk/",
    pos: "noun · attack method",
    meaning:
      "Attacking the ingredients instead of the kitchen: poisoning a trusted piece of software that others build on, so it arrives inside every project that uses it.",
    synonyms: ["dependency attack", "upstream compromise", "poisoned package"],
  },
  rat: {
    term: "Remote-access trojan",
    say: "re·mote-ac·cess tro·jan  /rɪˈməʊt ˈæk.ses ˈtrəʊ.dʒən/",
    pos: "noun · malware",
    meaning: "A hidden program that gives a stranger a remote keyboard on your machine: they can run commands and read files as if they were sitting at it.",
    synonyms: ["RAT", "backdoor", "remote-control malware"],
  },
};

export const attackScenes: QuestionScene[] = [
  {
    n: "01",
    id: "q01",
    caseId: "c3a",
    label: "The infection",
    question: "What happened in this incident?",
    meta: { category: "Supply-chain attack", date: "2026 · TODO: exact dates", source: "Author's investigation" },
    steps: [
      {
        kicker: "The package",
        body: "A malicious npm package entered several unrelated client projects through routine installs. It is reported to come from a 2026 campaign of compromised @joyfill packages.",
        flag: TO_VERIFY,
      },
      { kicker: "The program", body: "On each server it started a hidden program that tried to phone home: to reach a computer run by the attackers and wait for orders." },
      {
        kicker: "Four servers",
        body: "Over several weeks the same malware appeared on four separate servers. First detection: TODO. Each further server: TODO. Last cleanup: TODO.",
      },
      { kicker: "By hand", body: "Each server was found and cleaned by hand, one at a time." },
      { kicker: "No way in", body: "No single entry point was ever found." },
    ],
    alt: "A wall calendar with four server icons, A to D, standing on it; they light up red one after another across the weeks. Dates are placeholders still to be filled in.",
    refs: ["gridinsoft", "vulert"],
    evidence: ["e1", "e2"],
    next: "So who was on the receiving end?",
  },
  {
    n: "02",
    id: "q02",
    caseId: "c3a",
    label: "The victims",
    question: "Who was affected?",
    meta: { category: "Impact", date: "2026", source: "Author's investigation" },
    steps: [
      { kicker: "The agency", body: "A small software agency in Dhaka that builds apps for overseas clients. Client and project names are withheld." },
      { kicker: "The servers", body: "Four client servers were infected. The worst-hit one ran ten apps side by side." },
      { kicker: "The watch", body: "There were no dedicated security staff. The developer who wrote the apps also had to defend them." },
    ],
    alt: "Four server towers side by side with small app blocks stacked inside. The worst-hit tower holds ten; the app counts on the other three are still to be filled in, so their blocks are drawn faint.",
    refs: [],
    evidence: ["e4"],
    next: "How does an attack get in without anyone breaking in?",
  },
  {
    n: "03",
    id: "q03",
    caseId: "c3a",
    label: "The method",
    question: "What is a supply-chain attack?",
    meta: { category: "Explainer", date: "—", source: "Definition and analogy" },
    steps: [
      {
        kicker: "Ingredients",
        body: "Modern apps are assembled from hundreds of small ready-made packages, downloaded from the public npm registry. Each package can pull in more packages of its own.",
      },
      { kicker: "The sealed jar", body: "An analogy: a trusted supplier's sealed jar arrives already tampered with. The kitchen did nothing wrong; it used what it always uses." },
      { kicker: "Climbing up", body: "One poisoned package deep in the tree is enough. Everything above it, all the way up to the app, now carries it." },
    ],
    alt: "A tree of dependency boxes. One box deep in the tree turns red, and the red climbs box by box up to the app at the root.",
    refs: [],
    next: "So what did this poisoned ingredient do once it was inside?",
  },
  {
    n: "04",
    id: "q04",
    caseId: "c3a",
    label: "The behaviour",
    question: "What did the malware actually do?",
    meta: { category: "Malware", date: "2026", source: "Process and network evidence" },
    steps: [
      {
        kicker: "Disguise",
        body: "It hid inside a long, scrambled one-line command run by Node.js, the program that runs the apps. It appears here only as a blurred texture; the real command is not reproduced.",
      },
      { kicker: "Supplies", body: "It quietly installed two extra tools it needed, axios and socket.io-client, into a hidden folder in the root (administrator) account." },
      { kicker: "Calling out", body: "It tried to connect to two remote control servers on port 443, the same port normal secure web traffic uses, so it blended in." },
      { kicker: "Staying alive", body: "Whenever the infected app restarted, the malware restarted with it." },
    ],
    alt: "A glass box labelled node with a smaller red box inside it. A blurred, unreadable band of scrambled text wraps around it; only three markers are readable: node, hidden folder, port 443.",
    refs: [],
    evidence: ["e1", "e2", "e4"],
    next: "Where was it trying to call?",
  },
  {
    n: "05",
    id: "q05",
    caseId: "c3a",
    label: "The destination",
    question: "Where was it calling?",
    meta: { category: "Command and control", date: "2026", source: "Connection tables · VirusTotal" },
    steps: [
      { kicker: "Two addresses", body: "The malware tried to reach two addresses: 166.88.134.62 and 136.0.9.8. These were its remote control servers." },
      { kicker: "Known bad", body: "The first, 166.88.134.62, is flagged as malicious by 16 security vendors on VirusTotal. Date checked: TODO." },
      { kicker: "Nobody named", body: "Who runs these servers is not known. The operators have not been identified." },
    ],
    alt: "Two distant red beacons, labelled 166.88.134.62 and 136.0.9.8, with thin dashed lines reaching toward them from the foreground.",
    refs: ["vt166"],
    evidence: ["e2", "e3"],
    next: "So what kind of program calls home like that?",
  },
  {
    n: "06",
    id: "q06",
    caseId: "c3a",
    label: "The type",
    question: "What kind of malware was it?",
    meta: { category: "Malware type", date: "2026", source: "Public write-ups of the campaign" },
    steps: [
      { kicker: "The idea", body: "A trojan arrives looking like something useful. A remote-access trojan then opens a line back to its operator and waits for orders." },
      {
        kicker: "The family",
        body: "The pattern resembles a trojan family seen in earlier npm compromises. Public write-ups describe the compromised @joyfill packages as carrying a remote-access trojan.",
        flag: TO_VERIFY,
      },
    ],
    alt: "A computer screen with the owner's cursor resting still. A second, red cursor appears and starts moving on its own.",
    refs: ["gridinsoft", "vulert"],
    next: "What did all that look like from the outside?",
  },
  {
    n: "07",
    id: "q07",
    caseId: "c3a",
    label: "The symptoms",
    question: "What were the visible symptoms?",
    meta: { category: "Symptoms", date: "2026", source: "Process listings" },
    steps: [
      { kicker: "Maxed out", body: "Both processor cores on the server ran at 87–100%." },
      { kicker: "Queueing", body: "The load average climbed above 8 on a two-core machine: about four times more work waiting than the machine could handle." },
      { kicker: "Slowdown", body: "Client apps slowed down for the people using them." },
    ],
    alt: "Two dial gauges, one per processor core, pinned near the top of their range, with heat shimmering above them.",
    refs: [],
    evidence: ["e1"],
    next: "And who was behind it?",
  },
];

export const symptomStats: Stat[] = [
  { value: 100, prefix: "87–", suffix: "%", label: "Processor use, both cores" },
  { value: 8, prefix: ">", label: "Load average", note: "on a 2-core machine" },
  { value: 2, label: "Processor cores" },
];

export const affectedStats: Stat[] = [
  { value: 4, label: "Servers infected" },
  { value: 0, text: "TODO", label: "Client projects affected" },
  { value: 10, label: "Apps on the worst-hit server" },
  { value: 0, label: "Dedicated security staff" },
];

export const npmWho = {
  label: "Sidebar",
  title: "Who did it?",
  body: "Unknown. The operators of the two control servers have not been identified. This report does not guess at a group or a country.",
  silhouette: "Unknown",
};

// ── Part 02 — the response ──────────────────────────────────────────────────

export const responseScenes: QuestionScene[] = [
  {
    n: "08",
    id: "q08",
    caseId: "c3b",
    label: "The hunt",
    question: "How was it found?",
    meta: { category: "Detection", date: "TODO: date first noticed", source: "Process listings" },
    steps: [
      { kicker: "First sign", body: "TODO: how the infection was first noticed." },
      { kicker: "The list", body: "The running programs on the server were listed, one row per process. Most rows were the expected apps and system services." },
      { kicker: "The odd one", body: "One row stood out: Node.js running a long, scrambled one-line command that belonged to none of the apps." },
      { kicker: "The trail", body: "Its network connections were traced, which led to the two control-server addresses." },
    ],
    alt: "A list of calm white rows, one per running program. One row pulses red.",
    refs: [],
    evidence: ["e1", "e2"],
    next: "Then what was done on each server?",
  },
  {
    n: "09",
    id: "q09",
    caseId: "c3b",
    label: "The cleanup",
    question: "What was done on each server?",
    meta: { category: "Response", date: "2026", source: "Response log" },
    steps: [
      { kicker: "Stop", body: "The malicious processes were killed." },
      { kicker: "Block", body: "Both control-server addresses were blocked in the firewall." },
      { kicker: "Search", body: "Each server was checked for hidden doors that could bring the attacker back: scheduled jobs, system services, SSH keys and user accounts." },
      { kicker: "Trace", body: "The project that had brought the package in was traced." },
      { kicker: "Write down", body: "Every finding and every action went into a written log." },
    ],
    alt: "A server tower with a five-item checklist beside it; a tick appears against each item in turn.",
    refs: [],
    evidence: ["e1", "e5"],
    next: "Did blocking the addresses stop it?",
  },
  {
    n: "10",
    id: "q10",
    caseId: "c3b",
    label: "The wall",
    question: "Did blocking the address stop it?",
    meta: { category: "Response", date: "2026", source: "Firewall rules · process listings" },
    steps: [
      { kicker: "Traffic, not malware", body: "Blocking the addresses stopped the traffic, not the malware. The program was still running; it just could not get through." },
      { kicker: "Knocking", body: "On one server the malicious processes stayed alive, knocking on a closed door again and again." },
    ],
    alt: "Red arcs leave a server, fly toward a wall and stop at it, again and again.",
    refs: [],
    evidence: ["e2", "e5"],
    next: "So where was it actually starting from?",
  },
  {
    n: "11",
    id: "q11",
    caseId: "c3b",
    label: "The switch",
    question: "How was the source found?",
    meta: { category: "Response", date: "2026", source: "Process manager output" },
    steps: [
      { kicker: "Ten apps", body: "The worst-hit server ran ten apps side by side." },
      { kicker: "48% → 8%", body: "Stopping one of them dropped processor use from 48% to 8% within seconds." },
      { kicker: "The launcher", body: "That app's dependencies were the launcher: the poisoned package lived inside them and started the malware with the app." },
    ],
    alt: "Ten switches in a row. One is flipped off, and a processor gauge beside them falls from 48% to 8%.",
    refs: [],
    evidence: ["e4"],
    next: "What went wrong along the way?",
  },
  {
    n: "12",
    id: "q12",
    caseId: "c3b",
    label: "The mistakes",
    question: "What went wrong during the response?",
    meta: { category: "Response", date: "2026", source: "Response log" },
    steps: [
      { kicker: "Hindsight", body: "Not everything in the response worked. Four gaps made the hunt slower or the exposure wider." },
      { kicker: "Why name them", body: "Each is common in small teams, and each is fixable. They are listed below." },
    ],
    alt: "A magnifying glass passes over a row of network connections. One patch inside the lens stays dark: a blind spot exactly where port 443 sits.",
    refs: [],
    evidence: ["e2"],
    next: "And was this the only way in?",
  },
  {
    n: "13",
    id: "q13",
    caseId: "c3b",
    label: "The second door",
    question: "Was there a second door?",
    meta: { category: "Open question", date: "TODO: date found", source: "Process listings" },
    flag: "Unconfirmed — under investigation",
    steps: [
      { kicker: "A stranger", body: "An unknown program with a random name was found running beside a database cache that was open to the internet." },
      { kicker: "No conclusion", body: "Whether the two are linked to each other, or to the npm malware, is not known. This is unconfirmed and still under investigation." },
    ],
    alt: "A lit doorway seen head-on. Behind it stands a second, dimmer doorway, labelled unconfirmed.",
    refs: [],
    evidence: ["e1"],
    next: "If a door was open, what could have walked out?",
  },
  {
    n: "14",
    id: "q14",
    caseId: "c3b",
    label: "The exposure",
    question: "What could have been taken?",
    meta: { category: "Impact", date: "2026", source: "Author's assessment" },
    steps: [
      { kicker: "Anything readable", body: "The malware could read anything the server could read: passwords, database addresses, API keys and SSH keys." },
      { kicker: "Not confirmed", body: "Nothing is confirmed stolen. Nothing can be confirmed safe either." },
      { kicker: "Reforge", body: "So every secret on those servers must be treated as exposed and replaced. Rotation status: TODO." },
    ],
    alt: "A ring of keys. Each key turns grey, then is reforged bright.",
    refs: [],
    next: "And what did all this cost?",
  },
  {
    n: "15",
    id: "q15",
    caseId: "c3b",
    label: "The cost",
    question: "What did it cost?",
    meta: { category: "Impact", date: "2026", source: "Author's investigation" },
    steps: [
      { kicker: "Time", body: "Mostly time: four servers, each found and cleaned by hand, over weeks of exposure." },
      { kicker: "Still counting", body: "Hours spent: TODO. Client downtime: TODO." },
    ],
    alt: "",
    refs: [],
    next: "Which leaves one lesson.",
  },
];

export const costStats: Stat[] = [
  { value: 0, text: "TODO", label: "Hours spent" },
  { value: 0, text: "TODO", label: "Downtime" },
  { value: 4, label: "Servers cleaned by hand" },
  { value: 0, text: "Weeks", label: "Of exposure" },
];

export const responseGaps: Card[] = [
  { pill: "Blind spot", title: "A check that skipped the door", body: "A connection check filtered out port 443, the very port the malware used. A “clean” result meant nothing." },
  { pill: "Cleanup", title: "The launcher survived", body: "Killing the child processes left the launcher in place." },
  { pill: "Alerting", title: "Silent monitoring", body: "Monitoring tools were installed, but they raised no alert." },
  { pill: "Privilege", title: "Everything as root", body: "Every app ran as the root user, so one infected app exposed everything on the server." },
];

export const npmLesson = {
  n: "16",
  id: "q16",
  question: "The lesson learned",
  quote: "The attacker never broke in. We carried it through the front door.",
};

// ── Part 03 — the fix ───────────────────────────────────────────────────────

export const npmLessons = {
  n: "17",
  id: "q17",
  label: "The lesson",
  question: "What lessons can small teams learn?",
  meta: { category: "Opinion", date: "2026", source: "Author's recommendations" },
  developers: [
    "Pin and lock dependency versions.",
    "Install with npm ci, so the lockfile is followed exactly.",
    "Review new packages before adding them.",
    "Never run apps as root.",
    "Keep secrets out of project folders.",
  ],
  agencies: [
    "One view of all servers.",
    "Alerts on unusual outbound connections.",
    "A written response checklist.",
    "Rotate secrets after any incident.",
    "Close every port that does not need to be public.",
  ],
  next: "What would have caught this early?",
};

export const q18: QuestionScene = {
  n: "18",
  id: "q18",
  caseId: "c3c",
  label: "The idea",
  question: "What would have caught this early?",
  meta: { category: "Opinion", date: "2026", source: "Author's proposal" },
  flag: "Concept only — not a product",
  steps: [
    { kicker: "Install gate", body: "A gate that checks packages before they are installed." },
    { kicker: "Watchdog", body: "A watchdog that spots scrambled Node.js commands like the one this malware hid in." },
    { kicker: "Bad-address alert", body: "An alert the moment a server connects to a known-bad address." },
    {
      kicker: "One view",
      body: "One dashboard for every client server. Together, the idea this incident produced: an affordable security layer for small dev shops, working name AgencyGuard. A concept, not a product.",
    },
  ],
  alt: "A shield assembles from four labelled layers: install gate, Node watchdog, bad-address alert, one view.",
  refs: [],
  next: "Why doesn't this already exist for small teams?",
};

export const npmShieldLayers = ["Install gate", "Node watchdog", "Bad-address alert", "One view"];

export const npmGap = {
  id: "the-gap",
  label: "The gap",
  title: "Who is watching the small agencies?",
  meta: { category: "Opinion", date: "2026", source: "Author's view of the market" },
  cards: [
    { pill: "Enterprise", title: "Enterprise scanners", body: "Built and priced for companies with security teams." },
    { pill: "Free", title: "Free scanners", body: "They check packages, but see nothing at runtime and nothing across servers." },
    { pill: "The gap", title: "Small agencies and freelancers", body: "Many servers, many clients, nobody on watch." },
  ] satisfies Card[],
};

export const npmTimeline = {
  id: "timeline",
  label: "Timeline",
  title: "How it unfolded",
  note: "Every date is still to be filled in from the response log.",
  items: [
    { date: "TODO", title: "First detection", body: "Malware found on Server A." },
    { date: "TODO", title: "Server B", body: "The same malware, on a second server." },
    { date: "TODO", title: "Server C", body: "A third server." },
    { date: "TODO", title: "Server D", body: "A fourth server." },
    { date: "TODO", title: "Control addresses blocked", body: "166.88.134.62 and 136.0.9.8 blocked in the firewall." },
    { date: "TODO", title: "Source app identified", body: "Stopping one app: processor use 48% → 8%." },
    { date: "TODO", title: "Secrets rotated", body: "TODO: rotation status." },
    { date: "TODO", title: "Internal watchdog built", body: "An in-house check for the patterns seen here." },
  ],
};

// ── Closing, evidence, references ───────────────────────────────────────────

export const npmClosing: Closing = {
  caseId: "c3c",
  label: "Closing",
  title: "Where it went wrong",
  head: "The tools watched the servers. Nothing watched the packages.",
  body: "Monitoring, firewalls and backups were in place. None of them looked at what npm installed, what Node.js was running, or all four servers at once.",
  compare: {
    had: { title: "What we had", items: ["Monitoring", "Firewalls", "Backups"] },
    needed: { title: "What we needed", items: ["An install gate", "Runtime detection", "One view"] },
  },
  todayTitle: "What you can do today",
  today: [
    "Install with npm ci and a committed lockfile; pin dependency versions.",
    "Stop running apps as root.",
    "Move secrets out of project folders.",
    "Alert on outbound connections to unknown addresses.",
    "After any incident, rotate every secret the server could read.",
  ],
  quote: "Lock what you install. Watch what you run.",
};

export type EvidenceItem = {
  id: string;
  title: string;
  caption: string;
  columns: string[];
  rows: string[][];
  refs?: RefId[];
};

/** Recreated, anonymised exhibits. Values the brief did not supply stay TODO. */
export const npmEvidence: { id: string; label: string; title: string; note: string; items: EvidenceItem[] } = {
  id: "evidence",
  label: "Evidence",
  title: "The exhibits",
  note: "Recreated as tables from the author's notes. Client names, hostnames and server IPs are removed; the malicious command is not reproduced. Rows marked TODO are still to be filled in from the originals.",
  items: [
    {
      id: "e1",
      title: "Process listing",
      caption: "Running programs on an infected server (excerpt).",
      columns: ["User", "Command", "CPU"],
      rows: [
        ["root", "node -e “[scrambled one-line command — not reproduced]”", "TODO"],
        ["root", "node [client app — name withheld]", "TODO"],
        ["TODO", "TODO: further anonymised rows", "TODO"],
      ],
    },
    {
      id: "e2",
      title: "Connection table",
      caption: "Outbound connection attempts from the malicious process.",
      columns: ["Remote address", "Port", "State"],
      rows: [
        ["166.88.134.62", "443", "TODO"],
        ["136.0.9.8", "443", "TODO"],
      ],
    },
    {
      id: "e3",
      title: "VirusTotal result",
      caption: "Reputation of the control-server addresses.",
      columns: ["Address", "Result", "Checked"],
      rows: [
        ["166.88.134.62", "Flagged malicious by 16 security vendors", "TODO: date"],
        ["136.0.9.8", "TODO", "TODO"],
      ],
      refs: ["vt166"],
    },
    {
      id: "e4",
      title: "Process manager output",
      caption: "The worst-hit server, before and after stopping one app.",
      columns: ["State", "Apps running", "Processor use"],
      rows: [
        ["Before", "10 (names withheld)", "48%"],
        ["After stopping one app", "9", "8%"],
      ],
    },
    {
      id: "e5",
      title: "Firewall rules",
      caption: "Rules added during the response.",
      columns: ["Action", "Address", "Note"],
      rows: [
        ["Block", "166.88.134.62", "Control server 1"],
        ["Block", "136.0.9.8", "Control server 2"],
      ],
    },
  ],
};

export const npmRefs: RefId[] = ["vt166", "gridinsoft", "vulert"];
export const npmRefsNote =
  "The two write-ups describe the public @joyfill compromise. Whether the package in this incident was one of those versions is still to verify. TODO: add further public write-ups of the campaign.";

// ── Text drawn inside the visuals ───────────────────────────────────────────

export const npmVisual = {
  servers: ["Server A", "Server B", "Server C", "Server D"],
  calendar: { title: "Weeks · 2026", note: "Dates: TODO" },
  towers: { worst: "Worst hit · 10 apps", other: "Apps: TODO" },
  tree: { root: "Your app", bad: "Poisoned package" },
  nodeBox: { label: "node", markers: ["node", "hidden folder", "port 443"] },
  beacons: ["166.88.134.62", "136.0.9.8"],
  cursor: { owner: "You", stranger: "Someone else" },
  gauges: ["Core 1", "Core 2"],
  checklist: ["Kill processes", "Block addresses", "Search for hidden doors", "Trace the project", "Log everything"],
  wall: { wall: "Firewall", note: "Blocked, still knocking" },
  switches: { before: 48, after: 8, label: "Processor use" },
  magnifier: { ports: ["22", "80", "443", "3000", "5432"], blind: "Filtered out" },
  doors: { front: "npm package", back: "Unconfirmed" },
  keys: ["Passwords", "Database addresses", "API keys", "SSH keys"],
};

// ── Navigation ──────────────────────────────────────────────────────────────

const toNav = (s: QuestionScene): NavItem => ({ n: s.n, id: s.id, title: s.question, caseId: s.caseId });

const rail: NavItem[] = [
  ...attackScenes.map(toNav),
  ...responseScenes.map(toNav),
  { n: npmLesson.n, id: npmLesson.id, title: npmLesson.question, caseId: "c3b" },
  { n: npmLessons.n, id: npmLessons.id, title: npmLessons.question, caseId: "c3c" },
  toNav(q18),
];

export const npmNav: StudyNav = {
  rail,
  index: [
    {
      head: "Front",
      items: [
        { n: "00", id: "front", title: "Front page" },
        { n: "—", id: npmParts.attack.id, title: "Part 01 — The attack", caseId: "c3a" },
        ...rail.slice(0, 7),
        { n: "—", id: "who-did-it", title: "Sidebar: who did it?", caseId: "c3a" },
      ],
    },
    {
      head: "Part 02 — The response",
      items: [{ n: "—", id: npmParts.response.id, title: "Hook", caseId: "c3b" }, ...rail.slice(7, 16)],
    },
    {
      head: "Part 03 — The fix",
      items: [
        { n: "—", id: npmParts.fix.id, title: "Part 03 — The fix", caseId: "c3c" },
        ...rail.slice(16),
        { n: "—", id: npmGap.id, title: npmGap.title, caseId: "c3c" },
        { n: "—", id: npmTimeline.id, title: npmTimeline.title, caseId: "c3c" },
      ],
    },
    {
      head: "Back matter",
      items: [
        { n: "—", id: "closing", title: npmClosing.label },
        { n: "—", id: npmEvidence.id, title: npmEvidence.label },
        { n: "—", id: "references", title: "References" },
      ],
    },
  ],
};
