import type { BarProps } from "../../interfaces/EndlessArenaTypes";

const Bar = ({ hp, maxHp, color, height = 12 }: BarProps) => (
    <div className="w-full bg-black/60 rounded-full overflow-hidden ring-1 ring-white/20" style={{ height }}>
        <div
            className={`h-full ${color} rounded-full transition-[width] duration-200 ease-out`}
            style={{ width: `${Math.max(0, (hp / maxHp) * 100)}%` }}
        />
    </div>
);

export default Bar;
