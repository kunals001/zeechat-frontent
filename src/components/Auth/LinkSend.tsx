import React from 'react'
import { Mail} from 'lucide-react'


const LinkSend = () => {
  return (
    <div className='md:w-[30vw] w-full md:p-[1.5vw] p-[1vh] rounded-xl bg-zinc-900'>
      <div className="w-full mb-4">
        <h1 className='md:text-[2vw] text-[3.2vh] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-pink-500'>Forgot Password</h1>
      </div>


      <Mail className='md:size-[3vw] size-[3vh] text-purple-500 mx-auto'/>

      <p className='text-[1.5vh] md:text-[1vw] text-zinc-400 leading-none text-center mt-2'>If this email is in our system, you will receive an email with instructions about how to reset your password in a few minutes.</p>

    </div>
  )
}

export default LinkSend