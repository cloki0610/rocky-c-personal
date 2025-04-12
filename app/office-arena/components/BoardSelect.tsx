interface BoardSelectBoxProps {
  title: string;
  initSize: number;
  options: number[];
  handleChange: (newSize: number) => void;
  boxType: "board" | "square" | "staffCount";
}

const BoardSelectBox = ({
  title,
  initSize,
  options,
  handleChange,
  boxType,
}: BoardSelectBoxProps) => {
  return (
    <>
      <label className="mr-1">{title}</label>
      <select
        value={initSize}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="border p-1 lg:p-0 w-full lg:w-22 rounded-md"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {boxType === "board"
              ? `${size} x ${size}`
              : boxType === "square"
              ? `${size}px`
              : `${size}`}
          </option>
        ))}
      </select>
    </>
  );
};

export default BoardSelectBox;
