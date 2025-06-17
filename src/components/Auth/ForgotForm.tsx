import React from 'react'
import Input from '../Layouts/AuthInput'
import { Loader2 } from 'lucide-react'

type Props = {
  email: string,
  setEmail: (email: string) => void,
  handleForgotPassword: (e: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean
}

const ForgotForm = ({ email, setEmail, handleForgotPassword, isLoading }: Props) => {
  return (
    <div className='md:w-[30vw] w-full md:p-[1.5vw] p-[1vh] rounded-xl bg-zinc-900'>
      <div className="w-full mb-4">
        <h1 className='md:text-[2vw] text-[3.2vh] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-pink-500'>Forgot Password</h1>
      </div>

      <form onSubmit={handleForgotPassword} className="flex flex-col gap-4 w-full">
        <Input type='text' placeholder='Enter your email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />

        <button
          type='submit'
          disabled={isLoading}
          className='md:text-[1.2vw] text-[2.2vh] font-semibold text-center md:py-[.2vw] py-[1vh] rounded-lg text-zinc-800 hover:bg-zinc-300 transition duration-200 bg-zinc-200'
        >
          {isLoading ? <div className="flex items-center justify-center gap-1 text-zinc-800"><Loader2 className="animate-spin text-zinc-800" />Sending...</div> : "Send Link"}
        </button>
      </form>

      <p className='text-center md:text-[.9vw] text-[1.6vh] text-zinc-300 mt-3'>Don't have an account? <a href="/signup" className='text-purple-400 font-[500]'>Signup</a></p>
    </div>
  )
}

export default ForgotForm