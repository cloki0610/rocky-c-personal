interface BoardButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const BoardButton = ({ onClick, children }: BoardButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-black hover:opacity-80 text-white rounded-md transition-opacity"
    >
      {children}
    </button>
  );
};

export default BoardButton;
