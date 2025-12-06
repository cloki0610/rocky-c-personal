import Image from "next/image";

import type { Piece } from "../interfaces/OfficeAreanaTypes";

interface ArenaPieceProps {
  piece: Piece;
  isSenior: boolean | null;
}

const ArenaPiece = ({ piece, isSenior }: ArenaPieceProps) => {
  if (!piece) return "";

  switch (piece.type) {
    case "boss":
      return (
        <Image
          src="/boss.svg"
          alt="Boss"
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
        />
      );
    case "manager":
      return (
        <Image
          src="/manager.svg"
          alt="Manager"
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
        />
      );
    case "staff":
      return isSenior === true ? (
        <Image
          src="/senior-staff.svg"
          alt="Senior Staff"
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
        />
      ) : (
        <Image
          src="/staff.svg"
          alt="Staff"
          width={50}
          height={50}
          style={{ width: "auto", height: "auto" }}
        />
      );
    default:
      return "";
  }
};

export default ArenaPiece;
