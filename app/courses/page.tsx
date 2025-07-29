'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CourseModal from '@/components/CourseModal';
import Toast from '@/components/Toast';
import ShoppingCart from '@/components/ShoppingCart';

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

// Component that uses useSearchParams
function CoursesContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams?.get('role');

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Remove the course from the local state
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCourseSubmit = async (courseData: Course) => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? JSON.stringify({ courseId: editingCourse?._id, ...courseData })
        : JSON.stringify(courseData);

      const response = await fetch('/api/courses', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save course');
      }

      const data = await response.json();
      
      if (isEditing) {
        // Update the course in the local state
        setCourses(courses.map(course => 
          course._id === editingCourse?._id ? data.course : course
        ));
      } else {
        // Add the new course to the local state
        setCourses([...courses, data.course]);
      }

      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err; // Re-throw so the modal can handle it
    }
  };

  const handleEnrollment = async (course: Course, action: 'enroll' | 'unenroll') => {
    if (!user || !course.id) {
      setToast({
        message: 'User must be logged in and course must have an ID',
        type: 'error'
      });
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId: user._id,
          courseId: course.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} in course`);
      }

      const data = await response.json();
      
      // Update user data in localStorage and state
      const updatedUser = data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Show success message
      setToast({
        message: `Successfully ${action === 'enroll' ? 'enrolled in' : 'unenrolled from'} ${course.title}`,
        type: 'success'
      });
      
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'An error occurred',
        type: 'error'
      });
    }
  };

  const handleCartAction = async (course: Course, action: 'addToCart' | 'removeFromCart') => {
    if (!user || !course.id) {
      setToast({
        message: 'User must be logged in and course must have an ID',
        type: 'error'
      });
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId: user._id,
          courseId: course.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action}`);
      }

      const data = await response.json();
      
      // Update user data in localStorage and state
      const updatedUser = data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Show success message
      setToast({
        message: action === 'addToCart' ? `Added ${course.title} to cart` : `Removed ${course.title} from cart`,
        type: 'success'
      });
      
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'An error occurred',
        type: 'error'
      });
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const getPageTitle = () => {
    if (!user) return 'Available Courses';
    return user.user_type === 'teacher' ? 'My Courses - Teacher Dashboard' : 'Available Courses - Student Dashboard';
  };

  const getPageDescription = () => {
    if (!user) return 'Browse and explore our course catalog';
    return user.user_type === 'teacher' 
      ? `Welcome back, ${user.full_name}! Manage your courses below.`
      : `Welcome back, ${user.full_name}! Browse and enroll in courses below.`;
  };

  const getActionButtonText = (course: Course) => {
    if (!user) return 'Login to Enroll';
    if (user.user_type === 'teacher') return 'Manage Course';
    
    // Check if student is enrolled or in cart
    const isEnrolled = user.enrolled_courses?.includes(course.id);
    const isInCart = user.cart?.includes(course.id);
    
    if (isEnrolled) return 'Unenroll from Course';
    if (isInCart) return 'Remove from Cart';
    return 'Add to Cart';
  };

  const getActionButtonStyle = (course: Course) => {
    if (!user) return 'bg-[#a89984] hover:bg-[#bdae93] text-[#282828]';
    if (user.user_type === 'teacher') {
      return 'bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2]';
    }
    
    // Different styles for enrolled, in cart, or available
    const isEnrolled = user.enrolled_courses?.includes(course.id);
    const isInCart = user.cart?.includes(course.id);
    
    if (isEnrolled) return 'bg-[#cc241d] hover:bg-[#fb4934] text-[#ebdbb2]';
    if (isInCart) return 'bg-[#b57614] hover:bg-[#d79921] text-[#282828]';
    return 'bg-[#689d6a] hover:bg-[#98971a] text-[#282828]';
  };

  const handleActionButtonClick = (course: Course) => {
    if (!user) {
      // Redirect to login
      return;
    }
    
    if (user.user_type === 'teacher') {
      // Teacher management functionality (if needed)
      return;
    }
    
    // Handle student enrollment/cart actions
    const isEnrolled = user.enrolled_courses?.includes(course.id);
    const isInCart = user.cart?.includes(course.id);
    
    if (isEnrolled) {
      handleEnrollment(course, 'unenroll');
    } else if (isInCart) {
      handleCartAction(course, 'removeFromCart');
    } else {
      handleCartAction(course, 'addToCart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-2xl">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#fb4934] mb-4">Error: {error}</div>
          <Link href="/">
            <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Go Back Home
            </button>
          </Link>
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
            <h1 className="text-4xl font-bold text-[#fabd2f] mb-2">{getPageTitle()}</h1>
            <p className="text-[#a89984]">{getPageDescription()}</p>
            {user && (
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.user_type === 'teacher' 
                    ? 'bg-[#458588] text-[#ebdbb2]' 
                    : 'bg-[#d79921] text-[#282828]'
                }`}>
                  {user.user_type.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            {user?.user_type === 'student' && (
              <>
                <Link href="/my-courses">
                  <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                    My Enrolled Courses
                  </button>
                </Link>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-[#d79921] hover:bg-[#fabd2f] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200 relative"
                >
                  Cart ({user.cart?.length || 0})
                  {user.cart && user.cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#fb4934] text-[#ebdbb2] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {user.cart.length}
                    </span>
                  )}
                </button>
              </>
            )}
            {user?.user_type === 'teacher' && (
              <button
                onClick={handleAddCourse}
                className="bg-[#689d6a] hover:bg-[#98971a] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Add New Course
              </button>
            )}
            {user ? (
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
            ) : (
              <>
                <Link href="/login">
                  <button className="bg-[#d79921] hover:bg-[#fabd2f] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link href="/">
                  <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                    Back to Home
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-[#a89984] mb-4">No courses available at the moment</div>
            <p className="text-[#bdae93]">Please check back later for new courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-[#3c3836] border border-[#504945] rounded-lg p-6 hover:border-[#689d6a] transition-colors duration-200"
              >
                {/* Course Title */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-[#fabd2f] line-clamp-2 flex-1">
                    {course.title}
                  </h2>
                  <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
                    {user?.user_type === 'student' && user.enrolled_courses?.includes(course.id) && (
                      <span className="bg-[#689d6a] text-[#282828] text-xs px-2 py-1 rounded-full font-medium">
                        Enrolled
                      </span>
                    )}
                    {user?.user_type === 'student' && user.cart?.includes(course.id) && (
                      <span className="bg-[#d79921] text-[#282828] text-xs px-2 py-1 rounded-full font-medium">
                        In Cart
                      </span>
                    )}
                  </div>
                </div>

                {/* Course Description */}
                <p className="text-[#bdae93] mb-4 line-clamp-3 text-sm">
                  {course.description}
                </p>

                {/* Course Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a89984]">Instructor:</span>
                    <span className="text-[#ebdbb2] font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a89984]">Duration:</span>
                    <span className="text-[#ebdbb2]">{course.duration_weeks} weeks</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a89984]">Course ID:</span>
                    <span className="text-[#ebdbb2] font-mono text-xs">{course.id}</span>
                  </div>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="mb-4">
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

                {/* Action Button */}
                <div className="space-y-2">
                  <button 
                    onClick={() => handleActionButtonClick(course)}
                    className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${getActionButtonStyle(course)}`}
                  >
                    {getActionButtonText(course)}
                  </button>
                  
                  {/* Secondary Action for Cart Items */}
                  {user?.user_type === 'student' && user.cart?.includes(course.id) && (
                    <button 
                      onClick={() => handleEnrollment(course, 'enroll')}
                      className="w-full bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Enroll Now
                    </button>
                  )}
                  
                  {/* Teacher Action Buttons */}
                  {user?.user_type === 'teacher' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="flex-1 bg-[#b57614] hover:bg-[#d79921] text-[#282828] font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => course._id && handleDeleteCourse(course._id)}
                        disabled={!course._id}
                        className="flex-1 bg-[#cc241d] hover:bg-[#fb4934] text-[#ebdbb2] font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCourseSubmit}
        course={editingCourse}
        isEditing={isEditing}
      />

      {/* Shopping Cart */}
      {user?.user_type === 'student' && (
        <ShoppingCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          user={user}
          courses={courses}
          onUserUpdate={handleUserUpdate}
          onToast={showToast}
        />
      )}

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

// Main component with Suspense boundary
export default function CoursesPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#282828] text-[#ebdbb2] flex items-center justify-center">
          <div className="text-2xl">Loading courses...</div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
