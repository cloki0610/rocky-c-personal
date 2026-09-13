import Image from "next/image";
import type { Piece } from "../interfaces/OfficeAreanaTypes";

export default function ArenaPiece({ piece, isSenior }: { piece: Piece; isSenior: boolean }) {
  const name = piece.type === "staff" && isSenior ? "senior-staff" : piece.type;
  return <Image src={`/${name}.svg`} alt="" width={50} height={50} className="pointer-events-none h-4/5 w-4/5 object-contain" />;
}
