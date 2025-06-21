"use client"
import React, { useEffect, useState } from 'react'
import AuthLayout from '@/components/Layouts/AuthLayout'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { forgotPassword } from '@/redux/slice/authSlice'
import toast from 'react-hot-toast'
import ForgotForm from '@/components/Auth/ForgotForm'
import LinkSend from '@/components/Auth/LinkSend'
import {Redirect} from '@/components/Secure/Redirect'

const Page = () => {

  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState(false);
  const { isLoading ,error} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { email };
      await dispatch(forgotPassword(data)).unwrap();
      toast.success("Password reset link sent to your email");
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Redirect>
    <AuthLayout>
      {
        submitted ? (
          <div className="w-full px-[1vh] md:px-0 flex items-center justify-center">
            <LinkSend />
          </div>
        ) : (
          <div className="w-full px-[1vh] md:px-0 flex items-center justify-center">
            <ForgotForm email={email} setEmail={setEmail} handleForgotPassword={handleForgotPassword} isLoading={isLoading} />
          </div>
        )
      }
    </AuthLayout>
    </Redirect>
  )
}

export default Page