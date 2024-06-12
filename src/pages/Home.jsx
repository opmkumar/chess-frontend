import { useDispatch, useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import Invite from "../components/Invite";
import { Chessboard } from "react-chessboard";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import {
  challengeAccepted,
  getUserCompletedGames,
} from "../features/gameSlice";
import ArchiveFormat from "../components/ArchiveFormat";

function Home() {
  const { email } = useSelector((store) => store.user);
  const { games } = useSelector((store) => store.game);
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [challenger, setChallenger] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(socket);

  const otherUsers = onlineUsers.filter((user) => user.email !== email);
  console.log(email);

  useEffect(
    function () {
      if (socket) {
        function handleConnect() {
          console.log("Connected to server");
          console.log(`socket id: ${socket.id}`);
        }

        function handleDisconnect() {
          console.log("Disconnected from server");
        }

        function handleOnlineList(users) {
          setOnlineUsers(users);
          // console.log(onlineUsers);
        }
        function handleReceiveInvite(inviter) {
          setChallenger((challenger) => [...challenger, inviter]);
          // setChallenger(inviter);
          // alert(`${inviter} invited you for a match...`);
        }

        async function handleRemoveChallenge(userId) {
          setChallenger(
            challenger.filter(
              (challengerUser) => challengerUser._id !== userId,
            ),
          );
        }

        function handleAcceptance({ gameId, color }) {
          // console.log("going to navigate");
          console.log(color, gameId);
          dispatch(challengeAccepted({ color, gameId }));
          socket.emit("joinGame", gameId);

          navigate("/app/game");
        }
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("updateOnlineList", handleOnlineList);
        socket.on("receiveInvite", handleReceiveInvite);
        socket.on("removeChallenge", handleRemoveChallenge);
        socket.on("challengeAccepted", handleAcceptance);

        socket.emit("userConnected", email);

        if (socket.connected) {
          console.log("Already connected");
        } else {
          console.log("Not connected yet");
        }

        return () => {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
          socket.off("updateOnlineList", handleOnlineList);
          socket.off("receiveInvite", handleReceiveInvite);
          socket.off("removeChallenge", handleRemoveChallenge);
          socket.off("challengeAccepted", handleAcceptance);
        };
      }
    },
    [email, navigate, socket, dispatch],
  );

  useEffect(
    function () {
      dispatch(getUserCompletedGames());
    },
    [dispatch],
  );

  function handleChallengeAccepted(challengerId) {
    setChallenger([]);
    socket.emit("challengeAccepted", challengerId);
  }

  function handleChallengeRejected(userId) {
    setChallenger(
      challenger.filter((challengerUser) => challengerUser._id !== userId),
    );
  }

  console.log(games);

  return (
    <div className="flex justify-between p-12">
      <div className="h-[35rem] w-1/6 border border-solid border-black">
        <div className="h-[15rem]">
          <h3>Online users</h3>
          <ul>
            {otherUsers.map((user) => (
              <li key={user._id} className="flex justify-between">
                <div>{user.username}</div>
                <Invite socket={socket} userId={user._id} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          online challenges
          {challenger.length > 0 && (
            <ul>
              {challenger.map((challengerUser, index) => (
                <li key={challengerUser._id}>
                  <div>{`${challengerUser.username} sent you a challenge...`}</div>
                  <button
                    onClick={() => handleChallengeAccepted(challengerUser._id)}
                  >
                    ✅
                  </button>
                  <button
                    onClick={() => handleChallengeRejected(challengerUser._id)}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className=" w-[40rem] border border-solid border-black">
        <Chessboard id="BasicBoard" arePiecesDraggable={false} />
      </div>

      <div className="h-[40rem] w-1/4 border border-solid border-black">
        <div className="h-[15rem]">
          your past games
          <ul>
            {games.length > 0 &&
              games.map((game) => (
                <li key={game._id}>
                  <ArchiveFormat
                    playerWhite={game.playerWhite}
                    playerBlack={game.playerBlack}
                    winner={game.winner}
                    status={game.status}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
