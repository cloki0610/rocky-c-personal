"use client";

import SSCrossing from "./components/board/SSCrossing";
import SSControls from "./components/hud/SSControls";
import SSHeader from "./components/hud/SSHeader";
import SSOverlays from "./components/hud/SSOverlays";
import useSteppingStone from "./hooks/useSteppingStone";

export default function SteppingStone() {
  const { world, best, choose, land, acknowledgeFall, restart } =
    useSteppingStone();

  return (
    <div className="flex w-full max-w-md lg:max-w-5xl flex-col items-center">
      <SSHeader world={world} best={best} />
      <div className="relative w-full">
        <SSCrossing
          world={world}
          choose={choose}
          land={land}
          acknowledgeFall={acknowledgeFall}
        />
        <SSOverlays world={world} best={best} restart={restart} />
      </div>
      <SSControls />
    </div>
  );
}
