"use client";

import { useReducedMotion } from "framer-motion";
import type { DoctorFighterProps } from "../../interfaces/DrDualTypes";
import {
  BURN,
  FIGHTER_NAMES,
  HIT_FLASH_TIME,
  MAX_HP,
  MELEE_HIT_TIME,
  SWING_TIME,
} from "../../utils/constants";

const BOX = 80; // sprite box in world px, centred on the fighter

/* share of the swing spent striking; the rest is follow-through and recovery */
const STRIKE = 0.35;
const WIND_UP_DEG = -80;
const FOLLOW_DEG = 55;
const LUNGE = 7; // px toward the facing direction at the end of the strike
/* slash trail from the wind-up side, across the front, to the follow-through side */
const SLASH_PATH = "M9.8 -36.7 A38 38 0 0 1 19 32.9";
const INNER_SLASH_PATH = "M7.8 -29 A30 30 0 0 1 15 26";
const SPARKS = [0, 60, 120, 180, 240, 300];

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

/* arm angle, forward lunge, trail reveal and trail opacity for a swing */
const swingPose = (swing: number, reduceMotion: boolean) => {
  if (swing <= 0) return { armDeg: 0, lunge: 0, reveal: 1, trail: 0 };
  const p = 1 - swing / SWING_TIME;
  if (reduceMotion)
    return { armDeg: 0, lunge: 0, reveal: 1, trail: 0.8 * (1 - p) };
  if (p < STRIKE) {
    const s = easeOut(p / STRIKE);
    return {
      armDeg: WIND_UP_DEG + (FOLLOW_DEG - WIND_UP_DEG) * s,
      lunge: LUNGE * s,
      reveal: s,
      trail: 0.95,
    };
  }
  const r = easeInOut((p - STRIKE) / (1 - STRIKE));
  return {
    armDeg: FOLLOW_DEG * (1 - r),
    lunge: LUNGE * (1 - r),
    reveal: 1,
    trail: 0.95 * (1 - r),
  };
};

const TEAM = {
  player: { ring: "#38bdf8", tag: "bg-sky-500", bar: "bg-sky-400" },
  cpu: { ring: "#fb7185", tag: "bg-rose-500", bar: "bg-rose-400" },
} as const;

export default function DoctorFighter({ fighter: f }: DoctorFighterProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const team = TEAM[f.id];
  const facingDeg = (f.facing * 180) / Math.PI;
  const { armDeg, lunge, reveal, trail } = swingPose(f.swing, reduceMotion);
  const empowered = f.empowered > 0;
  const slashColor = f.swingEmpowered ? "#f87171" : "#f8fafc";
  const impact = f.meleeHit > 0 ? 1 - f.meleeHit / MELEE_HIT_TIME : null;

  return (
    <>
      {f.burning && (
        <div
          className="absolute rounded-full pointer-events-none animate-pulse motion-reduce:animate-none"
          style={{
            left: f.pos.x - BURN.radius,
            top: f.pos.y - BURN.radius,
            width: BURN.radius * 2,
            height: BURN.radius * 2,
            background:
              "radial-gradient(circle, rgba(251,146,60,.05) 30%, rgba(249,115,22,.28) 70%, rgba(239,68,68,.45) 100%)",
            boxShadow: "0 0 24px rgba(249,115,22,.5)",
          }}
        />
      )}

      <div
        className="absolute pointer-events-none"
        style={{
          left: f.pos.x - BOX / 2,
          top: f.pos.y - BOX / 2,
          width: BOX,
          height: BOX,
        }}
      >
        {/* name tag + health, never rotated */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-16 flex flex-col items-center gap-0.5">
          <span
            className={`${team.tag} px-1.5 rounded text-[10px] font-black leading-4 text-slate-950`}
          >
            {FIGHTER_NAMES[f.id].toUpperCase()}
          </span>
          <div className="w-full h-1.5 rounded-full bg-black/70 overflow-hidden">
            <div
              className={`h-full ${team.bar}`}
              style={{ width: `${(f.hp / MAX_HP) * 100}%` }}
            />
          </div>
        </div>

        <svg
          viewBox="-40 -40 80 80"
          width={BOX}
          height={BOX}
          overflow="visible"
          aria-hidden
        >
          <ellipse cx="0" cy="6" rx="26" ry="22" fill="rgba(0,0,0,.35)" />
          {f.healTime > 0 && (
            <circle
              r="31"
              fill="none"
              stroke="#4ade80"
              strokeWidth="3"
              opacity=".7"
            />
          )}
          {f.slow > 0 && <circle r="27" fill="rgba(125,211,252,.25)" />}
          <circle r="27" fill="none" stroke={team.ring} strokeWidth="3" />

          <g transform={`rotate(${facingDeg}) translate(${lunge} 0)`}>
            {/* off hand */}
            <circle cx="8" cy="-19" r="5" fill="#7c3aed" />
            {/* shoulders */}
            <ellipse cx="-3" cy="0" rx="15" ry="22" fill="#8b5cf6" />
            <ellipse
              cx="-6"
              cy="0"
              rx="7"
              ry="14"
              fill="#6d28d9"
              opacity=".6"
            />
            {/* cleaver arm, pivoting at the shoulder */}
            <g transform={`rotate(${armDeg} 0 17)`}>
              <line
                x1="0"
                y1="17"
                x2="13"
                y2="21"
                stroke="#7c3aed"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="13"
                y1="21"
                x2="21"
                y2="21"
                stroke="#78350f"
                strokeWidth="3"
              />
              <path
                d="M19 13 h15 a2 2 0 0 1 2 2 v10 a2 2 0 0 1 -2 2 h-13 z"
                fill={empowered ? "#f87171" : "#cbd5e1"}
                stroke={empowered ? "#fecaca" : "#64748b"}
                strokeWidth="1.5"
                style={
                  empowered
                    ? { filter: "drop-shadow(0 0 4px #ef4444)" }
                    : undefined
                }
              />
            </g>
            {/* slash trail drawn along the cleaver's arc */}
            {trail > 0 && (
              <g
                fill="none"
                strokeLinecap="round"
                opacity={trail}
                style={{ filter: `drop-shadow(0 0 4px ${slashColor})` }}
              >
                <path
                  d={SLASH_PATH}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - reveal}
                  stroke={slashColor}
                  strokeWidth="4"
                />
                <path
                  d={INNER_SLASH_PATH}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - reveal}
                  stroke={slashColor}
                  strokeWidth="2"
                  opacity=".5"
                />
              </g>
            )}
            {/* head with the doctor's exposed brain and yellow eyes */}
            <circle cx="6" cy="0" r="10" fill="#a78bfa" />
            <circle cx="2" cy="-3" r="4.5" fill="#f9a8d4" opacity=".85" />
            <circle cx="13" cy="-3.5" r="1.6" fill="#facc15" />
            <circle cx="13" cy="3.5" r="1.6" fill="#facc15" />
          </g>

          {/* impact burst when struck by a melee hit */}
          {impact !== null && (
            <g
              fill="none"
              stroke="#fde68a"
              strokeLinecap="round"
              opacity={1 - impact}
            >
              <circle
                r={reduceMotion ? 30 : 22 + 14 * easeOut(impact)}
                strokeWidth="3"
              />
              {!reduceMotion &&
                SPARKS.map((deg) => {
                  const a = (deg * Math.PI) / 180;
                  const inner = 26 + 10 * easeOut(impact);
                  const outer = inner + 7;
                  return (
                    <line
                      key={deg}
                      x1={Math.cos(a) * inner}
                      y1={Math.sin(a) * inner}
                      x2={Math.cos(a) * outer}
                      y2={Math.sin(a) * outer}
                      strokeWidth="2.5"
                    />
                  );
                })}
            </g>
          )}

          {f.hitFlash > 0 && (
            <circle
              r="24"
              fill="#fff"
              opacity={(f.hitFlash / HIT_FLASH_TIME) * 0.6}
            />
          )}
        </svg>
      </div>
    </>
  );
}
