import type { SSHeartsProps } from "../../interfaces/SteppingStoneTypes";
import { MAX_HEALTH } from "../../utils/game";

export default function SSHearts({ health }: SSHeartsProps) {
  return (
    <div
      className="flex gap-1"
      role="status"
      aria-label={`${health} of ${MAX_HEALTH} health remaining`}
    >
      {Array.from({ length: MAX_HEALTH }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rotate-45 rounded-sm ${
            i < health ? "bg-rose-500" : "bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
}
