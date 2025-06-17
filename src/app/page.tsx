"use client"
import React from 'react'
import { useAppSelector } from '@/redux/hooks'

const page = () => {

  const {user} = useAppSelector(state => state.auth)

  return (
    <div></div>
  )
}

export default page