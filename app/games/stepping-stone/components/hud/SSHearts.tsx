import DiamondPips from "@/app/games/components/DiamondPips";
import type { SSHeartsProps } from "../../interfaces/SteppingStoneTypes";
import { MAX_HEALTH } from "../../utils/game";

export default function SSHearts({ health }: SSHeartsProps) {
  return (
    <DiamondPips
      role="status"
      label={`${health} of ${MAX_HEALTH} health remaining`}
      total={MAX_HEALTH}
      filled={health}
      pipClassName="h-3.5 w-3.5 rounded-sm"
      filledClassName="bg-rose-500"
      emptyClassName="bg-slate-700"
    />
  );
}
