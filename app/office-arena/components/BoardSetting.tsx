import { useArena } from "../context/ArenaContext";
import BoardSelectBox from "./BoardSelect";

const BOARD_OPTIONS = [5, 6, 7, 8, 9, 10];
const SQUARE_OPTIONS = [40, 50, 60, 70, 80];
const STAFF_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10];

const BoardSetting = () => {
  const {
    boardSize,
    staffCountTarget,
    squareSize,
    initializeBoard,
    setBoardSize,
    setStaffCountTarget,
    setSquareSize,
  } = useArena();

  const resizeBoard = (newSize: number) => {
    setBoardSize(newSize);
    initializeBoard();
  };

  const adjustSquareSize = (newSize: number) => {
    setSquareSize(newSize);
    initializeBoard();
  };

  const adjustStaffCountTarget = (newCount: number) => {
    setStaffCountTarget(newCount);
    initializeBoard();
  };
  return (
    <div className="mt-4 flex flex-col w-full gap-2">
      <BoardSelectBox
        title="Board Size: "
        initSize={boardSize}
        options={BOARD_OPTIONS}
        handleChange={resizeBoard}
        boxType="board"
      />
      <BoardSelectBox
        title="Square Size: "
        initSize={squareSize}
        options={SQUARE_OPTIONS}
        handleChange={adjustSquareSize}
        boxType="square"
      />
      <BoardSelectBox
        title="Staff Count to Win: "
        initSize={staffCountTarget}
        options={STAFF_COUNT_OPTIONS}
        handleChange={adjustStaffCountTarget}
        boxType="staffCount"
      />
    </div>
  );
};

export default BoardSetting;
