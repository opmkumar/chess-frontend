import { Chessboard } from "react-chessboard";
import { useSocket } from "../context/SocketProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chess } from "chess.js";

function Game() {
  const { color, gameId } = useSelector((store) => store.game);
  const { socket } = useSocket();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  useEffect(() => {
    if (socket) {
      function handleUpdateBoard(newFen) {
        game.load(newFen);
        setFen(newFen);
      }

      socket.on("updateBoard", handleUpdateBoard);

      return () => {
        socket.off("updateBoard", handleUpdateBoard);
      };
    }
  }, [socket, game]);

  function onPieceDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to a queen for simplicity
    });

    if (move === null) return false;
    console.log(move);
    setGame(gameCopy);
    setFen(gameCopy.fen());
    socket.emit("movePiece", { gameId, fen: gameCopy.fen() });
    return true;
  }

  return (
    <div className="flex justify-between p-12">
      <div className="h-[35rem] w-1/5 border border-solid border-black">
        chat
      </div>
      <div className=" w-[40rem] border border-solid border-black">
        <Chessboard
          id="BasicBoard"
          boardOrientation={color}
          position={fen}
          onPieceDrop={onPieceDrop}
        />
      </div>
      <div className="w-1/5 border border-solid border-black">
        Time and other stuffs
      </div>
    </div>
  );
}

export default Game;
