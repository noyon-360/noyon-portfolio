import type { CraftArtId } from "@/components/CraftArt";

export const profile = {
  name: "Nazibullah Noyon",
  shortName: "Noyon",
  title: "Senior Software Engineer",
  roles: ["Full-Stack (Flutter + NestJS)", "Team Lead"],
  location: "Gazipur, Bangladesh",
  timezone: "UTC +06:00",
  email: "nazibullahnoyon19.20@gmail.com",
  phone: "+8801305223046",
  summary:
    "Senior software engineer with 35+ cross-platform apps shipped to Google Play and the App Store, working full-stack across the Flutter client and NestJS/Firebase backends. Comfortable owning a feature from architecture to release — Clean Architecture, state management, media streaming, payments, and CI/CD.",
  // Drop the PDF into /public with this name to enable the download button.
  cv: "/Nazibullah_Noyon_CV.pdf",
  socials: [{ label: "GitHub", href: "https://github.com/noyon-360" }],
};

export const stats = [
  { value: "35+", label: "apps shipped to Google Play & App Store" },
  { value: "14", label: "engineers led and mentored" },
  { value: "99%", label: "crash-free sessions across the portfolio" },
  { value: "6", label: "releases per month, automated" },
];

export type Accent = "client" | "server" | "ops" | "craft";

// Each entry is one station of the 3D expertise journey, in scroll order.
export const expertise: {
  id: string;
  label: string;
  title: string;
  accent: Accent;
  summary: string;
  proof: string[];
  metric: { value: string; label: string };
  tools: string[];
}[] = [
  {
    id: "flutter",
    label: "Client",
    title: "Flutter apps, shipped at scale",
    accent: "client",
    summary:
      "Cross-platform apps for Android, iOS and Android TV — from first screen to store listing, then maintained in production.",
    proof: [
      "Shipped and maintained 35+ apps across Google Play and the App Store",
      "Custom widgets, animations and Platform Channels (Kotlin/Swift)",
      "Cut app startup from 3s to 1.5s with Flutter DevTools profiling",
    ],
    metric: { value: "35+", label: "apps live" },
    tools: ["Dart", "Flutter", "go_router", "Platform Channels", "DevTools"],
  },
  {
    id: "architecture",
    label: "Architecture",
    title: "Clean Architecture that holds up",
    accent: "client",
    summary:
      "Presentation, domain and data kept apart, so features stay testable and a change in one layer doesn't ripple through the app.",
    proof: [
      "Clean Architecture, MVVM, Repository Pattern and DI across the portfolio",
      "Bloc/Cubit, Riverpod, Provider and GetX — picked per project",
      "Unit, widget, integration, golden and mock-based tests",
    ],
    metric: { value: "99%", label: "crash-free sessions" },
    tools: ["Bloc/Cubit", "Riverpod", "Provider", "GetX", "SOLID"],
  },
  {
    id: "offline-geo",
    label: "Offline geo",
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
    id: "backend",
    label: "Backend",
    title: "NestJS services behind the apps",
    accent: "server",
    summary:
      "Modular backends with guarded routes, validated input and payments that survive retries.",
    proof: [
      "Built BeatX solo: ~25k lines across 25 NestJS modules",
      "JWT auth with bcrypt-hashed refresh tokens and role-based guards",
      "Idempotent Stripe webhooks, DTO whitelisting, and a written security risk register",
    ],
    metric: { value: "25", label: "modules, one engineer" },
    tools: ["NestJS", "Node.js", "MongoDB", "MySQL", "Redis", "Stripe"],
  },
  {
    id: "streaming",
    label: "Media",
    title: "Adaptive streaming on one server",
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
    label: "Release",
    title: "From commit to store, automatically",
    accent: "ops",
    summary:
      "Builds, tests and releases run on CI, and Shorebird pushes fixes over the air without waiting on store review.",
    proof: [
      "GitHub Actions and Codemagic pipelines for build, test and release",
      "Shorebird over-the-air updates for urgent fixes",
      "Firebase Crashlytics and Analytics watching every release",
    ],
    metric: { value: "6", label: "releases / month" },
    tools: ["GitHub Actions", "Codemagic", "Shorebird", "AWS EC2", "PM2"],
  },
  {
    id: "hardware",
    label: "Hardware",
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
};

export const skills = [
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
  { group: "Hardware & IoT", items: ["Arduino (C++)", "Bluetooth (HC-05)", "Motor drivers", "Ultrasonic & IR sensors"] },
  {
    group: "Design & Media",
    items: ["Photoshop", "Illustrator", "InDesign", "Lightroom Classic", "XD", "Premiere Pro", "After Effects", "Audition", "Arabic calligraphy"],
  },
];

// "Beyond code": each track is shown as its process, from plan to finished piece.
// A step is either a redrawn illustration (`art`, see CraftArt.tsx) or a cleaned-up image.
export type CraftStep = { caption: string } & ({ art: CraftArtId } | { src: string; w: number; h: number });

type CraftTrack = {
  id: string;
  label: string;
  title: string;
  summary: string;
  tools: string[];
  steps: CraftStep[];
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
      { src: "/craft/calligraphy-ikhlas.jpg", w: 1054, h: 1400, caption: "Surah Al-Ikhlas — on canvas" },
      { src: "/craft/calligraphy-hasbunallah.jpg", w: 1400, h: 1057, caption: "Al-Imran 3:173 — on canvas" },
    ],
  },
  {
    id: "design",
    label: "Design",
    title: "Illustration & branding",
    summary:
      "Posters, editorial illustration, logos and print — built in Photoshop and Illustrator, composed on a grid before a single colour goes down.",
    tools: ["Photoshop", "Illustrator", "InDesign", "XD"],
    compare: {
      base: { src: "/craft/design-space-poster.jpg", w: 595, h: 842 },
      overlay: { src: "/craft/design-space-poster-grid.jpg", w: 595, h: 842 },
      caption: "“Innovation” poster, 2021 — toggle the golden-ratio grid it was built on",
    },
    steps: [
      { src: "/craft/design-lockdown-illustration.jpg", w: 1400, h: 787, caption: "Lockdown — editorial illustration" },
      { src: "/craft/design-night-bridge.jpg", w: 1400, h: 1050, caption: "Night bridge — digital painting" },
      { src: "/craft/design-grammar-pearls-cover.jpg", w: 1400, h: 845, caption: "Grammar Pearls — full book-cover wrap" },
      { src: "/craft/design-prodigy-logo.jpg", w: 1400, h: 1400, caption: "Prodigy Education — logo" },
      { src: "/craft/design-basoa-logo.jpg", w: 1400, h: 1400, caption: "BASOA — Arabic wordmark" },
      { src: "/craft/design-goodboy-app.jpg", w: 1365, h: 911, caption: "GoodBoy — app brand & splash" },
    ],
  },
];

export const faqs = [
  { q: "What do you build?", a: "Cross-platform Flutter apps and the NestJS or Firebase backends behind them — auth, payments, media streaming, real-time features and the CI/CD that ships them." },
  { q: "Can you own a product end-to-end?", a: "Yes. BeatX's backend and SmilesTreats were built end-to-end, from architecture to store release, with payments and OTA updates in place." },
  { q: "Do you work with existing codebases and teams?", a: "Daily. I lead a 14-person team, review code and set architecture standards, and I'm comfortable plugging into an established codebase and process." },
  { q: "Are you open to freelance or remote roles?", a: "Yes — send a short brief with what you're building and your timeline, and I'll reply with questions and a proposed plan." },
];
