"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-[#3c3836] rounded-lg shadow-lg p-8 border border-[#504945]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#fabd2f] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#a89984]">
              Sign in to manage your courses
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#ebdbb2] mb-2">
                Username
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#282828] border border-[#504945] rounded-lg 
                         text-[#ebdbb2] placeholder-[#a89984] focus:outline-none 
                         focus:ring-2 focus:ring-[#458588] focus:border-transparent
                         transition-colors duration-200"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#ebdbb2] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#282828] border border-[#504945] rounded-lg 
                         text-[#ebdbb2] placeholder-[#a89984] focus:outline-none 
                         focus:ring-2 focus:ring-[#458588] focus:border-transparent
                         transition-colors duration-200"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#458588] bg-[#282828] border-[#504945] 
                           rounded focus:ring-[#458588] focus:ring-2"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-[#a89984]">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#458588] hover:text-[#689d6a] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] 
                       font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#458588] focus:ring-offset-2
                       focus:ring-offset-[#3c3836]"
            >
              Sign In
            </button>
          </form>
          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-sm text-[#a89984] hover:text-[#ebdbb2] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}