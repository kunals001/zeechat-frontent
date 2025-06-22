"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IconSend2, IconMoodEdit,} from "@tabler/icons-react";
import { EllipsisVertical,Plus } from "lucide-react";
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


  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [openPanel, setOpenPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);


  // ---- handel emoji outside click -----

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // If emoji picker exists and click is outside
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  };

  if (showEmojiPicker) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, [showEmojiPicker]);


  // ---- handel Open Panel outside click -----

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      setOpenPanel(false);
    }
  };

  if (openPanel) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, [openPanel]);



   // ---- handel User typing online -----
  const dispatch = useAppDispatch();
  const { selectedUser, messages, typingUserIds, onlineUsers, lastSeenMap } = useAppSelector(
    (state) => state.conversation
  );
  const { user } = useAppSelector((state) => state.auth);

  const [message, setMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);



  const isTyping = !!(
    selectedUser &&
    Array.isArray(typingUserIds) &&
    typingUserIds.includes(selectedUser._id)
  );
  const isOnline = !!(
    selectedUser &&
    onlineUsers &&
    onlineUsers[selectedUser._id]
  );
  const lastSeen = selectedUser && lastSeenMap ? lastSeenMap[selectedUser._id] ?? null : null;


  const groupedMessages: { [date: string]: typeof messages } = {};
  messages.forEach((msg) => {
    const dateLabel = formatChatDate(msg.createdAt);
    if (!groupedMessages[dateLabel]) groupedMessages[dateLabel] = [];
    groupedMessages[dateLabel].push(msg);
  });



  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);



  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ Typing Event
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

  // ✅ WebSocket Listener
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
            dispatch(
              updateLastSeen({ userId: payload.userId, lastSeen: new Date().toISOString() })
            );
            break;

          default:
            break;
        }
      } catch (err) {
        console.error("WebSocket JSON error", err);
      }
    };

    socketRef.current.addEventListener("message", handleMessage);
    return () => {
      socketRef.current?.removeEventListener("message", handleMessage);
    };
  }, [selectedUser, dispatch]);


   // ---- handel User Message -----

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    dispatch(sendMessage({ userId: selectedUser._id, message, type: "text" }));
    setMessage("");
  };


   // ---- handel User Last Scene -----
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
  return `Last seen ${date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} at ${timeString}`;
  }

  return (
    <div className="md:w-[calc(100vw-54vw)] md:h-[calc(100vh-7vw)] md:rounded-r-lg text-white overflow-hidden relative w-full h-screen">
      {selectedUser ? (
        <div>
          <Image
            width={800}
            height={800}
            src="https://zeechat-kunal-singh-2025.s3.ap-south-1.amazonaws.com/uploads/theme.avif"
            alt="message theme"
            className="w-full h-screen object-cover relative"
            priority
          />
          <div className="absolute w-full h-full bg-[rgba(0,0,0,0.68)] top-0 flex flex-col">


            {/* Header */}
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
                <div onClick={() => setOpenPanel(prev => !prev)} className={`text-zinc-400 cursor-pointer md:p-1 p-1.5 rounded-full  md:rounded-lg ${openPanel ? "bg-zinc-800" : "hover:bg-zinc-800"}`}>
                  <EllipsisVertical className="md:size-8 size-6" />
                </div>

                <div ref={panelRef} className={`transform transition-all duration-300 origin-top-right ${openPanel ? "scale-100" : "scale-0"} absolute top-[6vh] right-[1.5vh] md:top-[3.1vw] md:right-[2vw] ease-[cubic-bezier(0.4, 0, 0.2, 1)] overflow-hidden rounded-lg z-40 bg-zinc-900`}>
                  <Panel/>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div ref={chatRef} className="chat w-full h-[calc(100%-16vh)] px-[2vw] py-[1vw] overflow-y-scroll hide-scrollbar flex flex-col gap-2">
              {Object.entries(groupedMessages).map(([date, msgs,]) => (
                <div key={date}>
                  <div className="w-full flex justify-center my-4">
                    <div className="text-sm text-zinc-200 bg-zinc-700 px-3 py-1 rounded-md">{date}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[...new Set(msgs.map((m) => m._id))].map((id, index) => {
                      const msg = msgs.find((m) => m._id === id);
                      if (!msg) return null;
                      const isSender = msg.sender._id === user?._id;
                      const time = new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <MessageBubble
                          chatRef={chatRef}
                          key={msg._id}
                          msg={msg}
                          isSender={isSender}
                          time={time}
                          showActions={showActions}
                          setShowActions={setShowActions}
                        />
                      );
                    })}

                    {isTyping && (
                      <div className="self-start bg-zinc-800 rounded-bl-none rounded-xl px-4 py-2 text-sm text-zinc-200 max-w-[75%] w-fit animate-pulse">
                        <div className="flex gap-1 items-center">
                          <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:.1s]" />
                          <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:.2s]" />
                          <div className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:.3s]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="w-full md:h-[4vw] h-[7.5vh] flex items-center justify-center bg-[#141414] absolute bottom-0 px-[1vh] md:px-[1vw]">
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full md:h-[3vw] bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 md:pr-[4vw] md:pl-[6vw] pl-[8vh] pr-[4vh] md:py-[1vh] py-[1.2vh] rounded-lg outline-none "
                />

                <Plus className="text-zinc-400 md:size-11 absolute md:right-5 left-3 cursor-pointer md:p-1.5 hover:bg-zinc-700 md:rounded-full transition-all duration-300"/>
                
                <IconSend2 onClick={handleSendMessage} className="text-[#8375FE] md:size-8 absolute md:right-5 right-2  cursor-pointer" />

                <div ref={emojiPickerRef} className="flex items-center" onClick={() => setShowEmojiPicker((prev) => !prev)}><IconMoodEdit className="text-zinc-400 md:size-11 absolute md:left-14 left-10 cursor-pointer md:p-1.5 hover:bg-zinc-700 md:rounded-full transition-all duration-300" /></div>
              </div>
            </div>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-[5vw] left-[1vw] z-50"
              >
                <Picker
                  data={data}
                  theme="dark"
                  onEmojiSelect={(emoji: any) => {
                    setMessage((prev) => prev + emoji.native); // ✅ insert emoji
                    inputRef.current?.focus(); // ✅ focus back to input
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