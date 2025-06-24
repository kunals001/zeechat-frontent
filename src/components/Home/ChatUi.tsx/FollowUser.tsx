"use client";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectUser,
  fetchConversations,
} from "@/redux/slice/conversationSlice";
import type { User } from "@/redux/type";

// Time formatting utility
const formatLastMessageTime = (dateString: string | null): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (diffMinutes < 2880) return "yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

const FollowUser = () => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.conversation.selectedUser);
  const followUsers = useAppSelector((state) => state.conversation.conversations);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="w-full">
      {(followUsers || []).map((user) => {
        const isSelected = selectedUser?._id === user._id;

        // Optional: Convert to full `User` if needed
        const userPayload: User = {
          ...user,
      email: "",
      gender: "other",
      bio: "",
      followers: [],
      following: [],
      followRequests: [],
      groups: [],
      isVerified: false,
      isOnline: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
        };

        return (
          <div key={user._id} className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => dispatch(selectUser(userPayload))}
              className={`group friend w-full md:px-[1vh] rounded-lg flex md:gap-[.9vw] px-[1.3vh] cursor-pointer transition-all duration-100 gap-[1vh] 
                ${isSelected ? "md:bg-zinc-800" : "hover:bg-zinc-800"}
              `}
            >
              {/* Profile Image */}
              <div className="flex items-center justify-center md:p-2 p-1">
                <div className="relative md:w-[3.2vw] md:h-[3.2vw] w-[6vh] h-[6vh] rounded-full overflow-hidden">
                  <Image
                    src={
                      user?.profilePic?.trim()
                        ? user.profilePic
                        : "/default-profile.png"
                    }
                    alt={`${user.fullName} profile`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 4vh, 3.2vw"
                  />
                </div>
              </div>

              {/* Name + Last Message */}
              <div className="w-full flex items-center justify-between md:py-[.5vh]">
                <div className="flex flex-col md:gap-[.4vh] gap-[.5vh]">
                  <h3 className="md:text-[.9vw] font-second text-zinc-200 text-[2vh]">
                    {user.fullName}
                  </h3>
                  <p className="md:text-[.7vw] text-zinc-400 font-second leading-none text-[1.2vh] truncate max-w-[25vw]">
                    {user.lastMessage?.trim()
                      ? user.lastMessage
                      : `@${user.userName}`}
                  </p>
                </div>

                {/* Time */}
                <div className="flex flex-col items-end justify-between h-full md:py-[.5vh] py-[.5vh]">
                  <span className="md:text-[.7vw] text-zinc-400 leading-none md:pt-[.7vh] text-[1.3vh] pt-[1vh] select-none">
                    {formatLastMessageTime(user.lastMessageAt)}
                  </span>
                  <ChevronDown className="text-zinc-400 hidden group-hover:block" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FollowUser;
