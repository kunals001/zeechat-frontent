import React from 'react'
import "@/app/globals.css"

const Setting = () => {
  return (
    <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] w-full h-[calc(100vh-6vh)] overflow-y-scroll text-white bg-[#181818f5] hide-scrollbar border-r border-zinc-800'>
      <div className="w-full sticky md:top-0 -top-[.2vh] bg-[#181818f5] backdrop-blur-2xl z-10 md:p-[1vw] p-2 ">
        <div className="w-full text-zinc-200">
          <h2 className='md:text-[1.5vw] text-[3vh] font-prime font-semibold select-none'>Settings</h2>
        </div>
      </div>

      <div className="">
      </div>
    </div>
  )
}

export default Setting