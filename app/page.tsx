"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  full_name: string;
  user_type: string;
  enrolled_courses?: string[];
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#282828] text-[#ebdbb2]">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-[#fabd2f]">
            Course Manager
          </h1>
          <p className="text-xl mb-8 text-[#a89984]">
            Add and drop courses with ease
          </p>
          
          {user ? (
            <div className="mb-8">
              <p className="text-lg text-[#bdae93] mb-4">
                Welcome back, <span className="text-[#fabd2f] font-semibold">{user.full_name}</span>!
              </p>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                user.user_type === 'teacher' 
                  ? 'bg-[#458588] text-[#ebdbb2]' 
                  : 'bg-[#d79921] text-[#282828]'
              }`}>
                {user.user_type.toUpperCase()} ACCOUNT
              </span>
            </div>
          ) : (
            <p className="text-lg mb-12 text-[#bdae93] max-w-2xl mx-auto">
              Manage your academic schedule efficiently. Browse available courses, 
              add new ones to your schedule, or drop courses you no longer need.
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Link href={`/courses?role=${user.user_type}`}>
                  <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                    {user.user_type === 'teacher' ? 'My Courses' : 'Browse Courses'}
                  </button>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="bg-[#fb4934] hover:bg-[#cc241d] text-[#ebdbb2] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]"
                >
                  Logout
                </button>

                <Link href="/test-users">
                  <button className="bg-[#a89984] hover:bg-[#bdae93] text-[#282828] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                    View All Users
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                    Login
                  </button>
                </Link>
                
                <Link href="/courses">
                  <button className="bg-[#d79921] hover:bg-[#fabd2f] text-[#282828] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                    Browse Courses
                  </button>
                </Link>

                <Link href="/test-users">
                  <button className="bg-[#cc241d] hover:bg-[#fb4934] text-[#282828] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 min-w-[150px]">
                    Test Logins
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}