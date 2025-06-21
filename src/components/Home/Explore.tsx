import { Loader2, Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import SearchResult from './SearchResult';
import { getUsers } from '@/redux/slice/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';


const Explore = () => {

    const dispatch = useAppDispatch();
    const { users,isLoading } = useAppSelector((state) => state.auth);

    const [query, setQuery] = useState('');

    const fetchUsers = useCallback(async () => {
      try {
        await dispatch(getUsers({ query })).unwrap();
      } catch (error) {
        console.log(error);
      }
    }, [dispatch, query]);

    useEffect(() => {
      const delaySearch = setTimeout(() => {
        if (query.trim() !== "") {
          fetchUsers();
        }
      }, 500);

      return () => clearTimeout(delaySearch);
    }, [query, fetchUsers]);

  return (
    <div className='md:w-[30vw] md:h-[calc(100vh-7vw)] w-full h-[calc(100vh-6vh)] text-white bg-[#181818f5] overflow-y-scroll hide-scrollbar border-r border-zinc-800'>

      <div className="w-full sticky md:top-0 -top-[.2vh] bg-[#181818f5] backdrop-blur-2xl z-10 md:p-[1vw] p-2 ">
        <div className="w-full text-zinc-200 flex items-center justify-between ">
          <h2 className='md:text-[1.5vw] text-[3vh] font-prime font-semibold select-none'>Explore</h2>
        </div>

        <div className="md:mt-[1vw] flex items-center relative mt-[1.5vh]">
          <input
            type="text"
            placeholder='Search by username...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-full md:py-[.5vh] md:rounded-lg bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 md:placeholder:text-md placeholder:text-xl outline-none md:px-[1vw] px-[1vh] md:text-[1vw] text-[2vh] py-[1vh] rounded-lg'
          />
          <Search className='text-zinc-500 absolute md:right-3 right-2' />
        </div>
      </div>

      <div className="w-full md:mt-[3vw] mt-[5vh] flex items-center justify-center">
        {isLoading ? (
            <Loader2 className="animate-spin text-zinc-800" />
        ) : (null)}
      </div>

      <div className="w-full bg-[#181818f5]">
        <SearchResult users={users} />
      </div>

    </div>
  );
};

export default Explore;
