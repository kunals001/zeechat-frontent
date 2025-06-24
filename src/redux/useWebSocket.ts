// hooks/useWebSocket.ts
"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  receiveMessage,
  addReactionToMessage,
  messageDeleted,
  clearChatForMe,
  messageSeen,
  updateMessageSeenBy,
  updateLastMessageInList
} from "@/redux/slice/conversationSlice";
import Cookies from "js-cookie";

type WebSocketPayload =
  | {
      type: 'send_message';
      payload: {
        message: string;
        to: string;            // receiver userId
        conversationId: string;
        tempId: string;        // temporary message ID for optimistic UI
      };
    }
  | {
      type: 'receive_message';
      payload: {
        messageId: string;
        from: string;
        conversationId: string;
        message: string;
        createdAt: string;
      };
    }
  | {
      type: 'typing';
      payload: {
        isTyping: boolean;
        to: string;
        conversationId: string;
      };
    }
  | {
      type: 'seen';
      payload: {
        messageId: string;
        conversationId: string;
        seenAt: string;
      };
    }
  | {
      type: 'online_status';
      payload: {
        userId: string;
        isOnline: boolean;
        lastSeen: string;
      };
    };


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

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };


    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type === "receive_message") {
          dispatch(receiveMessage(data.payload.message));
        }

        if (data.type === "message_reacted") {
          dispatch(addReactionToMessage(data.payload));
        }

        if (data.type === "reaction_update") {
          dispatch(addReactionToMessage(data.payload));
        }

        if (data.type === "message_deleted") {
          console.log("🧹 Delete Payload received:", data.payload);
          dispatch(messageDeleted(data.payload));
        }    

        if (data.type === "chat_cleared") {
          dispatch(clearChatForMe({ userId: data.payload.userId }));
        }

        if (data.type === "message_seen") {
          dispatch(messageSeen({
            messageId: data.payload.messageId,
            seenBy: data.payload.seenBy, // ✅ sahi key
          }));
        }

        if (data.type === "seen_message") {
          dispatch(updateMessageSeenBy({
            messageId: data.payload.messageId,
            userId: data.payload.userId,
          }));
        }

        
        if (data.type === "last_message_updated") {
           console.log("🔥 Last message update received");

           const msg = data.payload.lastMessage;

           dispatch(updateLastMessageInList({
             conversationId: data.payload.conversationId,
             lastMessage: {
               _id: msg._id,
               message: msg.message,
               createdAt: msg.createdAt,
             }
           }));


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
