import React from 'react'
import { IconMessagePlus } from '@tabler/icons-react';

const NoChatSelected = () => {
  return (
    <div className='md:w-[calc(100vw-54vw)] md:h-[calc(100vh-7vw)] flex flex-col items-center justify-center w-full bg-[#171717]'>
        <IconMessagePlus className='text-zinc-300 text-[4vh] md:size-[20vw]'/>
        <h2 className='text-prime text-[3vh] md:text-[1.5vw] font-second'>Select a chat to start messaging</h2>
    </div>
  )
}

export default NoChatSelected