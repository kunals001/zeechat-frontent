import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { receiveMessage } from "@/redux/slice/conversationSlice";
import Cookies from "js-cookie";

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    console.log("🔐 Token in useWebSocket:", token);

    if (!token) {
      console.warn("🚫 No token available for WebSocket");
      return;
    }

    const wsUrl = `ws://localhost:5000?token=${token}`;
    console.log("🌐 Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("📩 Message from server:", data);

      if (data.type === "receive_message") {
        dispatch(receiveMessage(data.payload.message));
      }
    };
    ws.onerror = (e) => console.error("❌ WebSocket error", e);
    ws.onclose = () => console.warn("🔌 WebSocket closed");

    return () => {
      ws.close();
    };
  }, [dispatch]);

  const sendWSMessage = (payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  };

  return { sendWSMessage };
};
