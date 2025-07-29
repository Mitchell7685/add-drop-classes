'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';

interface Course {
  _id?: string;
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration_weeks: number;
  tags: string[];
}

interface User {
  _id: string;
  username: string;
  full_name: string;
  user_type: string;
  enrolled_courses?: string[];
  cart?: string[];
}

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    // Check if user is logged in and is a student
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // If user is not a student, redirect or show error
      if (parsedUser.user_type !== 'student') {
        setError('This page is only available for students');
        setLoading(false);
        return;
      }
      
      fetchEnrolledCourses(parsedUser);
    } else {
      setError('Please log in to view your enrolled courses');
      setLoading(false);
    }
  }, []);

  const fetchEnrolledCourses = async (userData: User) => {
    try {
      if (!userData.enrolled_courses || userData.enrolled_courses.length === 0) {
        setEnrolledCourses([]);
        setLoading(false);
        return;
      }

      // Fetch all courses first
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      const allCourses = data.courses || [];
      
      // Filter courses that the user is enrolled in
      const userEnrolledCourses = allCourses.filter((course: Course) => 
        userData.enrolled_courses?.includes(course.id)
      );
      
      setEnrolledCourses(userEnrolledCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (course: Course) => {
    if (!user || !course.id) {
      setToast({
        message: 'Unable to unenroll from course',
        type: 'error'
      });
      return;
    }

    if (!confirm(`Are you sure you want to unenroll from "${course.title}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unenroll',
          userId: user._id,
          courseId: course.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unenroll from course');
      }

      const data = await response.json();
      
      // Update user data in localStorage and state
      const updatedUser = data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Remove the course from enrolled courses list
      setEnrolledCourses(prev => prev.filter(c => c.id !== course.id));

      // Show success message
      setToast({
        message: `Successfully unenrolled from ${course.title}`,
        type: 'success'
      });
      
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'An error occurred',
        type: 'error'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-2xl">Loading your enrolled courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#fb4934] mb-4">Error: {error}</div>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Login
              </button>
            </Link>
            <Link href="/">
              <button className="bg-[#d79921] hover:bg-[#fabd2f] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Go Back Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#282828] text-[#ebdbb2]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#fabd2f] mb-2">My Enrolled Courses</h1>
            <p className="text-[#a89984]">
              {user && `Welcome ${user.full_name}! Here are your enrolled courses.`}
            </p>
            {user && (
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#d79921] text-[#282828]">
                  STUDENT
                </span>
                <span className="ml-2 text-[#a89984]">
                  {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''} enrolled
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/courses">
              <button className="bg-[#689d6a] hover:bg-[#98971a] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                Browse More Courses
              </button>
            </Link>
            {user && (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-[#fb4934] hover:bg-[#cc241d] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
                <Link href="/">
                  <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                    Back to Home
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Enrolled Courses */}
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-[#a89984] mb-4">No enrolled courses yet</div>
            <p className="text-[#bdae93] mb-6">Start your learning journey by enrolling in some courses!</p>
            <Link href="/courses">
              <button className="bg-[#689d6a] hover:bg-[#98971a] text-[#282828] font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Browse Available Courses
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-[#3c3836] border border-[#689d6a] rounded-lg p-6 hover:border-[#98971a] transition-colors duration-200"
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#fabd2f] line-clamp-2 flex-1">
                    {course.title}
                  </h2>
                  <span className="bg-[#689d6a] text-[#282828] text-xs px-3 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                    Enrolled ✓
                  </span>
                </div>

                {/* Course Description */}
                <p className="text-[#bdae93] mb-4 text-sm leading-relaxed">
                  {course.description}
                </p>

                {/* Course Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a89984] font-medium">Instructor:</span>
                    <span className="text-[#ebdbb2] font-semibold">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a89984] font-medium">Duration:</span>
                    <span className="text-[#ebdbb2]">{course.duration_weeks} weeks</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a89984] font-medium">Course ID:</span>
                    <span className="text-[#ebdbb2] font-mono text-xs bg-[#282828] px-2 py-1 rounded">
                      {course.id}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-[#a89984] mb-2 font-medium">Topics:</div>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#458588] text-[#ebdbb2] text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-[#504945]">
                  <button 
                    onClick={() => handleUnenroll(course)}
                    className="w-full bg-[#cc241d] hover:bg-[#fb4934] text-[#ebdbb2] font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Unenroll from Course
                  </button>
                  <div className="text-xs text-[#a89984] text-center">
                    Make sure you want to unenroll before clicking
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Statistics */}
        {enrolledCourses.length > 0 && (
          <div className="mt-12 bg-[#3c3836] border border-[#504945] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-[#fabd2f] mb-4">Enrollment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-[#282828] rounded-lg p-4">
                <div className="text-2xl font-bold text-[#689d6a]">{enrolledCourses.length}</div>
                <div className="text-sm text-[#a89984]">Total Courses</div>
              </div>
              <div className="bg-[#282828] rounded-lg p-4">
                <div className="text-2xl font-bold text-[#d79921]">
                  {enrolledCourses.reduce((total, course) => total + course.duration_weeks, 0)}
                </div>
                <div className="text-sm text-[#a89984]">Total Weeks</div>
              </div>
              <div className="bg-[#282828] rounded-lg p-4">
                <div className="text-2xl font-bold text-[#458588]">
                  {[...new Set(enrolledCourses.flatMap(course => course.tags))].length}
                </div>
                <div className="text-sm text-[#a89984]">Unique Topics</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
