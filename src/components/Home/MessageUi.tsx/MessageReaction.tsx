"use client";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import type { Emoji } from 'emoji-mart';


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

  // ✅ Added selectedEmoji state
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        !boxRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose,anchorRef]);

  useEffect(() => {
    if (!showEmojiPicker) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!emojiPickerRef.current?.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showEmojiPicker]);

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
  }, [showEmojiPicker,anchorRef,chatRef]);

  return (
    <div
      ref={boxRef}
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute z-[999] left-full -top-3 ml-2 origin-left md:px-[.5vw] md:py-[.3vw] rounded-full bg-zinc-800 flex items-center transition-all duration-400 ease-in-out animate-wave-pop"
    >
      {[...emojis, "plus"].map((emoji, index) => (
        <div key={index} className="flex items-center">
          {emoji === "plus" ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(prev => !prev);
              }}
              className="p-1 bg-zinc-700 hover:bg-zinc-600 transition duration-200 rounded-full cursor-pointer md:ml-1"
            >
              <Plus className="text-zinc-400 md:size-8" />
            </div>
          ) : (
            <button
              onClick={() => {
                setSelectedEmoji(emoji); // ✅ set selected emoji
                onSelect(emoji);
              }}
              className={`md:text-[1.3vw] rounded-full transition duration-200 md:px-2 md:py-1 md:ml-1 hover:bg-zinc-600 ${
                selectedEmoji === emoji ? "bg-zinc-700" : ""
              }`} // ✅ apply bg-zinc-800 if selected
            >
              {emoji}
            </button>
          )}
        </div>
      ))}

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className={`absolute z-[999] ${showAbove ? "bottom-full mb-2" : "top-full mt-2"} left-1 scale-90 origin-top-left transition-all duration-300`}
        >
          <div className="h-[230px] overflow-y-scroll hide-scrollbar rounded-lg bg-zinc-900 ">
            <Picker
              data={data}
              theme="dark"
              onEmojiSelect={(emoji: Emoji) => {
                if ('native' in emoji && typeof emoji.native === 'string') {
                  onSelect(emoji.native);
                  setSelectedEmoji(emoji.native);
                  setShowEmojiPicker(false);
                }
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
