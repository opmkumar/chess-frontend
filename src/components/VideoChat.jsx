import { useSocket } from "@/context/SocketProvider";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function VideoChat() {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [opponentPeerId, setOpponentPeerId] = useState(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const { socket } = useSocket();
  const { gameId } = useSelector((store) => store.game);
  useEffect(
    function () {
      const peer = new Peer(undefined, {
        host: "localhost",
        port: 3000,
        path: "/peerjs",
      });

      peer.on("open", (id) => {
        console.log("This is my peer id ", id);
        socket.emit("peerId", { peerId: id, gameId });
        setPeerId(id);
      });

      peer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play();
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            });
          });
      });

      setPeer(peer);
      socket.on("opponentPeerId", (id) => {
        console.log(`peerId of opponent: ${id}`);
        setOpponentPeerId(id);
      });

      return () => {
        peer.destroy();
        socket.off("opponentPeerId");
      };
    },
    [socket, gameId],
  );

  useEffect(
    function () {
      if (peer && peerId && opponentPeerId) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            const call = peer.call(opponentPeerId, stream);
            call.on("stream", (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
            });
          });
      }
    },
    [peer, peerId, opponentPeerId],
  );
  return (
    <div className="flex h-[35rem] flex-col items-center justify-evenly">
      <div className="flex  flex-grow items-center justify-center">
        <video
          ref={remoteVideoRef}
          className="h-auto w-full"
          autoPlay
          playsInline
        />
      </div>
      <div className="flex  flex-grow items-center justify-center">
        <video
          ref={localVideoRef}
          className="h-auto w-full"
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}

export default VideoChat;
