import type { IslandArt as IslandArtKind } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/**
 * Hand-drawn miniature islands. Every island shares the same base (surf, sand,
 * cliff, grass) and gets its own landmark on top. Colours come from design tokens.
 */

function Palm({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C 2 -14 -2 -26 4 -38" className="fill-none stroke-wood" strokeWidth={3.2} strokeLinecap="round" />
      <path d="M4 -38 C -6 -44 -16 -40 -22 -32 C -12 -38 -4 -38 4 -38Z" className="fill-jungle" />
      <path d="M4 -38 C 14 -46 24 -44 30 -36 C 20 -40 12 -40 4 -38Z" className="fill-jungle" />
      <path d="M4 -38 C 0 -50 6 -56 14 -58 C 8 -52 6 -46 4 -38Z" className="fill-jungle-deep" />
      <path d="M4 -38 C -4 -46 -12 -54 -20 -52 C -12 -48 -4 -44 4 -38Z" className="fill-jungle-deep" />
      <circle cx={4} cy={-37} r={2.6} className="fill-wood" />
    </g>
  );
}

function Tree({ x, y, r = 12, deep = false }: { x: number; y: number; r?: number; deep?: boolean }) {
  return (
    <g>
      <rect x={x - 1.6} y={y - 4} width={3.2} height={10} rx={1} className="fill-wood" />
      <circle cx={x} cy={y - r * 0.6} r={r} className={deep ? "fill-jungle-deep" : "fill-jungle"} />
      <circle cx={x - r * 0.5} cy={y - r * 0.3} r={r * 0.7} className="fill-jungle-deep" opacity={0.9} />
      <circle cx={x + r * 0.35} cy={y - r * 0.95} r={r * 0.45} className="fill-haki" opacity={0.18} />
    </g>
  );
}

function Base({ sandy = false }: { sandy?: boolean }) {
  return (
    <g>
      <ellipse cx={130} cy={174} rx={112} ry={26} className="fill-sea-abyss" opacity={0.55} />
      <ellipse cx={130} cy={156} rx={114} ry={36} className="fill-foam" opacity={0.16} />
      <ellipse cx={130} cy={154} rx={104} ry={32} className="fill-foam" opacity={0.28} />
      <ellipse cx={130} cy={152} rx={98} ry={29} className="fill-sand" />
      <path d="M38 144 Q130 196 222 144 L222 150 Q130 204 38 150Z" className="fill-rock-deep" opacity={0.6} />
      <ellipse cx={130} cy={145} rx={88} ry={25} className={sandy ? "fill-sand" : "fill-jungle-deep"} />
      <ellipse cx={130} cy={141} rx={86} ry={22} className={sandy ? "fill-parchment-deep" : "fill-jungle"} />
      <ellipse cx={112} cy={136} rx={44} ry={9} className="fill-moon" opacity={0.08} />
    </g>
  );
}

function Window({ x, y, w = 5, h = 6 }: { x: number; y: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={1} className="fill-glow animate-flicker" />;
}

/* ---------- landmarks ---------- */

function Kozhikode() {
  // Hilltop campus with Kerala-style terracotta roofs and coconut palms.
  return (
    <g>
      <ellipse cx={136} cy={128} rx={58} ry={20} className="fill-jungle-deep" />
      <ellipse cx={136} cy={124} rx={50} ry={15} className="fill-jungle" />
      {/* main block */}
      <rect x={104} y={92} width={66} height={34} className="fill-moon" />
      <path d="M96 94 L137 70 L178 94 Z" className="fill-roof" />
      <path d="M96 94 L137 70 L137 74 L102 94Z" className="fill-ember" opacity={0.55} />
      <rect x={128} y={106} width={16} height={20} className="fill-wood" />
      <Window x={110} y={100} />
      <Window x={118} y={100} />
      <Window x={150} y={100} />
      <Window x={158} y={100} />
      {/* side wings */}
      <rect x={66} y={112} width={34} height={20} className="fill-parchment" />
      <path d="M60 114 L83 100 L106 114Z" className="fill-roof" />
      <Window x={72} y={118} />
      <Window x={88} y={118} />
      <rect x={174} y={110} width={32} height={20} className="fill-parchment" />
      <path d="M168 112 L190 98 L212 112Z" className="fill-roof" />
      <Window x={180} y={116} />
      <Window x={194} y={116} />
      {/* steps */}
      <path d="M128 126 h16 l4 10 h-24z" className="fill-sand" />
      <Palm x={58} y={140} s={0.9} />
      <Palm x={206} y={142} s={1} flip />
      <Palm x={222} y={132} s={0.7} />
      <Palm x={44} y={130} s={0.65} flip />
    </g>
  );
}

function Bangalore() {
  // Stone campus: long corridors, rhythmic arches, pergolas and rain trees.
  const arches = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <Tree x={70} y={120} r={18} deep />
      <Tree x={196} y={118} r={20} />
      <rect x={78} y={86} width={104} height={44} className="fill-rock" />
      <rect x={78} y={82} width={104} height={6} className="fill-rock-deep" />
      {arches.map((i) => (
        <path
          key={i}
          d={`M${84 + i * 16} 130 v-22 a6 6 0 0 1 12 0 v22z`}
          className="fill-rock-deep"
        />
      ))}
      {arches.map((i) => (
        <rect key={`l${i}`} x={87 + i * 16} y={116} width={6} height={4} className="fill-glow animate-flicker" opacity={0.8} />
      ))}
      {/* upper pergola */}
      <rect x={96} y={58} width={70} height={24} className="fill-rock" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={`p${i}`} x={94 + i * 11} y={52} width={3} height={8} className="fill-rock-deep" />
      ))}
      <rect x={92} y={50} width={78} height={4} className="fill-rock-deep" />
      <path d="M96 58 q10 -6 20 0 q10 -6 20 0 q10 -6 20 0" className="fill-none stroke-jungle" strokeWidth={4} strokeLinecap="round" />
      <Window x={104} y={66} w={8} />
      <Window x={120} y={66} w={8} />
      <Window x={136} y={66} w={8} />
      <Window x={152} y={66} w={8} />
      <Tree x={60} y={146} r={10} />
      <Tree x={212} y={146} r={11} deep />
    </g>
  );
}

function Forward() {
  // A lighthouse whose beam points forward.
  return (
    <g>
      <path d="M150 70 L250 40 L250 104 Z" className="fill-haki" opacity={0.16} />
      <path d="M150 72 L240 58 L240 88 Z" className="fill-glow" opacity={0.22} />
      <ellipse cx={128} cy={136} rx={30} ry={9} className="fill-rock-deep" />
      <path d="M116 134 L122 68 L138 68 L144 134Z" className="fill-moon" />
      <path d="M118 116 L142 116 L143 126 L117 126Z" className="fill-ember" />
      <path d="M120 92 L140 92 L141 100 L119 100Z" className="fill-ember" />
      <rect x={118} y={62} width={24} height={6} className="fill-rock-deep" />
      <rect x={121} y={48} width={18} height={14} className="fill-glow animate-flicker" />
      <path d="M118 48 L130 36 L142 48Z" className="fill-ember" />
      <rect x={129} y={28} width={2} height={9} className="fill-rock-deep" />
      <rect x={124} y={108} width={6} height={7} className="fill-glow" />
      {/* forward arrow pennant */}
      <path d="M131 28 L150 32 L131 36Z" className="fill-haki" />
      <path d="M70 140 l10 -12 l12 4 l6 10z" className="fill-rock" />
      <path d="M176 142 l8 -10 l10 2 l6 9z" className="fill-rock" />
      <Palm x={84} y={146} s={0.8} />
      <Tree x={190} y={136} r={10} />
    </g>
  );
}

function Hiroshima() {
  // Pagoda, cherry blossoms, stone lanterns and the famous floating torii.
  return (
    <g>
      {/* cherry trees */}
      {(
        [
          [70, 120, 16],
          [198, 118, 18],
          [178, 136, 11],
        ] as const
      ).map(([x, y, r]) => (
        <g key={`${x}`}>
          <rect x={x - 1.5} y={y} width={3} height={14} className="fill-wood" />
          <circle cx={x} cy={y - 2} r={r} className="fill-blossom" />
          <circle cx={x - r * 0.5} cy={y + 2} r={r * 0.6} className="fill-blossom" opacity={0.8} />
          <circle cx={x + r * 0.3} cy={y - r * 0.5} r={r * 0.4} className="fill-moon" opacity={0.35} />
        </g>
      ))}
      {/* pagoda */}
      <rect x={126} y={40} width={4} height={14} className="fill-rock-deep" />
      {[0, 1, 2, 3].map((i) => {
        const y = 56 + i * 18;
        const w = 22 + i * 7;
        return (
          <g key={i}>
            <rect x={128 - w / 2 + 4} y={y + 3} width={w - 8} height={14} className="fill-ember" />
            <rect x={128 - w / 2 + 8} y={y + 6} width={4} height={6} className="fill-glow animate-flicker" />
            <path d={`M${128 - w / 2 - 8} ${y + 4} Q128 ${y - 8} ${128 + w / 2 + 8} ${y + 4} L${128 + w / 2} ${y + 6} L${128 - w / 2} ${y + 6}Z`} className="fill-rock-deep" />
          </g>
        );
      })}
      <rect x={112} y={128} width={32} height={8} className="fill-rock" />
      {/* stone lanterns */}
      <g>
        <rect x={94} y={126} width={6} height={12} className="fill-rock" />
        <rect x={92} y={120} width={10} height={7} className="fill-glow animate-flicker" />
        <path d="M90 120 L97 114 L104 120Z" className="fill-rock" />
      </g>
      <g>
        <rect x={156} y={126} width={6} height={12} className="fill-rock" />
        <rect x={154} y={120} width={10} height={7} className="fill-glow animate-flicker" />
        <path d="M152 120 L159 114 L166 120Z" className="fill-rock" />
      </g>
      {/* floating torii, standing in the surf */}
      <g transform="translate(206 128)">
        <rect x={-18} y={10} width={5} height={42} className="fill-ember" />
        <rect x={13} y={10} width={5} height={42} className="fill-ember" />
        <path d="M-28 4 Q0 -4 28 4 L26 10 L-26 10Z" className="fill-ember" />
        <rect x={-30} y={1} width={60} height={4} rx={2} className="fill-rock-deep" />
        <rect x={-20} y={18} width={40} height={4} className="fill-ember" />
        <ellipse cx={0} cy={54} rx={30} ry={5} className="fill-foam" opacity={0.35} />
      </g>
    </g>
  );
}

function OpenCupboard() {
  // A giant cupboard with its doors flung open — glowing with code and shipped products.
  return (
    <g>
      <path d="M86 46 L174 46 L178 132 L82 132Z" className="fill-wood" />
      <path d="M92 54 L168 54 L171 126 L89 126Z" className="fill-sea-abyss" />
      <path d="M92 54 L168 54 L171 126 L89 126Z" className="fill-haki" opacity={0.22} />
      {/* shelves */}
      <rect x={91} y={78} width={79} height={3} className="fill-wood" />
      <rect x={90} y={102} width={81} height={3} className="fill-wood" />
      {/* code glyph */}
      <text x={130} y={74} textAnchor="middle" className="fill-haki font-mono" fontSize={16} fontWeight={700}>
        {"</>"}
      </text>
      {/* boxes = shipped products */}
      <rect x={98} y={86} width={14} height={16} rx={2} className="fill-gold" />
      <rect x={116} y={90} width={12} height={12} rx={2} className="fill-moon" />
      <rect x={132} y={84} width={16} height={18} rx={2} className="fill-ember" />
      <rect x={152} y={89} width={12} height={13} rx={2} className="fill-sea-light" />
      <rect x={100} y={110} width={26} height={16} rx={2} className="fill-parchment" />
      <rect x={132} y={112} width={30} height={14} rx={2} className="fill-gold" opacity={0.85} />
      {/* doors swung open */}
      <path d="M86 46 L58 58 L60 138 L82 132Z" className="fill-wood" />
      <path d="M86 46 L58 58 L60 138 L82 132Z" className="fill-moon" opacity={0.12} />
      <circle cx={78} cy={92} r={2.4} className="fill-gold" />
      <path d="M174 46 L204 58 L202 138 L178 132Z" className="fill-wood" />
      <path d="M174 46 L204 58 L202 138 L178 132Z" className="fill-sea-abyss" opacity={0.25} />
      <circle cx={182} cy={92} r={2.4} className="fill-gold" />
      {/* crown */}
      <path d="M80 46 L180 46 L172 34 L88 34Z" className="fill-wood" />
      <path d="M118 34 L130 18 L142 34Z" className="fill-gold" />
      <circle cx={130} cy={26} r={3} className="fill-glow animate-flicker" />
      {/* light spilling out */}
      <path d="M92 126 L171 126 L196 156 L64 156Z" className="fill-haki" opacity={0.16} />
      <Palm x={44} y={146} s={0.8} />
      <Palm x={218} y={146} s={0.85} flip />
    </g>
  );
}

function ECell() {
  // Launch pad: a rocket on its tower, founders' tents around it.
  return (
    <g>
      {/* tower */}
      <path d="M150 132 L150 40 M164 132 L164 40" className="stroke-rock-deep" strokeWidth={3} />
      {[50, 66, 82, 98, 114].map((y) => (
        <path key={y} d={`M150 ${y} L164 ${y + 14} M164 ${y} L150 ${y + 14}`} className="stroke-rock" strokeWidth={1.6} />
      ))}
      <rect x={136} y={62} width={14} height={3} className="fill-rock-deep" />
      {/* rocket */}
      <path d="M126 36 C 134 46 136 62 136 96 L116 96 C 116 62 118 46 126 36Z" className="fill-moon" />
      <circle cx={126} cy={62} r={5} className="fill-sea-light" />
      <circle cx={126} cy={62} r={2.4} className="fill-glow" />
      <path d="M116 80 L106 100 L116 96Z" className="fill-ember" />
      <path d="M136 80 L146 100 L136 96Z" className="fill-ember" />
      <path d="M121 96 L131 96 L128 104 L124 104Z" className="fill-rock-deep" />
      <path d="M120 104 Q126 132 132 104Z" className="fill-gold animate-flicker" />
      <path d="M122 104 Q126 120 130 104Z" className="fill-glow" />
      <rect x={108} y={124} width={46} height={8} className="fill-rock" />
      {/* tents */}
      <path d="M62 136 L78 112 L94 136Z" className="fill-gold" />
      <path d="M78 112 L84 136 L94 136Z" className="fill-wood" opacity={0.5} />
      <path d="M176 138 L190 116 L204 138Z" className="fill-ember" />
      <path d="M190 116 L195 138 L204 138Z" className="fill-rock-deep" opacity={0.45} />
      <circle cx={100} cy={142} r={4} className="fill-gold animate-flicker" />
      <path d="M78 112 L78 100 L88 104 L78 108" className="fill-haki stroke-wood" strokeWidth={1} />
      <Palm x={216} y={142} s={0.7} flip />
      <Tree x={48} y={146} r={9} />
    </g>
  );
}

function Marketing() {
  // Signal tower broadcasting campaigns, with a billboard of rising bars.
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${150 + i * 10} ${46 - i * 10} a${30 + i * 14} ${30 + i * 14} 0 0 1 0 ${44 + i * 24}`}
          className="fill-none stroke-haki"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.7 - i * 0.18}
        />
      ))}
      <path d="M128 136 L138 40 L148 136" className="fill-none stroke-rock-deep" strokeWidth={4} />
      {[60, 80, 100, 120].map((y) => (
        <path key={y} d={`M${131 + (136 - y) * 0.02} ${y} L${145} ${y + 12}`} className="stroke-rock" strokeWidth={2} />
      ))}
      <circle cx={138} cy={38} r={6} className="fill-ember animate-flicker" />
      {/* megaphone */}
      <path d="M140 58 L160 48 L160 72 L140 64Z" className="fill-gold" />
      <rect x={134} y={57} width={7} height={8} rx={2} className="fill-rock-deep" />
      {/* billboard */}
      <rect x={60} y={74} width={58} height={40} rx={3} className="fill-parchment" />
      <rect x={60} y={74} width={58} height={40} rx={3} className="fill-none stroke-wood" strokeWidth={3} />
      <rect x={68} y={98} width={8} height={10} className="fill-sea-light" />
      <rect x={80} y={92} width={8} height={16} className="fill-sea-light" />
      <rect x={92} y={86} width={8} height={22} className="fill-haki" />
      <rect x={104} y={80} width={8} height={28} className="fill-ember" />
      <path d="M68 92 L84 86 L96 80 L110 76" className="fill-none stroke-ink" strokeWidth={1.6} />
      <rect x={72} y={114} width={4} height={22} className="fill-wood" />
      <rect x={102} y={114} width={4} height={22} className="fill-wood" />
      <Palm x={196} y={144} s={0.9} flip />
      <Tree x={182} y={126} r={10} deep />
    </g>
  );
}

function EdTech() {
  // A giant phone streaming a lesson, a play-button billboard and a chalkboard.
  return (
    <g>
      {/* chalkboard */}
      <rect x={52} y={86} width={54} height={36} rx={2} className="fill-jungle-deep" />
      <rect x={52} y={86} width={54} height={36} rx={2} className="fill-none stroke-wood" strokeWidth={3} />
      <path d="M60 98 h18 M60 106 h30 M60 114 h22" className="stroke-moon" strokeWidth={1.6} strokeLinecap="round" opacity={0.8} />
      <path d="M84 96 l6 6 l10 -10" className="fill-none stroke-gold" strokeWidth={2} strokeLinecap="round" />
      <rect x={62} y={122} width={4} height={16} className="fill-wood" />
      <rect x={92} y={122} width={4} height={16} className="fill-wood" />
      {/* phone */}
      <rect x={118} y={36} width={52} height={98} rx={9} className="fill-rock-deep" />
      <rect x={122} y={44} width={44} height={80} rx={4} className="fill-sea-abyss" />
      <rect x={122} y={44} width={44} height={34} rx={4} className="fill-ember" />
      <path d="M139 53 L139 69 L152 61Z" className="fill-moon" />
      <rect x={126} y={84} width={36} height={4} rx={2} className="fill-moon" opacity={0.7} />
      <rect x={126} y={92} width={26} height={4} rx={2} className="fill-moon" opacity={0.45} />
      <rect x={126} y={102} width={36} height={14} rx={3} className="fill-haki" opacity={0.85} />
      <circle cx={144} cy={129} r={2.2} className="fill-moon" opacity={0.5} />
      {/* subscriber counter rising */}
      <path d="M176 112 L190 98 L200 104 L214 82" className="fill-none stroke-haki" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M208 80 L216 80 L216 88" className="fill-none stroke-haki" strokeWidth={3} strokeLinecap="round" />
      <Palm x={218} y={146} s={0.75} flip />
      <Tree x={40} y={144} r={9} />
    </g>
  );
}

function ArtShop() {
  // An easel with a fresh sketch, a giant pencil and a palette: the first shop.
  return (
    <g>
      {/* easel */}
      <path d="M96 136 L118 48 M150 136 L128 48 M123 48 L123 136" className="stroke-wood" strokeWidth={4} strokeLinecap="round" />
      <rect x={88} y={56} width={70} height={56} rx={2} className="fill-moon" />
      <rect x={88} y={56} width={70} height={56} rx={2} className="fill-none stroke-wood" strokeWidth={3} />
      <rect x={86} y={110} width={74} height={5} className="fill-wood" />
      {/* the sketch on the canvas */}
      <path d="M98 100 Q110 72 122 88 T146 74" className="fill-none stroke-ink" strokeWidth={2} strokeLinecap="round" />
      <circle cx={140} cy={68} r={6} className="fill-gold" />
      <path d="M98 104 h48" className="stroke-ink" strokeWidth={1} opacity={0.4} />
      {/* giant pencil */}
      <g transform="rotate(-28 190 96)">
        <rect x={180} y={50} width={14} height={70} className="fill-gold" />
        <rect x={180} y={50} width={14} height={9} className="fill-blossom" />
        <rect x={180} y={58} width={14} height={4} className="fill-rock" />
        <path d="M180 120 L187 136 L194 120Z" className="fill-sand" />
        <path d="M185 130 L187 136 L189 130Z" className="fill-ink" />
      </g>
      {/* palette */}
      <path d="M44 132 C 40 112 64 104 80 110 C 92 114 88 124 80 124 C 72 124 74 134 66 136 C 56 138 46 140 44 132Z" className="fill-wood" />
      <circle cx={56} cy={118} r={4} className="fill-ember" />
      <circle cx={67} cy={113} r={3.6} className="fill-haki" />
      <circle cx={78} cy={116} r={3.4} className="fill-gold" />
      <circle cx={54} cy={129} r={3.4} className="fill-sea-light" />
      {/* price tag */}
      <path d="M160 128 l16 -6 l6 12 l-16 6z" className="fill-parchment" />
      <circle cx={164} cy={130} r={1.6} className="fill-ink" />
      <Palm x={222} y={148} s={0.7} flip />
    </g>
  );
}

const LANDMARKS: Record<IslandArtKind, () => React.JSX.Element> = {
  iimk: Kozhikode,
  iimb: Bangalore,
  mckinsey: Forward,
  hiroshima: Hiroshima,
  opencupboard: OpenCupboard,
  ecell: ECell,
  marketing: Marketing,
  edtech: EdTech,
  anarts: ArtShop,
};

export function IslandArt({
  art,
  className,
  title,
}: {
  art: IslandArtKind;
  className?: string;
  title?: string;
}) {
  const Landmark = LANDMARKS[art];
  return (
    <svg
      viewBox="0 0 260 200"
      className={cn("h-auto w-full overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <Base sandy={art === "anarts"} />
      <Landmark />
    </svg>
  );
}
