"use client"
import React from 'react'
import "@/app/globals.css"
import { FollowUsers, Logout, Themes, UserProfile } from './Actions'

const Setting = () => {
  return (
    <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] w-full h-[calc(100vh-6vh)] overflow-y-scroll text-white bg-[#181818f5] hide-scrollbar border-r border-zinc-800'>
      <div className="w-full sticky md:top-0 -top-[.2vh] bg-[#181818f5] backdrop-blur-2xl z-10 md:p-[1vw] p-2 ">
        <div className="w-full text-zinc-200">
          <h2 className='md:text-[1.5vw] text-[3vh] font-prime font-semibold select-none'>Settings</h2>
        </div>
      </div>

      <div className="md:px-[1vw] px-1.5">
        <UserProfile/>
        <div className=" h-[2px] bg-zinc-800 md:mt-[1vw] mt-[1vh] rounded-full"></div>

        <div className="md:mt-[1.5vw] mt-[2vh] flex flex-col md:gap-[.5vw] gap-[1vh]">
          <FollowUsers/>
          <Themes/>
          <Logout/>
        </div>
      </div>
    </div>
  )
}

export default Setting