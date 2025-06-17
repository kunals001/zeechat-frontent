"use client";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {

    if (!user || !isAuthenticated) {
      router.push("/login");
    }else{
      router.push("/?tab=chats");
    }
  }, [user, isAuthenticated, router]);

  return <>{children}</>;
};