export default function SSControls() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-slate-400">
      <span>
        <span className="text-slate-200">↑ / W</span> top stone
      </span>
      <span>
        <span className="text-slate-200">↓ / S</span> bottom stone
      </span>
      <span>or tap a stone to jump</span>
    </div>
  );
}
