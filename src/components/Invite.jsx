function Invite({ socket, userId }) {
  function handleClick() {
    if (socket) {
      console.log(socket);
      socket.emit("sendInvite", userId);
    }
  }
  return <button onClick={handleClick}>Invite</button>;
}

export default Invite;
