'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  full_name: string;
  password: string;
  user_type: string;
}

export default function TestUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-xl text-[#fb4934]">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282828] text-[#ebdbb2]">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/">
            <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mb-4">
              ← Back to Home
            </button>
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-[#fabd2f]">Test Users</h1>
          <p className="text-lg text-[#a89984]">Use one of the below users to login and test features</p>
        </div>

        <div className="bg-[#3c3836] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-[#504945] border-b border-[#665c54]">
            <h2 className="text-xl font-semibold text-[#ebdbb2]">
              User Database ({users.length} users)
            </h2>
          </div>
          
          {users.length === 0 ? (
            <div className="px-6 py-8 text-center text-[#a89984]">
              No users found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#504945]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#a89984] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#a89984] uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#a89984] uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#a89984] uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#a89984] uppercase tracking-wider">
                      Password
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#665c54]">
                  {users.map((user, index) => (
                    <tr key={user._id} className={index % 2 === 0 ? 'bg-[#3c3836]' : 'bg-[#32302f]'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#bdae93] font-mono">
                        {user._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#ebdbb2]">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#bdae93]">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#bdae93]">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.user_type === 'teacher' 
                            ? 'bg-[#458588] text-[#ebdbb2]' 
                            : 'bg-[#d79921] text-[#282828]'
                        }`}>
                          {user.user_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#a89984] font-mono">
                        {user.password}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}