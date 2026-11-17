import type { ProgressBarProps } from "../interfaces/GamesTypes";

export default function ProgressBar({
  value,
  max,
  color,
  height = 12,
  label,
  children,
}: ProgressBarProps) {
  const meter = label
    ? {
        role: "meter",
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": max,
        "aria-valuenow": Math.round(value),
      }
    : {};
  return (
    <div
      {...meter}
      className="relative w-full bg-black/60 rounded-full overflow-hidden ring-1 ring-white/20"
      style={{ height }}
    >
      <div
        className={`h-full ${color} rounded-full transition-[width] duration-200 ease-out`}
        style={{ width: `${Math.max(0, (value / max) * 100)}%` }}
      />
      {children != null && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white [text-shadow:0_1px_2px_#000]">
          {children}
        </span>
      )}
    </div>
  );
}
