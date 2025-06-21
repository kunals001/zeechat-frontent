"use client";
import {
  IconCompass,
  IconCompassFilled,
  IconMessage,
  IconMessageFilled,
  IconUsersGroup
} from "@tabler/icons-react";
import  Link  from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const NavigationBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "chats";

  const {user} = useAppSelector(state => state.auth);

  const items = [
    {
      tab: "chats",
      filledIcon: <IconMessageFilled className="text-zinc-200 md:size-7" />,
      outlineIcon: <IconMessage className="text-zinc-200 md:size-7" />,
    },
    {
      tab: "groups",
      filledIcon: (
        <IconUsersGroup stroke={3} className="text-zinc-200 md:size-7" />
      ),
      outlineIcon: (
        <IconUsersGroup stroke={2} className="text-zinc-200 md:size-7" />
      ),
    },
    {
      tab: "explore",
      filledIcon: (
        <IconCompassFilled className="text-zinc-200 md:size-7" />
      ),
      outlineIcon: (
        <IconCompass className="text-zinc-200 md:size-7" />
      ),
    },
  ];

  return (
    
    <div className={`md:w-[4vw] md:h-[calc(100vh-7vw)] bg-[#111111df] md:rounded-l-lg md:flex flex-col items-center justify-between md:py-[1vh] relative hidden `}>
      <div className="flex md:flex-col md:gap-[.2vh] flex-row gap-[5vh]">
        {items.map((item) => {
          const isSelected = currentTab === item.tab;

          return (
            <div
              key={item.tab}
              onClick={() => router.push(`/?tab=${item.tab}`)}
              className={`md:p-[.5vw] md:rounded-lg cursor-pointer hover:bg-zinc-800 transition-all duration-300 ${
                isSelected ? "bg-zinc-800" : ""
              } `}
            >
              {isSelected ? item.filledIcon : item.outlineIcon}
            </div>
          );
        })}
      </div>

      <div className="items-center justify-center hidden md:flex">
        <Link href="/?tab=profile" className="p-1.5 rounded-full transition-all duration-300 hover:bg-zinc-800">
          {typeof user?.profilePic === "string" && user.profilePic.trim() !== "" ? (
          <Image
              width={100}
              height={100}
              src={user.profilePic}
              alt="user profile"
              className="md:w-[2.1vw] md:h-[2.1vw] rounded-full object-cover border-2 border-zinc-800 cursor-pointer"
            />
          ) : null}
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
