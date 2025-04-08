import OfficeArenaGame from "./components/OfficeArenaGame";

const OfficeChessPage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Office Arena</h1>
      <OfficeArenaGame />
    </div>
  );
};

export default OfficeChessPage;
