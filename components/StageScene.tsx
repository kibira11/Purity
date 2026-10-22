import { useId } from "react";
import { stages } from "@/content/stages";

/** Round trig results: Node and browsers can differ in the last digits, which breaks hydration. */
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Deterministic pseudo-random so server and client render identical stars. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function Stars({ n = 60, seed = 7, maxY = 220, opacity = 1 }: { n?: number; seed?: number; maxY?: number; opacity?: number }) {
  const r = rng(seed);
  return (
    <g opacity={opacity}>
      {Array.from({ length: n }).map((_, i) => {
        const x = r() * 800;
        const y = r() * maxY;
        const size = 0.6 + r() * 1.6;
        return <circle key={i} cx={x} cy={y} r={size} fill="#f6dfb2" opacity={0.35 + r() * 0.65} />;
      })}
    </g>
  );
}

const Dunes = ({ c1, c2, c3, y = 250 }: { c1: string; c2: string; c3: string; y?: number }) => (
  <>
    <path d={`M0 ${y} C 120 ${y - 40}, 240 ${y - 30}, 360 ${y - 8} S 620 ${y - 50}, 800 ${y - 12} V360 H0Z`} fill={c1} />
    <path d={`M0 ${y + 40} C 160 ${y + 6}, 300 ${y + 20}, 440 ${y + 38} S 680 ${y + 10}, 800 ${y + 32} V360 H0Z`} fill={c2} />
    <path d={`M0 ${y + 80} C 200 ${y + 54}, 360 ${y + 70}, 520 ${y + 84} S 720 ${y + 66}, 800 ${y + 78} V360 H0Z`} fill={c3} />
  </>
);

export function StageScene({
  stage,
  className = "",
  title,
}: {
  stage: string;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const meta = stages.find((s) => s.id === stage) ?? stages[0];
  const [top, bottom] = meta.sky;
  const sky = `sky-${uid}`;
  const glow = `glow-${uid}`;

  return (
    <svg
      viewBox="0 0 800 360"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      {...(title === ""
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": title ?? `${meta.name}: ${meta.subtitle}` })}
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#f6dfb2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f6dfb2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`water-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f93b5" />
          <stop offset="1" stopColor="#2a4a6e" />
        </linearGradient>
      </defs>
      <rect width="800" height="360" fill={`url(#${sky})`} />

      {stage === "egypt" && (
        <>
          <Stars n={80} seed={11} maxY={200} />
          <circle cx="620" cy="70" r="26" fill="#f4e7c8" opacity="0.95" />
          <circle cx="632" cy="64" r="24" fill={top} />
          <path d="M80 270 L200 140 L320 270Z" fill="#14172f" />
          <path d="M200 140 L320 270 L240 270Z" fill="#0e1124" />
          <path d="M300 270 L420 180 L540 270Z" fill="#171a36" />
          <Dunes c1="#1d2145" c2="#14172f" c3="#0e1124" y={262} />
          {/* a chain across the foreground */}
          <g fill="none" stroke="#8b8da3" strokeWidth="5" opacity="0.9">
            {Array.from({ length: 9 }).map((_, i) => {
              const cy = r1(318 + Math.sin(i * 0.7) * 6);
              return (
                <ellipse
                  key={i}
                  cx={140 + i * 58}
                  cy={cy}
                  rx="22"
                  ry="11"
                  transform={i % 2 ? `rotate(90 ${140 + i * 58} ${cy})` : undefined}
                />
              );
            })}
          </g>
          {/* lone figure */}
          <g fill="#05060f">
            <circle cx="600" cy="238" r="7" />
            <path d="M592 246 h16 l4 40 h-24Z" />
          </g>
        </>
      )}

      {stage === "passover" && (
        <>
          <Stars n={55} seed={23} maxY={170} opacity={0.9} />
          <circle cx="160" cy="80" r="22" fill="#f4e7c8" opacity="0.9" />
          <Dunes c1="#2a2650" c2="#201c42" c3="#171436" y={280} />
          {/* house */}
          <rect x="250" y="170" width="300" height="150" fill="#12122b" />
          <rect x="235" y="156" width="330" height="20" fill="#0c0c20" />
          {/* glowing doorway */}
          <circle cx="400" cy="250" r="120" fill={`url(#${glow})`} opacity="0.7" />
          <path d="M360 320 V230 a40 40 0 0 1 80 0 V320Z" fill="#f3c97c" />
          {/* blood on lintel and posts */}
          <path d="M350 232 H450" stroke="#a63f35" strokeWidth="9" strokeLinecap="round" />
          <path d="M352 232 V318 M448 232 V318" stroke="#a63f35" strokeWidth="8" strokeLinecap="round" />
          <path d="M330 320 h140" stroke="#0c0c20" strokeWidth="6" />
          {/* a lamb */}
          <g fill="#f7f1e6" opacity="0.95">
            <ellipse cx="600" cy="312" rx="24" ry="14" />
            <circle cx="625" cy="300" r="8" />
            <rect x="587" y="318" width="4" height="12" />
            <rect x="607" y="318" width="4" height="12" />
          </g>
        </>
      )}

      {stage === "red-sea" && (
        <>
          <Stars n={40} seed={31} maxY={140} opacity={0.7} />
          {/* pillar of fire and cloud */}
          <ellipse cx="400" cy="90" rx="130" ry="110" fill={`url(#${glow})`} opacity="0.55" />
          <path d="M392 360 V40 h16 V360Z" fill="#f3c97c" opacity="0.35" />
          {/* sea floor path */}
          <path d="M330 360 L385 90 H415 L470 360Z" fill="#b99a74" opacity="0.9" />
          {/* waters standing as walls */}
          <path d="M0 40 H345 C360 100 340 200 372 360 H0Z" fill={`url(#water-${uid})`} />
          <path d="M800 40 H455 C440 100 460 200 428 360 H800Z" fill={`url(#water-${uid})`} />
          <g fill="none" stroke="#d7e7f3" strokeWidth="2" opacity="0.5">
            <path d="M20 90 q40 -18 80 0 t80 0 t80 0" />
            <path d="M0 150 q40 -18 80 0 t80 0 t80 0 t60 0" />
            <path d="M0 220 q40 -18 80 0 t80 0 t80 0 t60 0" />
            <path d="M480 100 q40 -18 80 0 t80 0 t80 0" />
            <path d="M500 170 q40 -18 80 0 t80 0 t80 0" />
            <path d="M470 240 q40 -18 80 0 t80 0 t80 0" />
          </g>
          {/* crossing people */}
          <g fill="#0b0b1d">
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${385 + (i % 2) * 26} ${300 - i * 34}) scale(${1 - i * 0.12})`}>
                <circle cx="0" cy="0" r="6" />
                <path d="M-7 8 h14 l3 30 h-20Z" />
              </g>
            ))}
          </g>
        </>
      )}

      {stage === "wilderness" && (
        <>
          <circle cx="400" cy="210" r="170" fill={`url(#${glow})`} opacity="0.7" />
          <circle cx="400" cy="224" r="36" fill="#fbe2a8" />
          <Dunes c1="#8a5a6d" c2="#6d4560" c3="#4b3050" y={236} />
          {/* tent */}
          <path d="M560 318 L610 262 L660 318Z" fill="#2b1f3a" />
          <path d="M610 262 L632 318 H588Z" fill="#1d1428" />
          {/* manna falling */}
          <g fill="#fff6dc">
            {Array.from({ length: 36 }).map((_, i) => {
              const r = rng(i * 13 + 5);
              return <circle key={i} cx={r() * 800} cy={r() * 300} r={1 + r() * 2.2} opacity={0.35 + r() * 0.6} />;
            })}
          </g>
          <g fill="#05060f">
            <circle cx="200" cy="300" r="6" />
            <path d="M193 308 h14 l3 28 h-20Z" />
            <path d="M207 312 l22 -22" stroke="#05060f" strokeWidth="3" />
          </g>
        </>
      )}

      {stage === "sinai" && (
        <>
          <circle cx="400" cy="120" r="150" fill={`url(#${glow})`} opacity="0.45" />
          <path d="M120 320 L330 120 L400 70 L470 130 L690 320Z" fill="#4a2a3f" />
          <path d="M400 70 L470 130 L690 320 H480Z" fill="#331c2e" />
          <path d="M330 120 L400 70 L384 140Z" fill="#6c3f4f" opacity="0.8" />
          {/* flame on the peak */}
          <path d="M400 20 c22 20 30 34 30 50 a30 30 0 0 1 -60 0 c0 -16 8 -30 30 -50Z" fill="#f6a24c" />
          <path d="M400 40 c12 12 16 22 16 32 a16 16 0 0 1 -32 0 c0 -10 4 -20 16 -32Z" fill="#fff0b8" />
          {/* smoke */}
          <g fill="#2a1a2e" opacity="0.5">
            <ellipse cx="380" cy="112" rx="70" ry="22" />
            <ellipse cx="440" cy="130" rx="80" ry="20" />
          </g>
          <Dunes c1="#8c4b4a" c2="#6c3640" c3="#47252f" y={284} />
          {/* gathered people */}
          <g fill="#14090f">
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={i} transform={`translate(${150 + i * 48} ${330 + (i % 3) * 8})`}>
                <circle cx="0" cy="0" r="5" />
                <path d="M-6 7 h12 l3 22 h-18Z" />
              </g>
            ))}
          </g>
        </>
      )}

      {stage === "jordan" && (
        <>
          <circle cx="400" cy="150" r="190" fill={`url(#${glow})`} opacity="0.8" />
          <circle cx="400" cy="170" r="42" fill="#fff0c4" />
          <path d="M0 230 C 140 190 260 210 400 200 S 660 180 800 220 V360 H0Z" fill="#b57a58" opacity="0.8" />
          <path d="M0 250 C 120 226 280 240 400 236 S 680 224 800 246 V360 H0Z" fill="#8f9a6d" />
          {/* the river */}
          <path d="M280 360 C 300 310 420 300 380 270 S 330 250 400 240 L470 240 C 420 262 480 282 450 304 S 520 340 600 360Z" fill="#5b95aa" />
          <path d="M310 356 C 340 320 430 316 410 290" fill="none" stroke="#bfe0ea" strokeWidth="2" opacity="0.6" />
          {/* twelve stones */}
          <g>
            {[
              [90, 328, 30, 18], [128, 332, 28, 16], [166, 328, 26, 16], [108, 310, 30, 17], [148, 312, 26, 15], [128, 294, 28, 16],
            ].map(([x, y, rx, ry], i) => (
              <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={i % 2 ? "#7b6a5d" : "#9a8978"} />
            ))}
          </g>
          <g fill="#26283d">
            <circle cx="640" cy="318" r="6" />
            <path d="M633 326 h14 l3 26 h-20Z" />
            <circle cx="668" cy="320" r="5.5" />
            <path d="M662 327 h13 l3 24 h-19Z" />
          </g>
        </>
      )}

      {stage === "promised-land" && (
        <>
          <circle cx="620" cy="90" r="160" fill={`url(#${glow})`} opacity="0.7" />
          <circle cx="620" cy="96" r="34" fill="#fff4cf" />
          <path d="M0 230 C 160 170 300 210 420 200 S 660 160 800 210 V360 H0Z" fill="#a9b77f" />
          <path d="M0 270 C 180 220 340 262 480 244 S 700 214 800 250 V360 H0Z" fill="#7d8f69" />
          <path d="M0 316 C 200 280 380 310 560 296 S 740 290 800 304 V360 H0Z" fill="#5f7350" />
          {/* vineyard rows */}
          <g stroke="#4a5d3c" strokeWidth="2.5" fill="none" opacity="0.9">
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={i} d={`M${60 + i * 22} 330 Q ${150 + i * 34} 288 ${260 + i * 50} 276`} />
            ))}
          </g>
          {/* fruit tree */}
          <rect x="598" y="206" width="9" height="62" fill="#5c4332" />
          <circle cx="602" cy="196" r="44" fill="#6b8159" />
          <circle cx="580" cy="210" r="28" fill="#7d8f69" />
          <circle cx="626" cy="212" r="26" fill="#7d8f69" />
          {[[588, 190], [612, 182], [626, 206], [584, 214], [604, 208]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#d98f4e" />
          ))}
          {/* distant birds */}
          <g fill="none" stroke="#f6dfb2" strokeWidth="2" strokeLinecap="round" opacity="0.9">
            <path d="M210 90 q10 -10 20 0 q10 -10 20 0" />
            <path d="M280 62 q8 -8 16 0 q8 -8 16 0" />
          </g>
        </>
      )}

      {stage === "zion" && (
        <>
          <g opacity="0.7" stroke="#fff6dc" strokeWidth="3">
            {Array.from({ length: 14 }).map((_, i) => {
              const a = (i / 14) * Math.PI;
              return <line key={i} x1="400" y1="190" x2={r1(400 + Math.cos(a) * 520)} y2={r1(190 - Math.sin(a) * 520)} opacity="0.25" />;
            })}
          </g>
          <circle cx="400" cy="170" r="230" fill={`url(#${glow})`} />
          <circle cx="400" cy="160" r="50" fill="#fffaf0" />
          <path d="M0 290 C 160 250 300 270 400 240 S 660 250 800 280 V360 H0Z" fill="#e7c98f" />
          {/* the city */}
          <path d="M250 300 L300 230 H500 L550 300Z" fill="#d1a867" />
          <g fill="#f3dcaa">
            <rect x="300" y="190" width="200" height="50" />
            <rect x="312" y="150" width="30" height="50" />
            <rect x="385" y="120" width="30" height="80" />
            <rect x="458" y="150" width="30" height="50" />
          </g>
          <g fill="#c8903f">
            <path d="M312 150 l15 -22 l15 22Z" />
            <path d="M385 120 l15 -28 l15 28Z" />
            <path d="M458 150 l15 -22 l15 22Z" />
            <path d="M385 240 v-26 a15 15 0 0 1 30 0 v26Z" />
          </g>
          <path d="M0 330 C 200 306 420 326 800 304 V360 H0Z" fill="#cfae74" />
          <g fill="none" stroke="#c8903f" strokeWidth="2" strokeLinecap="round" opacity="0.9">
            <path d="M130 90 q10 -10 20 0 q10 -10 20 0" />
            <path d="M660 70 q8 -8 16 0 q8 -8 16 0" />
            <path d="M600 120 q7 -7 14 0 q7 -7 14 0" />
          </g>
        </>
      )}
    </svg>
  );
}
