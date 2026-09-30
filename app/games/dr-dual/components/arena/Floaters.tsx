import type { FloaterKind, FloatersProps } from "../../interfaces/DrDualTypes";
import { FLOATER_LIFE } from "../../utils/constants";

const STYLE: Record<FloaterKind, string> = {
  damage: "text-slate-100 text-sm",
  empowered: "text-red-400 text-xl",
  heal: "text-green-400 text-lg",
};

const RISE = 36; // px over a floater's lifetime

export default function Floaters({ floaters }: FloatersProps) {
  return (
    <>
      {floaters.map((fl) => {
        const t = fl.age / FLOATER_LIFE;
        return (
          <span
            key={fl.id}
            aria-hidden
            className={`absolute -translate-x-1/2 font-black font-mono pointer-events-none [text-shadow:0_1px_3px_#000] ${STYLE[fl.kind]}`}
            style={{
              left: fl.pos.x,
              top: fl.pos.y - t * RISE,
              opacity: 1 - t * t,
            }}
          >
            {fl.kind === "empowered" ? `${fl.text}!` : fl.text}
          </span>
        );
      })}
    </>
  );
}
