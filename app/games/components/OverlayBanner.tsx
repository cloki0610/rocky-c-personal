import type { OverlayBannerProps } from "../interfaces/GamesTypes";

/* non-interactive centred message over the board, e.g. countdowns */
export default function OverlayBanner({
  className = "",
  children,
}: OverlayBannerProps) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none ${className}`}
    >
      {children}
    </div>
  );
}
