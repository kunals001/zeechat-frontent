"use client"
import MainNavigation from '@/components/Home/MainNavigation'
import Navbar from '@/components/Navbar/Navbar'
import React from 'react'

const page = () => {

  return (
    <div className='bg-zinc-900 relative w-full h-screen'>
      <Navbar/>

      <div className="md:px-[10vw] md:mt-2">
        <MainNavigation/>
      </div>
      
    </div>
  )
}

export default page