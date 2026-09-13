import { usePolitics } from "../context/PoliticsContext";
import BoardSelectBox from "./BoardSelect";

export default function BoardSetting() {
  const { boardSize, staffCountTarget, squareSize, setBoardSize, setStaffCountTarget, setSquareSize } = usePolitics();
  return (
    <div className="mt-4 flex w-full flex-col gap-2">
      <BoardSelectBox title="Board size" initSize={boardSize} options={[5, 6, 7, 8, 9, 10]} handleChange={setBoardSize} boxType="board" />
      <BoardSelectBox title="Square size" initSize={squareSize} options={[40, 50, 60, 70, 80]} handleChange={setSquareSize} boxType="square" />
      <BoardSelectBox title="Senior Staff to win" initSize={staffCountTarget} options={[3, 4, 5, 6, 7, 8, 9, 10]} handleChange={setStaffCountTarget} boxType="staffCount" />
    </div>
  );
}
