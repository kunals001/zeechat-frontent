// app/WebSocketProvider.tsx
"use client";

import { useWebSocket } from "@/redux/useWebSocket";

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  useWebSocket(); 
  return <>{children}</>;
};

export default WebSocketProvider;
