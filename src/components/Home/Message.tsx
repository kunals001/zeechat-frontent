"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconSend2, IconMoodEdit } from "@tabler/icons-react";
import { EllipsisVertical } from "lucide-react";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchMessages,
  receiveMessage,
  sendMessage,
} from "@/redux/slice/conversationSlice";
import NoChatSelected from "./NoChatSelected";

const socketRef = { current: null as WebSocket | null };

// 🧠 Utility function to format date headers
function formatChatDate(dateStr: string): string {
  const msgDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = msgDate.toDateString() === today.toDateString();
  const isYesterday = msgDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const Message = () => {
  const dispatch = useAppDispatch();
  const { selectedUser, messages } = useAppSelector((state) => state.conversation);
  const { user } = useAppSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);


  const groupedMessages: { [date: string]: typeof messages } = {};
  messages.forEach((msg) => {
    const dateLabel = formatChatDate(msg.createdAt);
    if (!groupedMessages[dateLabel]) groupedMessages[dateLabel] = [];
    groupedMessages[dateLabel].push(msg);
  });

  // ⬇ Load messages when user selected
  useEffect(() => {
    if (selectedUser?._id) dispatch(fetchMessages(selectedUser._id));
  }, [selectedUser, dispatch]);


  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);


  useEffect(() => {
    if (socketRef.current) return;

    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => console.log("✅ WebSocket connected");

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "receive_message") {
          const msg = data.payload.message;
          if (msg.sender._id !== user?._id) {
            if (
              selectedUser &&
              (msg.sender._id === selectedUser._id || msg.receiver === selectedUser._id)
            ) {
              dispatch(receiveMessage(msg));
            }
          }
        }
      } catch (err) {
        console.log("WS error", err);
      }
    };

    socket.onclose = () => {
      socketRef.current = null;
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [dispatch, selectedUser, user]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    dispatch(sendMessage({ userId: selectedUser._id, message, type: "text" }));
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
              />
            </div>
            <div className="flex justify-between md:w-[calc(100%-6vh)] items-center">
              <div className="ml-[1vh]">
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
            className="chat w-full h-[calc(100%-9vw)] px-[2vw] py-[1vw] overflow-y-scroll hide-scrollbar flex flex-col gap-2"
          >
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} >
                <div className="w-full flex justify-center my-4">
                  <div className="text-sm text-zinc-200 bg-zinc-700 px-3 py-1 rounded-md">
                    {date}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {msgs.map((msg) => {
                    const isSender = msg.sender._id === user?._id;
                    const time = new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                      key={msg._id}
                      className={`px-4 py-2 rounded-xl text-sm md:text-base break-words whitespace-pre-wrap ${isSender ? "self-end bg-[#8375fe] rounded-br-none" : "self-start bg-zinc-800 rounded-bl-none"}`}
                      style={{ maxWidth: "75%", width: "fit-content" }}
                    >
                      <div className="flex items-end gap-2">
                        <span>{msg.message}</span>
                        <span className="text-[0.65rem] text-zinc-200 opacity-70 whitespace-nowrap">{time}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
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
