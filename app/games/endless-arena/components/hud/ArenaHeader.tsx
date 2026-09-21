import type { ArenaHeaderProps } from "../../interfaces/EndlessArenaTypes";
import { isBossStage } from "../../utils/game";

export default function ArenaHeader({
  player: p,
  stage,
  best,
}: ArenaHeaderProps) {
  const cls = p.cls;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h1 className="text-xl sm:text-3xl font-black tracking-tight">
        ENDLESS<span className="text-orange-500"> ARENA</span>
      </h1>
      <div className="flex items-baseline gap-3 text-xs sm:text-sm font-mono">
        <span className={cls.text}>{cls.name.toUpperCase()}</span>
        <span
          className={isBossStage(stage) ? "text-orange-400" : "text-slate-400"}
        >
          STAGE {stage}
        </span>
        {best > 0 && (
          <span className="text-slate-600 hidden sm:inline">BEST {best}</span>
        )}
      </div>
    </div>
  );
}
