"use client";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../Layouts/Loading";

export const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return <>{isAuthenticated && children}</>;
};
