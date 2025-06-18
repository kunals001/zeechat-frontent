import React from 'react'
import { Search } from 'lucide-react';
import "@/app/globals.css"

const Chats = () => {
  return (
    <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] w-full h-[calc(100vh-6vh)] overflow-y-scroll text-white bg-[#181818f5] hide-scrollbar border-r border-zinc-800'>
      <div className="w-full sticky md:top-0 -top-[.2vh] bg-[#181818f5] backdrop-blur-2xl z-10 md:p-[1vw] p-2 ">
        <div className="w-full text-zinc-200">
          <h2 className='md:text-[1.5vw] text-[3vh] font-prime font-semibold select-none'>Groups</h2>
        </div>

        <div className="md:mt-[1vw] flex items-center relative mt-[1.5vh]">
          <input type="text" placeholder='Search...' className='w-full md:py-[.5vh] md:rounded-lg bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 md:placeholder:text-md placeholder:text-xl outline-none md:px-[1vw] px-[1vh] md:text-[1vw] text-[2vh] py-[1vh] rounded-lg'/>

          <Search className='text-zinc-500 absolute md:right-3 right-2'/>
        </div>
      </div>

      <div className="">
      </div>
    </div>
  )
}

export default Chats