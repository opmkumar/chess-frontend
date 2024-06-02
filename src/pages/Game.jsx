import { Chessboard } from "react-chessboard";
import { useSocket } from "../context/SocketProvider";
function Game() {
  const { socket } = useSocket();
  console.log(socket);
  return (
    <div>
      <Chessboard id="BasicBoard" />
    </div>
  );
}

export default Game;
