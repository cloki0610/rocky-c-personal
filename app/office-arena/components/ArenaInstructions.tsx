export default function ArenaInstructions() {
  return (
    <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
      <li>Play on the same device. Turns run Boss (A), Manager (B), then Staff (C).</li>
      <li>Boss and Manager move one square horizontally or vertically. Both can capture Junior Staff.</li>
      <li>The Boss wins by capturing the Manager and can capture Senior Staff only while fewer than three Seniors remain on the board.</li>
      <li>The Manager cannot capture Senior Staff. With at least three Seniors on the board, the Manager can capture the Boss to win.</li>
      <li>Staff places one Junior on an empty square each round. Existing Staff age after each placement and become Seniors after surviving two rounds. The newly placed Junior starts at age zero.</li>
      <li>Staff wins when the number of Seniors reaches the selected target, or when neither leader has a legal move. A leader with no legal move skips their turn.</li>
      <li>The default target is three. Choose a higher target to let the Manager use the three-Senior capture rule before Staff wins.</li>
    </ul>
  );
}
