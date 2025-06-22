"use client"
import { useEffect, useState } from 'react';
import {useSearchParams } from 'next/navigation';
import NavigationBar from './NavigationBar';
import Chats from '../ChatUi.tsx/Chats';
import Profile from '../User/Profile';
import Explore from '../Explore/Explore';
import Groups from '../Group/Groups';
import Message from '../MessageUi.tsx/MessageLayout';
import MobileBar from './MobileBar';

const MainNavigation = () => {

  const searchParams = useSearchParams();
  const [tab, setTab] = useState('/chats');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className='md:flex relative'>
        <div className=''>
            <NavigationBar/>
        </div>

        <div className="md:hidden w-full absolute bottom-0 ">
          <MobileBar/>
        </div>
        

        <div className="">
          {tab === 'chats' && <Chats/>}
          {tab === 'explore' && <Explore/>}
          {tab === 'groups' && <Groups/>}
          {tab === 'profile' && <Profile/>}
        </div>

        <div className="hidden md:block">
          <Message/>
        </div>
      </div>
  )
}

export default MainNavigation