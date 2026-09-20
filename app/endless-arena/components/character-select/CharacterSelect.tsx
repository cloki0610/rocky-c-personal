"use client";

import { useEffect, useState } from "react";
import type { CharacterSelectProps } from "../../interfaces/EndlessArenaTypes";
import { CLASS_LIST } from "../../utils/constants";
import { rangedDesc } from "../../utils/game";
import Pips from "./Pips";

export default function CharacterSelect({
  onStart,
  best,
}: CharacterSelectProps) {
  const [idx, setIdx] = useState(0);
  const sel = CLASS_LIST[idx];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setIdx(
          (i) =>
            (e.key === "ArrowLeft" ? i + CLASS_LIST.length - 1 : i + 1) %
            CLASS_LIST.length,
        );
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onStart(CLASS_LIST[idx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, onStart]);

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          ENDLESS<span className="text-orange-500"> ARENA</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 tracking-[0.25em] font-mono">
          CHOOSE YOUR FIGHTER
        </p>
        {best > 0 && (
          <p className="text-amber-400/80 text-xs mt-2 font-mono">
            BEST — STAGE {best}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CLASS_LIST.map((c, i) => {
          const active = i === idx;
          return (
            <button
              key={c.id}
              onClick={() => setIdx(i)}
              onDoubleClick={() => onStart(c.id)}
              className={`text-left rounded-2xl p-5 bg-slate-900/80 ring-2 transition-all duration-200 ${active
                  ? `${c.ring} scale-[1.02]`
                  : "ring-slate-800 opacity-60 hover:opacity-90"
                }`}
              style={
                active
                  ? { boxShadow: `0 12px 40px -12px ${c.glow}` }
                  : undefined
              }
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="rounded-md shrink-0 relative"
                  style={{
                    width: c.size,
                    height: c.size,
                    background: c.color,
                    boxShadow: `0 6px 18px ${c.glow}`,
                  }}
                >
                  <span className="absolute top-1/2 right-1 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <h2 className="text-xl font-black leading-none">
                    {c.name}
                  </h2>
                  <p
                    className={`text-[10px] font-mono tracking-widest mt-1 ${c.text}`}
                  >
                    {c.tag}
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed mb-4 min-h-[4rem]">
                {c.blurb}
              </p>

              <div className="space-y-1.5 mb-4">
                {Object.entries(c.stats).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 w-16">
                      {k.toUpperCase()}
                    </span>
                    <Pips value={v} color={c.color} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                <div>
                  <span className="text-amber-300">A</span> MELEE
                  <div className="text-slate-500">
                    {c.melee.dmg} dmg · {c.melee.range}px
                  </div>
                </div>
                <div>
                  <span className="text-cyan-300">S</span> {c.ranged.label}
                  <div className="text-slate-500">{rangedDesc(c.ranged)}</div>
                  {c.ranged.mode === "stun" && (
                    <div className="text-amber-500/70">
                      all minions in range
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          onClick={() => onStart(sel.id)}
          className={`${sel.btn} active:scale-95 transition px-12 py-3 rounded-lg font-black tracking-[0.2em] text-sm`}
        >
          ENTER ARENA
        </button>
        <p className="text-[10px] text-slate-600 font-mono tracking-wider">
          ← → SELECT · ENTER CONFIRM
        </p>
      </div>
    </div>
  );
}
