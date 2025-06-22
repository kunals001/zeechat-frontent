// hooks/useWebSocket.ts
"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { receiveMessage,addReactionToMessage, } from "@/redux/slice/conversationSlice";
import Cookies from "js-cookie";

type WebSocketPayload = {
  type: string;
  payload: any;
};

// ✅ Export socketRef to use globally
export const socketRef = { current: null as WebSocket | null };

export const useWebSocket = () => {
  const ws_url = process.env.NEXT_PUBLIC_WS_URL;
  const dispatch = useAppDispatch();
  const connectedRef = useRef(false);

  useEffect(() => {
    if (connectedRef.current || socketRef.current) return;

    const token = Cookies.get("token") || localStorage.getItem("token");
    if (!token) {
      console.warn("🚫 No token for WebSocket");
      return;
    }

    const ws = new WebSocket(`${ws_url}?token=${token}`);
    socketRef.current = ws;
    connectedRef.current = true;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "receive_message") {
          dispatch(receiveMessage(data.payload.message));
        }
        
        
        if (data.type === "message_reacted") {
          dispatch(addReactionToMessage(data.payload));
        }

        // ✅ ADD THIS if your backend emits `reaction_update`
        if (data.type === "reaction_update") {
          dispatch(addReactionToMessage(data.payload));
        }

        // ✅ ADD THIS FOR DELETE
        if (data.type === "message_deleted") {
          dispatch({
            type: "conversation/messageDeleted",
            payload: data.payload,
          });
        }
      } catch (err) {
        console.error("❌ WS parse error", err);
      }
    };

    ws.onclose = () => {
      console.warn("🔌 WS disconnected");
      socketRef.current = null;
      connectedRef.current = false;
    };


    return () => {
      ws.close();
      connectedRef.current = false;
    };
  }, [dispatch, ws_url]);

  const sendWSMessage = (payload: WebSocketPayload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("⚠️ Cannot send, WebSocket not open");
    }
  };

  return { sendWSMessage };
};
