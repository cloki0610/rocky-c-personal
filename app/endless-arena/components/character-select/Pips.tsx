import type { PipsProps } from "../../interfaces/EndlessArenaTypes";

const Pips = ({ value, color }: PipsProps) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
            <span
                key={i}
                className="h-2 w-4 sm:w-5 rounded-sm"
                style={{ background: i <= value ? color : "rgba(148,163,184,.22)" }}
            />
        ))}
    </div>
);

export default Pips;
