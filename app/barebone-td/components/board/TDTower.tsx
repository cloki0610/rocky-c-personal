import type { TDTowerProps } from "../../interfaces/BareboneTDTypes";
import { TOWER_DEFS } from "../../utils/constants";

const SIZE = 40;

export default function TDTower({ tower, selected }: TDTowerProps) {
  const def = TOWER_DEFS[tower.type];
  return (
    <>
      <div
        className="absolute rounded-full border border-dashed opacity-20 pointer-events-none"
        style={{
          left: tower.x - def.range,
          top: tower.y - def.range,
          width: def.range * 2,
          height: def.range * 2,
          borderColor: def.color,
        }}
      />
      <div
        className={`absolute flex items-center justify-center rounded-full font-black text-slate-950 shadow-lg pointer-events-none transition ${
          selected ? "ring-4 ring-white ring-offset-2 ring-offset-slate-900" : ""
        }`}
        style={{
          left: tower.x - SIZE / 2,
          top: tower.y - SIZE / 2,
          width: SIZE,
          height: SIZE,
          backgroundColor: def.color,
        }}
      >
        {def.label}
        {tower.level > 1 && (
          <span className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-slate-950 text-white text-[9px] font-black ring-1 ring-slate-700">
            {tower.level}
          </span>
        )}
      </div>
    </>
  );
}
