import type { ArenaParticlesProps } from "../../interfaces/EndlessArenaTypes";

export default function ArenaParticles({ particles }: ArenaParticlesProps) {
  return (
    <>
      {/* death + impact animations */}
      {particles.map((c) => {
        const t = Math.min(1, c.t / 0.7);
        return (
          <div
            key={c.key}
            className="absolute pointer-events-none"
            style={{ left: c.x, top: c.y }}
          >
            <div
              className="absolute rounded-md"
              style={{
                width: c.size,
                height: c.size,
                background: c.color,
                opacity: 1 - t,
                transform: `translateY(${-30 * t}px) scale(${1 + t * 0.6}) rotate(${c.spin * t * 300}deg)`,
              }}
            />
            <div
              className="absolute rounded-full border-2"
              style={{
                borderColor: c.color,
                left: c.size / 2 - c.size * 1.6,
                top: c.size / 2 - c.size * 1.6,
                width: c.size * 3.2,
                height: c.size * 3.2,
                opacity: (1 - t) * 0.7,
                transform: `scale(${0.2 + t})`,
              }}
            />
          </div>
        );
      })}
    </>
  );
}
