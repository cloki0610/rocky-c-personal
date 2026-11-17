import type { ControlHintsProps } from "../interfaces/GamesTypes";

/* the key-binding legend shown under a board */
export default function ControlHints({ hints, children }: ControlHintsProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-slate-400">
      {hints.map(({ keys, label, keyClassName = "text-slate-200" }) => (
        <span key={keys}>
          <span className={keyClassName}>{keys}</span> {label}
        </span>
      ))}
      {children}
    </div>
  );
}
