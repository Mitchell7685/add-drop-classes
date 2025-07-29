'use client';
import { useState } from 'react';

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

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  courses: Course[];
  onUserUpdate: (user: User) => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

export default function ShoppingCart({ 
  isOpen, 
  onClose, 
  user, 
  courses, 
  onUserUpdate, 
  onToast 
}: ShoppingCartProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!isOpen) return null;

  const cartCourses = courses.filter(course => 
    user.cart?.includes(course.id)
  );

  const handleRemoveFromCart = async (courseId: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'removeFromCart',
          userId: user._id,
          courseId: courseId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove course from cart');
      }

      const data = await response.json();
      
      // Update user data
      const updatedUser = data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);

      onToast('Course removed from cart', 'success');
      
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'An error occurred', 'error');
    }
  };

  const handleEnrollFromCart = async () => {
    if (cartCourses.length === 0) {
      onToast('Your cart is empty', 'error');
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'enrollFromCart',
          userId: user._id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll from cart');
      }

      const data = await response.json();
      
      // Update user data
      const updatedUser = data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);

      onToast(data.message || 'Successfully enrolled in courses!', 'success');
      onClose();
      
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'An error occurred', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#3c3836] border border-[#504945] rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#fabd2f]">
            Shopping Cart ({cartCourses.length})
          </h2>
          <button
            onClick={onClose}
            className="text-[#a89984] hover:text-[#ebdbb2] text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Cart Contents */}
        {cartCourses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-xl text-[#a89984] mb-4">Your cart is empty</div>
            <p className="text-[#bdae93] mb-6">Add some courses to get started!</p>
            <button
              onClick={onClose}
              className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            {/* Course List */}
            <div className="space-y-4 mb-6">
              {cartCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#282828] border border-[#504945] rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#fabd2f] mb-2">
                      {course.title}
                    </h3>
                    <p className="text-[#bdae93] text-sm mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#a89984]">
                      <span>Instructor: {course.instructor}</span>
                      <span>Duration: {course.duration_weeks} weeks</span>
                      <span>ID: {course.id}</span>
                    </div>
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-[#458588] text-[#ebdbb2] text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(course.id)}
                    className="bg-[#cc241d] hover:bg-[#fb4934] text-[#ebdbb2] font-semibold py-1 px-3 rounded text-sm ml-4 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Actions */}
            <div className="border-t border-[#504945] pt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-[#ebdbb2]">
                  <span className="text-lg font-semibold">
                    Total: {cartCourses.length} course{cartCourses.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#a89984] hover:bg-[#bdae93] text-[#282828] font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleEnrollFromCart}
                  disabled={isEnrolling}
                  className="flex-1 bg-[#689d6a] hover:bg-[#98971a] text-[#282828] font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll in All Courses'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
