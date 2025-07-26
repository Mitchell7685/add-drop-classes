'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration_weeks: number;
  tags: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            <h1 className="text-4xl font-bold text-[#fabd2f] mb-2">Available Courses</h1>
            <p className="text-[#a89984]">Browse and explore our course catalog</p>
          </div>
          <Link href="/">
            <button className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Back to Home
            </button>
          </Link>
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
                <h2 className="text-xl font-semibold text-[#fabd2f] mb-3 line-clamp-2">
                  {course.title}
                </h2>

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
                <button className="w-full bg-[#d79921] hover:bg-[#fabd2f]  text-[#282828] font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                  Add Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
