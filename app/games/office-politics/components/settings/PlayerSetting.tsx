"use client";
import { usePolitics } from "../../context/PoliticsContext";
import type { Controller, Player } from "../../interfaces/OfficePoliticsTypes";

const seats: [Player, string][] = [
  ["A", "Boss"],
  ["B", "Manager"],
  ["C", "Staff"],
];

export default function PlayerSetting() {
  const { controllers, setController } = usePolitics();
  return (
    <fieldset className="mt-4 flex w-full flex-col gap-2">
      <legend className="sr-only">Who plays each role</legend>
      {seats.map(([player, name]) => (
        <div key={player} className="flex flex-col gap-1">
          <label htmlFor={`controller-${player}`}>
            {player}: {name}
          </label>
          <select
            id={`controller-${player}`}
            value={controllers[player]}
            onChange={(e) =>
              setController(player, e.target.value as Controller)
            }
            className="border p-3 w-full rounded"
          >
            <option value="human">Human</option>
            <option value="computer">Computer</option>
          </select>
        </div>
      ))}
    </fieldset>
  );
}
