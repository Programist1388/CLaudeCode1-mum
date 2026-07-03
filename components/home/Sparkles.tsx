const SPARKLE_COUNT = 46;

/** Deterministic pseudo-random in [0, 1), seeded by index — identical on server and client render, so no useEffect/hydration dance is needed for this purely decorative field. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function Sparkles() {
  const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    left: `${pseudoRandom(i * 12.9898) * 100}%`,
    top: `${pseudoRandom(i * 78.233) * 100}%`,
    delay: `${pseudoRandom(i * 37.719) * 3.4}s`,
    duration: `${2.6 + pseudoRandom(i * 94.673) * 2.4}s`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-dot"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
