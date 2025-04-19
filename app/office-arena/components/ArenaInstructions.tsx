const ArenaInstructions = () => {
  return (
    <>
      <ul className="list-disc pl-5 text-sm lg:text-md">
        <li>
          Boss (Player A): Moves one square orthogonally (no diagonals). Can
          capture Junior Staff. Can capture Senior Staff if less than 3 Senior
          on board. Can capture the Manager to win.
        </li>
        <li>
          Manager (Player B): Moves one square orthogonally (no diagonals). Can
          capture Junior Staff. Can capture the boss to win if more than 3
          Senior on board.
        </li>
        <li>
          Staff (Player C): Placed on the board each round. Promoted to Senior
          Staff after surviving two rounds.
        </li>
        <li>Turn Order: Boss &gt; Manager &gt; Staff Placement</li>
        <li>
          Win conditions:
          <ul className="list-disc pl-5">
            <li>Boss wins by capturing the Manager.</li>
            <li>
              Manager wins by capturing the Boss when there are 3+ Senior Staff
              on the board.
            </li>
            <li>
              Staff wins if there&apos;s a tie (Boss and Manager can&apos;t
              capture each other) or more than selected senior on board.
            </li>
          </ul>
        </li>
      </ul>
    </>
  );
};

export default ArenaInstructions;
