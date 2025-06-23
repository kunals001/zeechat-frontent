import React from 'react'
import PanelButton from '../../Layouts/PanelButton'
import { BrushCleaning, CircleX } from 'lucide-react';
import { IconStar,IconInfoSquareRounded, IconBellOff,IconPin, IconTrash } from '@tabler/icons-react';

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearChatForMeAsync } from "@/redux/slice/conversationSlice";
import { clearSelectedUser } from "@/redux/slice/conversationSlice";
import { socketRef } from '@/redux/useWebSocket';

const Panel = () => {

  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?._id);

  const selectedUser = useAppSelector((state) => state.conversation.selectedUser);

   const handleClearChat = () => {
  if (!currentUserId || !selectedUser?._id) return;

  // 🧠 First: Backend call (DB clean)
  dispatch(clearChatForMeAsync(selectedUser._id));

  // 🔄 Second: WebSocket emit to self for real-time
  socketRef.current?.send(JSON.stringify({
    type: "clear_chat",
    payload: {
      userId: selectedUser._id, // optional here, mainly for client
    },
  }));
   };



   const handleCloseChat = () => {
     dispatch(clearSelectedUser());
   };
  

  return (
    <div className='w-full h-full md:p-1.5 p-2 flex flex-col'>
      <PanelButton text='User info' col='27272a' Icon={IconInfoSquareRounded} />
      <PanelButton text='Mute notifications' col='27272a' Icon={IconBellOff} />
      <PanelButton text='Add to Favorites' col='27272a' Icon={IconStar} />
      <PanelButton text='Pin to top' col='27272a' Icon={IconPin} />
      <PanelButton onClick={handleCloseChat} text='Close Chat' col='27272a' Icon={CircleX} />

      <div className="w-full h-[1px] bg-zinc-700 my-1"></div>


      <PanelButton onClick={handleClearChat} text='Clear Chat' col='ff00113b' Icon={BrushCleaning} />

      <PanelButton text='Unfollow' col='ff00113b' Icon={IconTrash} />
    </div>
  )
}

export default Panel