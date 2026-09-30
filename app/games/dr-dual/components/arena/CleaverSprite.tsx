import type { CleaverSpriteProps } from "../../interfaces/DrDualTypes";

const SIZE = 30;
const SPIN_DEG_PER_SEC = 900;

export default function CleaverSprite({
  cleaver: c,
  time,
}: CleaverSpriteProps) {
  return (
    <svg
      viewBox="-15 -15 30 30"
      width={SIZE}
      height={SIZE}
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left: c.pos.x - SIZE / 2,
        top: c.pos.y - SIZE / 2,
        transform: `rotate(${(time * SPIN_DEG_PER_SEC) % 360}deg)`,
        filter: "drop-shadow(0 0 3px rgba(163,230,53,.8))",
      }}
    >
      <line
        x1="-12"
        y1="0"
        x2="-3"
        y2="0"
        stroke="#78350f"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M-4 -7 h13 a2 2 0 0 1 2 2 v9 a2 2 0 0 1 -2 2 h-13 z"
        fill="#cbd5e1"
        stroke="#475569"
      />
      <path
        d="M1 -5 h8"
        stroke="#a3e635"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
