"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconSend2, IconMoodEdit } from "@tabler/icons-react";
import { EllipsisVertical, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchMessages,
  receiveMessage,
  sendMessage,
  setTyping,
  updateOnlineStatus,
  updateLastSeen,
} from "@/redux/slice/conversationSlice";
import NoChatSelected from "../ChatUi.tsx/NoChatSelected";
import { socketRef } from "@/redux/useWebSocket";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import Panel from "./Panel";
import MessageBubble from "./MessageAction";
import axios from "axios";
import type { MessageType } from "@/redux/type";

/**
 * Formats a date string into a human-readable chat date label
 * @param dateStr - ISO date string
 * @returns Formatted date string (Today/Yesterday/Date)
 */
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

/**
 * Formats last seen timestamp into readable string
 * @param isoString - ISO date string
 * @returns Formatted last seen string
 */
function formatLastSeen(isoString: string): string {
  if (!isoString) return "Offline";

  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Last seen Today at ${timeString}`;
  if (isYesterday) return `Last seen Yesterday at ${timeString}`;

  const dateString = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `Last seen ${dateString} at ${timeString}`;
}

/**
 * Main Message Component - Handles chat UI and messaging functionality
 */
const Message = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // State management
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [message, setMessage] = useState("");

  // Refs
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);


  // Redux state
  const dispatch = useAppDispatch();
  const { selectedUser, messages, typingUserIds, onlineUsers, lastSeenMap } = useAppSelector(
    (state) => state.conversation
  );
  const { user } = useAppSelector((state) => state.auth);

  // Derived state
  const isTyping = selectedUser && typingUserIds.includes(selectedUser._id);
  const isOnline = selectedUser && onlineUsers[selectedUser._id];
  const lastSeen = selectedUser ? lastSeenMap[selectedUser._id] ?? null : null;

  // Group messages by date
  const groupedMessages: { [date: string]: typeof messages } = {};
  messages.forEach((msg) => {
    const dateLabel = formatChatDate(msg.createdAt);
    if (!groupedMessages[dateLabel]) groupedMessages[dateLabel] = [];
    groupedMessages[dateLabel].push(msg);
  });

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser?._id) dispatch(fetchMessages(selectedUser._id));
  }, [selectedUser, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  // Handle typing indicators
  useEffect(() => {
    if (!selectedUser || !socketRef.current) return;
    if (message.trim()) {
      socketRef.current.send(
        JSON.stringify({ type: "typing", payload: { to: selectedUser._id } })
      );
      const timer = setTimeout(() => {
        socketRef.current?.send(
          JSON.stringify({ type: "stop_typing", payload: { to: selectedUser._id } })
        );
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, selectedUser]);

  // WebSocket message handling
  useEffect(() => {
    if (!socketRef.current) return;
    const handleMessage = (event: MessageEvent) => {
      try {
        const { type, payload } = JSON.parse(event.data);
        switch (type) {
          case "receive_message":
            if (
              payload?.message?.sender?._id === selectedUser?._id ||
              payload?.message?.receiver === selectedUser?._id
            ) {
              dispatch(receiveMessage(payload.message));
            }
            break;
          case "user_typing":
            dispatch(setTyping({ userId: payload.userId, isTyping: true }));
            setTimeout(() => {
              dispatch(setTyping({ userId: payload.userId, isTyping: false }));
            }, 2000);
            break;
          case "user_online":
            dispatch(updateOnlineStatus({ userId: payload.userId, isOnline: true }));
            break;
          case "user_offline":
            dispatch(updateOnlineStatus({ userId: payload.userId, isOnline: false }));
            dispatch(updateLastSeen({ userId: payload.userId, lastSeen: new Date().toISOString() }));
            break;
        }
      } catch (err) {
        console.error("WebSocket JSON error", err);
      }
    };
    socketRef.current.addEventListener("message", handleMessage);
    return () => socketRef.current?.removeEventListener("message", handleMessage);
  }, [selectedUser, dispatch]);

  /**
   * Handles sending a message
   * @param mediaUrl - URL of media to send (optional)
   * @param mediaType - Type of media (defaults to text)
   * @param optionalCaption - Caption for media (optional)
   */
  const handleSendMessage = (
    mediaUrl?: string, 
    mediaType: MessageType = "text", 
    optionalCaption?: string
  ) => {
    if ((!mediaUrl && !message.trim()) || !selectedUser) return;
    dispatch(
      sendMessage({
        userId: selectedUser._id,
        message: mediaUrl || message,
        type: mediaType,
        caption: optionalCaption || "",
      })
    );
    setMessage("");
    setCaption("");
    setMediaPreview(null);
    setMediaType(null);
  };

  /**
   * Handles file selection for media upload
   * @param e - File input change event
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  };

  /**
   * Handles media upload and sending
   */
  const handleUploadAndSend = async () => {
    const input = fileInputRef.current;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url;
      handleSendMessage(url, mediaType ?? "image", caption);
    } catch (error) {
      console.error("❌ Upload failed", error);
    }
  };

  return (
    <div className="md:w-[calc(100vw-54vw)] md:h-[calc(100vh-7vw)] md:rounded-r-lg text-white overflow-hidden relative w-full h-screen">
      {selectedUser ? (
        <div>
          {/* Background Image */}
          <Image
            width={800}
            height={800}
            src="https://zeechat-kunal-singh-2025.s3.ap-south-1.amazonaws.com/uploads/theme.avif"
            alt="message theme"
            className="w-full h-screen object-cover relative"
            priority
          />
          
          {/* Overlay Container */}
          <div className="absolute w-full h-full bg-[rgba(0,0,0,0.68)] top-0 flex flex-col">
            {/* Header Section */}
            <div className="w-full md:h-[4vw] h-[8vh] bg-[#141414] px-[2vw] flex items-center">
              <div className="relative md:w-[3.1vw] md:h-[3.1vw] w-[6vh] h-[6vh] rounded-full overflow-hidden">
                <Image
                  src={selectedUser.profilePic || "/default-profile.png"}
                  alt="user profile"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
              
              <div className="flex justify-between w-[calc(100%-6vh)] md:w-[calc(100%-6vh)] items-center">
                <div className="ml-[1vh]">
                  <h3 className="md:text-[1vw] font-second text-zinc-200 text-[2vh]">
                    {selectedUser.fullName} | <span className="md:text-[.8vw] text-zinc-400 text-[1.3vh]">{selectedUser.userName}</span>
                  </h3>
                  <p className="md:text-[.7vw] text-zinc-400 font-second text-[1.2vh]">
                    {isTyping
                      ? "Typing..."
                      : isOnline
                      ? "Online"
                      : lastSeen
                      ? formatLastSeen(lastSeen)
                      : "Offline"}
                  </p>
                </div>
                
                {/* Panel Toggle Button */}
                <div 
                  onClick={() => setOpenPanel(prev => !prev)} 
                  className={`text-zinc-400 cursor-pointer md:p-1 p-1.5 rounded-full md:rounded-lg ${openPanel ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
                >
                  <EllipsisVertical className="md:size-8 size-6" />
                </div>

                {/* Panel Dropdown */}
                <div 
                  ref={panelRef} 
                  className={`transform transition-all duration-300 origin-top-right ${
                    openPanel ? "scale-100" : "scale-0"
                  } absolute top-[6vh] right-[1.5vh] md:top-[3.1vw] md:right-[2vw] ease-[cubic-bezier(0.4, 0, 0.2, 1)] overflow-hidden rounded-lg z-40 bg-zinc-900`}
                >
                  <Panel/>
                </div>
              </div>
            </div>

            {/* Chat Messages Section */}
            {/* Chat Messages Section */}
            <div 
              ref={chatRef} 
              className="chat w-full h-[calc(100%-16vh)] px-[2vw] py-[1vw] overflow-y-scroll hide-scrollbar flex flex-col gap-2"
            >
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="w-full flex justify-center my-4">
                    <div className="text-sm text-zinc-200 bg-zinc-700 px-3 py-1 rounded-md">
                      {date}
                    </div>
                  </div>
      
                  <div className="flex flex-col gap-2">
        {[...new Set(msgs.map((m) => m._id))].map((id) => {
          const msg = msgs.find((m) => m._id === id);
          if (!user || !msg || msg.deletedFor?.includes(user._id)) return null;
          const isSender = msg.sender._id === user?._id;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <MessageBubble
              key={msg._id}
              chatRef={chatRef}
              msg={msg}
              isSender={isSender}
              time={time}
              showActions={showActions}
              setShowActions={setShowActions}
            />
          );
        })}
                  </div>
                </div>
              ))}
            </div>


            {/* Media Preview Section */}
            {mediaPreview && (
              <div className="absolute bottom-[6.5vh] md:bottom-[5vw] left-0 w-full bg-zinc-900 p-4 flex flex-col items-center gap-2 z-50">
                {mediaType === "image" ? (
                  <img src={mediaPreview} className="max-h-[30vh] rounded-md" />
                ) : (
                  <video src={mediaPreview} className="max-h-[30vh] rounded-md" controls />
                )}
                <input
                  type="text"
                  placeholder="Add a caption..."
                  className="w-full bg-zinc-800 px-3 py-2 rounded-md text-white outline-none"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUploadAndSend}
                    className="bg-[#8375FE] px-4 py-2 rounded-md text-white"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setMediaPreview(null);
                      setMediaType(null);
                      setCaption("");
                    }}
                    className="bg-zinc-700 px-4 py-2 rounded-md text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Message Input Section */}
            <div className="w-full md:h-[4vw] h-[7.5vh] flex items-center justify-center bg-[#141414] absolute bottom-0 px-[1vh] md:px-[1vw]">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full md:h-[3vw] bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 md:pr-[4vw] md:pl-[6vw] pl-[8vh] pr-[4vh] md:py-[1vh] py-[1.2vh] rounded-lg outline-none"
                />

                {/* Attachment Button */}
                <Plus 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-zinc-400 md:size-11 absolute md:right-5 left-3 cursor-pointer md:p-1.5 hover:bg-zinc-700 md:rounded-full transition-all duration-300"
                />

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                
                {/* Send Button */}
                <IconSend2
                  onClick={() => handleSendMessage()}
                  className="text-[#8375FE] md:size-8 absolute md:right-5 right-2 cursor-pointer"
                />

                {/* Emoji Picker Toggle */}
                <div 
                  ref={emojiPickerRef} 
                  className="flex items-center" 
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <IconMoodEdit className="text-zinc-400 md:size-11 absolute md:left-14 left-10 cursor-pointer md:p-1.5 hover:bg-zinc-700 md:rounded-full transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-[5vw] left-[1vw] z-50"
              >
                <Picker
                  data={data}
                  theme="dark"
                  onEmojiSelect={(emoji: any) => {
                    setMessage((prev) => prev + emoji.native);
                    inputRef.current?.focus();
                  }}
                  previewPosition="none"
                  emojiSize={22}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default Message;