import { useId } from "react";

// Clean, redrawn illustrations for the "Beyond code" tracks. All share one drafting style:
// 480×360 panel, faint grid, line art in theme colours, mono labels.

const W = 480;
const H = 360;

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-full w-full font-mono">
      <defs>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" className="stroke-text/[0.06]" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} className="fill-panel-2" />
      <rect width={W} height={H} fill={`url(#${id}-grid)`} />
      {children}
    </svg>
  );
}

function Text({ x, y, children, anchor = "start", size = 10, className = "fill-muted" }: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  size?: number;
  className?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} letterSpacing="0.06em" className={className}>
      {children}
    </text>
  );
}

/* ---------- Waiter robot chassis geometry (inches, y up), from the hand-drawn blueprint ---------- */

function chassisPath(cx: number, cy: number, k: number) {
  const p = (x: number, y: number) => `${cx + x * k} ${cy - y * k}`;
  return [
    `M${p(-3.75, 3.6)}`,
    `Q${p(0, 7)} ${p(3.75, 3.6)}`,
    `L${p(3.75, 0.5)}`,
    `L${p(2.6, 0.5)}`,
    `L${p(2.6, -2.5)}`,
    `L${p(3.75, -2.5)}`,
    `L${p(3.75, -3.5)}`,
    `Q${p(0, -6.9)} ${p(-3.75, -3.5)}`,
    `L${p(-3.75, -2.5)}`,
    `L${p(-2.6, -2.5)}`,
    `L${p(-2.6, 0.5)}`,
    `L${p(-3.75, 0.5)}`,
    "Z",
  ].join(" ");
}

function DimH({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return (
    <g className="stroke-craft" strokeWidth="1">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <Text x={(x1 + x2) / 2} y={y - 5} anchor="middle" className="fill-craft stroke-none">{label}</Text>
    </g>
  );
}

function DimV({ y1, y2, x, label, side = "left" }: { y1: number; y2: number; x: number; label: string; side?: "left" | "right" }) {
  return (
    <g className="stroke-craft" strokeWidth="1">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} />
      <Text x={side === "left" ? x - 6 : x + 6} y={(y1 + y2) / 2 + 3} anchor={side === "left" ? "end" : "start"} className="fill-craft stroke-none">
        {label}
      </Text>
    </g>
  );
}

export function RobotBlueprint() {
  const cx = 230;
  const cy = 178;
  const k = 26;
  const X = (x: number) => cx + x * k;
  const Y = (y: number) => cy - y * k;
  return (
    <Frame label="Waiter robot chassis blueprint with dimensions in inches">
      <line x1={X(0)} y1={Y(5.6)} x2={X(0)} y2={Y(-5.5)} className="stroke-text/20" strokeDasharray="6 4" />
      <line x1={X(-4.2)} y1={Y(0)} x2={X(4.2)} y2={Y(0)} className="stroke-text/20" strokeDasharray="6 4" />
      <path d={chassisPath(cx, cy, k)} className="fill-text/[0.04] stroke-text" strokeWidth="1.6" />
      {[-2, 2].map((x) => (
        <circle key={x} cx={X(x)} cy={Y(-2)} r={4} className="fill-none stroke-text" strokeWidth="1.2" />
      ))}
      <DimH x1={X(-3.75)} x2={X(3.75)} y={Y(2.8)} label="7.5″" />
      <DimV y1={Y(5.3)} y2={Y(3.6)} x={X(0.35)} label="1.7″" side="right" />
      <DimV y1={Y(3.6)} y2={Y(0.5)} x={X(-4.3)} label="3.11″" />
      <DimH x1={X(-3.75)} x2={X(-2.6)} y={Y(-2.85)} label="1.15″" />
      <DimV y1={Y(0.5)} y2={Y(-2.5)} x={X(-3.175)} label="3″" />
      <DimH x1={X(-2.6)} x2={X(2.6)} y={Y(-1.1)} label="5.2″" />
      <DimV y1={Y(-2.5)} y2={Y(-3.5)} x={X(-4.3)} label="1″" />
      <DimV y1={Y(-3.5)} y2={Y(-5.2)} x={X(0.35)} label="1.7″" side="right" />
      <g transform="translate(352 286)">
        <rect width="114" height="58" className="fill-ink/60 stroke-text/30" />
        <Text x={8} y={18} size={10} className="fill-text">WAITER ROBOT</Text>
        <Text x={8} y={33} size={9}>chassis · top view</Text>
        <Text x={8} y={48} size={9}>units: inches</Text>
      </g>
    </Frame>
  );
}

const PARTS: { n: number; name: string; at: [number, number]; size: [number, number]; tone: string; marker?: [number, number] }[] = [
  { n: 1, name: "Breadboard", at: [0, 1.2], size: [5.4, 1.9], tone: "fill-text/[0.06] stroke-text/40", marker: [-0.68, 1.2] },
  { n: 2, name: "Arduino UNO", at: [0.95, 1.2], size: [2.7, 1.6], tone: "fill-client/20 stroke-client" },
  { n: 3, name: "L298N driver", at: [-1.75, 1.2], size: [1.6, 1.6], tone: "fill-server/20 stroke-server" },
  { n: 4, name: "HC-05 Bluetooth", at: [2.3, 2.5], size: [1.3, 0.55], tone: "fill-client/20 stroke-client" },
  { n: 5, name: "9V batteries ×2", at: [0.95, -1.4], size: [2.2, 1.8], tone: "fill-ops/20 stroke-ops" },
  { n: 6, name: "HC-SR04 sonar", at: [0, 4.15], size: [2.2, 0.35], tone: "fill-craft/25 stroke-craft" },
  { n: 7, name: "IR line sensors", at: [-2.85, 3.2], size: [0.55, 0.9], tone: "fill-craft/25 stroke-craft" },
];

export function RobotLayout() {
  const cx = 160;
  const cy = 182;
  const k = 24;
  const X = (x: number) => cx + x * k;
  const Y = (y: number) => cy - y * k;
  const rect = (at: [number, number], size: [number, number]) => ({
    x: X(at[0] - size[0] / 2),
    y: Y(at[1] + size[1] / 2),
    width: size[0] * k,
    height: size[1] * k,
  });
  return (
    <Frame label="Component layout on the robot chassis">
      <path d={chassisPath(cx, cy, k)} className="fill-ops/[0.07] stroke-text/70" strokeWidth="1.4" />
      {[-1, 1].map((s) => (
        <rect key={s} {...rect([s * 3.175, -1], [0.6, 2.6])} rx="4" className="fill-text/25 stroke-text/60" />
      ))}
      {PARTS.map((p) => (
        <g key={p.n}>
          <rect {...rect(p.at, p.size)} rx="2" className={p.tone} strokeWidth="1.2" />
          {p.n === 7 && <rect {...rect([2.85, 3.2], p.size)} rx="2" className={p.tone} strokeWidth="1.2" />}
          <circle cx={X((p.marker ?? p.at)[0])} cy={Y((p.marker ?? p.at)[1])} r="7" className="fill-ink stroke-text/60" />
          <Text x={X((p.marker ?? p.at)[0])} y={Y((p.marker ?? p.at)[1]) + 3.5} anchor="middle" size={9} className="fill-text">{p.n}</Text>
        </g>
      ))}
      <path d={`M${X(0)} ${Y(5.75)} l-5 8 h10 z`} className="fill-craft" />
      <Text x={X(0)} y={Y(5.85)} anchor="middle" size={9} className="fill-craft">FRONT</Text>
      <g transform="translate(318 70)">
        <Text x={0} y={0} size={10} className="fill-text">COMPONENTS</Text>
        {PARTS.map((p, i) => (
          <g key={p.n} transform={`translate(0 ${22 + i * 24})`}>
            <circle cx="7" cy="-3.5" r="7" className="fill-ink stroke-text/60" />
            <Text x={7} y={0} anchor="middle" size={9} className="fill-text">{p.n}</Text>
            <Text x={22} y={0} size={10}>{p.name}</Text>
          </g>
        ))}
      </g>
    </Frame>
  );
}

function Block({ x, y, w, h, title, sub, tone }: { x: number; y: number; w: number; h: number; title: string; sub?: string; tone: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" className={tone} strokeWidth="1.4" />
      <Text x={x + w / 2} y={y + h / 2 + (sub ? -2 : 4)} anchor="middle" size={11} className="fill-text">{title}</Text>
      {sub && <Text x={x + w / 2} y={y + h / 2 + 13} anchor="middle" size={9}>{sub}</Text>}
    </g>
  );
}

function Wire({ d, color, label, lx, ly, anchor }: { d: string; color: string; label?: string; lx?: number; ly?: number; anchor?: "start" | "end" }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {label && lx !== undefined && ly !== undefined && <Text x={lx} y={ly} size={9} anchor={anchor}>{label}</Text>}
    </g>
  );
}

export function RobotWiring() {
  return (
    <Frame label="Wiring diagram: Arduino UNO with motor driver, Bluetooth, sonar and IR sensors">
      <Wire d="M75 76 V122" color="#ff4d6d" label="12V" lx={82} ly={104} />
      <Wire d="M110 58 H230 V122" color="#ff4d6d" label="VIN" lx={236} ly={104} />
      <Wire d="M182 158 H128" color="#ff8a3d" label="IN1–IN4" lx={132} ly={151} />
      <Wire d="M182 176 H128" color="#ffd23d" label="ENA/ENB" lx={132} ly={190} />
      <Wire d="M60 196 V250" color="#8d97a8" />
      <Wire d="M100 196 V250" color="#8d97a8" />
      <Wire d="M302 140 H336 V76 H372" color="#4cc2ff" label="TX/RX" lx={342} ly={70} />
      <Wire d="M302 160 H372" color="#3ddc97" label="TRIG/ECHO" lx={308} ly={153} />
      <Wire d="M302 180 H336 V250 H372" color="#b48cff" label="analog in" lx={330} ly={222} anchor="end" />
      <Block x={30} y={30} w={80} h={46} title="9V ×2" sub="power" tone="fill-ops/15 stroke-ops" />
      <Block x={30} y={122} w={98} h={74} title="L298N" sub="motor driver" tone="fill-server/15 stroke-server" />
      <Block x={182} y={122} w={120} h={80} title="Arduino UNO" sub="firmware · C++" tone="fill-client/15 stroke-client" />
      <Block x={372} y={52} w={92} h={46} title="HC-05" sub="Bluetooth" tone="fill-client/15 stroke-client" />
      <Block x={372} y={138} w={92} h={46} title="HC-SR04" sub="sonar" tone="fill-craft/15 stroke-craft" />
      <Block x={372} y={228} w={42} h={44} title="IR L" tone="fill-craft/15 stroke-craft" />
      <Block x={422} y={228} w={42} h={44} title="IR R" tone="fill-craft/15 stroke-craft" />
      {[60, 100].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={268} r="18" className="fill-ink stroke-text/60" strokeWidth="1.4" />
          <Text x={x} y={272} anchor="middle" size={10} className="fill-text">{`M${i + 1}`}</Text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${467 + i * 4} ${64 - i * 4} q${5 + i * 2} ${11 + i * 4} 0 ${22 + i * 8}`} fill="none" className="stroke-client" strokeWidth="1.2" opacity={1 - i * 0.25} />
      ))}
      <Text x={30} y={330} size={10}>wheels: two DC motors · sensors read by the firmware loop</Text>
    </Frame>
  );
}

export function RobotSensing() {
  return (
    <Frame label="Top view: robot following a floor line with IR sensors, sonar watching ahead">
      <g transform="translate(60 0)">
      {/* Floor line: light edge under a dark tape line. */}
      <path d="M200 360 C200 270 210 220 250 170 S330 90 330 40" fill="none" className="stroke-text/20" strokeWidth="18" strokeLinecap="round" />
      <path d="M200 360 C200 270 210 220 250 170 S330 90 330 40" fill="none" className="stroke-ink" strokeWidth="12" strokeLinecap="round" />
      <circle cx="350" cy="34" r="22" className="fill-ops/15 stroke-ops" strokeWidth="1.4" />
      <Text x={350} y={37} anchor="middle" size={8} className="fill-ops">table</Text>
      <g transform="translate(212 236) rotate(18)">
        <path d={chassisPath(0, 0, 9)} className="fill-ops/20 stroke-text" strokeWidth="1.2" />
        <path d="M-12 -46 L-56 -150 L44 -150 L12 -46 Z" className="fill-craft/10 stroke-craft/50" strokeDasharray="4 3" />
        <circle cx="-26" cy="-30" r="4" className="fill-craft" />
        <circle cx="26" cy="-30" r="4" className="fill-craft" />
        <line x1="-26" y1="-30" x2="-34" y2="-44" className="stroke-craft" />
        <line x1="26" y1="-30" x2="34" y2="-44" className="stroke-craft" />
      </g>
      <rect x="120" y="66" width="40" height="30" rx="3" className="fill-text/10 stroke-text/50" />
      <Text x={140} y={58} anchor="middle" size={9}>obstacle</Text>
      </g>
      <g transform="translate(24 300)">
        <circle cx="5" cy="-4" r="4" className="fill-craft" />
        <Text x={16} y={0} size={10} className="fill-text">IR L / IR R</Text>
        <Text x={16} y={14} size={9}>keep the floor line between them</Text>
      </g>
      <g transform="translate(24 250)">
        <rect x="0" y="-10" width="10" height="10" className="fill-craft/20 stroke-craft/60" strokeDasharray="3 2" />
        <Text x={16} y={0} size={10} className="fill-text">HC-SR04</Text>
        <Text x={16} y={14} size={9}>watches ahead for obstacles</Text>
      </g>
    </Frame>
  );
}

function State({ x, y, label, active }: { x: number; y: number; label: string; active?: boolean }) {
  return (
    <g>
      <rect x={x - 52} y={y - 16} width="104" height="32" rx="16" className={active ? "fill-craft/20 stroke-craft" : "fill-ink stroke-text/50"} strokeWidth="1.3" />
      <Text x={x} y={y + 4} anchor="middle" size={10} className="fill-text">{label}</Text>
    </g>
  );
}

function Arrow({ d, label, lx, ly, anchor }: { d: string; label?: string; lx?: number; ly?: number; anchor?: "start" | "end" }) {
  const id = useId();
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" className="fill-text/60" />
        </marker>
      </defs>
      <path d={d} fill="none" className="stroke-text/50" strokeWidth="1.2" markerEnd={`url(#${id})`} />
      {label && lx !== undefined && ly !== undefined && <Text x={lx} y={ly} size={8.5} anchor={anchor}>{label}</Text>}
    </g>
  );
}

export function RobotApp() {
  return (
    <Frame label="Flutter controller app sending Bluetooth commands to the Arduino state machine">
      <rect x="28" y="40" width="128" height="250" rx="18" className="fill-ink stroke-text/60" strokeWidth="1.5" />
      <rect x="64" y="50" width="56" height="6" rx="3" className="fill-text/20" />
      <Text x={92} y={84} anchor="middle" size={10} className="fill-text">Robot Waiter</Text>
      <Text x={92} y={100} anchor="middle" size={8.5} className="fill-client">● connected · HC-05</Text>
      <g transform="translate(92 178)" className="fill-client/25 stroke-client" strokeWidth="1.2">
        <path d="M0 -50 l16 22 h-32 z" />
        <path d="M0 50 l16 -22 h-32 z" />
        <path d="M-50 0 l22 -16 v32 z" />
        <path d="M50 0 l-22 -16 v32 z" />
        <rect x="-13" y="-13" width="26" height="26" rx="5" className="fill-server/25 stroke-server" />
      </g>
      <rect x="44" y="246" width="96" height="26" rx="13" className="fill-craft/20 stroke-craft" />
      <Text x={92} y={263} anchor="middle" size={9.5} className="fill-text">collect order</Text>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${172 + i * 9} ${150 - i * 8} q${10 + i * 4} ${20 + i * 8} 0 ${40 + i * 16}`} fill="none" className="stroke-client" strokeWidth="1.4" opacity={1 - i * 0.25} />
      ))}
      <Text x={168} y={222} size={9} className="fill-client">Bluetooth</Text>
      <Text x={168} y={235} size={9} className="fill-client">commands</Text>
      <rect x="226" y="30" width="236" height="296" rx="10" className="fill-ink/40 stroke-text/20" strokeDasharray="4 4" />
      <Text x={240} y={50} size={9}>ARDUINO FIRMWARE · STATE MACHINE</Text>
      <State x={344} y={88} label="IDLE" />
      <State x={344} y={168} label="FOLLOW LINE" active />
      <State x={276} y={262} label="TURN" />
      <State x={410} y={262} label="STOP" />
      <Arrow d="M344 104 V150" label="command" lx={350} ly={131} />
      <Arrow d="M318 184 L292 244" label="off line" lx={250} ly={214} />
      <Arrow d="M300 246 Q330 214 326 186" />
      <Arrow d="M370 184 L396 244" label="obstacle" lx={392} ly={214} />
      <Arrow d="M430 246 Q470 150 396 92" label="stop/serve" lx={448} ly={140} anchor="end" />
    </Frame>
  );
}

export function RobotCharacters() {
  return (
    <Frame label="Three robot character designs">
      <line x1="40" y1="318" x2="440" y2="318" className="stroke-text/30" />
      <line x1="0" y1="0" x2={W} y2={H} className="stroke-text/[0.07]" />
      <line x1={W} y1="0" x2="0" y2={H} className="stroke-text/[0.07]" />
      <g className="fill-none stroke-text" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* A — dome head, triangle body */}
        <g transform="translate(110 0)">
          <path d="M-30 110 a30 30 0 0 1 60 0 v12 h-60 z" />
          <rect x="-16" y="112" width="32" height="8" className="stroke-craft" />
          <circle cx="-10" cy="98" r="2.5" className="fill-text" />
          <circle cx="10" cy="98" r="2.5" className="fill-text" />
          <path d="M-4 122 v18 M4 122 v18" />
          <path d="M-46 142 h92 l-46 80 z" />
          <rect x="-24" y="152" width="20" height="10" className="stroke-craft" />
          <circle cx="16" cy="157" r="6" className="stroke-craft" />
          <path d="M-42 148 l-22 70 M42 148 l22 70" />
          <path d="M-72 226 a9 9 0 1 1 16 0 M56 226 a9 9 0 1 1 16 0" />
          <path d="M-14 210 l-12 92 M14 210 l12 92" />
          <path d="M-36 312 h22 M14 312 h22" />
        </g>
        {/* B — square head with antenna, box body on a wheel */}
        <g transform="translate(240 0)">
          <path d="M0 108 v-18" />
          <circle cx="0" cy="84" r="6" className="stroke-craft" />
          <rect x="-28" y="108" width="56" height="48" rx="3" />
          <circle cx="-10" cy="126" r="3" className="fill-text" />
          <circle cx="10" cy="126" r="3" className="fill-text" />
          <rect x="-10" y="140" width="20" height="5" />
          <path d="M-5 156 v20 M5 156 v20" />
          <rect x="-44" y="176" width="88" height="88" rx="4" />
          <rect x="-26" y="192" width="52" height="8" className="stroke-craft" />
          <rect x="-26" y="208" width="52" height="8" className="stroke-craft" />
          <path d="M-44 190 q-30 30 -18 86 M44 190 q30 30 18 86" />
          <path d="M-18 264 a18 18 0 0 0 36 0" />
          <path d="M-6 282 v26 a6 6 0 0 0 12 0 v-26" className="stroke-craft" />
        </g>
        {/* C — rounded head with a smile and a cap, rounded body */}
        <g transform="translate(370 0)">
          <rect x="-12" y="80" width="24" height="12" rx="3" className="stroke-craft" />
          <rect x="-28" y="92" width="56" height="44" rx="12" />
          <circle cx="-10" cy="110" r="2.5" className="fill-text" />
          <circle cx="10" cy="110" r="2.5" className="fill-text" />
          <path d="M-8 122 q8 7 16 0" />
          <path d="M-4 136 v18 M4 136 v18" />
          <rect x="-38" y="154" width="76" height="92" rx="16" />
          <circle cx="-44" cy="160" r="7" />
          <circle cx="44" cy="160" r="7" />
          <path d="M-48 168 q-14 40 -4 76 M48 168 q14 40 4 76" />
          <path d="M-60 248 q8 10 14 0 M46 248 q8 10 14 0" className="stroke-craft" />
          <path d="M-16 246 v54 M16 246 v54" />
          <path d="M-30 310 a12 9 0 0 1 24 0 z M6 310 a12 9 0 0 1 24 0 z" />
        </g>
      </g>
      <Text x={110} y={340} anchor="middle" size={9}>A</Text>
      <Text x={240} y={340} anchor="middle" size={9}>B</Text>
      <Text x={370} y={340} anchor="middle" size={9}>C</Text>
    </Frame>
  );
}

export function CalligraphyGrid() {
  const cx = 230;
  const cy = 196;
  return (
    <Frame label="Construction grid for a circular calligraphy composition">
      {[150, 112, 74].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} className="fill-none stroke-text/25" />
      ))}
      <circle cx={cx} cy={cy} r={131} className="fill-none stroke-craft/70" strokeDasharray="5 4" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * 40}
            y1={cy + Math.sin(a) * 40}
            x2={cx + Math.cos(a) * 160}
            y2={cy + Math.sin(a) * 160}
            className="stroke-text/15"
          />
        );
      })}
      {[-112, -56, 56, 112].map((d) => (
        <g key={d}>
          <line x1={cx + d} y1={36} x2={cx + d} y2={350} className="stroke-text/10" />
          <line x1={70} y1={cy + d} x2={390} y2={cy + d} className="stroke-text/10" />
        </g>
      ))}
      <line x1={cx} y1={18} x2={cx} y2={cy} className="stroke-craft" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.5" className="fill-craft" />
      <g transform="translate(436 60)">
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M0 ${i * 16} l7 7 l-7 7 l-7 -7 z`} className={i % 2 ? "fill-craft/30 stroke-craft" : "fill-none stroke-craft"} strokeWidth="1" />
        ))}
        <Text x={0} y={132} anchor="middle" size={9} className="fill-craft">nuqta</Text>
        <Text x={0} y={144} anchor="middle" size={9} className="fill-craft">scale</Text>
      </g>
      <Text x={cx + 8} y={30} size={9} className="fill-craft">alif axis</Text>
      <Text x={cx + 96} y={cy + 118} size={9}>text ring</Text>
      <Text x={18} y={340} size={9}>rings · radial guides · proportion grid</Text>
    </Frame>
  );
}

export const CRAFT_ART = {
  "robot-blueprint": RobotBlueprint,
  "robot-layout": RobotLayout,
  "robot-wiring": RobotWiring,
  "robot-sensing": RobotSensing,
  "robot-app": RobotApp,
  "robot-characters": RobotCharacters,
  "calligraphy-grid": CalligraphyGrid,
} as const;

export type CraftArtId = keyof typeof CRAFT_ART;
