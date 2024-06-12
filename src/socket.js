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
