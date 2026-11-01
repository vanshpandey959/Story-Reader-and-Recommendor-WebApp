import { useEffect, useRef } from "react";

/* Decorative book "spines" in the side margins. They drift opposite to the page:
   scroll down and the books slide down; scroll up and they slide up.
   Only shown where the margin is wide enough, so it never touches the content. */

// same pastel palette + black outline as the BOOKS word in HeroBanner
const COLORS = ["#d9d0c3", "#ff8ccf", "#b7c9dc", "#f9c79b"]; // tan, pink, blue, orange
const INK = "#111111";
const GAP = 26; // space between pairs

// each entry is a pair of books standing side by side: [[height, colour], [height, colour]]
const LEFT = [
  [[96, 0], [76, 1]], [[84, 2], [104, 3]], [[110, 1], [82, 0]], [[78, 3], [98, 2]], [[102, 0], [86, 2]],
  [[90, 1], [112, 3]], [[80, 2], [100, 0]], [[106, 3], [84, 1]],
];
const RIGHT = [
  [[82, 2], [104, 1]], [[108, 3], [80, 0]], [[88, 1], [100, 2]], [[100, 0], [78, 3]], [[84, 3], [110, 1]],
  [[104, 2], [86, 0]], [[78, 1], [98, 3]], [[112, 0], [90, 2]],
];

const loopHeight = (list) => list.reduce((sum, pair) => sum + Math.max(...pair.map(([h]) => h)) + GAP, 0);

function Pair({ pair }) {
  return (
    <div className="flex shrink-0 items-end gap-1" style={{ marginBottom: GAP }}>
      {pair.map(([h, c], i) => (
        <div
          key={i}
          style={{
            height: h,
            width: 15,
            background: COLORS[c],
            border: `3px solid ${INK}`,
            borderRadius: 4,
          }}
        />
      ))}
    </div>
  );
}

function Column({ list, speed, side, trackRef }) {
  const items = [...list, ...list]; // twice, so the wrap-around is invisible
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed bottom-0 top-16 z-0 hidden w-10 overflow-hidden min-[1360px]:block`}
      style={{
        // centred inside the margin, so the books sit away from the screen edge
        [side]: "calc((100vw - 80rem) / 4 - 1.25rem)",
        maskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div ref={trackRef} data-speed={speed} data-loop={loopHeight(list)} className="flex flex-col items-center will-change-transform">
        {items.map((pair, i) => (
          <Pair key={i} pair={pair} />
        ))}
      </div>
    </div>
  );
}

export default function BookSpines() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracks = [leftRef.current, rightRef.current].filter(Boolean);
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      tracks.forEach((el, i) => {
        const loop = Number(el.dataset.loop);
        const speed = Number(el.dataset.speed);
        const start = i === 0 ? 0 : loop / 2; // right column starts at a different point
        const offset = (((y * speed + start) % loop) + loop) % loop;
        el.style.transform = `translate3d(0, ${offset - loop}px, 0)`; // +scroll => moves down
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <Column list={LEFT} speed={0.35} side="left" trackRef={leftRef} />
      <Column list={RIGHT} speed={0.5} side="right" trackRef={rightRef} />
    </>
  );
}