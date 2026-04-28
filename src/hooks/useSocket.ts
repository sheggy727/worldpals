"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io(window.location.origin, {
        path: "/socket.io",
        transports: ["websocket"],
      });
    }
    socketRef.current = socket;

    return () => {
      // Don't disconnect on unmount — keep connection alive
    };
  }, []);

  return socketRef;
}
