// import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

let socket;
export const initializeSocket = () => {
  const { jwt } = sessionStorage;

  if (jwt) {
    socket = io(URL, {
      query: { jwt },
    });
    return socket;
  } else {
    console.warn("Login to establish the connection");
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

export const getSocket = () => socket;

// const SocketContext = createContext();

// function SocketProvider({ children }) {
//   const [socket, setSocket] = useState(null);

//   useEffect(function () {
//     const jwt = sessionStorage.getItem("jwt");
//     // const { jwt } = sessionStorage;
//     if (jwt) {
//       const socketInstance = io(URL, {
//         query: { jwt },
//       });
//       setSocket(socketInstance);
//       // console.log(socket);
//       return () => {
//         socketInstance.disconnect();
//       };
//     } else {
//       console.warn("Login to establish the connection");
//     }
//   }, []);
//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// }

// function useSocket() {
//   const context = useContext(SocketContext);
//   console.log(context);
//   if (context === undefined)
//     throw new Error("socketcontext was used outside of socketProvider");
//   return context;
// }

// export { useSocket, SocketProvider };
