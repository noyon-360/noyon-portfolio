// Static SVG versions of every 3D object, shown on phones, under reduced motion, before 3D loads,
// and to anyone without WebGL. Each one shows the object's end state. Decorative: the Stage carries alt text.
import { c1Checklist, c1Shield, c2Pins, visualText } from "../content";
import { mongoCollections, mongoVisual } from "../studies/mongodb-ransomware-attack";
import { npmShieldLayers, npmVisual } from "../studies/npm-supply-chain-attack";
import { BD_CENTER, BD_OUTLINE, illustrativeDots } from "./bangladesh";
import { DRUMS, LAYER_OFFSETS, LINE_END, LINE_EVENTS, LINE_START, SCANNERS, SESSION_X } from "./mongodb";
import { NET_BAD, NET_EDGES, NET_NODES, SERVER_CELLS, SWITCH_COUNT, SWITCH_SUSPECT, TOWER_BLOCKS, TOWER_WORST, TREE, TREE_PATH } from "./npm";
import { rng } from "./util";

const A = "var(--color-amber)";
const R = "var(--color-signal)";
const I = "var(--color-ivory)";
const D = "var(--color-dim)";
const G = "var(--color-green)";
const L = "var(--color-rule)";
// Trig results can differ in the last digit between server and browser; round to keep hydration stable.
const r2 = (v: number) => Math.round(v * 100) / 100;
const mono = { fontFamily: "var(--font-geist-mono), monospace" };
const serif = { fontFamily: "var(--font-cs-serif), Georgia, serif" };

function Svg({ children, vb = "0 0 400 300" }: { children: React.ReactNode; vb?: string }) {
  return (
    <svg viewBox={vb} className="h-full w-full" preserveAspectRatio="xMidYMid meet" fill="none">
      {children}
    </svg>
  );
}

export function GlobeSvg({ arcs = false, pins = false, faded = false }: { arcs?: boolean; pins?: boolean; faded?: boolean }) {
  const cx = 200;
  const cy = 150;
  const r = 120;
  // Simple orthographic projection, centred on lon 30°, lat 25°.
  const proj = (lat: number, lon: number) => {
    const l0 = (30 * Math.PI) / 180;
    const p0 = (25 * Math.PI) / 180;
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    const cosc = Math.sin(p0) * Math.sin(la) + Math.cos(p0) * Math.cos(la) * Math.cos(lo - l0);
    return {
      x: r2(cx + r * Math.cos(la) * Math.sin(lo - l0)),
      y: r2(cy - r * (Math.cos(p0) * Math.sin(la) - Math.sin(p0) * Math.cos(la) * Math.cos(lo - l0))),
      front: cosc > 0,
    };
  };
  const visiblePins = c2Pins.map((p) => ({ ...p, ...proj(p.lat, p.lon) })).filter((p) => p.front);
  return (
    <Svg>
      <circle cx={cx} cy={cy} r={r} stroke={I} strokeOpacity={0.35} />
      {[-60, -30, 0, 30, 60].map((lat) => (
        <ellipse key={lat} cx={cx} cy={r2(cy - r * Math.sin(((lat - 10) * Math.PI) / 180) * 0.9)} rx={r2(r * Math.cos((lat * Math.PI) / 180))} ry={r2(r * Math.cos((lat * Math.PI) / 180) * 0.3)} stroke={I} strokeOpacity={0.14} />
      ))}
      {[-60, -30, 0, 30, 60].map((k) => (
        <ellipse key={k} cx={cx} cy={cy} rx={r2(Math.abs(r * Math.sin((k * Math.PI) / 180))) || 1} ry={r} stroke={I} strokeOpacity={0.14} />
      ))}
      {arcs &&
        visiblePins.slice(1).map((p, i) => {
          const a = visiblePins[i];
          return <path key={p.place} d={`M${a.x},${a.y} Q${(a.x + p.x) / 2},${Math.min(a.y, p.y) - 40} ${p.x},${p.y}`} stroke={faded ? D : R} strokeOpacity={faded ? 0.35 : 0.9} strokeDasharray={faded ? "3 4" : undefined} />;
        })}
      {(arcs || pins) &&
        visiblePins.map((p) => (
          <g key={p.place}>
            <circle cx={p.x} cy={p.y} r={3} fill={faded ? I : R} />
            {pins && (
              <text x={p.x + 6} y={p.y + 3} fontSize={8} fill={I} style={mono}>
                {p.name}
              </text>
            )}
          </g>
        ))}
    </Svg>
  );
}

export function CalendarSvg() {
  const { months, counter } = visualText.calendar;
  return (
    <Svg>
      {months.map((m, i) => (
        <g key={m} transform={`translate(${70 + i * 9},${40 + i * 6})`}>
          <rect width={170} height={190} fill="#efebe4" stroke="#0a0a0a" fillOpacity={i === months.length - 1 ? 1 : 0.6} />
          <rect width={170} height={38} fill={i === 0 || i === months.length - 1 ? A : "#1b1b1b"} />
          {i === months.length - 1 && (
            <text x={12} y={27} fontSize={22} fill="#111" style={serif}>
              {m}
            </text>
          )}
        </g>
      ))}
      <text x={322} y={150} fontSize={64} fill={A} style={serif}>
        7
      </text>
      <text x={322} y={172} fontSize={8} fill={D} style={mono}>
        {counter.toUpperCase()}
      </text>
    </Svg>
  );
}

export function MapSvg() {
  const k = 48;
  const pt = ([lon, lat]: [number, number]) => [r2(200 + (lon - BD_CENTER[0]) * k * 0.92), r2(150 - (lat - BD_CENTER[1]) * k)];
  const d = BD_OUTLINE.map((p, i) => `${i ? "L" : "M"}${pt(p).join(",")}`).join(" ") + "Z";
  const dots = illustrativeDots(63, rng(812)).map(pt);
  return (
    <Svg>
      <path d={d} fill="#151515" stroke={A} strokeWidth={1.2} />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill={A} />
      ))}
      <text x={20} y={288} fontSize={8} fill={D} style={mono}>
        {visualText.map.caption}
      </text>
    </Svg>
  );
}

export function ReceiptSvg() {
  const { header, lines, tags, claim } = visualText.receipt;
  return (
    <Svg>
      <rect x={60} y={20} width={150} height={260} fill="#f3efe8" />
      <text x={72} y={44} fontSize={9} fill="#222" style={mono} fontWeight={600}>
        {header}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={72} y={72 + i * 22 + (i > 1 ? 10 : 0)} fontSize={9} fill="#222" style={mono}>
          {l}
        </text>
      ))}
      {tags.map((t, i) => {
        const y = [68, 90, 160][i];
        return (
          <g key={t}>
            <path d={`M200,${y} L248,${y}`} stroke={A} strokeDasharray="2 3" />
            <rect x={250} y={y - 12} width={120} height={22} fill={A} />
            <text x={258} y={y + 3} fontSize={9} fill="#111" style={mono} fontWeight={600}>
              {t.toUpperCase()}
            </text>
          </g>
        );
      })}
      <text x={72} y={262} fontSize={6.5} fill="#555" style={mono}>
        {claim}
      </text>
    </Svg>
  );
}

export function CrowdSvg({ labels = visualText.crowd }: { labels?: string[] }) {
  const groups = [7, 3, 4, 3];
  const r = rng(4);
  return (
    <Svg>
      {groups.map((n, g) => (
        <g key={g} transform={`translate(${55 + g * 97},0)`}>
          {Array.from({ length: n }, (_, i) => {
            const x = r2((r() - 0.5) * 60);
            const y = r2(150 + (r() - 0.5) * 30);
            return (
              <g key={i} fill={g === 0 ? A : I} fillOpacity={g === 0 ? 0.9 : 0.35 + g * 0.1}>
                <circle cx={x} cy={y - 26} r={7} />
                <rect x={x - 9} y={y - 16} width={18} height={34} rx={9} />
              </g>
            );
          })}
          <text y={210} fontSize={8} fill={D} style={mono} textAnchor="middle">
            {labels[g].toUpperCase()}
          </text>
        </g>
      ))}
      {[60, 90, 120].map((rr) => (
        <circle key={rr} cx={55} cy={140} r={rr} stroke={A} strokeOpacity={0.25} />
      ))}
    </Svg>
  );
}

export function PhoneSvg() {
  const { caller, status, script, fills, note } = visualText.phone;
  return (
    <Svg>
      <rect x={130} y={10} width={140} height={280} rx={18} fill="#1c1c1c" />
      <rect x={138} y={20} width={124} height={260} rx={10} fill="#0e0e0e" />
      <text x={148} y={44} fontSize={7} fill={D} style={mono}>
        {status.toUpperCase()}
      </text>
      <text x={148} y={60} fontSize={12} fill={I}>
        {caller}
      </text>
      {script.map((s, i) => (
        <g key={s}>
          <rect x={144} y={78 + i * 48} width={112} height={40} fill="#1d1d1d" />
          <foreignObject x={148} y={80 + i * 48} width={104} height={38}>
            <p style={{ fontSize: 8, lineHeight: 1.3, color: i < 2 ? "var(--color-amber)" : "var(--color-ivory)", margin: 0 }}>
              {s.replace("{name}", fills.name).replace("{purchase}", fills.purchase)}
            </p>
          </foreignObject>
        </g>
      ))}
      <text x={148} y={240} fontSize={6} fill={D} style={mono}>
        {note.toUpperCase()}
      </text>
      <circle cx={165} cy={262} r={10} fill={R} />
      <circle cx={235} cy={262} r={10} fill="#6fd08c" />
    </Svg>
  );
}

export function GaugeSvg({ gauge = visualText.gauge }: { gauge?: { label: string; cards: string[]; note: string } }) {
  const { label, cards, note } = gauge;
  return (
    <Svg>
      <path d="M40,210 A100,100 0 1,1 240,210" stroke="#222" strokeWidth={16} />
      <path d="M40,210 A100,100 0 0,1 62,148" stroke={R} strokeWidth={16} />
      <line x1={140} y1={190} x2={58} y2={160} stroke={I} strokeWidth={3} />
      <circle cx={140} cy={190} r={7} fill={I} />
      <text x={140} y={250} fontSize={9} fill={D} textAnchor="middle" style={mono}>
        {label.toUpperCase()} · {note.toUpperCase()}
      </text>
      {cards.map((c, i) => (
        <g key={c} transform={`translate(262,${40 + i * 34})`}>
          <rect width={130} height={28} fill="#151515" stroke={L} />
          <text x={8} y={18} fontSize={8} fill={I}>
            {c}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function ClipboardSvg() {
  return (
    <Svg>
      <rect x={90} y={10} width={220} height={285} rx={6} fill="#5a4632" />
      <rect x={100} y={30} width={200} height={258} fill="#f3efe8" />
      <text x={112} y={56} fontSize={16} fill="#111" style={serif}>
        {visualText.checklist.title}
      </text>
      {c1Checklist.map((item, i) => (
        <g key={item.text} transform={`translate(112,${78 + i * 29})`}>
          <rect width={13} height={13} stroke="#999" />
          {item.done && <path d="M2,7 L5,11 L12,2" stroke="#2f8a4f" strokeWidth={2} />}
          <text x={20} y={10} fontSize={8} fill={item.done ? "#222" : "#8a1b14"} fontWeight={item.done ? 400 : 700}>
            {item.text}
          </text>
        </g>
      ))}
      <g transform="translate(150,252) rotate(-7)">
        <rect width={130} height={32} stroke={R} strokeWidth={3} />
        <text x={65} y={23} fontSize={18} fill={R} fontWeight={700} textAnchor="middle">
          {visualText.checklist.stamp}
        </text>
      </g>
    </Svg>
  );
}

export function ShieldSvg() {
  return (
    <Svg>
      {c1Shield.map((label, i) => {
        const s = 1 - i * 0.085;
        return (
          <path
            key={label}
            d={`M${120 - 75 * s},${150 - 85 * s} L${120 + 75 * s},${150 - 85 * s} L${120 + 75 * s},${150 - 10 * s} Q${120 + 70 * s},${150 + 65 * s} 120,${150 + 105 * s} Q${120 - 70 * s},${150 + 65 * s} ${120 - 75 * s},${150 - 10 * s} Z`}
            fill={A}
            fillOpacity={0.1 + i * 0.09}
            stroke={A}
            strokeOpacity={0.6}
          />
        );
      })}
      {c1Shield.map((label, i) => (
        <text key={label} x={226} y={44 + i * 27} fontSize={9} fill={I} style={mono}>
          {String(i + 1).padStart(2, "0")} {label}
        </text>
      ))}
    </Svg>
  );
}

export function GlassSvg() {
  const { a, b } = visualText.glass;
  return (
    <Svg>
      {[60, 220].map((x, k) => (
        <g key={x}>
          <rect x={x} y={110} width={120} height={120} stroke={I} strokeOpacity={0.6} fill="#9fb7c8" fillOpacity={0.05} />
          {Array.from({ length: k ? 16 : 12 }, (_, i) => (
            <rect key={i} x={x + 12 + (i % 4) * 25} y={204 - Math.floor(i / 4) * 26} width={22} height={22} fill={k === 0 ? I : i < 8 ? "#8d8a84" : R} fillOpacity={k === 0 ? 0.85 : 1} />
          ))}
          <text x={x} y={250} fontSize={8} fill={D} style={mono}>
            {(k ? b : a).toUpperCase()}
          </text>
        </g>
      ))}
      <path d="M120,96 Q170,40 250,96" stroke={R} strokeDasharray="4 4" />
      <path d="M244,90 L251,97 L242,100" stroke={R} />
      {[0, 1].map((i) => (
        <rect key={i} x={95 + i * 24} y={70 - i * 18} width={22} height={22} fill={R} />
      ))}
      {[0, 1].map((i) => (
        <rect key={i} x={182 - i * 10} y={58 + i * 20} width={22} height={22} fill={R} />
      ))}
    </Svg>
  );
}

export function CoinsSvg() {
  const { coins, bar, note } = visualText.coins;
  return (
    <Svg>
      <line x1={40} y1={270} x2={360} y2={270} stroke={L} />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={110} cy={266 - i * 4} rx={12} ry={4} fill={A} stroke="#0a0a0a" strokeWidth={0.6} />
      ))}
      <text x={110} y={244} fontSize={8} fill={I} textAnchor="middle" style={mono}>
        {coins}
      </text>
      <rect x={230} y={20} width={70} height={250} fill={R} />
      <text x={265} y={14} fontSize={8} fill={I} textAnchor="middle" style={mono}>
        {bar}
      </text>
      <text x={40} y={292} fontSize={7} fill={D} style={mono}>
        {note.toUpperCase()}
      </text>
    </Svg>
  );
}

export function CorridorSvg() {
  return (
    <Svg>
      <path d="M0,0 L170,110 L230,110 L400,0 Z" fill="#1a1a1a" />
      <path d="M0,300 L170,190 L230,190 L400,300 Z" fill="#2a2a28" />
      <path d="M0,0 L170,110 L170,190 L0,300 Z" fill="#3a3936" />
      <path d="M400,0 L230,110 L230,190 L400,300 Z" fill="#3a3936" />
      {[0, 1, 2, 3].map((i) => {
        const t = 1 - i * 0.22;
        const x = 170 - 140 * t;
        const y = 150 - 32 * t;
        return (
          <g key={i}>
            <path d={`M${x},${y - 18 * t} L${x + 30 * t},${y - 15 * t} L${x + 30 * t},${y + 8 * t} L${x},${y + 10 * t} Z`} fill={R} />
            <path d={`M${400 - x},${y - 18 * t} L${400 - x - 30 * t},${y - 15 * t} L${400 - x - 30 * t},${y + 8 * t} L${400 - x},${y + 10 * t} Z`} fill={R} />
          </g>
        );
      })}
      <text x={200} y={290} fontSize={8} fill={D} textAnchor="middle" style={mono}>
        {visualText.corridor.note.toUpperCase()}
      </text>
    </Svg>
  );
}

export function PcsSvg() {
  const { a, b, wave } = visualText.pcs;
  return (
    <Svg>
      {[50, 230].map((x, i) => (
        <g key={x}>
          <rect x={x} y={70} width={120} height={84} rx={4} fill="#1d1d1d" />
          <rect x={x + 6} y={76} width={108} height={72} fill={i ? R : "#2f6b4a"} />
          <rect x={x + 55} y={154} width={10} height={26} fill="#2a2a2a" />
          <rect x={x + 30} y={180} width={60} height={4} fill="#2a2a2a" />
          <text x={x + 60} y={208} fontSize={9} fill={I} textAnchor="middle" style={mono}>
            {(i ? b : a).toUpperCase()}
          </text>
        </g>
      ))}
      <path d="M20,250 C100,230 300,270 380,250" stroke={R} strokeOpacity={0.6} />
      <text x={20} y={268} fontSize={8} fill={R} style={mono}>
        {wave.toUpperCase()} →
      </text>
    </Svg>
  );
}

// ── npm supply-chain study ──────────────────────────────────────────────────

export function NetworkSvg() {
  // Flat projection of the 3D layout: x, y with a little depth shift.
  const pt = ([x, y, z]: [number, number, number]) => [r2(200 + x * 24 + z * 6), r2(150 - y * 24 - z * 4)];
  return (
    <Svg>
      {NET_EDGES.map(([a, b]) => {
        const [x1, y1] = pt(NET_NODES[a]);
        const [x2, y2] = pt(NET_NODES[b]);
        return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={I} strokeOpacity={0.22} />;
      })}
      {NET_NODES.map((n, i) => {
        const [x, y] = pt(n);
        return <rect key={i} x={x - 5} y={y - 5} width={10} height={10} stroke={i === NET_BAD ? R : I} strokeOpacity={i === NET_BAD ? 1 : 0.45} />;
      })}
    </Svg>
  );
}

export function ServerCalendarSvg() {
  const { servers, calendar } = npmVisual;
  const cw = 300 / 7;
  const ch = 190 / 4;
  return (
    <Svg>
      <rect x={40} y={30} width={320} height={250} fill="#121212" stroke={L} />
      <text x={56} y={58} fontSize={18} fill={I} style={serif}>
        {calendar.title}
      </text>
      <text x={344} y={58} fontSize={7} fill={A} textAnchor="end" style={mono}>
        {calendar.note.toUpperCase()}
      </text>
      {Array.from({ length: 28 }, (_, k) => (
        <rect key={k} x={r2(50 + (k % 7) * cw)} y={r2(78 + Math.floor(k / 7) * ch)} width={r2(cw - 4)} height={r2(ch - 4)} stroke={I} strokeOpacity={0.14} />
      ))}
      {SERVER_CELLS.map(([c, r], i) => (
        <g key={i} transform={`translate(${r2(50 + c * cw + cw / 2 - 9)},${r2(78 + r * ch + 6)})`}>
          <rect width={18} height={26} fill="#1a1a1a" stroke={R} />
          <rect x={3} y={5} width={12} height={3} fill={R} />
          <text x={9} y={38} fontSize={7} fill={I} textAnchor="middle" style={mono}>
            {servers[i].replace("Server ", "")}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function TowersSvg() {
  const { towers } = npmVisual;
  return (
    <Svg>
      {TOWER_BLOCKS.map((n, t) => {
        const x = 50 + t * 82;
        const worst = t === TOWER_WORST;
        return (
          <g key={t}>
            <rect x={x} y={40} width={60} height={210} stroke={worst ? R : I} strokeOpacity={worst ? 1 : 0.35} />
            {Array.from({ length: n }, (_, j) => (
              <rect
                key={j}
                x={x + 7}
                y={238 - j * 19}
                width={46}
                height={14}
                fill={worst ? (j === 6 ? R : I) : D}
                fillOpacity={worst ? 0.9 : 0.18}
              />
            ))}
            <text x={x + 30} y={270} fontSize={7} fill={worst ? R : D} textAnchor="middle" style={mono}>
              {(worst ? towers.worst : towers.other).toUpperCase()}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

export function TreeSvg() {
  const pt = (i: number) => [r2(200 + TREE[i].x * 52), r2(150 - TREE[i].y * 60)];
  const onPath = (a: number, b: number) => {
    const k = TREE_PATH.indexOf(a);
    return k >= 0 && TREE_PATH[k + 1] === b;
  };
  return (
    <Svg>
      {TREE.map((n, i) => {
        if (n.parent < 0) return null;
        const [x1, y1] = pt(i);
        const [x2, y2] = pt(n.parent);
        const red = onPath(i, n.parent);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={red ? R : D} strokeOpacity={red ? 1 : 0.45} />;
      })}
      {TREE.map((_, i) => {
        const [x, y] = pt(i);
        const red = TREE_PATH.includes(i);
        const w = i === 0 ? 56 : 32;
        return <rect key={i} x={x - w / 2} y={y - 9} width={w} height={18} fill={red ? R : "#3a3835"} />;
      })}
      <text x={pt(0)[0]} y={pt(0)[1] - 16} fontSize={8} fill={I} textAnchor="middle" style={mono}>
        {npmVisual.tree.root.toUpperCase()}
      </text>
      <text x={pt(TREE_PATH[0])[0]} y={pt(TREE_PATH[0])[1] + 24} fontSize={8} fill={R} textAnchor="middle" style={mono}>
        {npmVisual.tree.bad.toUpperCase()}
      </text>
    </Svg>
  );
}

export function NodeBoxSvg() {
  const { label, markers } = npmVisual.nodeBox;
  return (
    <Svg>
      <rect x={110} y={50} width={180} height={140} fill="#9fb4c8" fillOpacity={0.06} stroke={I} strokeOpacity={0.6} />
      <text x={124} y={72} fontSize={14} fill={I} style={mono}>
        {label}
      </text>
      <rect x={176} y={96} width={48} height={48} fill={R} />
      {/* Scrambled band: blurred placeholder bars, never real text. */}
      <g className="cs-scramble">
        {Array.from({ length: 22 }, (_, k) => (
          <rect key={k} x={40 + k * 15} y={222} width={10} height={8} fill={I} fillOpacity={0.4} />
        ))}
      </g>
      {markers.map((m, i) => (
        <g key={m} transform={`translate(${56 + i * 112},216)`}>
          <rect width={m.length * 6.4 + 12} height={20} fill={R} />
          <text x={6} y={14} fontSize={10} fill="#0a0a0a" style={mono}>
            {m}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function BeaconsSvg({ labels = npmVisual.beacons }: { labels?: string[] }) {
  const b = [
    [110, 70],
    [300, 100],
  ];
  return (
    <Svg>
      {b.map(([x, y], i) => (
        <g key={i}>
          <path d={`M200,270 Q${(200 + x) / 2},${y - 20} ${x},${y}`} stroke={R} strokeDasharray="5 4" />
          <circle cx={x} cy={y} r={14} fill={R} fillOpacity={0.18} />
          <circle cx={x} cy={y} r={6} fill={R} />
          <text x={x} y={y - 22} fontSize={9} fill={I} textAnchor="middle" style={mono}>
            {labels[i]}
          </text>
        </g>
      ))}
      <rect x={186} y={264} width={28} height={16} fill="#1a1a1a" stroke={R} />
    </Svg>
  );
}

function cursorPath(x: number, y: number, s = 1) {
  const p = [
    [0, 0],
    [0, 42],
    [10, 32],
    [18, 50],
    [24, 47],
    [16, 30],
    [30, 30],
  ];
  return p.map(([a, b], i) => `${i ? "L" : "M"}${x + a * s},${y + b * s}`).join(" ") + "Z";
}

export function CursorSvg() {
  return (
    <Svg>
      <rect x={60} y={40} width={280} height={180} fill="#101214" stroke="#2a2a2a" strokeWidth={8} />
      <rect x={80} y={60} width={140} height={90} fill="#1b1e21" />
      <rect x={180} y={110} width={140} height={90} fill="#1b1e21" />
      <rect x={185} y={225} width={30} height={30} fill="#1a1a1a" />
      <path d={cursorPath(130, 120, 0.6)} fill={I} />
      <path d={cursorPath(250, 80, 0.6)} fill={R} />
      <text x={130} y={162} fontSize={7} fill={D} style={mono}>
        {npmVisual.cursor.owner.toUpperCase()}
      </text>
      <text x={250} y={122} fontSize={7} fill={R} style={mono}>
        {npmVisual.cursor.stranger.toUpperCase()}
      </text>
    </Svg>
  );
}

export function GaugesSvg() {
  const arc = (cx: number, level: number) => {
    const a0 = Math.PI * 1.375;
    const a1 = a0 - Math.PI * 1.25 * level;
    const r = 60;
    const p = (a: number) => `${r2(cx + r * Math.cos(a))},${r2(190 - r * Math.sin(a))}`;
    return `M${p(a0)} A${r},${r} 0 ${level > 0.8 ? 1 : 0} 1 ${p(a1)}`;
  };
  return (
    <Svg>
      <defs>
        <linearGradient id="npm-heat" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={R} stopOpacity={0.35} />
          <stop offset="1" stopColor={A} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={40} y={30} width={320} height={110} fill="url(#npm-heat)" />
      {[120, 280].map((cx, i) => (
        <g key={cx}>
          <path d={arc(cx, 1)} stroke="#222" strokeWidth={10} />
          <path d={arc(cx, i ? 0.93 : 0.97)} stroke={R} strokeWidth={10} />
          <text x={cx} y={200} fontSize={9} fill={I} textAnchor="middle" style={mono}>
            {npmVisual.gauges[i].toUpperCase()}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function RowsSvg() {
  const widths = [150, 110, 190, 90, 160, 120, 260, 140, 100, 170, 130];
  return (
    <Svg>
      {widths.map((w, i) => (
        <g key={i} transform={`translate(50,${30 + i * 22})`}>
          <rect width={20} height={8} fill={D} />
          <rect x={30} width={w} height={8} fill={i === 6 ? R : "#cfcac2"} fillOpacity={i === 6 ? 1 : 0.55} />
          <rect x={290} width={18} height={8} fill={D} fillOpacity={0.6} />
        </g>
      ))}
    </Svg>
  );
}

export function ChecklistSvg() {
  return (
    <Svg>
      <rect x={40} y={50} width={70} height={200} fill="#161616" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={50} y={65 + i * 28} width={50} height={5} fill={A} fillOpacity={0.5} />
      ))}
      {npmVisual.checklist.map((label, i) => (
        <g key={label} transform={`translate(140,${70 + i * 40})`}>
          <rect width={18} height={18} stroke={I} strokeOpacity={0.5} />
          <path d="M3,9 L8,14 L16,3" stroke={A} strokeWidth={2.5} />
          <text x={30} y={13} fontSize={12} fill={I}>
            {label}
          </text>
        </g>
      ))}
    </Svg>
  );
}

export function WallSvg({ label = npmVisual.wall.wall }: { label?: string }) {
  return (
    <Svg>
      <rect x={40} y={110} width={50} height={120} fill="#161616" />
      {Array.from({ length: 7 }, (_, r) => (
        <g key={r}>
          {Array.from({ length: 2 }, (_, c) => (
            <rect key={c} x={290 + (r % 2 ? 12 : 0) + c * 32} y={40 + r * 32} width={28} height={28} fill="#2a2722" />
          ))}
        </g>
      ))}
      {[70, 110, 150, 190, 230].map((y, k) => (
        <g key={y}>
          <path d={`M80,110 Q${180},${20 + k * 8} 285,${y}`} stroke={R} strokeOpacity={0.6} />
          <circle cx={285} cy={y} r={5} fill={R} />
        </g>
      ))}
      <text x={300} y={282} fontSize={8} fill={D} style={mono}>
        {label.toUpperCase()}
      </text>
    </Svg>
  );
}

export function SwitchesSvg() {
  const { after, label } = npmVisual.switches;
  return (
    <Svg>
      {Array.from({ length: SWITCH_COUNT }, (_, i) => {
        const x = 30 + i * 28;
        const off = i === SWITCH_SUSPECT;
        return (
          <g key={i}>
            <rect x={x} y={130} width={20} height={40} fill="#1b1b1b" />
            <rect x={x + 7} y={off ? 150 : 132} width={6} height={18} fill={I} />
            <circle cx={x + 10} cy={120} r={3} fill={off ? "#333" : A} />
          </g>
        );
      })}
      <rect x={330} y={60} width={24} height={180} fill="#222" />
      <rect x={334} y={r2(240 - 180 * (after / 100))} width={16} height={r2(180 * (after / 100))} fill={A} />
      <text x={342} y={52} fontSize={14} fill={A} textAnchor="middle" style={serif}>
        {after}%
      </text>
      <text x={342} y={258} fontSize={7} fill={D} textAnchor="middle" style={mono}>
        {label.toUpperCase()}
      </text>
    </Svg>
  );
}

export function MagnifierSvg() {
  const { ports, blind } = npmVisual.magnifier;
  const x = (i: number) => 40 + i * 68;
  const b = ports.indexOf("443");
  return (
    <Svg>
      {ports.map((p, i) => (
        <g key={p}>
          <rect x={x(i)} y={130} width={56} height={36} fill="#151515" stroke={I} strokeOpacity={0.35} />
          <text x={x(i) + 28} y={153} fontSize={12} fill={I} textAnchor="middle" style={mono}>
            :{p}
          </text>
        </g>
      ))}
      <circle cx={x(b) + 28} cy={148} r={44} stroke={I} strokeWidth={6} />
      <circle cx={x(b) + 28} cy={148} r={28} fill="#050505" fillOpacity={0.94} />
      <line x1={x(b) + 60} y1={180} x2={x(b) + 92} y2={212} stroke="#2a2a2a" strokeWidth={10} />
      <text x={x(b) + 28} y={110} fontSize={8} fill={A} textAnchor="middle" style={mono}>
        {blind.toUpperCase()}
      </text>
    </Svg>
  );
}

export function DoorsSvg() {
  return (
    <Svg>
      <rect x={230} y={70} width={70} height={130} fill={A} fillOpacity={0.05} stroke={D} strokeOpacity={0.4} strokeWidth={4} />
      <text x={265} y={62} fontSize={8} fill={A} textAnchor="middle" style={mono}>
        {npmVisual.doors.back.toUpperCase()}
      </text>
      <rect x={90} y={50} width={110} height={210} fill={A} fillOpacity={0.18} stroke={I} strokeWidth={8} />
      <text x={145} y={278} fontSize={8} fill={I} textAnchor="middle" style={mono}>
        {npmVisual.doors.front.toUpperCase()}
      </text>
    </Svg>
  );
}

export function KeysSvg() {
  return (
    <Svg>
      <circle cx={200} cy={60} r={30} stroke={D} strokeWidth={4} />
      {npmVisual.keys.map((k, i) => {
        const a = (i - 1.5) * 18;
        return (
          <g key={k} transform={`rotate(${a} 200 90)`}>
            <circle cx={200} cy={110} r={12} stroke={A} strokeWidth={5} />
            <rect x={197} y={122} width={6} height={80} fill={A} />
            <rect x={203} y={186} width={10} height={6} fill={A} />
            <rect x={203} y={196} width={7} height={6} fill={A} />
          </g>
        );
      })}
      {npmVisual.keys.map((k, i) => (
        <text key={k} x={50 + i * 100} y={280} fontSize={8} fill={I} textAnchor="middle" style={mono}>
          {k.toUpperCase()}
        </text>
      ))}
    </Svg>
  );
}

export function GuardShieldSvg() {
  return (
    <Svg>
      {npmShieldLayers.map((label, i) => {
        const s = 1 - i * 0.17;
        return (
          <path
            key={label}
            d={`M${120 - 75 * s},${150 - 85 * s} L${120 + 75 * s},${150 - 85 * s} L${120 + 75 * s},${150 - 10 * s} Q${120 + 70 * s},${150 + 65 * s} 120,${150 + 105 * s} Q${120 - 70 * s},${150 + 65 * s} ${120 - 75 * s},${150 - 10 * s} Z`}
            fill={G}
            fillOpacity={0.12 + i * 0.16}
            stroke={G}
            strokeOpacity={0.7}
          />
        );
      })}
      {npmShieldLayers.map((label, i) => (
        <text key={label} x={226} y={100 + i * 30} fontSize={11} fill={I} style={mono}>
          {String(i + 1).padStart(2, "0")} {label}
        </text>
      ))}
    </Svg>
  );
}

// ── MongoDB study ───────────────────────────────────────────────────────────

const C = "var(--color-ice)";
const TONE = { ivory: I, dim: D, amber: A, signal: R };
/** Maps the 3D timeline's x (-4…4) onto the SVG's width. */
const lx = (x: number) => r2(200 + x * 44);

export function ExposureSvg() {
  return (
    <Svg>
      <rect x={lx(LINE_START)} y={196} width={r2(lx(LINE_END) - lx(LINE_START))} height={6} fill="#2a2926" />
      <rect x={lx(LINE_START)} y={196} width={r2(lx(LINE_END) - lx(LINE_START))} height={6} fill={C} fillOpacity={0.85} />
      {Array.from({ length: 20 }, (_, i) => (
        <line key={i} x1={r2(lx(LINE_START) + ((lx(LINE_END) - lx(LINE_START)) * i) / 19)} x2={r2(lx(LINE_START) + ((lx(LINE_END) - lx(LINE_START)) * i) / 19)} y1={206} y2={212} stroke={D} />
      ))}
      {SESSION_X.map((x) => (
        <rect key={x} x={lx(x) - 2} y={170} width={4} height={24} fill={A} fillOpacity={0.4} />
      ))}
      {LINE_EVENTS.map((e, i) => (
        <rect key={i} x={lx(e.x) - 4} y={r2(196 - e.h * 50)} width={8} height={r2(e.h * 50)} fill={TONE[e.tone]} />
      ))}
      <text x={lx(LINE_START)} y={232} fontSize={8} fill={D} style={mono}>
        FEB 2025
      </text>
      <text x={lx(LINE_END)} y={232} fontSize={8} fill={D} style={mono} textAnchor="end">
        SEP 2026
      </text>
      <text x={200} y={268} fontSize={8} fill={D} style={mono} textAnchor="middle">
        {mongoVisual.timeline.note.toUpperCase()}
      </text>
    </Svg>
  );
}

export function OpenPortSvg() {
  return (
    <Svg>
      {SCANNERS.slice(0, 14).map((s, i) => {
        const x = r2(200 + s.from[0] * 30);
        const y = r2(140 - s.from[1] * 30);
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={200} y2={132} stroke={R} strokeOpacity={0.25} strokeDasharray="3 4" />
            <circle cx={x} cy={y} r={3} fill={R} />
          </g>
        );
      })}
      <rect x={140} y={70} width={120} height={150} fill="#141414" stroke={I} strokeOpacity={0.5} />
      {[190, 200, 108].map((y) => (
        <rect key={y} x={152} y={y} width={96} height={5} fill="#2a2926" />
      ))}
      <rect x={180} y={120} width={40} height={24} fill={C} fillOpacity={0.6} />
      <text x={200} y={162} fontSize={9} fill={I} style={mono} textAnchor="middle">
        {mongoVisual.port.port}
      </text>
      <text x={200} y={250} fontSize={8} fill={D} style={mono} textAnchor="middle">
        {mongoVisual.port.lock.toUpperCase()} · {mongoVisual.port.note.toUpperCase()}
      </text>
    </Svg>
  );
}

export function CollectionsSvg() {
  return (
    <Svg>
      {DRUMS.map(([x, z], i) => {
        const cx = r2(200 + x * 58);
        const cy = r2(140 - z * 62);
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={20} ry={8} stroke={D} strokeOpacity={0.5} strokeDasharray="3 3" />
            <text x={cx} y={cy + 22} fontSize={6} fill={D} style={mono} textAnchor="middle">
              {mongoCollections[i].name}
            </text>
          </g>
        );
      })}
      <rect x={186} y={118} width={28} height={28} fill={R} />
      <text x={200} y={268} fontSize={8} fill={R} style={mono} textAnchor="middle">
        {mongoVisual.ransom.toUpperCase()}
      </text>
    </Svg>
  );
}

export function HoleLayersSvg() {
  return (
    <Svg>
      {LAYER_OFFSETS.map((_, i) => {
        const x = 70 + i * 64;
        const y = 70 + i * 14;
        return (
          <g key={i}>
            <path d={`M${x},${y} l60,-20 l0,150 l-60,20 Z`} fill={I} fillOpacity={0.12 + i * 0.03} stroke={I} strokeOpacity={0.4} />
            <ellipse cx={x + 30} cy={y + 65} rx={8} ry={14} fill="#0a0a0a" stroke={I} strokeOpacity={0.5} />
            <text x={x + 30} y={y + 182} fontSize={7} fill={D} style={mono} textAnchor="middle">
              {mongoVisual.layers[i].toUpperCase()}
            </text>
          </g>
        );
      })}
      <line x1={40} y1={122} x2={360} y2={192} stroke={R} strokeWidth={3} />
      <text x={200} y={286} fontSize={8} fill={D} style={mono} textAnchor="middle">
        ILLUSTRATIVE
      </text>
    </Svg>
  );
}
