import { useState, useEffect, useCallback } from "react";

import { isOccupiedBySamePlayer, isValidPosition } from "../utils/hooks";
import type {
  GameBoard,
  Player,
  StaffLocation,
  PieceType,
  Piece,
  PlayerCount,
} from "../interfaces/OfficeAreanaTypes";

const useOfficeArena = (
  initBoardSize: number,
  initStaffCountTarget: number
) => {
  // Game states
  const [board, setBoard] = useState<GameBoard>([]);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(
    null
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>("A");
  const [roundCount, setRoundCount] = useState<number>(1);
  const [countPiece, setCountPiece] = useState<PlayerCount>({
    boss: 1,
    manager: 1,
    staff: 0,
  });
  const [gameStatus, setGameStatus] = useState<string>(
    "Waiting for Player A (Boss) to move"
  );
  const [staffLoc, setStaffLoc] = useState<StaffLocation[]>([]); // Track staff age for promotion
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(initBoardSize);
  const [staffCountTarget, setStaffCountTarget] =
    useState<number>(initStaffCountTarget);
  const seniorStaffCount = staffLoc.filter((loc) => loc.age >= 2).length;
  // Initilize a new game board and reset the status
  const initializeBoard = useCallback(() => {
    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null));

    const centerRow = Math.floor(boardSize / 2);
    const leftCol = Math.floor(boardSize / 2) - 2;
    const rightCol = Math.floor(boardSize / 2) + 2;

    newBoard[centerRow][leftCol] = { type: "boss", player: "A" };
    newBoard[centerRow][rightCol] = { type: "manager", player: "B" };

    setBoard(newBoard);
    setSelectedPiece(null);
    setCurrentPlayer("A");
    setRoundCount(1);
    setCountPiece({
      boss: 1,
      manager: 1,
      staff: 0,
    });
    setGameStatus("Waiting for Player A (Boss) to move");
    setStaffLoc([]);
    setGameOver(false);
  }, [boardSize]);

  // Initialize the board
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Trigger when use click the square
  const handleSquareClick = (row: number, col: number) => {
    // Don't allow moves if game is over
    if (gameOver) return;
    // If a piece is already selected, try to move it
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      const piece = board[selectedRow][selectedCol];

      // Check if this is a valid move
      if (piece && isValidMove(piece, selectedRow, selectedCol, row, col)) {
        movePiece(selectedRow, selectedCol, row, col);
      } else {
        setSelectedPiece(null);
        setGameStatus(`Invalid move. Player ${currentPlayer}'s turn.`);
      }
    }
    // If no piece is selected, check if there's a piece to select
    else if (board[row][col] !== null) {
      const piece = board[row][col];

      // Only allow selecting pieces that belong to the current player
      if (
        (currentPlayer === "A" && piece.type === "boss") ||
        (currentPlayer === "B" && piece.type === "manager")
      ) {
        setSelectedPiece([row, col]);
        setGameStatus(`Selected ${piece.type}. Click a square to move.`);
      } else {
        setGameStatus(`It's Player ${currentPlayer}'s turn.`);
      }
    }
    // If we're in staff placement mode
    else if (currentPlayer === "C" && board[row][col] === null) {
      const countBoss = board
        .flat()
        .filter((piece) => piece?.type === "boss").length;
      const countManager = board
        .flat()
        .filter((piece) => piece?.type === "manager").length;
      const countStaff = board
        .flat()
        .filter((piece) => piece?.type === "staff").length;
      setCountPiece((prevCountPiece) => ({
        ...prevCountPiece,
        staff: countPiece.staff + 1,
      }));
      const newSeniorCount = placeAndIncreaseStaffAge({ row, col, age: 0 });
      setRoundCount((prevCount) => prevCount + 1);
      setCountPiece({
        boss: countBoss,
        manager: countManager,
        staff: countStaff + 1,
      });
      const isTie = checkTieConditions(newSeniorCount);
      if (!isTie) {
        setCurrentPlayer("A");
        setGameStatus("Waiting for Player A (Boss) to move");
      }
    }
  };

  const isValidMove = (
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    // Check if destination is empty or has an enemy piece that can be captured
    if (
      board[toRow][toCol] !== null &&
      board[toRow][toCol].player === piece.player
    ) {
      return false;
    }

    // Boss movement rules
    if (piece.type === "boss" && currentPlayer === "A") {
      // Boss can move only up, down, left, right (not diagonally)
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);

      if (
        (rowDiff === 1 && colDiff === 0) ||
        (rowDiff === 0 && colDiff === 1)
      ) {
        // Check if destination has a piece that boss can capture
        if (board[toRow][toCol] !== null) {
          // Rule 1: Boss can capture manager
          if (board[toRow][toCol].type === "manager") {
            return true;
          }
          if (board[toRow][toCol]?.type === "staff") {
            const targetStaff = board[toRow][toCol];
            return targetStaff.age < 2 || seniorStaffCount < 3;
          }
        }
        return true;
      }
    }

    // Manager movement rules
    if (piece.type === "manager" && currentPlayer === "B") {
      // Manager can move only up, down, left, right (not diagonally)
      const rowDiff = Math.abs(toRow - fromRow);
      const colDiff = Math.abs(toCol - fromCol);

      if (
        (rowDiff === 1 && colDiff === 0) ||
        (rowDiff === 0 && colDiff === 1)
      ) {
        // Check if destination has a piece that manager can capture
        if (board[toRow][toCol] !== null) {
          // Manager can capture junior staff
          if (
            board[toRow][toCol].type === "staff" &&
            board[toRow][toCol].age < 2
          ) {
            return true;
          }

          // Manager can capture boss if there are more than three senior staff on board
          if (board[toRow][toCol].type === "boss" && seniorStaffCount >= 3) {
            return true;
          }

          return false;
        }
        return true;
      }
    }

    return false;
  };

  const movePiece = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => {
    const newBoard = [...board];
    const piece = board[fromRow][fromCol];

    // Capture logic
    if (board[toRow][toCol] !== null) {
      // When a staff is captured, remove its location from staffLocation
      if (board[toRow][toCol].type === "staff") {
        const newStaffLocations = staffLoc.filter(
          (loc) => loc.row !== toRow || loc.col !== toCol
        );
        setStaffLoc(newStaffLocations);
        setCountPiece((prevCount) => ({
          ...prevCount,
          staff: prevCount.staff - 1,
        }));
      }

      // If boss captures the last manager, boss wins
      if (
        piece &&
        piece.type === "boss" &&
        board[toRow][toCol].type === "manager"
      ) {
        if (countPiece["manager"] === 1) {
          setGameStatus("Game Over! Boss wins by capturing the last Manager!");
          setGameOver(true);
          newBoard[toRow][toCol] = piece;
          newBoard[fromRow][fromCol] = null;
          setBoard(newBoard);
          setCountPiece((prevCount) => ({
            ...prevCount,
            manager: prevCount.manager - 1,
          }));
          return;
        }
      }

      // If manager captures boss with 3+ senior staff, manager wins
      if (
        piece &&
        piece.type === "manager" &&
        board[toRow][toCol].type === "boss" &&
        seniorStaffCount >= 3
      ) {
        setGameStatus("Game Over! Manager wins by capturing the Boss!");
        setGameOver(true);
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;
        setCountPiece((prevCount) => ({
          ...prevCount,
          boss: prevCount.boss - 1,
        }));
        setBoard(newBoard);
        return;
      }
    }

    // Move the piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    setBoard(newBoard);

    // Reset selected piece
    setSelectedPiece(null);

    // Handle turn logic
    if (piece && piece.type === "boss") {
      setCurrentPlayer("B");
      setGameStatus("Waiting for Player B (Manager) to move.");
    } else if (piece && piece.type === "manager") {
      setCurrentPlayer("C");
      setGameStatus("Player C can place a Staff member.");
    }

    // Check for win conditions
    checkWinConditions();
  };

  const placeAndIncreaseStaffAge = ({ row, col, age }: StaffLocation) => {
    let newBoard = [...board];
    let newStaffLoc = [...staffLoc];
    newBoard = newBoard.map((row) => {
      return row.map((cell) => {
        if (cell && cell.type === "staff") {
          return { ...cell, age: cell.age + 1 };
        }
        return cell;
      });
    });
    newStaffLoc = newStaffLoc.map((loc) => {
      return { ...loc, age: loc.age + 1 };
    });
    newBoard[row][col] = { type: "staff", player: "C", age: 0 };
    newStaffLoc = [...newStaffLoc, { row, col, age }];
    setStaffLoc(newStaffLoc);
    setBoard(newBoard);
    return newStaffLoc.filter((loc) => loc.age >= 2).length;
  };

  const checkWinConditions = () => {
    // Prevent null reference errors by checking game state before proceeding
    if (gameOver) return true;

    // Check if boss is missing (manager won)
    if (countPiece["boss"] === 0) {
      setGameStatus("Game Over! Manager wins!");
      setGameOver(true);
      return true;
    }

    // Check if manager is missing (boss won)
    if (countPiece["manager"] === 0) {
      setGameStatus("Game Over! Boss wins!");
      setGameOver(true);
      return true;
    }
  };

  const checkTieConditions = (newSeniorCount: number) => {
    // Prevent null reference errors by checking game state before proceeding
    if (gameOver) return true;

    // Check for a tie - if boss and manager can't capture each other or move
    const bossCanMoveOrCapture = checkIfPieceTypeCanMove("boss");
    const managerCanMoveOrCapture = checkIfPieceTypeCanMove("manager");

    // If there are more than 3 senior staff, game is over and staff wins.
    if (newSeniorCount >= staffCountTarget) {
      setGameStatus(
        `Game Over! ${staffCountTarget} Senior Staffs on board! Staff wins!`
      );
      setGameOver(true);
      return true;
    }
    // If the game is a tie, game is over and staff wins.
    if (!bossCanMoveOrCapture && !managerCanMoveOrCapture) {
      setGameStatus("Game Over! Tie! Staff wins!");
      setGameOver(true);
      return true;
    }

    return false;
  };

  const findCapturePath = (
    startRow: number,
    startCol: number,
    targetRow: number,
    targetCol: number,
    currentBoard: GameBoard,
    piece: Piece,
    maxDepth: number
  ): boolean => {
    // Queue for BFS, storing position and depth
    const queue: [number, number, number][] = [[startRow, startCol, 0]];

    // Set to keep track of visited positions
    const visited = new Set<string>();
    visited.add(`${startRow},${startCol}`);

    // Define movement directions based on piece type
    const directions = [
      [-1, 0], // Up
      [0, -1], // Left
      [0, 1], // Right
      [1, 0], // Down
    ];

    while (queue.length > 0) {
      const [currentRow, currentCol, depth] = queue.shift()!;

      // Check if we've reached max depth
      if (depth >= maxDepth) {
        continue;
      }

      // Check if we can capture the target from this position
      if (currentRow === targetRow && currentCol === targetCol) {
        return true; // Path to target found
      }

      // Try each possible move
      for (const [rowOffset, colOffset] of directions) {
        const newRow = currentRow + rowOffset;
        const newCol = currentCol + colOffset;
        const posKey = `${newRow},${newCol}`;

        // Skip if already visited
        if (visited.has(posKey)) {
          continue;
        }

        // Check if position is valid and not occupied by the same player
        if (
          isValidPosition(newRow, newCol, currentBoard) &&
          !isOccupiedBySamePlayer(newRow, newCol, piece.player, currentBoard)
        ) {
          visited.add(posKey);
          queue.push([newRow, newCol, depth + 1]);
        }
      }
    }

    return false; // No path to target found
  };

  const checkIfPieceTypeCanMove = (
    pieceType: PieceType,
    maxDepth: number = 10
  ): boolean => {
    // Validate input parameters
    if (pieceType !== "boss" && pieceType !== "manager") {
      return false;
    }

    // Determine which piece we're looking for as target
    const targetType = pieceType === "boss" ? "manager" : "boss";

    // Find all pieces of the specified type
    const pieces: [number, number, Piece][] = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const piece = board[row][col];
        if (piece && piece.type === pieceType) {
          pieces.push([row, col, piece]);
        }
      }
    }

    // Find all targets of the specified type
    const targets: [number, number][] = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const piece = board[row][col];
        if (piece && piece.type === targetType) {
          targets.push([row, col]);
        }
      }
    }

    // Check if any piece can find a complete path to capture any target
    for (const [pieceRow, pieceCol, piece] of pieces) {
      for (const [targetRow, targetCol] of targets) {
        if (
          findCapturePath(
            pieceRow,
            pieceCol,
            targetRow,
            targetCol,
            board,
            piece,
            maxDepth
          )
        ) {
          return true; // A valid path exists
        }
      }
    }

    return false; // No valid path found
  };

  return {
    board,
    roundCount,
    selectedPiece,
    gameStatus,
    boardSize,
    staffCountTarget,
    currentPlayer,
    initializeBoard,
    handleSquareClick,
    isValidMove,
    setBoardSize,
    setStaffCountTarget,
  };
};

export default useOfficeArena;
