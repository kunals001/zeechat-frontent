import React from 'react'
import Image from 'next/image'
import { useAppSelector } from '@/redux/hooks'
import RecentStatus from './RecentStatus'
import { Plus } from 'lucide-react'

const Status = () => {

  const {user} = useAppSelector(state => state.auth)

  return (
     <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] w-full h-[calc(100vh-6vh)] text-white bg-[#181818f5] overflow-y-scroll hide-scrollbar border-r border-zinc-800'>
      <div className="w-full md:px-[1vw] text-zinc-200 px-3 py-2 md:py-[.5vw] flex items-center justify-between">
        <h2 className='md:text-[1.5vw] text-[3vh] font-prime font-semibold select-none'>Status</h2>

        <Plus className='md:text-[1.5vw] text-[3vh] text-zinc-400 cursor-pointer md:p-1 hover:bg-zinc-800 transition-all duration-300 md:rounded-lg rounded-md md:size-8 size-6'/>
      </div>

      <div className="flex items-center md:pl-[1vw] pl-[1.3vh] md:gap-[1vh] hover:bg-zinc-700 transition-all duration-300 gap-[1vh] cursor-pointer border-b border-zinc-700 md:py-2 py-2">
       
        {typeof user?.profilePic === "string" && user.profilePic.trim() !== "" ? (
        <div className="relative md:w-[3.5vw] md:h-[3.5vw] w-[6vh] h-[6vh] rounded-full overflow-hidden border-2 border-prime">
          <Image 
            src={user?.profilePic} 
            alt="user profile" 
            fill
            className='object-cover'
            sizes="(max-width: 768px) 4vh, 3.2vw"
          />
          </div>
        ) : null}  
          
        

        <div className="flex flex-col md:gap-[.3vh] gap-[.5vh]">
            <h3 className='md:text-[1vw] font-second text-zinc-200 text-[2vh]'>My Status</h3>
            <p className='md:text-[.7vw] text-zinc-400 font-second leading-none text-[1.2vh]'>Click to add status</p>
        </div>

      </div>

      <h3 className='md:text-[1vw] font-second text-second text-[2vh] md:px-[1vw] px-[1.5vh] md:pt-[.7vw] pt-2'>Recent Status</h3>


      <div className=" mt-1 ">
        <RecentStatus/>
        <RecentStatus/>
      </div>
    </div>
  )
}

export default Status