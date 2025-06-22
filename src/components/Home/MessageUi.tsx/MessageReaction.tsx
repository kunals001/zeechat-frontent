"use client";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface ReactionBoxProps {
  onClose: () => void;
  onSelect: (emoji: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  chatRef: React.RefObject<HTMLDivElement | null>;
}

const emojis = ["👍", "❤️", "😂", "🔥"];

export default function ReactionBox({
  onClose,
  onSelect,
  anchorRef,
  chatRef,
}: ReactionBoxProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAbove, setShowAbove] = useState(false);

  // Close reaction box on outside click

// 👇 ReactionBox: Close full box on outside click
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (
      !boxRef.current?.contains(e.target as Node) &&
      !anchorRef.current?.contains(e.target as Node)
    ) {
      onClose();
    }
  };
  document.addEventListener("click", handleClick); // ✅ CHANGED TO CLICK
  return () => document.removeEventListener("click", handleClick);
}, [onClose]);

// 👇 ReactionBox: Close emoji picker popup on outside click
useEffect(() => {
  if (!showEmojiPicker) return;

  const handleClickOutside = (e: MouseEvent) => {
    if (!emojiPickerRef.current?.contains(e.target as Node)) {
      setShowEmojiPicker(false);
    }
  };

  document.addEventListener("click", handleClickOutside); // ✅ CHANGED TO CLICK
  return () => document.removeEventListener("click", handleClickOutside);
}, [showEmojiPicker]);

  // Decide whether to show emoji picker above or below
  useEffect(() => {
    if (
      showEmojiPicker &&
      anchorRef.current &&
      emojiPickerRef.current &&
      chatRef.current
    ) {
      const anchor = anchorRef.current.getBoundingClientRect();
      const chat = chatRef.current.getBoundingClientRect();
      const height = 280;
      setShowAbove(chat.bottom - anchor.bottom < height && anchor.top - chat.top > height);
    }
  }, [showEmojiPicker]);

  return (
    <div
      ref={boxRef}
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute z-[999] left-full -top-3 ml-2 origin-left px-1 py-1 rounded-full bg-zinc-800 flex gap-1"
    >
      {/* Quick emoji buttons */}
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onSelect(emoji)}
          className="p-1 rounded-full hover:bg-zinc-600 transition duration-200"
        >
          {emoji}
        </button>
      ))}

      {/* Plus icon */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // ✅ prevent closing due to outer click
          setShowEmojiPicker(prev => !prev);
        }}
        className="p-1 hover:bg-zinc-600 transition duration-200 rounded-full cursor-pointer"
      >
        <Plus className="text-zinc-400" />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className={`absolute z-[999] ${showAbove ? "bottom-full mb-2" : "top-full mt-2"} left-1 scale-90 origin-top-left transition-all duration-300`}
        >
          <div className=" h-[230px] overflow-y-scroll hide-scrollbar rounded-lg bg-zinc-900 border border-zinc-700">
            <Picker
              data={data}
              theme="dark"
              onEmojiSelect={(emoji: any) => {
                onSelect(emoji.native);
                setShowEmojiPicker(false);
              }}
              previewPosition="none"
              emojiSize={20}
              perLine={7}
            />
          </div>
        </div>
      )}
    </div>
  );
}
