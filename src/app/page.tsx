"use client"
import MainNavigation from '@/components/Home/Navigation/MainNavigation'
import Navbar from '@/components/Navbar/Navbar'
import React from 'react'
import { AuthCheck } from '@/components/Secure/AuthCheck'

const page = () => {

  return (
    <AuthCheck>
      <div className='bg-zinc-900 relative w-full h-screen'>
      <Navbar/>

      <div className="md:px-[10vw] md:mt-2">
        <MainNavigation/>
      </div>
      </div>
    </AuthCheck>
  )
}

export default page