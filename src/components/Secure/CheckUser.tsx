"use client";

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { checkAuth } from '@/redux/slice/authSlice';
import { useEffect } from 'react';
import Loading from '../Layouts/Loading';

export const CheckUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center backdrop-blur-lg z-10">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
};