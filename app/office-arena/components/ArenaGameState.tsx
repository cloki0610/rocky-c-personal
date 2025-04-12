import Image from "next/image";

interface ArenaGameStateProps {
  gameStatus: string;
  round: number;
}

const ArenaGameState = ({ gameStatus, round }: ArenaGameStateProps) => {
  return (
    <div className="mb-4">
      <div className="font-bold">{gameStatus}</div>
      <div className="font-bold">Round: {round}</div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex flex-col lg:flex-row">
          <Image
            src="/boss.svg"
            alt="Boss"
            width={20}
            height={20}
            className="mr-2"
          />{" "}
          Boss: Player A
        </div>
        <div className="flex flex-col lg:flex-row">
          <Image
            src="/manager.svg"
            alt="Manager"
            width={20}
            height={20}
            className="mr-2"
          />{" "}
          Manager: Player B
        </div>
        <div className="flex flex-col lg:flex-row">
          <Image
            src="/staff.svg"
            alt="Staff"
            width={20}
            height={20}
            className="mr-2"
          />{" "}
          Junior Staff: Player C
        </div>
        <div className="flex flex-col lg:flex-row">
          <Image
            src="/senior-staff.svg"
            alt="Senior Staff"
            width={20}
            height={20}
            className="mr-2"
          />{" "}
          Senior Staff: Player C
        </div>
      </div>
      <div className="mt-2">
        <div className="font-semibold">
        Turn Order: Boss &gt; Manager &gt; Staff Placement
        </div>
      </div>
    </div>
  );
};

export default ArenaGameState;
