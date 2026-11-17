import ControlHints from "@/app/games/components/ControlHints";

export default function SSControls() {
  return (
    <ControlHints
      hints={[
        { keys: "↑ / W", label: "top stone" },
        { keys: "↓ / S", label: "bottom stone" },
      ]}
    >
      <span>or tap a stone to jump</span>
    </ControlHints>
  );
}
