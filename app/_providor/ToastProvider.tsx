"use client";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        position={toast.POSITION.BOTTOM_RIGHT}
        autoClose={3000}
        hideProgressBar
        pauseOnFocusLoss={false}
        theme="light"
      />
    </>
  );
}
