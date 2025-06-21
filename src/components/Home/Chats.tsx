"use client";
import React from 'react'
import { IconSquareRoundedPlus} from '@tabler/icons-react';
import { Search } from 'lucide-react';
import "@/app/globals.css"
import ChatList from './ChatList';
import { useAppSelector } from '@/redux/hooks';
import Message from './Message';

const Chats = () => {

  const { selectedUser } = useAppSelector((state) => state.conversation);

  return (
    <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] w-full h-[calc(100vh-6vh)] overflow-y-scroll text-white bg-[#181818f5] hide-scrollbar border-r border-zinc-800'>
      <div className="w-full sticky md:top-0 -top-[.2vh] bg-[#181818f5] backdrop-blur-2xl z-10 md:p-[1vw] p-2 ">
        <div className="w-full text-zinc-200  flex items-center justify-between px-1 md:px-0">
          <h2 className='md:text-[1.5vw] text-[3vh] font-prime font-semibold select-none'>Chats</h2>

          <div className='md:p-[.5vw] md:rounded-lg cursor-pointer hover:bg-zinc-800 transition-all duration-300'>
            <IconSquareRoundedPlus className={ `text-zinc-200 size-7`}/>
          </div>
        </div>

        <div className="md:mt-[1vw] flex items-center relative mt-[1.5vh]">
          <input type="text" placeholder='Search...' className='w-full md:py-[.5vh] md:rounded-lg bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 md:placeholder:text-md placeholder:text-xl outline-none md:px-[1vw] px-[1vh] md:text-[1vw] text-[2vh] py-[1vh] rounded-lg'/>

          <Search className='text-zinc-500 absolute md:right-3 right-2'/>
        </div>
      </div>

      <div className="px-2 md:px-0 pb-[7vh] md:pb-0 pt-[1.2vh] md:pt-0">
        <ChatList/>
      </div>


        {selectedUser && (
        <div className="fixed inset-0 z-50 bg-zinc-900/50 flex items-center justify-center md:hidden ">
          <Message />
        </div>
      )}
      </div>

  )
}

export default Chats