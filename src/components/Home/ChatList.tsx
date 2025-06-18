"use client"
import React,{ useEffect,useState} from 'react'
import FollowUser from './FollowUser'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getFollowingUsers } from '@/redux/slice/authSlice'

const ChatList = () => {

  

  return (
    <div className='w-full overflow-hidden'>
      <FollowUser followUser={followUser}  />
    </div>
  )
}

export default ChatList
