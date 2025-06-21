"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { receiveMessage } from "@/redux/slice/conversationSlice";
import Cookies from "js-cookie";

export const useWebSocket = () => {
  const ws_url = process.env.NEXT_PUBLIC_WS_URL;
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef(false); // ✅ useRef to persist across renders

  useEffect(() => {
    if (connectedRef.current) return;

    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No token for WebSocket");
      return;
    }

    const ws = new WebSocket(`${ws_url}?token=${token}`);
    socketRef.current = ws;
    connectedRef.current = true;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "receive_message") {
          dispatch(receiveMessage(data.payload.message));
        }
        // Add more WebSocket event handling here if needed
      } catch (err) {
        console.error("❌ WebSocket parse error:", err);
      }
    };

    ws.onclose = (event) => {
      console.warn("🔌 WebSocket disconnected", event.code, event.reason);
      connectedRef.current = false;
    };

    return () => {
      ws.close();
      connectedRef.current = false;
    };
  }, [dispatch, ws_url]);

  const sendWSMessage = (payload: { type: string; payload: any }) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("⚠️ Cannot send, WebSocket not open");
    }
  };

  return { sendWSMessage };
};
