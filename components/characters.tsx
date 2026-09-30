import type { Mascot } from "@/lib/types";

const OUT = "#3d2b52";

type Props = { size?: number; className?: string; title?: string };

/** Mochi — a round cream cat who runs the café. Your main guide. */
export function Mochi({ size = 120, className, title = "Mochi the café cat" }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label={title}>
      {/* tail */}
      <path d="M92 92 C112 88 114 66 102 62" fill="none" stroke={OUT} strokeWidth="9" strokeLinecap="round" />
      <path d="M92 92 C112 88 114 66 102 62" fill="none" stroke="#f6e7cf" strokeWidth="5" strokeLinecap="round" />
      {/* ears */}
      <path d="M28 44 L32 14 L54 32 Z" fill="#f6e7cf" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M92 44 L88 14 L66 32 Z" fill="#f6e7cf" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M34 36 L35 22 L46 31 Z" fill="#f4b6b6" />
      <path d="M86 36 L85 22 L74 31 Z" fill="#f4b6b6" />
      {/* body */}
      <ellipse cx="60" cy="70" rx="40" ry="38" fill="#f6e7cf" stroke={OUT} strokeWidth="3" />
      {/* apron */}
      <path d="M36 82 Q60 76 84 82 L80 104 Q60 110 40 104 Z" fill="#c2a9f2" stroke={OUT} strokeWidth="2.5" />
      <path d="M52 90 h16" stroke={OUT} strokeWidth="2" strokeLinecap="round" />
      <text x="60" y="101" textAnchor="middle" fontSize="9" fill={OUT}>☕</text>
      {/* face */}
      <g className="blink">
        <ellipse cx="46" cy="62" rx="4" ry="5" fill={OUT} />
        <ellipse cx="74" cy="62" rx="4" ry="5" fill={OUT} />
        <circle cx="47.5" cy="60" r="1.4" fill="#fff" />
        <circle cx="75.5" cy="60" r="1.4" fill="#fff" />
      </g>
      <ellipse cx="38" cy="72" rx="6" ry="3.5" fill="#f4b6b6" opacity="0.8" />
      <ellipse cx="82" cy="72" rx="6" ry="3.5" fill="#f4b6b6" opacity="0.8" />
      <path d="M54 69 Q57 73 60 69 Q63 73 66 69" fill="none" stroke={OUT} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M58 66 L62 66 L60 68 Z" fill="#e58f8f" />
      {/* whiskers */}
      <path d="M24 64 L34 66 M24 70 L34 69 M96 64 L86 66 M96 70 L86 69" stroke={OUT} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Pip — a tiny acorn sprite. Shows up for the "baby steps" explanations. */
export function Pip({ size = 120, className, title = "Pip the acorn sprite" }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label={title}>
      {/* sprout */}
      <path d="M60 22 C60 14 62 8 66 4" fill="none" stroke={OUT} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 6 C76 0 86 6 82 14 C74 16 68 12 66 6 Z" fill="#8db580" stroke={OUT} strokeWidth="2" />
      {/* body */}
      <ellipse cx="60" cy="72" rx="34" ry="38" fill="#e9c08f" stroke={OUT} strokeWidth="3" />
      {/* cap */}
      <path d="M22 54 C22 26 98 26 98 54 C98 60 22 60 22 54 Z" fill="#9b6a43" stroke={OUT} strokeWidth="3" />
      <path d="M32 40 L44 52 M46 34 L58 50 M62 32 L72 50 M76 36 L84 50 M36 50 L50 36 M54 50 L66 34 M70 50 L82 38" stroke="#7b5132" strokeWidth="2" strokeLinecap="round" />
      {/* face */}
      <g className="blink">
        <circle cx="48" cy="74" r="4.2" fill={OUT} />
        <circle cx="72" cy="74" r="4.2" fill={OUT} />
        <circle cx="49.5" cy="72.5" r="1.3" fill="#fff" />
        <circle cx="73.5" cy="72.5" r="1.3" fill="#fff" />
      </g>
      <ellipse cx="40" cy="84" rx="5.5" ry="3.2" fill="#f19a8e" opacity="0.7" />
      <ellipse cx="80" cy="84" rx="5.5" ry="3.2" fill="#f19a8e" opacity="0.7" />
      <path d="M55 84 Q60 89 65 84" fill="none" stroke={OUT} strokeWidth="2.3" strokeLinecap="round" />
      {/* arms */}
      <path d="M27 84 Q18 90 22 98" fill="none" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
      <path d="M93 84 Q102 78 100 70" fill="none" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
      {/* feet */}
      <ellipse cx="48" cy="110" rx="7" ry="4" fill="#9b6a43" stroke={OUT} strokeWidth="2" />
      <ellipse cx="72" cy="110" rx="7" ry="4" fill="#9b6a43" stroke={OUT} strokeWidth="2" />
    </svg>
  );
}

/** Tofu — a fluffy librarian owl. Knows all the exam traps. */
export function Tofu({ size = 120, className, title = "Tofu the librarian owl" }: Props) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} role="img" aria-label={title}>
      {/* ear tufts */}
      <path d="M30 34 L26 14 L46 26 Z" fill="#c9b6e4" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M90 34 L94 14 L74 26 Z" fill="#c9b6e4" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      {/* body */}
      <path d="M20 60 C20 26 100 26 100 60 L100 84 C100 110 20 110 20 84 Z" fill="#c9b6e4" stroke={OUT} strokeWidth="3" />
      {/* belly */}
      <path d="M38 76 C38 62 82 62 82 76 L82 90 C82 106 38 106 38 90 Z" fill="#fbf3e6" stroke={OUT} strokeWidth="2" />
      <path d="M48 80 q4 4 8 0 q4 4 8 0 q4 4 8 0 M46 90 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0" fill="none" stroke="#c9b6e4" strokeWidth="2" strokeLinecap="round" />
      {/* wings */}
      <path d="M20 64 Q8 80 22 96" fill="#b39ddb" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M100 64 Q112 80 98 96" fill="#b39ddb" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      {/* eyes + glasses */}
      <circle cx="44" cy="50" r="13" fill="#fff" stroke={OUT} strokeWidth="3" />
      <circle cx="76" cy="50" r="13" fill="#fff" stroke={OUT} strokeWidth="3" />
      <path d="M57 50 h6" stroke={OUT} strokeWidth="3" />
      <g className="blink">
        <circle cx="45" cy="51" r="5.5" fill={OUT} />
        <circle cx="75" cy="51" r="5.5" fill={OUT} />
        <circle cx="47" cy="49" r="1.8" fill="#fff" />
        <circle cx="77" cy="49" r="1.8" fill="#fff" />
      </g>
      {/* beak */}
      <path d="M55 60 L65 60 L60 68 Z" fill="#f2b45a" stroke={OUT} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="30" cy="64" rx="5" ry="3" fill="#f4b6b6" opacity="0.8" />
      <ellipse cx="90" cy="64" rx="5" ry="3" fill="#f4b6b6" opacity="0.8" />
      {/* feet */}
      <path d="M48 108 v5 M52 108 v5 M68 108 v5 M72 108 v5" stroke="#f2b45a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Character({ name, ...rest }: Props & { name: Mascot }) {
  if (name === "pip") return <Pip {...rest} />;
  if (name === "tofu") return <Tofu {...rest} />;
  return <Mochi {...rest} />;
}

export const MASCOT_NAMES: Record<Mascot, string> = {
  mochi: "Mochi",
  pip: "Pip",
  tofu: "Tofu",
};
