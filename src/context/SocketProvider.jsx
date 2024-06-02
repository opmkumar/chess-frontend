import { createContext, useContext, useEffect, useState } from "react";
import { disconnectSocket, getSocket, initializeSocket } from "../socket";

const SocketContext = createContext();

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // useEffect(
  //   function () {
  //     if (userEmail) {
  //       const socketInstance = initializeSocket();
  //       setSocket(socketInstance); // Set the socket instance
  //     } else {
  //       disconnectSocket();
  //       setSocket(null); // Clear the socket instance
  //     }
  //   },
  //   [userEmail],
  // );
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);
  function login(userEmail) {
    const newSocket = initializeSocket();
    setSocket(newSocket);
  }

  const logout = () => {
    setUserEmail(null);
  };
  return (
    <SocketContext.Provider
      value={{ userEmail, login, logout, getSocket, socket }}
    >
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined)
    throw new Error("Context is used outside of the provider");
  return context;
}

export { SocketProvider, useSocket };
