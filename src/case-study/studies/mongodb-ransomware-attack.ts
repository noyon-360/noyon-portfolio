// Every word on /case-study/mongodb-ransomware-attack. This is the author's own incident write-up (9 Oct 2026).
// Facts come only from the author's report; each claim keeps the confidence the report gives it, and anything
// the logs do not prove carries a visible stamp. Anonymised: no business name, people's names or IP addresses.
// The only published sources are for the Shwapno comparison, which reuses that study's references.
import type { Card, Closing, Front, NavItem, QuestionScene, RefId, Stat, StudyNav } from "../content";

const UNCONFIRMED = "Possible — unconfirmed";

// ── Front page ──────────────────────────────────────────────────────────────

export const mongoFront: Front = {
  caseId: "c4",
  kicker: "Cybersecurity Incident Case Study",
  masthead: "MongoDB Ransomware Attack",
  edition: "Interactive edition · 9 Oct 2026",
  dateline: "Special report · Production database · 2025–26 · Ten questions",
  headline: "Nineteen months with the door open",
  deck: "A live database sat on the open internet with authentication switched off. Scanners found it, planted a backdoor account, then wiped every collection and left a ransom note. There was no backup.",
  read: "#hook",
  globeAlt: "A slow wireframe network of connected boxes turns behind the masthead.",
  cover: "network",
};

export const mongoMarquees = {
  front: ["port 27017", "bindIp 0.0.0.0", "23 Feb 2025", "19 months", "osysadmin", "14 Sep 2026", "13 collections", "0 backups"],
  middle: ["15:19:43 UTC", "0.0063 BTC", "~USD 400", "GBP 10,000+", "Not paid", "Preserve", "Contain", "Rebuild"],
};

export const mongoHook = {
  id: "hook",
  caseId: "c4" as const,
  eyebrow: "Special report — Production database",
  title: "The open door",
  text: "Nobody guessed a password. Nobody needed one. For nineteen months, anyone who knocked on port 27017 walked in as the administrator.",
};

export const mongoDefinitions = {
  auth: {
    term: "Authentication",
    say: "au·then·ti·ca·tion  /ɔːˌθɛn.tɪˈkeɪ.ʃən/",
    pos: "noun · access control",
    meaning:
      "Proving who you are before you are let in. A database with authentication switched off treats every connection as its administrator: like a front door with no lock, where turning the handle is enough.",
    synonyms: ["sign-in", "login", "access check"],
  },
  depth: {
    term: "Defence in depth",
    say: "de·fence in depth  /dɪˈfɛns ɪn dɛpθ/",
    pos: "noun · security principle",
    meaning:
      "Stacking independent safeguards so that no single mistake is decisive. It assumes a configuration error will happen, and makes sure another layer catches it.",
    synonyms: ["layered defence", "Swiss cheese model"],
  },
};

// ── Questions ───────────────────────────────────────────────────────────────

export const mongoScenes: QuestionScene[] = [
  {
    n: "01",
    id: "q01",
    caseId: "c4",
    label: "The attack",
    question: "What happened?",
    meta: { category: "Ransomware", date: "Feb 2025 – Sep 2026", source: "MongoDB server log" },
    steps: [
      {
        kicker: "Feb 2025",
        body: "MongoDB is installed on 20 February 2025, reachable only from the server itself. Three days later it is restarted listening on every network, with authentication off. An outside connection arrives 24 minutes later.",
      },
      {
        kicker: "19 months",
        body: "A change back toward localhost is tried on 24 February, then reverted within the hour. Restarts in March 2025 and June 2026 leave the setting untouched. The database stays public and unlocked.",
      },
      {
        kicker: "Jul–Aug 2026",
        body: "Five outside sessions between 3 July and 29 August show access patterns consistent with bulk export. The logs prove the connections; they do not prove a copy was taken.",
        flag: UNCONFIRMED,
      },
      {
        kicker: "11 Sep 2026",
        body: "An outside address creates a root-level account named osysadmin through a Python database client. A door is left open for later.",
      },
      {
        kicker: "14 Sep 2026",
        body: "At 15:19:43 UTC a different address drops all thirteen application collections, one by one, and creates a ransom database. It takes under a minute. Nobody is alerted; it is found three days later.",
      },
    ],
    alt: "A long timeline bar spanning nineteen months, not to scale. From February 2025 it glows as an open door; five faint marks rise in July and August 2026, then an amber marker for the backdoor account on 11 September and a tall red marker for the wipe on 14 September.",
    refs: [],
    evidence: ["e1", "e3", "e4"],
    next: "So what was sitting behind that open door?",
  },
  {
    n: "02",
    id: "q02",
    caseId: "c4",
    label: "The target",
    question: "What system was affected?",
    meta: { category: "Production system", date: "2025–26", source: "Server configuration" },
    steps: [
      {
        kicker: "The app",
        body: "A private messaging app built for a UK-based business owner: group chats, broadcast channels, invite links and one-time-passcode sign-in. Live on Google Play for Android; iOS in TestFlight testing.",
      },
      {
        kicker: "The server",
        body: "One Amazon Web Services (AWS) EC2 cloud server running Ubuntu, owned by the business. A single MongoDB 7.0.16 database: no replica set, and no backups found.",
      },
      {
        kicker: "The door",
        body: "Port 27017, the database's network door, was reachable from any address on the internet. Authentication was disabled for the whole exposure window.",
      },
      {
        kicker: "Why it hurt",
        body: "The app was already live, so the database held real operational data. It was the business's main channel to its customers, not a side system.",
      },
    ],
    alt: "A single server box with one port on its face, labelled 27017, standing open. Small dots — automated scanners — arrive from every direction and pass straight in; there is no lock on the port.",
    refs: [],
    evidence: ["e2", "e5"],
    next: "What was inside, and what is gone?",
  },
  {
    n: "03",
    id: "q03",
    caseId: "c4",
    label: "The loss",
    question: "What was lost, and what may have been taken?",
    meta: { category: "Data loss", date: "14 Sep 2026", source: "Server log · collection counts" },
    steps: [
      {
        kicker: "Deleted",
        body: "Thirteen collections, the database's tables, were dropped one by one. Deletion is proven by the server log.",
      },
      {
        kicker: "Survivors",
        body: "Only records written between 14 and 17 September survived. The app created them itself after the wipe; nothing was recovered.",
      },
      {
        kicker: "Taken?",
        body: "Five earlier sessions look consistent with bulk export. MongoDB's default logging does not record how many documents left the server, so theft can be neither proven nor ruled out.",
        flag: UNCONFIRMED,
      },
      {
        kicker: "Act anyway",
        body: "Two collections demand action either way. eckeys held cryptographic key material: rotate it. devicetokens can push notifications to real devices: invalidate and reissue them.",
      },
    ],
    alt: "Thirteen database drums stand in a grid, one per collection. One by one they drain and vanish, until a single small red block, the ransom database, is left in their place.",
    refs: [],
    evidence: ["e1", "e6"],
    next: "Whose data was it?",
  },
  {
    n: "04",
    id: "q04",
    caseId: "c4",
    label: "The people",
    question: "Who was affected?",
    meta: { category: "Impact", date: "Sep 2026", source: "Author's assessment" },
    steps: [
      {
        kicker: "The owner",
        body: "The business owner lost eighteen months of customer conversations, order history and invoicing correspondence, including the thread behind one pending invoice over GBP 10,000. Technical management had been delegated.",
      },
      {
        kicker: "End users",
        body: "Users lost their message history without warning or any say. If the data was copied, their private conversations sit with a stranger, and they have no way to know.",
      },
      {
        kicker: "The developers",
        body: "The team could no longer verify months of delivered work: an emptied database makes failures look identical to code defects. They also absorbed the first blame.",
      },
      {
        kicker: "Third parties",
        body: "Anyone in a user's contacts or group chats was in the database without ever using the app: no relationship with the business, no chance to consent.",
      },
    ],
    alt: "Four groups of figures stand side by side: end users, the business owner, the development team and third parties in users' contacts. A ripple passes through all four. Group sizes are illustrative.",
    refs: [],
    next: "What does that mean for the people using the app?",
  },
  {
    n: "05",
    id: "q05",
    caseId: "c4",
    label: "The users",
    question: "What does this mean for end users?",
    meta: { category: "Impact", date: "Sep 2026", source: "Author's assessment" },
    steps: [
      {
        kicker: "Now",
        body: "The immediate harm is lost history: conversations, shared files and records gone, with no version to restore. For users who kept business records in the app, that includes evidence they may later need.",
      },
      {
        kicker: "If copied",
        body: "If the data was copied, the harm lasts longer. Message content cannot be reissued or revoked: unlike a password, it stays sensitive for good.",
      },
      {
        kicker: "Don't wait",
        body: "Five actions should not wait for proof of theft. The last one, telling users plainly, is the step most often skipped.",
      },
    ],
    alt: "",
    refs: [],
    next: "And what did it cost the business?",
  },
  {
    n: "06",
    id: "q06",
    caseId: "c4",
    label: "The cost",
    question: "What was the business impact?",
    meta: { category: "Business impact", date: "Sep 2026", source: "Author's assessment" },
    steps: [
      {
        kicker: "Money",
        body: "One identified invoice above GBP 10,000 lost its supporting correspondence. Orders not yet formalised and agreements recorded only in chat cannot be counted: the record that would count them is gone.",
      },
      {
        kicker: "Operations",
        body: "The app stayed live on Google Play, so users kept opening an app that no longer knew them: failed sign-ins, empty chat lists and “user not found”, with no explanation.",
      },
      {
        kicker: "Trust",
        body: "It surfaced in a tense delivery period. The failures were blamed on the development work first; the attack, found afterwards, arrived sounding like an excuse.",
      },
      {
        kicker: "Logs decide",
        body: "The commercial dispute that followed could not be settled by either party's account of events. Only the logs could settle it.",
      },
    ],
    alt: "A trust dial drains from full to nearly empty while four cards stack beside it: users report failures; the failures are blamed on the development work; the attack is found and sounds like an excuse; trust degrades either way. Illustrative, not measured.",
    refs: [],
    next: "So who was on the other end?",
  },
  {
    n: "07",
    id: "q07",
    caseId: "c4",
    label: "The attacker",
    question: "Who did it?",
    meta: { category: "Attribution", date: "Sep 2026", source: "Ransom note · server log" },
    steps: [
      { kicker: "Unknown", body: "Nobody has been identified, and this report does not speculate. The evidence describes a method, not a name." },
      {
        kicker: "A template",
        body: "The ransom note carried a reference code, repeated in its contact address: one code per victim, so the operators can match a payment to a database they no longer remember individually.",
      },
      {
        kicker: "The price",
        body: "The demand was 0.0063 bitcoin, roughly USD 400 at the time: low enough that a share of thousands of victims pay without arguing. Targeted extortion looks nothing like this.",
      },
      {
        kicker: "Two addresses",
        body: "One address planted the osysadmin account; a different one ran the wipe three days later. That split is routine housekeeping on the attacker's side, not evidence of a conspiracy.",
      },
      {
        kicker: "Not singled out",
        body: "No competitor, insider or disgruntled party chose this target. A scanner found it, as it found thousands of others that week, because the door was open.",
      },
    ],
    alt: "Two distant red beacons with dashed lines reaching toward them, labelled Address 1, backdoor, 11 September, and Address 2, wipe, 14 September. The real addresses are not shown.",
    refs: [],
    evidence: ["e1", "e3", "e4"],
    next: "So how did the door come to be open?",
  },
  {
    n: "08",
    id: "q08",
    caseId: "c4",
    label: "The cause",
    question: "What was the root cause?",
    meta: { category: "Root cause", date: "Feb 2025 – Sep 2026", source: "Configuration file · firewall rules" },
    steps: [
      {
        kicker: "Open to all",
        body: "MongoDB was set to bindIp 0.0.0.0: listen on every network, including the public internet. It is a common development shortcut that makes a remote database tool work at once.",
      },
      {
        kicker: "No lock",
        body: "Authentication was off. Without it, any connection is an administrator connection: the first scanner to arrive had full control.",
      },
      {
        kicker: "No fence",
        body: "The cloud firewall did not limit port 27017 to the app server or a trusted address. One correct rule would have made the first two failures harmless.",
      },
      {
        kicker: "No copy",
        body: "No backups existed. The first three failures let the attack happen; this one made the damage permanent. A thirty-minute backup task would have turned it into an afternoon's restore.",
      },
      {
        kicker: "Never reviewed",
        body: "The setting was changed once, three days after installation, and never reviewed again. No alert fired and no audit ran for nineteen months.",
      },
    ],
    alt: "Four slices of a safeguard stand one behind another: bind address, authentication, firewall and backups. Each has a hole; as you scroll the holes line up and a red line passes straight through all four. Illustrative.",
    refs: [],
    evidence: ["e2", "e5"],
    next: "Once it was found, what was done?",
  },
  {
    n: "09",
    id: "q09",
    caseId: "c4",
    label: "The response",
    question: "How was it handled?",
    meta: { category: "Incident response", date: "Sep 2026", source: "Author's account" },
    steps: [
      {
        kicker: "Preserve",
        body: "The ransom database and server logs were kept, not deleted. They were the only timeline, the only proof of an outside attack, and the only material a dispute could be settled on.",
      },
      {
        kicker: "Contain",
        body: "Close the port at the cloud firewall, rebind the database to the server itself, turn on authentication, remove unknown accounts, rotate secrets, and set up tested off-server backups.",
      },
      {
        kicker: "The easy miss",
        body: "Removing the backdoor account is the step most easily missed. Securing the service while osysadmin remains gives a system that looks protected and is not.",
      },
      {
        kicker: "Not recoverable",
        body: "The data could not be recovered. Dropped collections can sometimes be rebuilt from disk if the server is imaged at once, but the app kept writing for three more days.",
      },
      {
        kicker: "Not paid",
        body: "The ransom was not paid. In automated campaigns, payment buys a claim, not a dataset: the note's promise of a backup is generated for every victim.",
      },
    ],
    alt: "Red arcs fly toward a wall and stop at it, again and again: port 27017 closed at the cloud firewall.",
    refs: [],
    evidence: ["e1", "e4", "e5"],
    next: "Then who was responsible?",
  },
  {
    n: "10",
    id: "q10",
    caseId: "c4",
    label: "Responsibility",
    question: "Who was responsible?",
    meta: { category: "Analysis", date: "2026", source: "Author's assessment" },
    steps: [
      {
        kicker: "Distributed",
        body: "Responsibility here is distributed. A case study that pins all of it on one party is usually serving an argument, not describing what happened.",
      },
      {
        kicker: "The hard part",
        body: "The deletion was a third party's act. The exposure was not: someone set the database to listen everywhere with no lock, and it stayed that way through nineteen months of restarts.",
      },
      {
        kicker: "Still unknown",
        body: "Three things need documents this analysis does not have: the written scope of work, who held admin access and made each change, and whether the risk was ever flagged.",
      },
      {
        kicker: "Fair reading",
        body: "A third party destroyed the data, an insecure configuration made it possible, and a missing backup made it permanent. Three failures, and they do not all belong to the same party.",
      },
    ],
    alt: "",
    refs: [],
    next: "What should other teams take from it?",
  },
];

// ── Scene extras ────────────────────────────────────────────────────────────

export const mongoSystem: [string, string][] = [
  ["Application", "Private messaging: group chats, broadcast channels, invite links, one-time-passcode sign-in"],
  ["Platforms", "Android, live on Google Play; iOS in TestFlight testing"],
  ["Hosting", "AWS EC2 server, Ubuntu, owned by the business"],
  ["Database", "MongoDB 7.0.16, single instance, no replica set"],
  ["Exposed service", "TCP port 27017, reachable from any address"],
  ["Authentication", "Disabled for the entire exposure window"],
  ["Backups", "None found"],
];

export type Collection = { name: string; contents: string; sensitivity: "Critical" | "High" | "Medium" | "Low" };

/** The thirteen dropped collections. Deletion of every one is confirmed; sensitivity is "if copied". */
export const mongoCollections: Collection[] = [
  { name: "users", contents: "Account records, profile details, contact identifiers", sensitivity: "High" },
  { name: "messages", contents: "Full message history", sensitivity: "Critical" },
  { name: "chats", contents: "Conversation structure", sensitivity: "High" },
  { name: "chatparticipants", contents: "Conversation membership", sensitivity: "High" },
  { name: "channels", contents: "Broadcast channel definitions", sensitivity: "Medium" },
  { name: "savedmessages", contents: "Saved user content", sensitivity: "Medium" },
  { name: "stories", contents: "Ephemeral user content", sensitivity: "Medium" },
  { name: "notifications", contents: "Activity metadata", sensitivity: "Medium" },
  { name: "callhistories", contents: "Call metadata", sensitivity: "Medium" },
  { name: "devicetokens", contents: "Push notification tokens per device", sensitivity: "High" },
  { name: "eckeys", contents: "Cryptographic key material", sensitivity: "Critical" },
  { name: "blockedusers", contents: "Moderation records", sensitivity: "Low" },
  { name: "reports", contents: "Moderation records", sensitivity: "Low" },
];

export const userHarms: Card[] = [
  { pill: "If copied", title: "Private conversations in unknown hands", body: "Message content cannot be reissued or revoked. Unlike a password, it is permanently sensitive." },
  { pill: "If copied", title: "The contact graph", body: "Who talks to whom, how often, in which groups. Often more revealing than the messages, because people do not think of it as data." },
  { pill: "If copied", title: "Targeted social engineering", body: "With real conversation history, an attacker can impersonate a known contact convincingly. A message quoting a real past exchange is hard to spot." },
  { pill: "If copied", title: "Push notification abuse", body: "Leaked device tokens can let an attacker's message arrive on real phones, carrying the credibility of the app's own branding." },
  { pill: "If copied", title: "Cryptographic exposure", body: "If key material was usable, protections users assumed were in place may not have held." },
];

export const userActions = [
  "Invalidate all sessions and force everyone to sign in again.",
  "Rotate every credential and secret stored in, or reachable from, the database.",
  "Reissue push notification tokens.",
  "Generate new cryptographic keys rather than reusing any that were present.",
  "Tell users in plain language what is known, what is uncertain, and what to watch for.",
];

export const costStats: Stat[] = [
  { value: 10000, prefix: "£", suffix: "+", label: "One pending invoice that lost its paper trail" },
  { value: 18, label: "Months of message history erased" },
  { value: 13, label: "Collections deleted" },
  { value: 0, label: "Backups to restore from" },
];

export const ransomStats: Stat[] = [
  { value: 0, text: "0.0063 BTC", label: "Ransom demanded", note: "roughly USD 400 at the time" },
  { value: 3, label: "Days between backdoor and wipe" },
  { value: 0, text: "< 1 min", label: "Time to drop every collection" },
  { value: 0, label: "Ransom paid" },
];

export const addressesNote = {
  title: "On the addresses in the logs",
  body: "An IP address identifies a network endpoint at a moment in time, not a person. Any of these may be a rented server, someone else's hacked machine, a VPN exit or a proxy. The right use is narrow: report them to the providers that control them, and keep them as evidence. They are not published here.",
};

export const rootCauses: Card[] = [
  { pill: "Exposure", title: "Open to the internet", body: "bindIp 0.0.0.0 turned a private service into a public one." },
  { pill: "Access", title: "Authentication off", body: "Every connection was an administrator connection." },
  { pill: "Network", title: "No firewall rule", body: "Nothing kept outsiders away from port 27017." },
  { pill: "Recovery", title: "No backups", body: "Nothing to restore, so the loss was permanent the moment it happened." },
];

export const persistence = {
  title: "The persistence account",
  body: "Three days before the wipe, a root-level account named osysadmin was created through a Python database client. The name is chosen to look like a legitimate system account, so an administrator skimming a user list skips it. It is a valid credential: it survives a firewall fix and an authentication rollout. Any clean-up that does not audit every existing account leaves the attacker's access intact.",
};

export const containment: Card[] = [
  { pill: "Firewall", title: "Restrict port 27017", body: "Remove public reachability immediately." },
  { pill: "Network", title: "Rebind to localhost or a private interface", body: "Close the exposure at its source." },
  { pill: "Access", title: "Enable authentication", body: "A dedicated least-privilege user: a connection alone is no longer control." },
  { pill: "Persistence", title: "Audit and remove unknown accounts", body: "Revoke the attacker's way back in. The easiest step to miss." },
  { pill: "Secrets", title: "Rotate all application secrets", body: "Treat anything reachable from the database as compromised." },
  { pill: "Recovery", title: "Tested, off-server backups", body: "Make the next incident recoverable." },
];

export const responsibility: [string, string][] = [
  ["Who deleted the data?", "An external, unauthorised third party. Not in dispute."],
  ["Who configured the exposure?", "Whoever made the 23 February 2025 configuration change. Determinable from access records."],
  ["Who operated the server for 19 months afterwards?", "Anyone with administrative access during that period: potentially several parties."],
  ["Who was responsible for backups?", "Decided by the written scope of work, not by technical convention."],
];

export const responsibilityNote =
  "The most defensible position in a dispute like this is to concede what the evidence shows. An accurate account that admits a configuration failure is far more credible than a denial that collapses the moment someone reads the logs.";

// ── Timeline ────────────────────────────────────────────────────────────────

export type Confidence = "Confirmed" | "Possible, unconfirmed";

export const mongoTimeline: {
  id: string;
  label: string;
  title: string;
  note: string;
  items: { date: string; source: "Internal" | "External" | "Development"; body: string; confidence: Confidence }[];
} = {
  id: "timeline",
  label: "Timeline",
  title: "Nineteen months, eleven entries",
  note: "Each confidence rating reflects what the server logs prove, not what is probable. All times UTC.",
  items: [
    { date: "20 Feb 2025 · 15:54", source: "Internal", body: "MongoDB 7.0.16 installed, bound to localhost only. Secure at this point.", confidence: "Confirmed" },
    { date: "23 Feb 2025 · 16:00", source: "Internal", body: "Restarted with bindIp 0.0.0.0 and authentication disabled. The exposure begins.", confidence: "Confirmed" },
    { date: "23 Feb 2025 · 16:24", source: "External", body: "First remote connection, 24 minutes later.", confidence: "Confirmed" },
    { date: "24 Feb 2025 · 09:00", source: "Internal", body: "A change back toward localhost is attempted, then reverted within the hour.", confidence: "Confirmed" },
    { date: "13 Mar 2025", source: "Internal", body: "Service restarted; still public, still unauthenticated.", confidence: "Confirmed" },
    { date: "Feb – Dec 2025", source: "Development", body: "Routine development and SSH activity throughout.", confidence: "Confirmed" },
    { date: "28 Jun 2026 · 08:48", source: "Internal", body: "Restart during an EC2 Instance Connect session; configuration unchanged.", confidence: "Confirmed" },
    { date: "3 Jul – 29 Aug 2026", source: "External", body: "Five sessions with access patterns consistent with bulk export.", confidence: "Possible, unconfirmed" },
    { date: "11 Sep 2026 · 12:36:21", source: "External", body: "Root-level account osysadmin created via a Python client.", confidence: "Confirmed" },
    { date: "14 Sep 2026 · 15:19:43", source: "External", body: "All thirteen application collections dropped one by one; ransom database created.", confidence: "Confirmed" },
    { date: "17 Sep 2026", source: "Internal", body: "Found during routine testing. Only data created since 14 September remains.", confidence: "Confirmed" },
  ],
};

// ── Lessons, comparison, evidence ───────────────────────────────────────────

export const mongoLessons = {
  id: "lessons",
  label: "Lessons",
  title: "Nine controls, any one of which would have helped",
  meta: { category: "Lessons", date: "2026", source: "Author's recommendations" },
  intro: "Each control would have independently prevented or limited this incident. That is the point of defence in depth: no single mistake is decisive.",
  controls: [
    ["Never bind a database to 0.0.0.0", "Removes the exposure entirely"],
    ["Enable authentication before any data exists", "Makes a connection insufficient for control"],
    ["Restrict database ports at the firewall", "Contains a configuration error before it matters"],
    ["Automated, tested, off-server backups", "Turns permanent loss into a restoration task"],
    ["Audit database accounts regularly", "Catches persistence accounts like osysadmin"],
    ["Alert on destructive operations", "Detection in minutes rather than three days"],
    ["Separate development and production", "Keeps development shortcuts away from real data"],
    ["Written ownership of infrastructure security", "Removes the ambiguity that fuels disputes"],
    ["A rehearsed incident response plan", "Preserve, contain, rebuild: decided before the pressure"],
  ] as [string, string][],
  topThree: [
    {
      pill: "Most important",
      title: "Backups work after everything else fails",
      body: "Other controls lower the odds of an incident; backups lower its cost to near zero. And an untested backup should be assumed not to exist.",
    },
    {
      pill: "The usual cause",
      title: "Convenience becomes configuration",
      body: "bindIp 0.0.0.0 was almost certainly set to make a tool work during development. Nothing caught it before launch or in the nineteen months after. Every team has a line like this somewhere.",
    },
    {
      pill: "Monitoring",
      title: "No alarm is not no problem",
      body: "The database was reachable and accessed for nineteen months, and nobody knew until the app broke. Silence from an unmonitored system carries no information.",
    },
  ] satisfies Card[],
  smallTeams:
    "Attackers scan continuously and at no cost; defenders need to be wrong only once, often with no security staff at all. The upside: a firewall rule, an authentication flag and a scheduled backup cost a few hours in total, and they stop being optional the moment real user data is involved.",
};

export const mongoLesson = {
  id: "lesson",
  quote: "The database was open, it was unauthenticated, and no backup existed. Everything else was a matter of time.",
};

export const mongoComparison = {
  id: "comparison",
  label: "Comparison",
  title: "The Shwapno breach, side by side",
  meta: { category: "Comparison", date: "2025–26", source: "Bangladeshi press" },
  intro:
    "In August 2025 attackers reached the customer database of Shwapno, Bangladesh's largest supermarket chain: 812 outlets in 63 districts and more than four million registered customers. They demanded about USD 1.5 million. The company refused and told no one. In late March 2026 the data was published, and the company confirmed the breach on 28–29 March, roughly seven months after it began.",
  columns: ["", "This incident", "Shwapno"],
  rows: [
    ["Scale", "One small business, its users and contacts", "4 million+ customers"],
    ["Entry", "Open port, no authentication", "Not publicly disclosed"],
    ["Attacker aim", "Automated extortion, ~USD 400", "Targeted extortion, ~USD 1.5m"],
    ["Ransom paid", "No", "No"],
    ["Primary damage", "Data destroyed, no backup", "Data published seven months later"],
    ["Users told", "Found through app failure", "Learned from social media"],
    ["Core failure", "Exposure", "Disclosure"],
  ],
  shows: {
    head: "Opposite ends of the same process",
    body: "One left a door open and lost everything behind it. The other closed its door competently, then decided the people whose data had walked out did not need to be told. Regaining control of a system does not undo a theft; the only variable left is whether people hear it from the organisation or from a stranger online.",
  },
  shared:
    "Both are failures of assumption, not sophistication. Shwapno assumed securing the breach ended the exposure; this incident assumed a development setting would be reviewed before it mattered. When users are finally told, the damage comes less from the breach than from the delay.",
  refs: ["tbs", "dailystar", "fe", "dhakatribune"] as RefId[],
  link: { label: "Read the Shwapno case study", href: "/case-study/shwapno-data-breach" },
};

export type EvidenceItem = { id: string; title: string; supports: string };

export const mongoEvidence = {
  id: "evidence",
  label: "Evidence",
  title: "Evidence held, and what is still open",
  note: "All of it should be copied off the server, hashed, and stored with a record of who collected what and when. Evidence that lives only on the affected server is one restart away from being gone. None of it is reproduced here.",
  items: [
    { id: "e1", title: "MongoDB server log", supports: "The full timeline, connection sources and the drop operations" },
    { id: "e2", title: "MongoDB configuration file", supports: "The exposure and the disabled authentication" },
    { id: "e3", title: "Database account listing", supports: "The unauthorised root account and its creation time" },
    { id: "e4", title: "The ransom database and note", supports: "Proof that an outside extortion attempt occurred" },
    { id: "e5", title: "Cloud firewall rules", supports: "Whether the port was reachable publicly" },
    { id: "e6", title: "Collection counts after the incident", supports: "The extent of the loss and the post-wipe writes" },
  ] satisfies EvidenceItem[],
  openTitle: "Questions still open",
  open: [
    ["Was the data actually copied?", "Needs network flow logs or hosting egress figures. Connection logs cannot answer it, and the attacker's claim is not evidence."],
    ["Did the attacker reach the operating system?", "Database access and shell access are different levels of compromise. Until system authentication logs are reviewed, a full server rebuild is the safer assumption."],
    ["Was any other persistence set up?", "The database account was found. Scheduled tasks, SSH keys and system services have not been ruled out."],
    ["Did any backup or snapshot exist before 14 September 2026?", "Confirming the absence matters as much as finding one: it decides whether recovery was ever possible."],
    ["What secrets were stored inside the database?", "This decides the full scope of the rotation work."],
  ] as [string, string][],
  method:
    "Every conclusion here is labelled by the strength of its evidence, and the questions above are left open rather than filled with a plausible guess. A complete narrative is usually the sign that evidence has been stretched to cover a gap.",
};

// ── Closing and references ──────────────────────────────────────────────────

export const mongoClosing: Closing = {
  caseId: "c4",
  label: "Closing",
  title: "Where it went wrong",
  head: "The door was open, the lock was off, and there was no copy.",
  body: "A third party destroyed the data. Three cheap controls (a firewall rule, an authentication flag and a scheduled backup) cost a few hours in total, and any one of them would have changed the outcome.",
  compare: {
    had: { title: "What was there", items: ["A live app with real users", "A public cloud server", "A development-time setting"] },
    needed: { title: "What was missing", items: ["A closed port", "Authentication on", "Tested, off-server backups"] },
  },
  todayTitle: "What you can do today",
  today: [
    "Check that no database on your servers listens on 0.0.0.0 or is reachable from the internet.",
    "Turn on authentication, with a least-privilege user for the app.",
    "Restrict database ports in your cloud firewall to the app server only.",
    "Schedule an off-server backup, then actually restore from it once.",
    "List every database account and remove any you do not recognise.",
  ],
  quote: "Close the port. Lock the door. Test the backup.",
};

export const mongoRefs: RefId[] = ["tbs", "dailystar", "fe", "dhakatribune"];
export const mongoRefsNote =
  "The MongoDB incident is documented from the author's own evidence (server log, configuration, account listing, ransom note); it has no published sources. The references support the Shwapno comparison only.";

// ── Text drawn inside the visuals ───────────────────────────────────────────

export const mongoVisual = {
  timeline: {
    events: ["Port opened · 23 Feb 2025", "Restart · Mar 2025", "Restart · Jun 2026", "Five sessions · Jul–Aug 2026", "osysadmin created · 11 Sep", "Collections dropped · 14 Sep", "Discovered · 17 Sep"],
    note: "Not to scale",
  },
  port: { port: "27017", lock: "No authentication", note: "Scanner dots illustrative" },
  ransom: "Ransom database",
  crowd: ["End users", "Business owner", "Developers", "Third parties"],
  crowdNote: "Group sizes illustrative",
  gauge: {
    label: "Trust",
    cards: ["Users report failures", "Blamed on the development work", "The attack is found — sounds like an excuse", "Trust degrades either way"],
    note: "Illustrative, not measured",
  },
  beacons: ["Address 1 · backdoor · 11 Sep", "Address 2 · wipe · 14 Sep"],
  layers: ["Bind address", "Authentication", "Firewall", "Backups"],
  wall: { wall: "Cloud firewall", note: "Port 27017 closed" },
};

// ── Navigation ──────────────────────────────────────────────────────────────

const toNav = (s: QuestionScene): NavItem => ({ n: s.n, id: s.id, title: s.question, caseId: s.caseId });

const rail: NavItem[] = mongoScenes.map(toNav);

export const mongoNav: StudyNav = {
  rail,
  index: [
    { head: "Front", items: [{ n: "00", id: "front", title: "Front page" }] },
    {
      head: "The case",
      items: [
        { n: "—", id: mongoHook.id, title: "Hook", caseId: "c4" },
        rail[0],
        { n: "—", id: mongoTimeline.id, title: "Timeline", caseId: "c4" },
        ...rail.slice(1),
      ],
    },
    {
      head: "Lessons",
      items: [
        { n: "—", id: mongoLessons.id, title: mongoLessons.label, caseId: "c4" },
        { n: "—", id: mongoComparison.id, title: mongoComparison.title, caseId: "c4" },
      ],
    },
    {
      head: "Back matter",
      items: [
        { n: "—", id: mongoEvidence.id, title: mongoEvidence.label },
        { n: "—", id: "closing", title: mongoClosing.label },
        { n: "—", id: "references", title: "References" },
      ],
    },
  ],
};
