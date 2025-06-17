import React from 'react'
import Image from 'next/image'

const RecentStatus = () => {
  return (
    <div className="friend w-full md:px-[1vh] flex md:gap-[.5vw] px-[1.3vh] cursor-pointer hover:bg-zinc-800 transition-all duration-100 gap-[1vh]">
        {/* Image container with padding */}
        <div className="flex items-center justify-center md:p-2 p-1">
            <div className="relative md:w-[3.5vw] md:h-[3.5vw] w-[6vh] h-[6vh] rounded-full overflow-hidden">
            <Image 
                src="/theme.webp" 
                alt="user profile" 
                fill
                className='object-cover'
                sizes="(max-width: 768px) 4vh, 3.2vw"
            />
            </div>
        </div>
    
        <div className="w-full flex items-center justify-between md:py-[.5vh] border-b border-zinc-700">
            <div className="flex flex-col md:gap-[.4vh] gap-[.5vh]">
                <h3 className='md:text-[1vw] font-second text-zinc-200 text-[2vh]'>Kunal Singh</h3>
                <p className='md:text-[.7vw] text-zinc-400 font-second leading-none text-[1.2vh] md:w-[18vw] w-[60vw]'>Today at 10:00 AM</p>
            </div>
        </div>
    </div>
  )
}

export default RecentStatus