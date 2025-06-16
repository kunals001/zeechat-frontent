import React from 'react'
import Input from '../Layouts/AuthInput'
import { Loader2 } from 'lucide-react'


type Props = {
  fullName: string,
  setFullName: (fullName: string) => void,
  userName: string,
  setUserName: (userName: string) => void,
  email: string,
  setEmail: (email: string) => void,
  password: string,
  setPassword: (password: string) => void,
  handleSignup: (e: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean
}

const SignupForm = ({
  fullName, setFullName,
  userName, setUserName,
  email, setEmail,
  password, setPassword,
  handleSignup, isLoading
}: Props) => {
  return (
    <div className='md:w-[30vw] w-full md:p-[1.5vw] p-[1vh] rounded-xl bg-zinc-900'>
      <div className="w-full mb-4">
        <h1 className='md:text-[2vw] text-[3.2vh] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-pink-500'>Create an account</h1>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">
        <Input type='text' placeholder='Full Name' value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} />
        <Input type='text' placeholder='Username' value={userName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)} />
        <Input type='email' placeholder='Email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
        <Input type='password' placeholder='Password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />

        <button
          type='submit'
          disabled={isLoading}
          className='md:text-[1.2vw] text-[2.2vh] font-semibold text-center md:py-[.2vw] py-[1vh] rounded-lg text-zinc-800 hover:bg-zinc-300 transition duration-200 bg-zinc-200'
        >
          {isLoading ? <div className="flex items-center justify-center gap-1 text-zinc-800"><Loader2 className="animate-spin text-zinc-800" />Sign Up</div> : "Sign Up"}
        </button>
      </form>

      <p className='text-center md:text-[.9vw] text-[1.6vh] text-zinc-300 mt-3'>Already have an account? <a href="/login" className='text-purple-400 font-[500]'>Login</a></p>
    </div>
  )
}

export default SignupForm;
