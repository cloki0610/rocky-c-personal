import type { TimedWorldProps } from "../../interfaces/EndlessArenaTypes";

export default function ArenaCombat({ world: w, now }: TimedWorldProps) {
  const p = w.player;
  const cls = p.cls;
  const meleeOn = p.meleeUntil > now;
  const rangedOn = p.rangedUntil > now;
  const rangedMode = p.ranged.mode;
  const waveT =
    rangedMode !== "projectile" && rangedOn
      ? 1 - (p.rangedUntil - now) / p.ranged.show
      : 0;
  return (
    <>
      {/* shockwave ring (non-projectile ranged) */}
      {rangedMode !== "projectile" && rangedOn && (
        <div
          className="absolute rounded-full border-2 pointer-events-none"
          style={{
            left: p.x + p.size / 2 - p.ranged.range,
            top: p.y + p.size / 2 - p.ranged.range,
            width: p.ranged.range * 2,
            height: p.ranged.range * 2,
            borderColor: rangedMode === "stun" ? "#fbbf24" : "#67e8f9",
            opacity: 0.6 * (1 - waveT),
            transform: `scale(${0.25 + waveT * 0.75})`,
            background:
              rangedMode === "stun"
                ? "radial-gradient(circle, rgba(251,191,36,.16) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(34,211,238,.14) 0%, transparent 70%)",
          }}
        />
      )}

      {/* melee arc */}
      {meleeOn && (
        <div
          className="absolute rounded-full border-2 border-amber-300 pointer-events-none"
          style={{
            left: p.x + p.size / 2 - p.melee.range,
            top: p.y + p.size / 2 - p.melee.range,
            width: p.melee.range * 2,
            height: p.melee.range * 2,
            background:
              "radial-gradient(circle, rgba(252,211,77,.22) 0%, transparent 70%)",
          }}
        />
      )}

      {/* bullets */}
      {w.bullets.map((b) => (
        <div
          key={b.id}
          className="absolute pointer-events-none"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: `rotate(${b.angle}deg)`,
          }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              right: b.size / 2,
              width: 46,
              height: 3,
              background: `linear-gradient(to left, ${b.color}, transparent)`,
              opacity: 0.8,
            }}
          />
          <div
            className="w-full h-full rounded-full"
            style={{
              background: "#ecfeff",
              boxShadow: `0 0 12px 3px ${b.color}`,
            }}
          />
        </div>
      ))}

      {/* muzzle flash */}
      {rangedMode === "projectile" && rangedOn && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x + p.size / 2 + p.aim.x * (p.size / 2 + 6) - 11,
            top: p.y + p.size / 2 + p.aim.y * (p.size / 2 + 6) - 11,
            width: 22,
            height: 22,
            background: `radial-gradient(circle, #ecfeff 0%, ${cls.color} 45%, transparent 70%)`,
            opacity: (p.rangedUntil - now) / p.ranged.show,
          }}
        />
      )}

      {/* player */}
      {w.phase !== "lost" && (
        <div
          className="absolute rounded-md"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: meleeOn ? "#fbbf24" : cls.color,
            boxShadow:
              p.flash > now ? "0 0 0 3px #f87171" : `0 4px 14px ${cls.glow}`,
            transform: `scale(${meleeOn ? 1.12 : 1})`,
          }}
        >
          <div
            className="absolute w-2.5 h-2.5 bg-white rounded-full"
            style={{
              left: p.size / 2 - 5 + p.aim.x * (p.size * 0.3),
              top: p.size / 2 - 5 + p.aim.y * (p.size * 0.3),
            }}
          />
        </div>
      )}
    </>
  );
}
