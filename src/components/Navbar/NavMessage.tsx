"use client"
import React from 'react'
import Image from 'next/image'
import { CoolMode } from "@/components/magicui/cool-mode";
import type{User} from "@/redux/type"
import axios from 'axios';


const NavMessage = ({followRequests,setFollowRequests}:{followRequests:User[]; setFollowRequests: React.Dispatch<React.SetStateAction<User[]>>;}) => {

  const API_URL_3 = process.env.NEXT_PUBLIC_API_KEY_3

  if (!followRequests || followRequests.length === 0) {
    return (
      <div className="text-center text-zinc-400 text-sm pt-4">
        No follow requests
      </div>
    );
  }

  const handelAcceptRequest = async (userId: string) => {
  try {
    await axios.post(`${API_URL_3}/accept-follow-request`, { userId });
    setFollowRequests(prev => prev.filter(user => user._id !== userId));
  } catch (error) {
    console.log("Error accepting request", error);
  }
  }

  return (
  <div className="">
    {followRequests.map((user) => (
       <div key={user._id} className='w-full md:px-[1vh] md:py-[.5vh] p-[1vh]  bg-zinc-800 rounded-lg flex gap-[1vh]'>
        <Image width={50} height={50} src="/next.svg" alt="user profile" className='md:w-[2vw] md:h-[2vw] w-[4vh] h-[4vh] rounded-xl object-cover border-2 border-prime'/>

        <div className="flex flex-col gap-[.5vh]">
          <h2 className='text-[1.5vh] md:text-[1vw] text-white leading-none'>{user.fullName}<span className='text-[1vh] md:text-[.6vw] text-zinc-300'>2 hours ago</span></h2>

          <p className='text-[1.2vh] md:text-[.8vw] text-zinc-200 leading-none'>{user?.userName}</p>
        </div>

        <CoolMode>
        <button onClick={() => handelAcceptRequest(user._id.toString())} className='text-[1.2vh] md:px-[.5vw] md:py-[.2vh] bg-gradient-to-l from-prime to-second md:rounded-md bg-gra md:text-[.8vw] text-zinc-100 leading-none translate-x-7 cursor-pointer'>accept</button></CoolMode>
    </div>
    ))}
   
  </div>
  )
}

export default NavMessage