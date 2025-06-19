// hooks/useWebSocket.ts
"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { receiveMessage } from "@/redux/slice/conversationSlice";
import Cookies from "js-cookie";

let isConnected = false; // ✅ connection flag outside the hook

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isConnected) return;

    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No token for WebSocket");
      return;
    }

    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
    socketRef.current = ws;
    isConnected = true;

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "receive_message") {
          dispatch(receiveMessage(data.payload.message));
        }
      } catch (err) {
        console.error("❌ WebSocket parse error", e.data);
      }
    };
    ws.onclose = () => {
      console.warn("🔌 WebSocket disconnected");
      isConnected = false;
    };

    return () => {
      ws.close();
      isConnected = false;
    };
  }, [dispatch]);

  const sendWSMessage = (payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  return { sendWSMessage };
};
