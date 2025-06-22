"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, Forward, Trash, Copy } from "lucide-react";
import { IconMoodSmile } from "@tabler/icons-react";
import ReactionBox from "./MessageReaction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addReactionToMessageAsync } from "@/redux/slice/conversationSlice";
import { socketRef } from "@/redux/useWebSocket";
import type { MessageType } from '@/redux/type';
import Image from "next/image";

interface Message {
  _id: string;
  sender: { _id: string };
  message: string;
  caption?: string;
  createdAt: string;
  reactions?: { emoji: string; userId: string }[];
  type: MessageType;
}

interface MessageBubbleProps {
  msg: Message;
  isSender: boolean;
  time: string;
  showActions: string | null;
  setShowActions: React.Dispatch<React.SetStateAction<string | null>>;
  chatRef: React.RefObject<HTMLDivElement>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  isSender,
  time,
  showActions,
  setShowActions,
  chatRef,
}) => {
  const dispatch = useAppDispatch();
  const { selectedUser } = useAppSelector((state) => state.conversation);
  const { user } = useAppSelector((state) => state.auth);

  const actionRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const emojiIconRef = useRef<HTMLDivElement>(null);
  const reactRef = useRef<HTMLDivElement>(null);

  const [showAbove, setShowAbove] = useState(false);
  const [showReactBox, setShowReactBox] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteType, setDeleteType] = useState<"me" | "everyone">("me");

  useEffect(() => {
    if (showActions !== msg._id || !iconRef.current || !chatRef.current) return;
    const iconRect = iconRef.current.getBoundingClientRect();
    const chatRect = chatRef.current.getBoundingClientRect();
    const estimatedHeight = 160;
    const spaceBelow = chatRect.bottom - iconRect.bottom;
    const spaceAbove = iconRect.top - chatRect.top;
    setShowAbove(spaceBelow < estimatedHeight && spaceAbove > estimatedHeight);
  }, [showActions, msg._id, chatRef]);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (
      showActions === msg._id &&
      !actionRef.current?.contains(e.target as Node) &&
      !iconRef.current?.contains(e.target as Node)
    ) {
      // ✅ prevent closing action if delete popup is open
      if (!showDeletePopup) {
        setShowActions(null);
      }
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [showActions, msg._id, setShowActions, showDeletePopup]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showReactBox === msg._id &&
        !reactRef.current?.contains(e.target as Node)
      ) {
        setShowReactBox(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReactBox, msg._id]);

  const handleEmojiReact = (emoji: string) => {
    if (!user) return;

    dispatch(
      addReactionToMessageAsync({
        messageId: msg._id,
        emoji,
      })
    );

    if (selectedUser?._id) {
      socketRef.current?.send(
        JSON.stringify({
          type: "react_message",
          payload: {
            to: selectedUser._id,
            messageId: msg._id,
            emoji,
          },
        })
      );
    }
  };

  const actionItems = [
    { icon: <Forward size={16} />, label: "Forward" },
    {
      icon: <Trash size={16} />,
      label: "Delete",
      onClick: () => {
        setShowDeletePopup(true);
        setShowActions(null);
      },
    },
    { icon: <Copy size={16} />, label: "Copy" },
    {
      icon: <IconMoodSmile size={16} />,
      label: "React",
      onClick: () => {
        setShowActions(null);
        setShowActions(null);
        setShowReactBox(msg._id);
      },
    },
  ];

  return (
    <div
      className={`w-full relative group flex gap-2 items-center ${
        isSender ? "justify-end" : "justify-start"
      }`}
      style={{
        marginBottom: msg.reactions?.length ? "1.5rem" : undefined,
      }}
    >
      <div
        className={`relative rounded-xl text-md md:text-base break-words whitespace-pre-wrap ${
          isSender ? "bg-[#7667ff] rounded-br-none" : "bg-zinc-800 rounded-bl-none"
        } ${msg.type === "image" || msg.type === "video" ? "p-2" : "px-4 py-2"}`}
        style={{
          maxWidth: "75%",
          width: "fit-content",
          overflow: "visible",
        }}
      >
        <div className="flex items-end gap-2 relative">
          {msg.type === "text" && (
            <>
              <span>{msg.message}</span>
              <span className="text-[0.65rem] text-zinc-100 opacity-80 whitespace-nowrap select-none">
                {time}
              </span>
            </>
          )}

          {msg.type === "image" && (
            <div className="flex flex-col">
              <img
                src={msg.message}
                alt="sent"
                className="max-w-[300px] rounded-lg object-cover"
              />
              {msg.caption && (
                <span className="text-md text-zinc-100 mt-1 break-words">{msg.caption}</span>
              )}
              <span className="text-[0.65rem] text-zinc-100 opacity-70 mt-1 self-end select-none">
                {time}
              </span>
            </div>
          )}

          {msg.type === "video" && (
            <div className="flex flex-col">
              <video
                src={msg.message}
                controls
                className="max-w-[300px] rounded-lg"
              />
              {msg.caption && (
                <span className="text-md text-zinc-100 mt-1 break-words">{msg.caption}</span>
              )}
              <span className="text-[0.65rem] text-zinc-100 opacity-70 mt-1 self-end select-none">
                {time}
              </span>
            </div>
          )}

          <div 
            ref={iconRef} 
            className={`absolute bottom-0 cursor-pointer z-60 ${
              isSender 
                ? "bg-gradient-to-b from-[#7667ff] to-transparent" 
                : "bg-gradient-to-b from-zinc-800 to-transparent"
            } ${msg.type === "image" || msg.type === "video" ? "-right-0" : "-right-2"}`}
          >
            <ChevronDown
              className={`hidden text-zinc-300 md:group-hover:block transition-all duration-300 size-5 cursor-pointer ${
                showActions === msg._id || showReactBox === msg._id ? "block" : ""
              }`}
              onClick={() => setShowActions((prev) => (prev === msg._id ? null : msg._id))}
            />

            {/* Action Menu */}
            {showActions === msg._id && (
              <div
                ref={actionRef}
                className={`absolute z-50 shadow-md ${
                  isSender
                    ? showAbove
                      ? "bottom-full right-0 origin-bottom-right mb-2"
                      : "top-full right-0 origin-top-right mt-2"
                    : showAbove
                    ? "bottom-full left-0 origin-bottom-left mb-2"
                    : "top-full left-0 origin-top-left mt-2"
                } bg-zinc-900 border border-zinc-700 p-1 rounded-lg flex flex-col w-36 transition-transform duration-200`}
              >
                {actionItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-2 py-1 text-md text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer"
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>


        {showDeletePopup && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
      <div className="text-white font-semibold text-lg mb-4">Delete Message</div>

      <div className="flex flex-col gap-3 mb-6">
        <label className="flex items-center gap-2 text-zinc-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={deleteType === "me"}
            onChange={() => setDeleteType("me")}
          />
          Delete for me
        </label>

        <label className="flex items-center gap-2 text-zinc-300 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={deleteType === "everyone"}
            onChange={() => setDeleteType("everyone")}
          />
          Delete for everyone
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowDeletePopup(false)}
          className="px-4 py-2 text-sm bg-zinc-700 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            socketRef.current?.send(
              JSON.stringify({
                type: "delete_message",
                payload: {
                  messageId: msg._id,
                  to: selectedUser?._id,
                  deleteType,
                },
              })
            );
            setShowDeletePopup(false);
          }}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


        {msg.reactions && msg.reactions.length > 0 && (
          <div
            className={`absolute -bottom-3 ${
              isSender ? "right-3" : "left-3"
            } flex gap-1 bg-zinc-700 border border-zinc-600 px-2 py-[2px] rounded-full shadow-sm`}
          >
            {msg.reactions.map((reaction, index) => (
              <span key={index} className="text-white text-sm select-none leading-none">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {!isSender && (
        <div ref={emojiIconRef} className="hidden md:block cursor-pointer relative">
          <IconMoodSmile
            className={`text-zinc-400 transition-all duration-300 ${
              showReactBox === msg._id ? "block" : "md:hidden group-hover:block"
            }`}
            onClick={() => setShowReactBox((prev) => (prev === msg._id ? null : msg._id))}
          />
          {showReactBox === msg._id && (
            <div ref={reactRef}>
              <ReactionBox
                chatRef={chatRef}
                anchorRef={emojiIconRef}
                onClose={() => setShowReactBox(null)}
                onSelect={handleEmojiReact}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
