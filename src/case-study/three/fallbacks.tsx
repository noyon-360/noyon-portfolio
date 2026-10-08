// Static SVG versions of every 3D object, shown on phones, under reduced motion, before 3D loads,
// and to anyone without WebGL. Each one shows the object's end state. Decorative: the Stage carries alt text.
import { c1Checklist, c1Shield, c2Pins, visualText } from "../content";
import { BD_CENTER, BD_OUTLINE, illustrativeDots } from "./bangladesh";
import { rng } from "./util";

const A = "var(--color-amber)";
const R = "var(--color-signal)";
const I = "var(--color-ivory)";
const D = "var(--color-dim)";
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

export function CrowdSvg() {
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
            {visualText.crowd[g].toUpperCase()}
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

export function GaugeSvg() {
  const { label, cards, note } = visualText.gauge;
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
