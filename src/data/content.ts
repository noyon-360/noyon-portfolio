import type { CraftArtId } from "@/components/CraftArt";

// Public-folder URLs need the GitHub Pages sub-path (basePath) prepended.
const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const profile = {
  name: "Nazibullah Noyon",
  shortName: "Noyon",
  title: "Cyber Security Researcher & Software Engineer",
  roles: ["Security research", "Mobile, Web & Backend"],
  location: "Gazipur, Bangladesh",
  timezone: "UTC +06:00",
  // IANA zone for the live clock in the hero.
  timeZone: "Asia/Dhaka",
  email: "nazibullahnoyon19.20@gmail.com",
  phone: "+8801305223046",
  summary:
    "Cyber security researcher: finding system vulnerabilities, analysing malware, studying zero-day exploits and designing defences, including adversarial machine-learning models. Working in Kali Linux with Burp Suite, Nmap, Metasploit, MobSF and Python. Behind that, a software engineer with 35+ cross-platform apps shipped to Google Play and the App Store, full-stack across Flutter and NestJS/Firebase — so I know how the systems I attack are built.",
  // Drop the PDF into /public with this name to enable the download button.
  cv: asset("/Nazibullah_Noyon_CV.pdf"),
  // Square headshot shown beside the name in the navbar; initials show until the file exists.
  photo: asset("/avatar.jpg"),
  socials: [{ label: "GitHub", href: "https://github.com/noyon-360" }],
};

// The Intro section's take on the summary: short statements that fill in as you scroll, then the
// toolkit as tags. `accents` fill in a colour instead of the text colour.
export const intro = {
  lines: [
    "Cyber security researcher: vulnerabilities, malware, zero-days and ML-based defences.",
    "Software engineer with 35+ cross-platform apps shipped to Google Play and the App Store.",
    "Full-stack across the Flutter client and the NestJS/Firebase backend behind it.",
    "I own features end to end, from architecture to release.",
  ],
  accents: [
    { text: "Cyber security researcher", className: "font-semibold text-server" },
    { text: "35+ cross-platform apps", className: "font-semibold text-text" },
    { text: "Flutter client", className: "text-client" },
    { text: "NestJS/Firebase backend", className: "text-server" },
  ],
  toolkit: ["Kali Linux", "Burp Suite", "Nmap", "Metasploit", "MobSF", "Clean Architecture", "State management", "Media streaming", "Payments", "CI/CD"],
};

export const stats = [
  { value: "35+", label: "apps shipped to Google Play & App Store" },
  { value: "14", label: "engineers led and mentored" },
  { value: "99%", label: "crash-free sessions across the portfolio" },
  { value: "6", label: "releases per month, automated" },
];

export type Accent = "client" | "server" | "ops" | "craft";

// Every entry is one station of a 3D tour. The pool is split into a skills tour and a projects tour below.
export type TourEntry = {
  id: string;
  label: string;
  /** Projects only: the line above the title, e.g. "Client project · Bus booking". */
  tag?: string;
  title: string;
  accent: Accent;
  summary: string;
  proof: string[];
  metric: { value: string; label: string };
  tools: string[];
};

const tourEntries: TourEntry[] = [
  {
    id: "flutter",
    label: "Flutter & Dart",
    title: "Flutter apps, shipped at scale",
    accent: "client",
    summary:
      "Cross-platform apps for Android, iOS and Android TV — from first screen to store listing, then maintained in production.",
    proof: [
      "Shipped and maintained 35+ apps across Google Play and the App Store",
      "Dart and TypeScript; custom widgets, animations and Platform Channels (Kotlin/Swift)",
      "Cut app startup from 3s to 1.5s with Flutter DevTools profiling",
    ],
    metric: { value: "35+", label: "apps live" },
    tools: ["Dart", "Flutter", "go_router", "Platform Channels", "DevTools", "TypeScript", "SQL"],
  },
  {
    id: "architecture",
    label: "Architecture & tests",
    title: "Clean Architecture, tested",
    accent: "client",
    summary:
      "Presentation, domain and data kept apart, so features stay testable and a change in one layer doesn't ripple through the app.",
    proof: [
      "Clean Architecture, MVVM, Repository Pattern and DI across the portfolio",
      "Bloc/Cubit, Riverpod, Provider and GetX — picked per project",
      "Unit, widget, integration, golden and mock-based tests",
    ],
    metric: { value: "99%", label: "crash-free sessions" },
    tools: ["Clean Architecture", "MVVM", "DI", "Bloc/Cubit", "Riverpod", "GetX", "Golden tests"],
  },
  {
    id: "offline-geo",
    label: "Envielite",
    tag: "Client project · Offline travel",
    title: "Landmarks that speak, offline",
    accent: "client",
    summary:
      "A tour guide for sightseeing flights. The plane never lands between origin and destination — so as it passes each landmark, every passenger's phone plays its story, with no internet.",
    proof: [
      "On-device GPS checks a 300 m geofence around every point of interest",
      "Alert queue plays one story at a time; each landmark re-arms once you leave it",
      "Admin panel builds routes, landmarks and narration in 8 languages, stored on the phone",
    ],
    metric: { value: "300 m", label: "geofence per landmark" },
    tools: ["Flutter", "GetX", "Geolocator", "Audioplayers", "SharedPreferences"],
  },
  {
    id: "couplio",
    label: "Couplio",
    tag: "Personal project · Real-time",
    title: "Two phones, one goal",
    accent: "client",
    summary:
      "Couplio — a calorie app for two. Each partner gets a personal daily target, then they pair by QR code and watch each other's progress live, so they keep each other on track.",
    proof: [
      "Daily target from the Mifflin-St Jeor formula, activity level and goal (±500 kcal)",
      "QR pairing with connection requests and notifications on Cloud Firestore",
      "Partner progress streamed live with Firestore snapshots; Gemini writes a personal goal message",
    ],
    metric: { value: "2", label: "phones, synced live" },
    tools: ["Flutter", "Firebase Auth", "Cloud Firestore", "Gemini", "QR scan"],
  },
  {
    id: "exodus",
    label: "Exodus",
    tag: "Client project · Live transit",
    title: "Book it, board it, watch it move",
    accent: "client",
    summary:
      "Exodus — bus booking for passengers. Book a seat or a whole bus, show a QR ticket to the driver, follow the bus live on the map, and pay when the ride ends.",
    proof: [
      "QR tickets issued by the backend; the driver scans them to board",
      "Live bus location over Socket.IO rooms, drawn on an OpenStreetMap view",
      "Stripe PaymentSheet with server-side intents; Dio token refresh and a Hive cache for weak networks",
    ],
    metric: { value: "4", label: "steps: book · scan · ride · pay" },
    tools: ["Flutter", "Socket.IO", "flutter_map", "Stripe", "Dio", "Hive"],
  },
  {
    id: "azlotv",
    label: "AzloTV",
    tag: "Client project · Streaming",
    title: "A TV channel in your pocket",
    accent: "client",
    summary:
      "AzloTV — the client's own streaming app for the shows and episodes they host: movies, series by season and episode, a vertical reels feed, and a player that remembers where you stopped.",
    proof: [
      "Series with season & episode navigation; full-screen Chewie player that resumes from your last position",
      "Vertical reels feed, genres, upcoming titles, likes, watchlist and watch history",
      "Live search over Socket.IO; ads for free viewers, skipped for premium",
    ],
    metric: { value: "3", label: "formats: movies · series · reels" },
    tools: ["Flutter", "GetX", "Chewie", "Socket.IO", "Dio", "Hive"],
  },
  {
    id: "cosmoquest",
    label: "CosmoQuest",
    tag: "Personal project · EdTech",
    title: "Learning space by playing it",
    accent: "client",
    summary:
      "CosmoQuest (Exoplanet Explorer) — learn about exoplanets from NASA data, test it in quizzes and a planet-matching game, and climb the leaderboard.",
    proof: [
      "NASA Astronomy Picture of the Day, plus live queries to NASA's Exoplanet Archive",
      "Habitable-zone explorer: Earth-size planets (0.8–1.25 R⊕) around stars of 2,600–7,200 K",
      "Quizzes, drag-and-drop planet matching, a level map, and daily / weekly / all-time leaderboards",
    ],
    metric: { value: "3", label: "leaderboards: daily · weekly · all-time" },
    tools: ["Flutter", "Firebase", "NASA APIs", "Provider", "MVVM"],
  },
  {
    id: "backend",
    label: "Backend & data",
    title: "NestJS services behind the apps",
    accent: "server",
    summary:
      "Modular Node backends for the apps I ship — guarded APIs, real-time channels, queues and payments that survive retries.",
    proof: [
      "NestJS, Node.js and Express REST APIs with JWT auth and role-based guards",
      "Real-time over WebSockets/SSE and Socket.IO; background jobs on BullMQ",
      "MongoDB, MySQL and Redis; Stripe payments, AWS S3 storage, ffmpeg/HLS media",
    ],
    metric: { value: "25", label: "modules in one backend, solo" },
    tools: ["NestJS", "Node.js", "Express", "MongoDB", "MySQL", "Redis", "BullMQ", "Socket.IO"],
  },
  {
    id: "firebase",
    label: "Firebase",
    title: "Firebase, end to end",
    accent: "server",
    summary:
      "When an app needs a backend fast, Firebase carries it: sign-in, live data, push, server logic and the crash reports that keep it healthy.",
    proof: [
      "Authentication with email, Google and Apple; Firestore with live snapshots",
      "Cloud Messaging push notifications and Node Cloud Functions",
      "Crashlytics and Analytics watching every release",
    ],
    metric: { value: "6", label: "Firebase services in production" },
    tools: ["Auth", "Firestore", "FCM", "Cloud Functions", "Crashlytics", "Analytics"],
  },
  {
    id: "ml-security",
    label: "Thesis",
    tag: "University thesis · ML security",
    title: "Catching attacks in network traffic",
    accent: "server",
    summary:
      "My thesis: a machine-learning intrusion detector that turns live network packets into flow features and flags attacks like DDoS, port scans and brute force.",
    proof: [
      "Trained on 19k labelled CIC-IDS flows — 14 attack types plus benign traffic",
      "Compared 6 models: XGBoost and Random Forest reached 98% accuracy; unsupervised ones 52–66%",
      "Live capture with Scapy builds 78 flow features per connection and classifies each one",
    ],
    metric: { value: "98%", label: "accuracy · XGBoost & RF" },
    tools: ["Python", "scikit-learn", "XGBoost", "Scapy", "pandas"],
  },
  {
    id: "security",
    label: "Security research",
    title: "Breaking things to defend them",
    accent: "server",
    summary:
      "I research cyber security: finding vulnerabilities, studying malware and zero-day exploits, and designing defences, including adversarial machine-learning models.",
    proof: [
      "Recon and exploitation on Kali Linux with Nmap and Metasploit (msfconsole)",
      "Web testing through Burp Suite on OWASP Juice Shop and PortSwigger Web Security Academy labs",
      "Mobile app analysis with MobSF, plus Python for custom tooling and the ML intrusion detector from my thesis",
    ],
    metric: { value: "6", label: "tools in the daily kit" },
    tools: ["Kali Linux", "Burp Suite", "Nmap", "Metasploit", "MobSF", "Python", "OWASP Juice Shop", "PortSwigger Labs"],
  },
  {
    id: "streaming",
    label: "BeatX",
    tag: "Client project · Streaming backend",
    title: "BeatX: adaptive streaming on one server",
    accent: "server",
    summary:
      "Multi-GB uploads streamed straight to S3, then transcoded by ffmpeg into HLS renditions off a job queue — memory stays flat.",
    proof: [
      "BullMQ transcoding queue with retry/backoff and presigned-URL fallback",
      "4 HLS renditions per upload for music, video, podcasts and audiobooks",
      "Chose self-hosted ffmpeg over managed transcoding to control cost",
    ],
    metric: { value: "4", label: "HLS renditions per upload" },
    tools: ["ffmpeg", "HLS", "BullMQ", "AWS S3", "WebSockets/SSE"],
  },
  {
    id: "release",
    label: "DevOps & release",
    title: "From commit to store, automatically",
    accent: "ops",
    summary:
      "Builds, tests and releases run on CI, and Shorebird pushes fixes over the air without waiting on store review.",
    proof: [
      "GitHub Actions and Codemagic pipelines for build, test and release",
      "Shorebird over-the-air updates for urgent fixes",
      "Backends on AWS EC2/S3 and VPS with PM2; releases through App Store Connect and Play Console",
    ],
    metric: { value: "6", label: "releases / month" },
    tools: ["Git", "GitHub Actions", "Codemagic", "Shorebird", "AWS EC2/S3", "VPS", "PM2"],
  },
  {
    id: "hardware",
    label: "Waiter Robot",
    tag: "Personal project · IoT",
    title: "A waiter robot, app to wheels",
    accent: "craft",
    summary:
      "An Arduino robot that carries orders to the right table and collects new ones — driven from a Flutter app over Bluetooth.",
    proof: [
      "Drew the chassis on paper, redrew it as a vector blueprint, then cut it from plywood",
      "Arduino UNO, L298N motor driver, IR line sensors and an HC-SR04 sonar",
      "Flutter controller app sending commands to the robot's firmware over Bluetooth",
    ],
    metric: { value: "3", label: "layers: app, firmware, chassis" },
    tools: ["Arduino C++", "Flutter", "Bluetooth", "L298N", "HC-SR04", "IR sensors"],
  },
  {
    id: "design",
    label: "Design",
    title: "Grids before pixels",
    accent: "craft",
    summary:
      "Illustration, branding and Arabic calligraphy — each piece starts from a grid, the same way an app starts from its architecture.",
    proof: [
      "Posters composed on a golden-ratio grid in Photoshop and Illustrator",
      "Logos, a full book-cover wrap and app branding for real clients",
      "Calligraphy built on a proportion grid, then painted on canvas",
    ],
    metric: { value: "φ", label: "the grid behind the layout" },
    tools: ["Photoshop", "Illustrator", "InDesign", "XD", "After Effects", "Premiere Pro"],
  },
  {
    id: "team",
    label: "Leadership",
    title: "Leading a 14-person team",
    accent: "ops",
    summary:
      "Setting the standards a team ships against — and reviewing the code that meets them.",
    proof: [
      "Lead and mentor a 14-person engineering team",
      "Own code-review, architecture and quality standards",
      "Those standards measurably reduced production defects",
    ],
    metric: { value: "14", label: "engineers led" },
    tools: ["Code review", "Mentoring", "Architecture", "Planning"],
  },
];
const pick = (ids: string[]) =>
  ids.map((id) => {
    const entry = tourEntries.find((e) => e.id === id);
    if (!entry) throw new Error(`Unknown tour entry: ${id}`);
    return entry;
  });

export const skillTour = pick(["security", "flutter", "architecture", "backend", "firebase", "release", "design", "team"]);
export const projectTour = pick(["ml-security", "streaming", "exodus", "azlotv", "offline-geo", "couplio", "cosmoquest", "hardware"]);


export const projects = [
  {
    slug: "beatx",
    title: "BeatX",
    kind: "Client project",
    category: "Streaming platform backend",
    stack: ["NestJS", "MongoDB", "BullMQ", "ffmpeg/HLS", "AWS S3", "Stripe"],
    summary:
      "Full backend, built solo, for a music, video, podcast and audiobook streaming platform with a merch and event-ticket store and an artist publishing workflow (KYC → draft → review → scheduled publish).",
    challenge:
      "Adaptive streaming of multi-GB media on a single server without running out of memory.",
    solution:
      "Offloaded ffmpeg HLS transcoding (4 renditions) to a BullMQ queue with retry/backoff and a presigned-URL fallback, and streamed large uploads directly to S3.",
    facts: ["~25k lines", "25 modules", "4 renditions"],
    links: [] as { label: string; href: string }[],
  },
  {
    slug: "envielite",
    title: "Envielite Tour Guide",
    kind: "Offline-first travel",
    category: "Flutter · GPS",
    stack: ["Flutter", "GetX", "Geolocator", "Audioplayers", "SharedPreferences"],
    summary:
      "A tour guide for sightseeing flights. Between origin and destination the plane passes landmarks it never lands at — passengers' phones tell each one's story as it flies by.",
    challenge: "No internet in the air, and several landmarks can sit close together.",
    solution:
      "On-device GPS checks 300 m geofences every 10 seconds; a queue plays one narration at a time, and an in-app admin panel stores routes, landmarks and audio in 8 languages locally.",
    facts: ["300 m geofences", "5 routes", "8 languages"],
    links: [{ label: "GitHub", href: "https://github.com/FSDTeam-SAA/flutter_envielite" }],
  },
  {
    slug: "exodus",
    title: "Exodus",
    kind: "Client project",
    category: "Bus booking · Flutter",
    stack: ["Flutter", "Socket.IO", "flutter_map", "Stripe", "Dio", "Hive", "get_it"],
    summary:
      "A bus-booking app: passengers book a seat or reserve a whole bus, board with a QR ticket the driver scans, follow the bus live, and pay when they arrive.",
    challenge: "Keep passengers informed in real time — where the bus is, whether they've boarded, what they owe — on patchy mobile networks.",
    solution:
      "Socket.IO rooms stream each bus's location to a flutter_map view; tickets carry server-issued QR codes; Stripe PaymentSheet takes payment. Dio with token refresh and a Hive cache keeps it usable on weak connections — all in Clean Architecture with get_it and dartz.",
    facts: ["~14.5k lines", "Live map", "Stripe"],
    links: [] as { label: string; href: string }[],
  },
  {
    slug: "azlotv",
    title: "AzloTV",
    kind: "Client project",
    category: "Streaming · Flutter",
    stack: ["Flutter", "GetX", "Chewie", "video_player", "Socket.IO", "Dio", "Hive"],
    summary:
      "The client's own TV app for the shows and episodes they host — movies, series, a reels feed, and a player that picks up where you left off.",
    challenge: "Make a small network's catalogue feel like a big streaming service: fast browsing, smooth playback, free and premium viewers.",
    solution:
      "Season/episode navigation and a full-screen Chewie player that resumes from the last position; reels, genres, watchlist and history; live Socket.IO search; ads only for free viewers. Dio with a Hive cache, organised as feature modules.",
    facts: ["~16.5k lines", "Movies · series · reels", "Live search"],
    links: [{ label: "GitHub", href: "https://github.com/noyon-360/flutter_flimsa_v2" }],
  },
  {
    slug: "cosmoquest",
    title: "CosmoQuest",
    kind: "Personal project",
    category: "EdTech · Flutter · NASA",
    stack: ["Flutter", "Firebase Auth", "Firestore", "Firebase Storage", "NASA APIs", "Provider", "MVVM"],
    summary:
      "Exoplanet Explorer: an educational app that pairs NASA content with games — learn, quiz yourself, match planets, and climb the leaderboard.",
    challenge: "Turn real astronomy data into something people want to come back to.",
    solution:
      "NASA's APOD and Exoplanet Archive feed the learning screens and a habitable-zone explorer; quizzes, a planet-matching game and a level map reward progress on daily, weekly and all-time leaderboards you can share as an image. Firebase auth with Google sign-in, profile photos in Storage, MVVM with Provider.",
    facts: ["NASA data", "Habitable-zone explorer", "Shareable leaderboard"],
    links: [{ label: "GitHub", href: "https://github.com/noyon-360/CosmoQuest" }],
  },
  {
    slug: "couplio",
    title: "Couplio",
    kind: "Personal project",
    category: "Flutter · Firebase · AI",
    stack: ["Flutter", "Firebase Auth", "Cloud Firestore", "Gemini 1.5 Flash", "QR scan"],
    summary:
      "A calorie tracker for two: each partner gets a personal daily target, pairs by QR code, and sees the other's progress live so they can guide each other.",
    challenge: "Make a diet a shared habit instead of a solo chore — without partners having to message each other.",
    solution:
      "Onboarding computes a daily target (Mifflin-St Jeor × activity, ±500 kcal for the goal); QR pairing links the two accounts in Firestore, and live snapshots keep both progress rings in sync. Google & Apple sign-in; Gemini adds a personal goal message.",
    facts: ["QR pairing", "Live sync", "Google & Apple sign-in"],
    links: [{ label: "GitHub", href: "https://github.com/noyon-360/couplio" }],
  },
  {
    slug: "smilestreats",
    title: "SmilesTreats",
    kind: "Full-stack e-commerce",
    category: "Flutter + Firebase",
    stack: ["Flutter", "Riverpod", "Firebase", "Cloud Functions", "Stripe", "Shorebird"],
    summary:
      "A Flutter e-commerce app shipped end-to-end — browsing, cart, checkout, orders, reviews and in-app support chat.",
    challenge: "One engineer owning the client, backend logic and payments through to both stores.",
    solution:
      "Clean Architecture and Riverpod on Firebase (Auth, Firestore, Storage, FCM) plus Node Cloud Functions, with Stripe payments and Shorebird OTA updates.",
    facts: ["Google Play", "App Store", "OTA updates"],
    // Add store URLs here, e.g. { label: "Google Play", href: "https://play.google.com/..." }
    links: [] as { label: string; href: string }[],
  },
  {
    slug: "labbytv",
    title: "LabbyTV",
    kind: "Live-TV & VOD",
    category: "Flutter client",
    stack: ["Flutter", "Android TV", "iOS", "Adaptive playback"],
    summary:
      "The Flutter client for a live-TV and video-on-demand app with an EPG, favourites, watch history and downloads.",
    challenge: "One codebase that feels right on a phone, a tablet and a TV remote.",
    solution:
      "Built the client end-to-end and shipped it on Android, Android TV and iOS, integrating the streaming API for adaptive playback.",
    facts: ["Android", "Android TV", "iOS"],
    links: [] as { label: string; href: string }[],
  },
];

export const experience = [
  {
    company: "ScaleUp Ads Agency",
    role: "Flutter Developer",
    period: "Jan 2025 – Present",
    place: "Mohakhali, Dhaka",
    points: [
      "Shipped and maintained 35+ cross-platform apps across Google Play and the App Store.",
      "Led and mentored a 14-person team, setting code-review, architecture and quality standards that reduced production defects.",
      "Structured apps with Clean Architecture, MVVM, Repository Pattern and DI, lifting crash-free sessions to 99%.",
      "Built NestJS and MongoDB backend services — HLS media transcoding, Stripe payments and JWT auth — delivering apps full-stack, including the BeatX streaming platform.",
      "Integrated payment gateways and secure storage with token refresh, caching and offline-first sync.",
      "Cut app startup time from 3s to 1.5s using Flutter DevTools profiling.",
      "Automated build, test and release with GitHub Actions, Codemagic and Shorebird OTA, enabling 6 releases per month.",
    ],
  },
  {
    company: "Madrasatu `Ibadir Rahman",
    role: "Graphic Designer",
    period: "Feb 2023 – Dec 2023",
    place: "College Gate, Gazipur",
    points: [
      "Designed brand and campaign materials in Photoshop, Illustrator and InDesign — the UI/UX foundation that now informs app design.",
    ],
  },
];

export const education = {
  school: "Primeasia University",
  degree: "BSc in Computer Science & Technology",
  period: "2021 – 2025",
  place: "Banani, Dhaka",
  note: "GPA 3.4",
  thesis: {
    title: "Machine learning for network intrusion detection",
    summary:
      "Detects common cyber attacks from network flows — trained on CIC-IDS data, then run live on captured packets.",
    results: [
      { model: "XGBoost", score: 98.4 },
      { model: "Random Forest", score: 98.0 },
      { model: "SVM", score: 85.7 },
      { model: "One-Class SVM", score: 66 },
      { model: "Autoencoder", score: 54 },
      { model: "Isolation Forest", score: 52 },
    ],
    href: "https://github.com/noyon-360/ML-in-Cyber-security",
  },
};

export const skills = [
  {
    group: "Cyber Security",
    items: ["Kali Linux", "Burp Suite", "Nmap", "Metasploit (msfconsole)", "MobSF", "Python", "OWASP Juice Shop", "PortSwigger Labs", "Vulnerability research", "Malware analysis", "Adversarial ML"],
  },
  { group: "Languages", items: ["Dart", "TypeScript", "JavaScript", "SQL"] },
  {
    group: "Flutter & Architecture",
    items: ["Clean Architecture", "MVVM", "Repository Pattern", "Dependency Injection", "SOLID", "Bloc/Cubit", "Riverpod", "Provider", "GetX", "go_router", "Platform Channels", "Flutter DevTools", "Custom widgets & animations"],
  },
  { group: "Testing", items: ["Unit", "Widget", "Integration", "Golden", "Mock-based"] },
  {
    group: "Backend & Data",
    items: ["NestJS", "Node.js", "Express", "MongoDB", "MySQL", "Redis", "REST APIs", "WebSockets/SSE", "Socket.IO", "BullMQ", "Stripe", "AWS S3", "ffmpeg/HLS"],
  },
  { group: "Firebase", items: ["Authentication", "Firestore", "FCM", "Cloud Functions", "Crashlytics", "Analytics"] },
  {
    group: "DevOps & Tooling",
    items: ["Git", "GitHub Actions", "Codemagic", "Shorebird", "CI/CD", "AWS (EC2/S3)", "VPS", "PM2", "App Store Connect", "Google Play Console"],
  },
  { group: "Machine Learning", items: ["Python", "scikit-learn", "XGBoost", "pandas", "Scapy", "Jupyter"] },
  { group: "Hardware & IoT", items: ["Arduino (C++)", "Bluetooth (HC-05)", "Motor drivers", "Ultrasonic & IR sensors"] },
  {
    group: "Design & Media",
    items: ["Photoshop", "Illustrator", "InDesign", "Lightroom Classic", "XD", "Premiere Pro", "After Effects", "Audition", "Arabic calligraphy"],
  },
  { group: "Spoken", items: ["English (professional proficiency)"] },
];

// "Beyond code": each track is shown as its process, from plan to finished piece.
// A step is either a redrawn illustration (`art`, see CraftArt.tsx) or a cleaned-up image.
export type CraftStep = { caption: string } & ({ art: CraftArtId } | { src: string; w: number; h: number });

export type CraftTrack = {
  id: string;
  label: string;
  title: string;
  summary: string;
  tools: string[];
  steps: CraftStep[];
  // Lay steps out two per row instead of one, for tracks with many small pieces.
  columns?: 1 | 2;
  compare?: {
    base: { src: string; w: number; h: number };
    overlay: { src: string; w: number; h: number };
    caption: string;
  };
};

export const craft: CraftTrack[] = [
  {
    id: "robot",
    label: "Robotics",
    title: "Waiter Robot",
    summary:
      "An IoT robot for restaurants: it carries orders to the right table and collects new ones. I designed the body, wired the electronics, wrote the Arduino firmware and built the Flutter app that drives it over Bluetooth.",
    tools: ["Arduino C++", "Flutter", "Bluetooth", "L298N", "HC-SR04", "IR sensors"],
    steps: [
      { art: "robot-blueprint", caption: "Chassis blueprint, measured in inches" },
      { art: "robot-layout", caption: "Component layout, cut from plywood" },
      { art: "robot-wiring", caption: "Wiring: Arduino, driver, Bluetooth, sensors" },
      { art: "robot-sensing", caption: "IR line following + sonar for obstacles" },
      { art: "robot-app", caption: "Flutter app → Bluetooth → firmware states" },
      { art: "robot-characters", caption: "Character explorations" },
    ],
  },
  {
    id: "calligraphy",
    label: "Calligraphy",
    title: "Arabic calligraphy",
    summary:
      "Compositions planned on a construction grid — circles, radial guides and dot-based letter proportions — then painted by hand on canvas.",
    tools: ["Pencil & grid", "Acrylic on canvas", "Thuluth-style lettering"],
    steps: [
      { art: "calligraphy-grid", caption: "Construction grid: rings, radials, nuqta scale" },
      { src: asset("/craft/calligraphy-ikhlas.jpg"), w: 1054, h: 1400, caption: "Surah Al-Ikhlas — on canvas" },
      { src: asset("/craft/calligraphy-hasbunallah.jpg"), w: 1400, h: 1057, caption: "Al-Imran 3:173 — on canvas" },
    ],
  },
  {
    id: "design",
    label: "Design",
    title: "Illustration & branding",
    summary:
      "Posters, editorial illustration, logos and print — built in Photoshop and Illustrator, composed on a grid before a single colour goes down.",
    tools: ["Photoshop", "Illustrator", "InDesign", "XD"],
    columns: 2,
    compare: {
      base: { src: asset("/craft/design-space-poster.jpg"), w: 595, h: 842 },
      overlay: { src: asset("/craft/design-space-poster-grid.jpg"), w: 595, h: 842 },
      caption: "“Innovation” poster, 2021 — toggle the golden-ratio grid it was built on",
    },
    steps: [
      { src: asset("/craft/design-lockdown-illustration.jpg"), w: 1400, h: 787, caption: "Lockdown — editorial illustration" },
      { src: asset("/craft/design-night-bridge.jpg"), w: 1400, h: 1050, caption: "Night bridge — digital painting" },
      { src: asset("/craft/design-grammar-pearls-cover.jpg"), w: 1400, h: 845, caption: "Grammar Pearls — full book-cover wrap" },
      { src: asset("/craft/design-prodigy-logo.jpg"), w: 1400, h: 1400, caption: "Prodigy Education — logo" },
      { src: asset("/craft/design-basoa-logo.jpg"), w: 1400, h: 1400, caption: "BASOA — Arabic wordmark" },
      { src: asset("/craft/design-goodboy-app.jpg"), w: 1365, h: 911, caption: "GoodBoy — app brand & splash" },
    ],
  },
];

export const faqs = [
  { q: "Do you do security work?", a: "Yes, it's my main focus. I test web and mobile apps with Kali Linux, Burp Suite, Nmap, Metasploit and MobSF, practise on OWASP Juice Shop and PortSwigger labs, and study malware, zero-days and adversarial ML defences. It also shapes how I build: auth, token handling and secure storage in my own apps." },
  { q: "What do you build?", a: "Cross-platform Flutter apps and the NestJS or Firebase backends behind them — auth, payments, media streaming, real-time features and the CI/CD that ships them." },
  { q: "Can you own a product end-to-end?", a: "Yes. BeatX's backend and SmilesTreats were built end-to-end, from architecture to store release, with payments and OTA updates in place." },
  { q: "Do you work with existing codebases and teams?", a: "Daily. I lead a 14-person team, review code and set architecture standards, and I'm comfortable plugging into an established codebase and process." },
  { q: "Are you open to freelance or remote roles?", a: "Yes — send a short brief with what you're building and your timeline, and I'll reply with questions and a proposed plan." },
];
