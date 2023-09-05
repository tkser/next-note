"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors([]);
    if (!username || !password) {
      setErrors(["Username and password are required"]);
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.meta.message === "LOGIN_SUCCESS") {
      window.location.href = "/dashboard";
    } else {
      if (data.meta.message === "INVALID_USERNAME_OR_PASSWORD") {
        setErrors(["Username or password is incorrect"]);
      } else {
        setErrors(["An error occurred. Please try again later"]);
      }
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-700">
          Note
        </h1>
        <div>
          <p className="text-sm mb-2 text-center text-red-500">
            {errors.map((error) => (
              <span key={error}>{error}</span>
            ))}
          </p>
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
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
