"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data in localStorage (in a real app, use proper session management)
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user type
      if (data.user.user_type === 'teacher') {
        router.push('/courses?role=teacher');
      } else if (data.user.user_type === 'student') {
        router.push('/courses?role=student');
      } else {
        router.push('/courses');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div className="bg-[#fb4934] bg-opacity-20 border border-[#fb4934] text-[#fb4934] px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#ebdbb2] mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-[#282828] border border-[#504945] rounded-lg 
                         text-[#ebdbb2] placeholder-[#a89984] focus:outline-none 
                         focus:ring-2 focus:ring-[#458588] focus:border-transparent
                         transition-colors duration-200 disabled:opacity-50"
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
                disabled={loading}
                className="w-full px-4 py-3 bg-[#282828] border border-[#504945] rounded-lg 
                         text-[#ebdbb2] placeholder-[#a89984] focus:outline-none 
                         focus:ring-2 focus:ring-[#458588] focus:border-transparent
                         transition-colors duration-200 disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  disabled={loading}
                  className="h-4 w-4 text-[#458588] bg-[#282828] border-[#504945] 
                           rounded focus:ring-[#458588] focus:ring-2 disabled:opacity-50"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-[#a89984]">
                  Remember me
                </label>
              </div>
              <Link href="/test-users" className="text-sm text-[#458588] hover:text-[#689d6a] transition-colors">
                View test users
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] 
                       font-semibold py-3 px-4 rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-[#458588] focus:ring-offset-2
                       focus:ring-offset-[#3c3836] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
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