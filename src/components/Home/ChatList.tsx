// "use client"
// import React,{ useEffect,useState} from 'react'
// import FollowUser from './FollowUser'
// import type{ User } from '@/store/authStore'
// import axios from 'axios'

// const ChatList = () => {
//   const API_URL = process.env.NEXT_PUBLIC_API_KEY
//   const [followUser,setFollowUser] = useState<User[]>([])

//   useEffect(()=>{
//     const fetchFollowingUser = async () => {
//       const response = await axios.get(`${API_URL}/api/users/get-following-users`);
//       setFollowUser(response.data.following); // <-- correct key
//     }

//     fetchFollowingUser()
//   },[API_URL])

//   return (
//     <div className='w-full overflow-hidden'>
//       <FollowUser followUser={followUser}  />
//     </div>
//   )
// }

// export default ChatList
