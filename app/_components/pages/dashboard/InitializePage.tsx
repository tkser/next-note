"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const InitializePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("NOT_INITIALIZED");

  const initializeDatabase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.meta.message === "INITIALIZED") {
        setMessage("SUCCESS");
      } else {
        setMessage("ERROR");
      }
    } catch (error) {
      setMessage("ERROR");
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-3xl font-semibold mb-4 text-center text-gray-700">
          Note
        </h1>
        {message === "NOT_INITIALIZED" && (
          <div>
            <p className="text-sm mb-2 text-gray-400">
              This is your first time running this app. Please initialize the
              database.
            </p>
            <form onSubmit={initializeDatabase}>
              <p className="mb-2 text-gray-500">Admin Username:</p>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-4 text-gray-700"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="mb-2 text-gray-500">Admin password:</p>
              <input
                type="password"
                className="border rounded w-full py-2 px-3 mb-4 text-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="mb-4 text-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded select-none"
                >
                  Initialize Database
                </button>
              </div>
            </form>
          </div>
        )}
        {message === "SUCCESS" && (
          <div>
            <p className="mb-2 text-gray-500 text-center">
              Database initialization successful!
            </p>
            <div className="mb-4 text-center">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded select-none"
                onClick={() => {
                  router.prefetch("/");
                  router.push("/");
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
        {message === "ERROR" && (
          <p className="text-red-500 mt-2">
            An error occurred during initialization.
          </p>
        )}
      </div>
    </div>
  );
};

export default InitializePage;
