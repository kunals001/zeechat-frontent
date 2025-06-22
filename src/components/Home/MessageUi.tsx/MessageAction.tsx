"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, Forward, Trash, Copy } from "lucide-react";
import { IconMoodSmile } from "@tabler/icons-react";
import ReactionBox from "./MessageReaction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addReactionToMessageAsync } from "@/redux/slice/conversationSlice";
import { socketRef } from "@/redux/useWebSocket";

interface Message {
  _id: string;
  sender: { _id: string };
  message: string;
  createdAt: string;
  reactions?: { emoji: string; userId: string }[];
}

interface MessageBubbleProps {
  msg: Message;
  isSender: boolean;
  time: string;
  showActions: string | null;
  setShowActions: React.Dispatch<React.SetStateAction<string | null>>;
  chatRef: React.RefObject<HTMLDivElement | null>;
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

  useEffect(() => {
    if (showActions !== msg._id || !iconRef.current || !chatRef.current) return;
    const iconRect = iconRef.current.getBoundingClientRect();
    const chatRect = chatRef.current.getBoundingClientRect();
    const estimatedHeight = 160;
    const spaceBelow = chatRect.bottom - iconRect.bottom;
    const spaceAbove = iconRect.top - chatRect.top;
    setShowAbove(spaceBelow < estimatedHeight && spaceAbove > estimatedHeight);
  }, [showActions, msg._id]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        showActions === msg._id &&
        !actionRef.current?.contains(e.target as Node) &&
        !iconRef.current?.contains(e.target as Node)
      ) {
        setShowActions(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showActions, msg._id]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        showReactBox === msg._id &&
        !reactRef.current?.contains(e.target as Node)
      ) {
        setShowReactBox(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showReactBox, msg._id]);

const handleEmojiReact = (emoji: string) => {
  if (!user) return;
  const existingReaction = msg.reactions?.find(
    (r) => r.userId === user._id
  );

  // ✅ 1. Redux: Reaction update/remove
  dispatch(
    addReactionToMessageAsync({
      messageId: msg._id,
      emoji,
    })
  );

  // ✅ 2. WebSocket: real-time update
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
      className={`relative px-4 py-2 rounded-xl text-md md:text-base break-words whitespace-pre-wrap ${
        isSender ? "bg-[#8375fe] rounded-br-none" : "bg-zinc-800 rounded-bl-none"
      }`}
      style={{
        maxWidth: "75%",
        width: "fit-content",
        overflow: "visible",
      }}
    >
      <div className="flex items-end gap-2 relative">
        <span>{msg.message}</span>
        <span className="text-[0.65rem] text-zinc-200 opacity-70 whitespace-nowrap select-none">
          {time}
        </span>

        {/* Dropdown trigger */}
        <div ref={iconRef} className="relative">
          <ChevronDown
            className={`hidden text-zinc-400 md:group-hover:block transition-all duration-300 size-5 cursor-pointer ${
              showActions === msg._id || showReactBox === msg._id ? "block" : ""
            }`}
            onClick={() =>
              setShowActions((prev) => (prev === msg._id ? null : msg._id))
            }
          />
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
              {[
                { icon: <Forward size={16} />, label: "Forward" },
                { icon: <Trash size={16} />, label: "Delete" },
                { icon: <Copy size={16} />, label: "Copy" },
                {
                  icon: <IconMoodSmile size={16} />,
                  label: "React",
                  onClick: () => {
                    setShowActions(null);
                    setShowReactBox(msg._id);
                  },
                },
              ].map((item, i) => (
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

      {/* ✅ Reaction bubble */}
      { msg.reactions && msg.reactions?.length > 0 && (
        <div
          className={`absolute -bottom-3 ${
            isSender ? "right-3" : "left-3"
          } flex gap-1 bg-zinc-700 border border-zinc-600 px-2 py-[2px] rounded-full shadow-sm`}
        >
          {msg.reactions.map((reaction, index) => (
            <span
              key={index}
              className="text-white text-sm select-none leading-none"
            >
              {reaction.emoji}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Emoji Picker */}
    {!isSender && (
      <div ref={emojiIconRef} className="hidden md:block cursor-pointer relative">
        <IconMoodSmile
          className={`text-zinc-400 transition-all duration-300 ${
            showReactBox === msg._id ? "block" : "md:hidden group-hover:block"
          }`}
          onClick={() =>
            setShowReactBox((prev) => (prev === msg._id ? null : msg._id))
          }
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
