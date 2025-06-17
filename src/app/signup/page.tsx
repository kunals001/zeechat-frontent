"use client"
import React, { useState ,useEffect} from 'react'
import AuthLayout from '@/components/Layouts/AuthLayout'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { signup, verifyEmail } from '@/redux/slice/authSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import SignupForm from '@/components/Auth/SignupForm'
import VerifyEmail from '@/components/Auth/VerifyEmail'
import {Redirect} from '@/components/Secure/Redirect'

const Page = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading,error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { fullName, userName, email, password };
      await dispatch(signup(data)).unwrap();
      toast.success("Verification code sent to your email");
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { code };
      await dispatch(verifyEmail(data)).unwrap();
      toast.success("Account created successfully");
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Redirect>
    <AuthLayout>
      {submitted ? (
        <div className="w-full px-[1vh] md:px-0 flex items-center justify-center">
          <VerifyEmail code={code} setCode={setCode} handleVerify={handleVerify} isLoading={isLoading} />
        </div>
      ) : (
        <div className="w-full px-[1vh] md:px-0 flex items-center justify-center">
          <SignupForm
          fullName={fullName}
          setFullName={setFullName}
          userName={userName}
          setUserName={setUserName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSignup={handleSignup}
          isLoading={isLoading}
          />
        </div>
      )}
    </AuthLayout>
    </Redirect>
  )
}

export default Page;
