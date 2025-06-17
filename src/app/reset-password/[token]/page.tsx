"use client";
import React, { useEffect, useState } from "react";
import AuthLayout from "@/components/Layouts/AuthLayout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetPassword } from "@/redux/slice/authSlice";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Input from "@/components/Layouts/AuthInput";
import {Redirect} from '@/components/Secure/Redirect'

const Page = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const data = { token, password };
      await dispatch(resetPassword(data)).unwrap();
      toast.success("Password reset successful. Please login.");
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Redirect>
    <AuthLayout>
      <div className="w-full flex items-center justify-center px-[1vh] md:px-0">
        <div className="md:w-[30vw] w-full md:p-[1.5vw] p-[1vh] rounded-xl bg-zinc-900">
          <div className="w-full mb-4">
            <h1 className="md:text-[2vw] text-[3.2vh] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-pink-500">
              Reset Password
            </h1>
          </div>

          <form onSubmit={handleReset} className="flex flex-col gap-4 w-full">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:text-[1.2vw] text-[2.2vh] font-semibold text-center md:py-[.2vw] py-[1vh] rounded-lg text-zinc-800 hover:bg-zinc-300 transition duration-200 bg-zinc-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-1 text-zinc-800">
                  <Loader2 className="animate-spin text-zinc-800" />
                  Resetting...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center md:text-[.9vw] text-[1.6vh] text-zinc-300 mt-3">
            Back to{" "}
            <a href="/login" className="text-purple-400 font-[500]">
              Login
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
    </Redirect>
  );
};

export default Page;
