import React from 'react'
import "@/app/globals.css"
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { logout } from '@/redux/slice/authSlice'
import Link from 'next/link'
import { Users, ArrowRight, LogOut, Palette  } from 'lucide-react';
import toast from 'react-hot-toast'


export const UserProfile = () =>{

  const {user} = useAppSelector((state) => state.auth)

  return(
    <Link href={`/?tab=profile`}>
        <div className="flex items-center gap-4 md:px-[1vw] px-[2vh] py-1 md:py-[.5vw] rounded-lg hover:bg-zinc-800 transition-all duration-300 cursor-pointer bg-zinc-800 md:bg-zinc-900">
      <div className="rounded-full md:w-[4vw] md:h-[4vw] w-[7vh] h-[7vh] border-1 border-zinc-700">
        {user?.profilePic?.trim() ? (
          <Image
            width={100}
            height={100}
            src={user.profilePic}
            alt="User Profile"
            className="w-full h-full rounded-full object-cover cursor-pointer"
          />
        ) : (
          <div className='bg-zinc-700 text-white w-full h-full rounded-full flex items-center justify-center'>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h2 className='md:text-[1.2vw] text-[1.8vh] font-[500] capitalize select-none'>{user?.fullName} | <span className='md:text-[1vw] text-[1.5vh] font-[400] text-zinc-300'>{user?.userName}</span></h2>
        <p className='md:text-[.9vw] text-[1.4vh] select-none text-zinc-400'>{user?.bio}</p>
      </div>
    </div>
    </Link>
  )
}

export const FollowUsers = () => {
  return(
    <Link href={`/?tab=profile`}>
        <div className="flex items-center gap-4 md:px-[1vw] px-[2vh] py-[1.5vh] md:py-[1vw] rounded-lg hover:bg-zinc-800 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center md:gap-[1vw] gap-[1vh] relative w-full">
                <Users className='md:size-8 size-5 text-zinc-300'/>
                <h2 className='md:text-[1.1vw] text-[1.9vh] font-[500] select-none text-zinc-300 flex flex-col leading-tight'>Follow Users <span className='md:text-[.9vw] text-[1.4vh] select-none text-zinc-400'>Manage your followed users </span></h2>
                <div className={`absolute md:opacity-0 right-2 transform group-hover:translate-x-3 group-hover:opacity-100 transition-all duration-300`}>
                    <ArrowRight className='md:size-8 size-5 text-zinc-300'/>
                </div>
            </div>
        </div>
    </Link>
  )
}

export const Themes = () => {
  return(
    <Link href={`/?tab=theme`}>
        <div className="flex items-center gap-4 md:px-[1vw] px-[2vh] py-[1.5vh] md:py-[1vw] rounded-lg hover:bg-zinc-800 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center md:gap-[1vw] gap-[1vh] relative w-full">
                <Palette className='md:size-8 size-5 text-zinc-300'/>
                <h2 className='md:text-[1.1vw] text-[1.9vh] font-[500] select-none text-zinc-300 flex flex-col leading-tight'>Chat Themes  <span className='md:text-[.9vw] text-[1.4vh] select-none text-zinc-400'> Customize your chat theme </span></h2>
                <div className={`absolute md:opacity-0 right-2 transform group-hover:translate-x-3 group-hover:opacity-100 transition-all duration-300`}>
                    <ArrowRight className='md:size-8 size-5 text-zinc-300'/>
                </div>
            </div>
        </div>
    </Link>
  )
}

export const Logout = () => {

    const dispatch = useAppDispatch()

    const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success('Logout successful')
    } catch (err) {
      console.log(err)
      
    }
  }

  return(
        <button onClick={handleLogout} className="flex items-center gap-4 md:px-[1vw] px-[2vh] py-[1.5vh] md:py-[1vw] rounded-lg hover:bg-[#ff2c2c52] transition-all duration-300 cursor-pointer group">
            <div className="flex items-center md:gap-[1vw] gap-[1vh] relative w-full">
                <LogOut className='md:size-8 size-5 text-zinc-300'/>
                <h2 className='md:text-[1.1vw] text-[1.9vh] font-[500] select-none text-zinc-300'>Logout</h2>
                <div className={`absolute md:opacity-0 right-2 transform group-hover:translate-x-3 group-hover:opacity-100 transition-all duration-300`}>
                    <ArrowRight className='md:size-8 size-5 text-zinc-300'/>
                </div>
            </div>
        </button>
  )
}