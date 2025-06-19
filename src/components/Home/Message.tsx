"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IconMoodEdit, IconSend2 } from "@tabler/icons-react";
import { EllipsisVertical } from "lucide-react";
import NoChatSelected from "./NoChatSelected";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchMessages,
  receiveMessage,
  sendMessage,
} from "@/redux/slice/conversationSlice";
import Cookies from "js-cookie";


const Message = () => {
  const dispatch = useAppDispatch();
  const { selectedUser, messages } = useAppSelector((state) => state.conversation);
  const { user } = useAppSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser?._id) dispatch(fetchMessages(selectedUser._id));
  }, [selectedUser, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket real-time receiver
useEffect(() => {
  const token = Cookies.get("token") || localStorage.getItem("token");

  if (!token) {
    console.warn("🚫 No token available for WebSocket");
    return;
  }

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
  console.log("🌐 Connecting to WebSocket:", wsUrl);

  const socket = new WebSocket(wsUrl);

  socket.onopen = () => console.log("✅ WebSocket connected");

  socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "receive_message") {
      dispatch(receiveMessage(data.payload.message));
    }
  };

  socket.onerror = (e) => console.error("❌ WebSocket error", e);
  socket.onclose = () => console.warn("🔌 WebSocket closed");

  return () => socket.close();
}, [dispatch]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    dispatch(
      sendMessage({
        userId: selectedUser._id,
        message: message.trim(),
        type: "text",
      })
    );
    setMessage("");
  };

  return (
    <div className="md:w-[calc(100vw-54vw)] md:h-[calc(100vh-7vw)] md:rounded-r-lg text-white overflow-hidden relative hidden md:block">
      {selectedUser ? (
        <div>
          <Image
            width={800}
            height={800}
            src="https://zeechat-kunal-singh-2025.s3.ap-south-1.amazonaws.com/uploads/theme.avif"
            alt="message theme"
            className="w-full h-full object-cover relative"
          />

          <div className="absolute w-full h-full bg-[rgba(0,0,0,0.68)] top-0 flex flex-col">
            {/* Header */}
            <div className="w-full h-[4vw] bg-[#141414] px-[2vw] flex items-center">
              <div className="relative md:w-[3.2vw] md:h-[3.2vw] w-[6vh] h-[6vh] rounded-full overflow-hidden">
                <Image
                  src={selectedUser.profilePic || "/default-profile.png"}
                  alt="user profile"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 3.2vw, 6vh"
                  loading="eager"
                  priority
                />
              </div>
              <div className="flex justify-between md:w-[calc(100%-6vh)] items-center">
                <div className="flex flex-col md:gap-[.4vh] gap-[.5vh] ml-[1vh]">
                  <h3 className="md:text-[1vw] font-second text-zinc-200 text-[2vh]">
                    {selectedUser.fullName} |{" "}
                    <span className="text-[.8vw] text-zinc-400">{selectedUser.userName}</span>
                  </h3>
                  <p className="md:text-[.7vw] text-zinc-400 font-second text-[1.2vh]">
                    Online
                  </p>
                </div>
                <div className="text-zinc-400 cursor-pointer md:p-1 hover:bg-zinc-800 md:rounded-lg">
                  <EllipsisVertical className="md:size-8 size-6" />
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div
              ref={chatRef}
              className="chat w-full h-[calc(100%-9vw)] p-2 overflow-y-scroll hide-scrollbar flex flex-col gap-2 "
            >
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`max-w-[70%] px-4 py-2 rounded-xl text-sm md:text-base break-words whitespace-pre-wrap ${
                      msg.sender._id === user?._id
                        ? "ml-auto bg-blue-600 rounded-br-none"
                        : "mr-auto bg-zinc-800 rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))
              ) : (
                <p className="text-zinc-400 text-center mt-4">No messages yet.</p>
              )}
            </div>

            {/* Input box */}
            <div className="w-full h-[4vw] flex items-center justify-center bg-[#141414] absolute bottom-0 md:px-[1vw]">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full md:h-[3vw] bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 md:px-[4vw] px-[1vh] py-[1vh] rounded-lg outline-none"
                />
                <IconSend2
                  onClick={handleSendMessage}
                  className="text-zinc-500 md:size-8 absolute md:right-5 right-8 cursor-pointer"
                />
                <IconMoodEdit className="text-zinc-400 md:size-8 absolute md:left-5 right-16 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default Message;
