"use client"
import { useEffect, useState } from 'react';
import {useSearchParams } from 'next/navigation';
import NavigationBar from './NavigationBar';
import Chats from './Chats';
import Status from './Status';
import Profile from './Profile';

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
    <div className='md:flex'>
        <div className=''>
            <NavigationBar/>
        </div>

        <div className="">
          {tab === 'chats' && <Chats/>}
          {tab === 'status' && <Status/>}
          {tab === 'groups' && <div>Groups</div>}
          {tab === 'profile' && <Profile/>}
        </div>
      </div>
  )
}

export default MainNavigation