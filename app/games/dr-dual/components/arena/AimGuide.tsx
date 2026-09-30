import type { AimGuideProps } from "../../interfaces/DrDualTypes";
import { ARENA_H, ARENA_W, CLEAVER, MARKER_LIFE } from "../../utils/constants";
import { abilityReady, normalize } from "../../utils/helpers";

/* cleaver throw preview toward the cursor, plus the last click marker */
export default function AimGuide({
  fighter: f,
  aim,
  marker,
  time,
}: AimGuideProps) {
  const dir = normalize({ x: aim.x - f.pos.x, y: aim.y - f.pos.y });
  const ready = abilityReady(f, "q");
  const markerAge = marker ? time - marker.at : MARKER_LIFE;
  const markerLeft = Math.max(0, 1 - markerAge / MARKER_LIFE);

  return (
    <svg
      width={ARENA_W}
      height={ARENA_H}
      aria-hidden
      className="absolute inset-0 pointer-events-none"
    >
      {(dir.x !== 0 || dir.y !== 0) && (
        <line
          x1={f.pos.x}
          y1={f.pos.y}
          x2={f.pos.x + dir.x * CLEAVER.range}
          y2={f.pos.y + dir.y * CLEAVER.range}
          stroke="#a3e635"
          strokeWidth={ready ? 2 : 1}
          strokeDasharray="6 8"
          opacity={ready ? 0.45 : 0.12}
        />
      )}
      {marker && markerLeft > 0 && (
        <circle
          cx={marker.pos.x}
          cy={marker.pos.y}
          r={8 + (1 - markerLeft) * 14}
          fill="none"
          stroke={marker.kind === "attack" ? "#f87171" : "#4ade80"}
          strokeWidth="2.5"
          opacity={markerLeft}
        />
      )}
    </svg>
  );
}
