import type { ScaledStageProps } from "../interfaces/GamesTypes";

/* a fixed-size world drawn at `scale` inside a full-width, rounded board */
export default function ScaledStage({
  boardRef,
  scale,
  width,
  height,
  overlay,
  className = "",
  children,
  ...rest
}: ScaledStageProps) {
  return (
    <div
      {...rest}
      ref={boardRef}
      className={`relative w-full rounded-xl overflow-hidden ring-2 shadow-2xl ${className}`}
      style={{ height: height * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
      {overlay}
    </div>
  );
}
