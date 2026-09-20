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
        options={[5, 6, 7, 8, 9, 10]}
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
        options={[10, 15, 20, 30, 50, 100]}
        handleChange={setBossRoundTarget}
        boxType="bossRounds"
      />
      <BoardButton onClick={initializeBoard}>New game</BoardButton>
    </div>
  );
}
