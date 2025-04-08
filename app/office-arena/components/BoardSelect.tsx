interface BoardSelectBoxProps {
  initSize: number;
  options: number[];
  handleChange: (newSize: number) => void;
  boxType: "board" | "square"
}

const BoardSelectBox = ({
  initSize,
  options,
  handleChange,
  boxType
}: BoardSelectBoxProps) => {
  return (
    <div>
      <label className="mr-2">Board Size:</label>
      <select
        value={initSize}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="border p-1"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {boxType === "board" ? `${size} x ${size}` : `${size}px`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BoardSelectBox;
