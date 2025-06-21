'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { sendFollowRequest, unfollow } from '@/redux/slice/authSlice';
import { toast } from 'react-hot-toast';
import type { User } from '@/redux/type';

const SearchResult = ({ users = [] }: { users?: User[] }) => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.auth.user);

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleFollow = async (userId: string) => {
    setLoadingUserId(userId);
    try {
        const data = { userId };
      await dispatch(sendFollowRequest(data)).unwrap();
      toast.success('Follow request sent');
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    setLoadingUserId(userId);
    try {
        const data = { userId };
      await dispatch(unfollow(data)).unwrap();
      toast.success('Unfollowed successfully');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {users.length === 0 ? (
        <p className='md:text-[1vw] text-zinc-400 font-second text-[2vh] text-center'>
          Find New Friends
        </p>
      ) : (
        users.map((user) => {
          if (!loggedInUser || user._id === loggedInUser._id) return null;

         const isFollowing =Array.isArray(loggedInUser.following) &&loggedInUser.following.includes(user._id);

         const isRequested =
           Array.isArray(user.followRequests) &&
           user.followRequests.includes(loggedInUser._id);

          return (
            <div
              key={user._id}
              className="friend w-full md:px-[1vh] flex md:gap-[.5vw] px-[1.3vh] cursor-pointer hover:bg-zinc-800 transition-all duration-100 gap-[1vh]"
            >
              <div className="flex items-center justify-center md:p-2 p-1">
                <div className="relative md:w-[3.2vw] md:h-[3.2vw] w-[6vh] h-[6vh] rounded-full overflow-hidden">
                  {typeof user?.profilePic === 'string' && (
                    <Image
                      src={user?.profilePic}
                      alt="user profile"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 4vh, 3.2vw"
                    />
                  )}
                </div>
              </div>

              <div className="w-full flex items-center justify-between md:py-[.5vh] border-b border-zinc-700">
                <div className="flex flex-col md:gap-[.4vh] gap-[.5vh]">
                  <h3 className="md:text-[1vw] font-second text-zinc-200 text-[2vh]">
                    {user?.fullName} |{' '}
                    <span className="text-zinc-400 text-sm">
                      {user?.userName}
                    </span>
                  </h3>
                  <p className="md:text-[.7vw] text-zinc-400 font-second leading-none text-[1.2vh] md:w-[18vw] w-[60vw]">
                    {user?.bio}
                  </p>
                </div>

                {/* Follow / Requested / Unfollow Button */}
                {isFollowing ? (
                  <button
                    onClick={() => handleUnfollow(user._id)}
                    disabled={loadingUserId === user._id}
                    className="md:text-[1vw] md:px-[1vh] md:py-[.4vh] px-[.5vh] py-[.3vh] md:rounded-lg rounded-md text-white bg-red-600 cursor-pointer"
                  >
                    {loadingUserId === user._id ? 'Unfollowing...' : 'Unfollow'}
                  </button>
                ) : isRequested ? (
                  <button
                    disabled
                    className="md:text-[1vw] md:px-[1vh] md:py-[.4vh] px-[.5vh] py-[.3vh] md:rounded-lg rounded-md text-white bg-zinc-600 cursor-default"
                  >
                    Requested
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(user._id)}
                    disabled={loadingUserId === user._id}
                    className="md:text-[1vw] md:px-[1vh] md:py-[.4vh] px-[.5vh] py-[.3vh] md:rounded-lg rounded-md text-white bg-gradient-to-r from-prime to-second cursor-pointer"
                  >
                    {loadingUserId === user._id ? 'Following...' : 'Follow'}
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SearchResult;
