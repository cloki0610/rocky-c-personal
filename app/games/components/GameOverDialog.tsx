import type { GameOverDialogProps } from "../interfaces/GamesTypes";

const BUTTON =
  "w-full active:scale-95 transition px-6 py-3 rounded-lg font-bold tracking-wide";

/* end-of-run card over the board with a result, a best/record line, and actions */
export default function GameOverDialog({
  title,
  titleClassName = "text-red-500",
  message,
  detail,
  highlight,
  primaryAction,
  secondaryAction,
  className = "",
}: GameOverDialogProps) {
  return (
    <div
      className={`absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 ${className}`}
    >
      <div className="bg-slate-900 ring-1 ring-slate-700 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full shadow-2xl">
        <h2
          className={`text-3xl sm:text-4xl font-black mb-1 ${titleClassName}`}
        >
          {title}
        </h2>
        <p className="text-slate-400 mb-1 text-sm">{message}</p>
        {detail && (
          <p className="text-slate-300 font-mono text-xs mb-1">{detail}</p>
        )}
        <p className="text-amber-400 font-mono text-xs mb-6">{highlight}</p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={primaryAction.onClick}
            className={`${BUTTON} ${primaryAction.className ?? "bg-emerald-600 hover:bg-emerald-500"}`}
          >
            {primaryAction.label}
          </button>
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className={`${BUTTON} ${secondaryAction.className ?? "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
