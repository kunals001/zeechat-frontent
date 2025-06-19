"use client";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import React from "react";
import type { User } from "@/redux/type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUser } from "@/redux/slice/conversationSlice";

const FollowUser = ({ followUsers }: { followUsers: User[] }) => {
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector((state) => state.conversation.selectedUser);

  return (
    <div className="w-full">
      {followUsers.map((user) => {
        const isSelected = selectedUser?._id === user._id;

        return (
          <div
            key={user._id}
            role="button"
            tabIndex={0}
            onClick={() => dispatch(selectUser(user))}
            className={`friend w-full md:px-[1vh] flex md:gap-[.9vw] px-[1.3vh] cursor-pointer transition-all duration-100 gap-[1vh] 
              ${isSelected ? "bg-zinc-800" : "hover:bg-zinc-800"}
            `}
          >
            {/* Image container */}
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

            <div className="w-full flex items-center justify-between md:py-[.5vh] border-b border-zinc-700">
              <div className="flex flex-col md:gap-[.4vh] gap-[.5vh]">
                <h3 className="md:text-[.9vw] font-second text-zinc-200 text-[2vh]">
                  {user.fullName}
                </h3>
                <p className="md:text-[.7vw] text-zinc-400 font-second leading-none text-[1.2vh]">
                  @{user.userName}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between h-full md:py-[.5vh] py-[.5vh]">
                <span className="md:text-[.7vw] text-zinc-400 leading-none md:pt-[.7vh] text-[1.3vh] pt-[1vh] select-none">
                  2 hours ago
                </span>
                <ChevronDown className="text-zinc-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FollowUser;
