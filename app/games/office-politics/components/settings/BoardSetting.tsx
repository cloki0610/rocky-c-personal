"use client";
import { usePolitics } from "../../context/PoliticsContext";
import BoardSelectBox from "./BoardSelect";
import BoardButton from "./BoardButton";

export default function BoardSetting() {
  const {
    boardSize,
    staffCountTarget,
    bossRoundTarget,
    setBossRoundTarget,
    performanceTarget,
    setPerformanceTarget,
    squareSize,
    setBoardSize,
    setStaffCountTarget,
    setSquareSize,
    initializeBoard,
  } = usePolitics();
  return (
    <div className="mt-4 flex w-full flex-col gap-2">
      <BoardSelectBox
        title="Board size"
        initSize={boardSize}
        options={[7, 8, 9, 10]}
        handleChange={setBoardSize}
        boxType="board"
      />
      <BoardSelectBox
        title="Square size"
        initSize={squareSize}
        options={[40, 50, 60, 70, 80]}
        handleChange={setSquareSize}
        boxType="square"
      />
      <BoardSelectBox
        title="Senior Staff to win"
        initSize={staffCountTarget}
        options={[5, 6, 7, 8, 9, 10]}
        handleChange={setStaffCountTarget}
        boxType="staffCount"
      />
      <BoardSelectBox
        title="Rounds for Boss to survive"
        initSize={bossRoundTarget}
        options={[10, 12, 15, 18, 21, 24, 27, 30]}
        handleChange={setBossRoundTarget}
        boxType="bossRounds"
      />
      <BoardSelectBox
        title="Performance for Manager to win"
        initSize={performanceTarget}
        options={[8, 9, 10, 11, 12, 13, 14, 15]}
        handleChange={setPerformanceTarget}
        boxType="performance"
      />
      <BoardButton onClick={initializeBoard}>New game</BoardButton>
    </div>
  );
}
