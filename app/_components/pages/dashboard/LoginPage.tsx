"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoginLoading(true);
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      next: { revalidate: false },
      credentials: "include",
    });
    const data = (await res.json()) as ApiResponse<ApiDataUserResponse>;
    if (data.meta.message === "LOGIN_SUCCESS" && data.data && data.data.user) {
      router.prefetch("/dashboard");
      router.push("/dashboard");
      router.refresh();
      toast.success("Login Successful.");
    } else {
      if (data.meta.message === "INVALID_USERNAME_OR_PASSWORD") {
        toast.error("Username or password is incorrect");
      } else {
        toast.error("An error occurred. Please try again later");
      }
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-700">
          Note
        </h1>
        <div>
          <form onSubmit={handleLogin}>
            <p className="mb-2 text-gray-500">Username:</p>
            <input
              type="text"
              className="border rounded w-full py-2 px-3 mb-4 text-gray-700"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className="mb-2 text-gray-500">Password:</p>
            <input
              type="password"
              className="border rounded w-full py-2 px-3 mb-4 text-gray-700"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mb-4 text-center">
              {isLoginLoading ? (
                <div className="flex justify-center" aria-label="loading">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded select-none"
                >
                  Login
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
