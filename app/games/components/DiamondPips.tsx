import type { DiamondPipsProps } from "../interfaces/GamesTypes";

/* a row of rotated squares for small counts such as health or rounds won */
export default function DiamondPips({
  total,
  filled,
  label,
  pipClassName,
  filledClassName,
  emptyClassName,
  role,
  className = "",
}: DiamondPipsProps) {
  return (
    <span role={role} aria-label={label} className={`flex gap-1 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={`rotate-45 ${pipClassName} ${
            i < filled ? filledClassName : emptyClassName
          }`}
        />
      ))}
    </span>
  );
}
