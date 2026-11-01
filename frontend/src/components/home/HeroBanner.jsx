import useNow from "../../hooks/useNow";

const INK = "#111111";
const SECOND = "#ff4fa8";
const SPINE = { tan: "#d9d0c3", pink: "#ff8ccf", blue: "#b7c9dc", orange: "#f9c79b" };

const outline = { fill: "none", stroke: INK, strokeWidth: 5, strokeLinejoin: "round" };
const spine = { stroke: INK, strokeWidth: 5, rx: 6 };

// glyph widths in em. textLength pins every letter to this width, so the layout
// stays put whether the web font or the fallback font is showing.
const WIDTH = { B: 0.68, O: 0.78, K: 0.72, S: 0.56, T: 0.62, I: 0.36, M: 0.92, E: 0.62, R: 0.68, A: 0.72, D: 0.74 };

/** Live analog clock drawn in a 100x100 box (hour, minute and ticking second hand) */
function ClockFace() {
  const now = useNow(1000);
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourDeg = h * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;

  return (
    <>
      <circle cx="50" cy="50" r="46" fill="#fff" stroke={INK} strokeWidth="4.2" />

      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="50"
          y1={i % 3 === 0 ? 10 : 12}
          x2="50"
          y2={i % 3 === 0 ? 20 : 16}
          stroke={INK}
          strokeWidth={i % 3 === 0 ? 3 : 2}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}

      <line x1="50" y1="50" x2="50" y2="29" stroke={INK} strokeWidth="5" strokeLinecap="round" transform={`rotate(${hourDeg} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="17" stroke={INK} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${minuteDeg} 50 50)`} />
      <line x1="50" y1="60" x2="50" y2="13" stroke={SECOND} strokeWidth="2" strokeLinecap="round" transform={`rotate(${secondDeg} 50 50)`} />
      <circle cx="50" cy="50" r="3.5" fill={SECOND} stroke={INK} strokeWidth="1.5" />
    </>
  );
}

/** "TIME TO READ" - same outlined serif as BOOKS, the O of "TO" is the clock */
function TimeToRead() {
  const SIZE = 160;
  const BASE = 140;
  const GAP = 8;
  const SPACE = 50;
  const CLOCK = 120;
  const TOKENS = ["T", "I", "M", "E", " ", "T", "clock", " ", "R", "E", "A", "D"];

  let x = 0;
  const nodes = TOKENS.map((token, i) => {
    if (token === " ") {
      x += SPACE;
      return null;
    }
    if (token === "clock") {
      const clock = (
        <svg key={i} x={x} y={BASE - CLOCK + 4} width={CLOCK} height={CLOCK} viewBox="0 0 100 100">
          <ClockFace />
        </svg>
      );
      x += CLOCK + GAP;
      return clock;
    }
    const width = WIDTH[token] * SIZE;
    const letter = (
      <text key={i} x={x} y={BASE} fontSize={SIZE} fontWeight="500" textLength={width} lengthAdjust="spacingAndGlyphs" {...outline}>
        {token}
      </text>
    );
    x += width + GAP;
    return letter;
  });

  return (
    <svg viewBox={`0 0 ${x - GAP} 160`} role="img" aria-label="Time to read" className="font-outline w-[85%] sm:w-[62%]">
      {nodes}
    </svg>
  );
}

/** Outlined serif BOOKS with coloured book spines standing between the letters.
 *  Everything sits on one baseline (y = 330). */
function BooksWord() {
  const letter = (char, x, width) => (
    <text x={x} y="330" fontSize="400" fontWeight="500" textLength={width} lengthAdjust="spacingAndGlyphs" {...outline}>
      {char}
    </text>
  );

  return (
    <svg viewBox="0 0 1840 350" role="img" aria-label="Books" className="font-outline w-full">
      {letter("B", 0, WIDTH.B * 400)}

      <rect x="286" y="0" width="70" height="330" fill={SPINE.tan} {...spine} />
      <rect x="362" y="60" width="82" height="270" fill={SPINE.pink} {...spine} />

      {letter("O", 462, WIDTH.O * 400)}
      {letter("O", 776, WIDTH.O * 400)}

      <rect x="1102" y="10" width="80" height="320" fill={SPINE.blue} {...spine} />
      <rect x="1194" y="130" width="84" height="200" fill={SPINE.orange} {...spine} transform="rotate(-7 1194 330)" />

      {letter("K", 1300, WIDTH.K * 400)}
      {letter("S", 1600, WIDTH.S * 400)}
    </svg>
  );
}

export default function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-2xl bg-white px-5 pb-6 pt-4 shadow-lg shadow-black/5 sm:px-10">
      <div className="h-px w-full bg-zinc-900" />

      <div className="mt-5">
        <h2 className="text-4xl font-medium uppercase leading-[0.9] tracking-tighter text-zinc-950 sm:text-6xl lg:text-7xl">
          Books &amp;
          <br />
          Smarter Reads
        </h2>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6 sm:mt-14 sm:gap-8">
        <TimeToRead />
        <BooksWord />
      </div>

      <div className="mt-2 h-px w-full bg-zinc-900" />
    </section>
  );
}
