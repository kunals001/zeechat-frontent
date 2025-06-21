import React from 'react'
import PanelButton from '../Layouts/PanelButton'
import { BrushCleaning, CircleX } from 'lucide-react';
import { IconStar,IconInfoSquareRounded, IconBellOff,IconPin, IconTrash } from '@tabler/icons-react';

const Panel = () => {
  return (
    <div className='w-full h-full md:p-1.5 p-2 flex flex-col'>
      <PanelButton text='User info' col='27272a' Icon={IconInfoSquareRounded} />
      <PanelButton text='Mute notifications' col='27272a' Icon={IconBellOff} />
      <PanelButton text='Add to Favorites' col='27272a' Icon={IconStar} />
      <PanelButton text='Pin to top' col='27272a' Icon={IconPin} />
      <PanelButton text='Close Chat' col='27272a' Icon={CircleX} />

      <div className="w-full h-[1px] bg-zinc-700 my-1"></div>


      <PanelButton text='Clear Chat' col='ff00113b' Icon={BrushCleaning} />
      <PanelButton text='Unfollow' col='ff00113b' Icon={IconTrash} />
    </div>
  )
}

export default Panel