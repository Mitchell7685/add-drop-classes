'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authUtils, User } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedUserTypes?: ('teacher' | 'student')[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  allowedUserTypes = ['teacher', 'student'],
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authUtils.getCurrentUser();
      
      if (!requireAuth) {
        setAuthorized(true);
        setUser(currentUser);
        setLoading(false);
        return;
      }

      if (!currentUser) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      if (allowedUserTypes.includes(currentUser.user_type)) {
        setAuthorized(true);
        setUser(currentUser);
      } else {
        setAuthorized(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [requireAuth, allowedUserTypes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-xl">Checking authorization...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#fabd2f] mb-4">Authentication Required</h1>
          <p className="text-[#a89984] mb-6">You need to be logged in to access this page.</p>
          <div className="space-x-4">
            <Link href="/login">
              <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Login
              </button>
            </Link>
            <Link href="/">
              <button className="bg-[#a89984] hover:bg-[#bdae93] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (requireAuth && user && !authorized) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#fb4934] mb-4">Access Denied</h1>
          <p className="text-[#a89984] mb-2">You don't have permission to access this page.</p>
          <p className="text-[#bdae93] mb-6">
            Required: {allowedUserTypes.join(' or ')} | Your role: {user.user_type}
          </p>
          <div className="space-x-4">
            <Link href="/courses">
              <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Browse Courses
              </button>
            </Link>
            <Link href="/">
              <button className="bg-[#a89984] hover:bg-[#bdae93] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
