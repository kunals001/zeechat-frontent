"use client";
import {
  IconCompass,
  IconCompassFilled,
  IconMessage,
  IconMessageFilled,
  IconUsersGroup,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import { useSearchParams, useRouter } from "next/navigation";

const NavigationBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab") || "chats";

  const items = [
    {
      tab: "chats",
      label: "Chats",
      filledIcon: <IconMessageFilled className="text-zinc-200 md:size-7" />,
      outlineIcon: <IconMessage className="text-zinc-200 md:size-7" />,
    },
    {
      tab: "groups",
      label: "Groups",
      filledIcon: (
        <IconUsersGroup stroke={3} className="text-zinc-200 md:size-7" />
      ),
      outlineIcon: (
        <IconUsersGroup stroke={2} className="text-zinc-200 md:size-7" />
      ),
    },
    {
      tab: "explore",
      label: "Explore",
      filledIcon: <IconCompassFilled className="text-zinc-200 md:size-7" />,
      outlineIcon: <IconCompass className="text-zinc-200 md:size-7" />,
    },
    {
      tab: "profile",
      label: "Profile",
      filledIcon: <IconUserFilled className="text-zinc-200 md:size-7" />,
      outlineIcon: <IconUser className="text-zinc-200 md:size-7" />,
    },
  ];

  return (
    <div className="bg-[#111111df] w-full h-[8.5vh] md:hidden flex items-center justify-center px-[4vh]">
      <div className="flex flex-row items-center justify-center gap-[4vh]">
        {items.map((item) => {
          const isSelected = currentTab === item.tab;
          return (
            <div key={item.tab} className="flex flex-col items-center">
              <div
                onClick={() => router.push(`/?tab=${item.tab}`)}
                className={`cursor-pointer px-[1.4vh] py-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.83, 0, 0.17, 1)] ${
                  isSelected
                    ? "bg-[#AA8BF7]"
                    : ""
                }`}
              >
                {isSelected ? item.filledIcon : item.outlineIcon}
              </div>
              <span className="text-[1.5vh] text-zinc-300 font-[500] tracking-wide">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
