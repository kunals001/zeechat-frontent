// app/WebSocketProvider.tsx
"use client";

import { useWebSocket } from "@/redux/useWebSocket";

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  useWebSocket(); // Initiates WebSocket connection

  return <div id="ws-root">{children}</div>; // optional wrapper for debugging
};

export default WebSocketProvider;
