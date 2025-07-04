"use client"
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateProfile } from '@/redux/slice/authSlice'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import ProfilePicUploader from '../../Layouts/Upload'

const Profile = () => {
  const dispatch = useAppDispatch()
  const { user, error ,isLoading} = useAppSelector((state) => state.auth)
  

  const [profilePic, setProfilePic] = useState('')
  const [fullName, setFullName] = useState('')
  const [userName, setUserName] = useState('')
  const [bio, setBio] = useState('')
  const [isEditing, setIsEditing] = useState(false)


  useEffect(() => {
    if (user) {
      setProfilePic(user.profilePic || '')
      setFullName(user.fullName || '')
      setUserName(user.userName || '')
      setBio(user.bio || '')
    }
  }, [user])

  // Show error only once
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isEditing) return

    try {

      const data = {
        fullName,
        userName,
        bio,
        profilePic,
      }

      console.log("🧠 Final Data to Submit:", data); // 👈 check her

      await dispatch(
        updateProfile(data)
      ).unwrap()
      
      toast.success('Profile updated')
      setIsEditing(false)
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] text-white bg-[#181818f5] w-full h-[calc(100vh-6vh)] overflow-y-scroll hide-scrollbar border-r border-zinc-800 pro-wave-in'>
      <div className="w-full md:p-[1vw] p-[2vh] text-zinc-200 flex items-center justify-between">
        <h2 className='md:text-[1.5vw] text-[3vh] font-second font-[500] select-none'>Profile</h2>
      </div>

      <div className="relative rounded-full md:w-[8vw] md:h-[8vw] w-[12vh] h-[12vh] flex items-center justify-center mx-auto overflow-hidden">
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
            No Image
          </div>
        )}

        <div className={`upload-profilepic absolute top-0 rounded-full md:w-[8vw] md:h-[8vw] w-[12vh] h-[12vh] flex items-center justify-center mx-auto overflow-hidden ${!isEditing ? 'pointer-events-none opacity-40' : ''}`}>
          <ProfilePicUploader profilePic={profilePic} setProfilePic={setProfilePic} />
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="md:px-[1vw] px-[2vh] md:mt-[1.5vw] flex flex-col md:gap-[1.5vh]">
        <label className='md:text-[.9vw] text-zinc-300'>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={!isEditing}
          className="w-full md:h-[3vh] h-[5vh] md:p-[1vw] p-[1vh] rounded-lg bg-zinc-800 text-zinc-200 outline-none disabled:opacity-50"
        />

        <label className='md:text-[.9vw] text-zinc-300'>User Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={!isEditing}
          className="w-full md:h-[3vh] h-[5vh] md:p-[1vw] p-[1vh] rounded-lg bg-zinc-800 text-zinc-200 outline-none disabled:opacity-50"
        />

        <label className='md:text-[.9vw] text-zinc-300'>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={!isEditing}
          className="w-full md:h-[6vw] h-[8vh] md:p-[1vw] p-[1vh] rounded-lg bg-zinc-800 text-zinc-200 outline-none resize-none disabled:opacity-50"
        />

        <div className="flex items-center justify-between md:mt-1 mt-4">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="md:text-[1.1vw] text-[2vh] p-1.5 rounded-md font-semibold text-zinc-100 md:px-[.8vw] md:py-[1vh] md:rounded-lg bg-zinc-700 hover:bg-zinc-600 cursor-pointer transition-all duration-300 ease-in-out"
          >
            Edit Profile
          </button>

          <button
            type="submit"
            disabled={!isEditing || isLoading}
            className="md:text-[1.1vw] text-[2vh] rounded-md p-1.5 text-zinc-100 md:px-[1vw] md:py-[.9vh] md:rounded-lg bg-gradient-to-l from-prime to-second cursor-pointer focus:ring-2 ring-prime font-semibold disabled:opacity-50"
          >
            {isLoading ? <div className="flex items-center justify-center gap-1"><Loader2 className="animate-spin text-white" />Saving...</div> : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
