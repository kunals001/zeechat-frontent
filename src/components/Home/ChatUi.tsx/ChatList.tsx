"use client"
import React,{ useEffect} from 'react'
import FollowUser from './FollowUser'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { getFollowingUsers } from '@/redux/slice/authSlice'

const ChatList = () => {

  const {followUsers = []} = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getFollowingUsers()).unwrap();
  },[dispatch])

  return (
    <div className='w-full overflow-hidden'>
      <FollowUser followUsers={followUsers}  />
    </div>
  )
}

export default ChatList
