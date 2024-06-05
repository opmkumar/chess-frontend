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
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [whiteTime, setWhiteTime] = useState(300000);
  const [blackTime, setBlackTime] = useState(300000);

  useEffect(() => {
    if (socket) {
      function handleUpdateBoard(newFen) {
        game.load(newFen);
        setFen(newFen);
      }

      function handleGameOver(result) {
        setGameOver(true);
        setGameResult(result);
        console.log(result);
      }
      socket.on("updateBoard", handleUpdateBoard);
      socket.on("gameOver", handleGameOver);

      return () => {
        socket.off("updateBoard", handleUpdateBoard);
      };
    }
  }, [socket, game]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        setWhiteTime((prev) =>
          Math.max(prev - (game.turn() === "w" ? 1000 : 0), 0),
        );
        setBlackTime((prev) =>
          Math.max(prev - (game.turn() === "b" ? 1000 : 0), 0),
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game.turn(), gameOver]);

  function onPieceDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(game.fen());

    if (gameCopy.turn() !== color[0]) {
      return false;
    }
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
    // checkGameOver(gameCopy);
    return true;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
      <div className="my-40 mr-20 h-[20rem] w-1/5 border border-solid border-black">
        <div>
          {color === "white"
            ? `Black: ${formatTime(blackTime)}`
            : `White: ${formatTime(whiteTime)}`}
        </div>
        <div>misc</div>
        <div>draw res</div>
        <div>
          {color === "white"
            ? `White: ${formatTime(whiteTime)}`
            : `Black: ${formatTime(blackTime)}`}
        </div>
      </div>
    </div>
  );
}

export default Game;
