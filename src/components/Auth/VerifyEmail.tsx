import React from 'react'
import Input from '../Layouts/AuthInput'
import { Loader2 } from 'lucide-react'

type Props = {
  code: string,
  setCode: (code: string) => void,
  handleVerify: (e: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean
}

const VerifyEmail = ({ code, setCode, handleVerify, isLoading }: Props) => {
  return (
    <div className='md:w-[30vw] w-full md:p-[1.5vw] p-[1vh] rounded-xl bg-zinc-900'>
      <div className="w-full mb-4">
        <h1 className='md:text-[2vw] text-[3.2vh] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-pink-500'>Verify your account</h1>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-4 w-full">
        <Input type='text' placeholder='Verification Code' value={code} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)} />

        <button
          type='submit'
          disabled={isLoading}
          className='md:text-[1.2vw] text-[2.2vh] font-semibold text-center md:py-[.2vw] py-[1vh] rounded-lg text-zinc-800 hover:bg-zinc-300 transition duration-200 bg-zinc-200'
        >
          {isLoading ? <div className="flex items-center justify-center gap-1 text-zinc-800"><Loader2 className="animate-spin text-zinc-800" />Verifying...</div> : "Verify Email"}
        </button>
      </form>
    </div>
  )
}

export default VerifyEmail