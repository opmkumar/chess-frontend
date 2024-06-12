import { Chessboard } from "react-chessboard";
import { useSocket } from "../context/SocketProvider";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Chess } from "chess.js";
import ModalDialog from "@/components/ModalDialog";
import VideoChat from "@/components/VideoChat";

function Game() {
  const { color, gameId } = useSelector((store) => store.game);
  const { socket } = useSocket();
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [gameOver, setGameOver] = useState(false);
  // const [gameResult, setGameResult] = useState("");
  const [whiteTime, setWhiteTime] = useState(300000);
  const [blackTime, setBlackTime] = useState(300000);
  const [isModelOpen, setIsModelOpen] = useState(false);
  // const [winner, setWinner] = useState("");
  const [message, setMessage] = useState("");
  const [drawOffer, setDrawOffer] = useState("");

  useEffect(() => {
    if (socket) {
      function handleUpdateBoard(newFen) {
        game.load(newFen);
        setFen(newFen);
      }

      function handleGameOver(result, winner) {
        setGameOver(true);
        // setGameResult(result);
        setIsModelOpen(true);
        // setWinner(winner);
        if (winner !== null) {
          const playerId = sessionStorage.getItem("id");
          if (result === "checkmate")
            setMessage(
              winner === playerId
                ? `You won by checkmate`
                : "You lose by checkmate",
            );
          else setMessage(result);
        } else {
          if (result === "draw") setMessage("DRAW");
          else setMessage(`Draw by ${result}`);
        }

        socket.emit("stopTimer", gameId);

        console.log(result);
      }

      function handleUpdateTimes(times) {
        setWhiteTime(times.whiteTime);
        setBlackTime(times.blackTime);
      }

      function handleRecieveDraw(opponent) {
        setDrawOffer(`${opponent} sent you a draw offer`);
        console.log(`${opponent} sent you a draw offer`);
      }
      socket.on("updateBoard", handleUpdateBoard);
      socket.on("updateTimes", handleUpdateTimes);
      socket.on("gameOver", handleGameOver);
      socket.on("recieveDraw", handleRecieveDraw);

      return () => {
        socket.off("updateBoard", handleUpdateBoard);
      };
    }
  }, [socket, game, gameId]);

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
    return true;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function handleResign(gameId, color) {
    socket.emit("resign", { gameId, color });
  }

  function handleDraw(gameId) {
    socket.emit("sendDraw", gameId);
  }

  function handleDrawAccepted(gameId) {
    socket.emit("drawAccepted", gameId);
  }
  function handleDrawRejected() {
    setDrawOffer("");
  }
  return (
    <div className="flex justify-between p-12">
      <div className="h-[35rem] w-1/5 border border-solid border-black">
        <VideoChat />
      </div>
      <div className=" w-[40rem] border border-solid border-black">
        <Chessboard
          id="BasicBoard"
          boardOrientation={color}
          position={fen}
          onPieceDrop={onPieceDrop}
          arePiecesDraggable={gameOver ? false : true}
        />
      </div>
      <div className="my-40 mr-20 flex h-[20rem] w-1/5 flex-col justify-around border border-solid border-black">
        <div>
          {color === "white"
            ? `Black: ${formatTime(blackTime)}`
            : `White: ${formatTime(whiteTime)}`}
        </div>
        <div>misc</div>
        {!drawOffer ? (
          <div className="flex justify-evenly">
            <button onClick={() => handleDraw(gameId)}>
              <img src="./../../img/draw.png" alt="draw" className="w-[2rem]" />
            </button>
            <button onClick={() => handleResign(gameId, color)}>
              <img
                src="./../../img/resign.png"
                alt="resign"
                className="w-[2rem]"
              />
            </button>
          </div>
        ) : (
          <div className="flex justify-evenly">
            <span>{drawOffer}</span>
            <button onClick={() => handleDrawAccepted(gameId)}>✅</button>
            <button onClick={() => handleDrawRejected()}>❌</button>
          </div>
        )}
        <div>
          {color === "white"
            ? `White: ${formatTime(whiteTime)}`
            : `Black: ${formatTime(blackTime)}`}
        </div>
      </div>
      {isModelOpen && (
        <ModalDialog
          open={isModelOpen}
          onOpenChange={() => setIsModelOpen(false)}
          message={message}
        />
      )}
    </div>
  );
}

export default Game;
