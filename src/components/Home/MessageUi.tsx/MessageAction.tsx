"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, Forward, Trash, Copy } from "lucide-react";
import { IconMoodSmile } from "@tabler/icons-react";
import ReactionBox from "./MessageReaction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addReactionToMessageAsync, deleteMessageAsync } from "@/redux/slice/conversationSlice";
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
  deletedFor?: string[];
  isDeleted?: boolean;
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
  const smileyRef = useRef<HTMLDivElement>(null);

  const [showAbove, setShowAbove] = useState(false);
  const [showReactBox, setShowReactBox] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteType, setDeleteType] = useState<"me" | "everyone">("me");
  const [lastReactionKey, setLastReactionKey] = useState<string | null>(null);

  // ✅ Flag to check if message was deleted for UI
  const isDeleted = msg.message === "This message was deleted." || msg.isDeleted;

  // ✅ Calculate placement for action menu
  useEffect(() => {
    if (showActions !== msg._id || !iconRef.current || !chatRef.current) return;
    const iconRect = iconRef.current.getBoundingClientRect();
    const chatRect = chatRef.current.getBoundingClientRect();
    const estimatedHeight = 160;
    const spaceBelow = chatRect.bottom - iconRect.bottom;
    const spaceAbove = iconRect.top - chatRect.top;
    setShowAbove(spaceBelow < estimatedHeight && spaceAbove > estimatedHeight);
  }, [showActions, msg._id, chatRef]);

  // ✅ Hide actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showActions === msg._id &&
        !actionRef.current?.contains(e.target as Node) &&
        !iconRef.current?.contains(e.target as Node) &&
        !showDeletePopup
      ) {
        setShowActions(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActions, msg._id, showDeletePopup]);

  // ✅ Hide reaction box when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showReactBox === msg._id &&
        !reactRef.current?.contains(e.target as Node) &&
        smileyRef.current &&
        !smileyRef.current.contains(e.target as Node)
      ) {
        setShowReactBox(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showReactBox, msg._id]);

  // ✅ Emoji reaction handler
  const handleEmojiReact = (emoji: string) => {
    if (!user || isDeleted) return;
    const key = `${emoji}-${user._id}`;
    setLastReactionKey(key);

    dispatch(addReactionToMessageAsync({ messageId: msg._id, emoji }));
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

    // ✅ Close the emoji box after reacting
    setShowReactBox(null);
  };

  useEffect(() => {
    if (lastReactionKey) {
      const timeout = setTimeout(() => setLastReactionKey(null), 400);
      return () => clearTimeout(timeout);
    }
  }, [lastReactionKey]);

  // ✅ Actions in dropdown
  const actionItems = [
    { icon: <Forward className="md:size-5" />, label: "Forward", disabled: isDeleted },
    {
      icon: <IconMoodSmile className="md:size-5" />,
      label: "React",
      onClick: () => {
        setShowActions(null);
        setShowReactBox(msg._id);
      },
      disabled: isDeleted
    },
    { icon: <Copy className="md:size-5" />, label: "Copy", disabled: isDeleted },
    {
      icon: <Trash className="md:size-5" />,
      label: "Delete",
      onClick: () => {
        setShowDeletePopup(true);
        setShowActions(null);
      },
    },
  ];

  return (
    <div
      className={`w-full relative group flex gap-2 items-center ${
        isSender ? "justify-end" : "justify-start"
      } animate-wave-in`}
      style={{
        marginBottom: msg.reactions?.length ? "1.5rem" : undefined,
      }}
    >
      <div
        className={`relative rounded-xl text-md md:text-base break-words whitespace-pre-wrap ${
          isSender ? "bg-[#7667ff] rounded-br-none" : "bg-zinc-800 rounded-bl-none"
        } ${msg.type === "image" || msg.type === "video" ? "p-2" : "px-4 py-2"}`}
        style={{ maxWidth: "75%", width: "fit-content", overflow: "visible" }}
      >
        <div className="flex items-end gap-2 relative">
          {/* ✅ TEXT MESSAGE (Handle deleted) */}
          {msg.type === "text" && (
            <>
              {isDeleted ? (
                <span className="text-md text-zinc-100 break-words">
                  This message was deleted.
                </span>
              ) : (
                <span className="text-md text-zinc-100 break-words">
                  {msg.message}
                </span>
              )}
              <span className="text-[0.65rem] text-zinc-100 opacity-80 whitespace-nowrap select-none">
                {time}
              </span>
            </>
          )}

          {/* ✅ IMAGE MESSAGE */}
          {msg.type === "image" && (
            <div className="flex flex-col">
              <Image
                src={msg.message}
                alt="sent"
                className="max-w-[300px] rounded-lg object-cover"
                width={800}
                height={800}
                priority
              />
              {msg.caption && (
                <span className="text-md text-zinc-100 mt-1 break-words">{msg.caption}</span>
              )}
              <span className="text-[0.65rem] text-zinc-100 opacity-70 mt-1 self-end select-none">
                {time}
              </span>
            </div>
          )}

          {/* ✅ VIDEO MESSAGE */}
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

          {/* ✅ ACTION DROPDOWN */}
          {(isSender || !isSender || isDeleted) && (
            <div
              ref={iconRef}
              className={`absolute bottom-0 cursor-pointer z-60 ${
                isSender
                  ? "bg-gradient-to-b from-[#7667ff] to-transparent"
                  : "bg-gradient-to-b from-zinc-800 to-transparent"
              } ${msg.type === "image" || msg.type === "video" ? "-right-0" : "-right-2"}`}
            >
              <ChevronDown
                className={`hidden text-zinc-300 size-5 cursor-pointer transition-all duration-300 ${
                  showActions === msg._id || showReactBox === msg._id ? "md:block" : "md:group-hover:block"
                }`}
                onClick={() => setShowActions((prev) => (prev === msg._id ? null : msg._id))}
              />

              {/* Action Menu */}
              {showActions === msg._id && (
                <div
                  ref={actionRef}
                  className={`absolute z-50 ${
                    isSender
                      ? showAbove
                        ? "bottom-full right-0 origin-bottom-right mb-2"
                        : "top-full right-0 origin-top-right mt-2"
                      : showAbove
                      ? "bottom-full left-0 origin-bottom-left mb-2"
                      : "top-full left-0 origin-top-left mt-2"
                  } bg-zinc-900 p-2 rounded-lg flex flex-col w-36 transition-transform duration-200`}
                >
                  {actionItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={`flex items-center gap-2 px-2 py-1 font-[500] text-md ${
                        item.disabled ? 'text-zinc-500 cursor-not-allowed' : 'text-zinc-300 hover:bg-zinc-800 cursor-pointer'
                      } rounded-md`}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ✅ DELETE POPUP */}
        {showDeletePopup && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/40">
            <div className="bg-zinc-900 p-6 rounded-xl shadow-2xl w-[90%] max-w-md">
              <div className="text-white font-semibold text-lg mb-4 text-center">Delete Message</div>
              <div className="text-zinc-300 text-sm mb-4 text-center">
                Are you sure you want to delete this message?
              </div>
              {!isDeleted && (
                <div className="flex flex-col gap-1 mb-6 ml-[3vw]">
                  <label className="flex items-center gap-2 text-zinc-300 text-md cursor-pointer font-[400]">
                    <input
                      type="checkbox"
                      checked={deleteType === "me"}
                      onChange={() => setDeleteType("me")}
                      className="cursor-pointer size-4"
                    />
                    Delete for me
                  </label>
                  <label className={`flex items-center gap-2 text-zinc-300 text-md cursor-pointer font-[400] ${!isSender ? "hidden" : ""}`}>
                    <input
                      type="checkbox"
                      checked={deleteType === "everyone"}
                      onChange={() => setDeleteType("everyone")}
                      className="cursor-pointer size-4"
                    />
                    Delete for everyone
                  </label>
                </div>
              )}
              <div className="flex items-center justify-between md:px-[2vw]">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className="px-4 py-2 text-lg bg-[#49494955] font-[500] cursor-pointer text-white rounded-full hover:bg-[#4d4d4d84] transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const wsPayload = {
                      type: "delete_message",
                      payload: {
                        messageId: msg._id,
                        to: selectedUser?._id,
                        type: isDeleted ? "for_me" : deleteType === "everyone" ? "for_everyone" : "me",
                      },
                    };
                    socketRef.current?.send(JSON.stringify(wsPayload));

                    const typeForAPI = isDeleted ? "for_me" : deleteType === "everyone" ? "for_everyone" : "for_me";
                    dispatch(deleteMessageAsync({ messageId: msg._id, type: typeForAPI }));

                    setShowDeletePopup(false);
                  }}
                  className="px-4 py-2 text-lg bg-[#f0060655] font-[500] cursor-pointer text-white rounded-full hover:bg-[#f0060684] transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {msg.reactions && msg.reactions.length > 0 && (
          <div
            className={`absolute ${
              isSender ? "right-3" : "left-3"
            } flex gap-1 px-1.5 py-[2px] rounded-full bg-zinc-700 transition-all duration-300 ease-[cubic-bezier(0.76, 0, 0.24, 1)] ${
              msg.reactions ? "opacity-100 -bottom-3.5" : "opacity-0 bottom-2"
            }`}
          >
            {msg.reactions.map((reaction, index) => {
              const reactionKey = `${reaction.emoji}-${reaction.userId}`;
              const isUserReacted = reaction.userId === user?._id;

              return (
                <span
                  key={index}
                  className={`text-white md:text-[1vw] select-none leading-none rounded-full ${
                    reactionKey === lastReactionKey ? "animate-reaction-pop" : ""
                  } ${isUserReacted ? "bg-zinc-700" : ""}`}
                >
                  {reaction.emoji}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ EMOJI ICON (hide if deleted) */}
      {!isSender && !isDeleted && (
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