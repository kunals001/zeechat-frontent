"use client"
import React, { useEffect, useState } from 'react'
import AuthLayout from '@/components/Layouts/AuthLayout'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { login } from '@/redux/slice/authSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Input from '@/components/Layouts/AuthInput'
import Link from 'next/link'
import {Redirect} from '@/components/Secure/Redirect'

const Page = () => {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { identifier, password };
      await dispatch(login(data)).unwrap();
      toast.success("Login successful");
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Redirect>
    <AuthLayout>
      <div className="w-full flex items-center justify-center px-[1vh] md:px-0">
        <div className='md:w-[30vw] w-full md:p-[1.5vw] p-[1vh] rounded-xl bg-zinc-900'>
          <div className="w-full mb-4">
            <h1 className='md:text-[2vw] text-[3.2vh] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-pink-500'>Welcome Back</h1>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
            <Input
              type='text'
              placeholder='Email'
              value={identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <Link href="/forgot-password" className='md:text-[.8vw] text-[1.2vh] text-zinc-400 mt-1 hover:underline'>
              Forgot Password?
            </Link>

            <button
              type='submit'
              disabled={isLoading}
              className='md:text-[1.2vw] text-[2.2vh] font-semibold text-center md:py-[.2vw] py-[1vh] rounded-lg text-zinc-800 hover:bg-zinc-300 transition duration-200 bg-zinc-200'
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-1 text-zinc-800">
                  <Loader2 className="animate-spin text-zinc-800" />Login
                </div>
              ) : "Login"}
            </button>
          </form>

          <p className='text-center md:text-[.9vw] text-[1.6vh] text-zinc-300 mt-3'>
            Don't have an account? <a href="/signup" className='text-purple-400 font-[500]'>Signup</a>
          </p>
        </div>
      </div>
    </AuthLayout>
    </Redirect>
  )
}

export default Page;
