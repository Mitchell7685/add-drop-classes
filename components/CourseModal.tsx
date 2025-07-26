'use client';
import { useState, useEffect } from 'react';

interface Course {
  _id?: string;
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration_weeks: number;
  tags: string[];
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: Course) => Promise<void>;
  course?: Course | null;
  isEditing?: boolean;
}

export default function CourseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  course, 
  isEditing = false 
}: CourseModalProps) {
  const [formData, setFormData] = useState<Course>({
    id: '',
    title: '',
    description: '',
    instructor: '',
    duration_weeks: 1,
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && course) {
      setFormData({
        ...course,
        tags: course.tags || []
      });
    } else {
      setFormData({
        id: '',
        title: '',
        description: '',
        instructor: '',
        duration_weeks: 1,
        tags: []
      });
    }
    setTagInput('');
  }, [isEditing, course, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_weeks' ? parseInt(value) || 1 : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.activeElement) {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3c3836] border border-[#504945] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#fabd2f]">
              {isEditing ? 'Edit Course' : 'Add New Course'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#a89984] hover:text-[#ebdbb2] text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Course ID */}
            <div>
              <label className="block text-[#ebdbb2] text-sm font-medium mb-2">
                Course ID *
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled={isEditing}
                className="w-full bg-[#282828] border border-[#504945] rounded-lg px-3 py-2 text-[#ebdbb2] focus:border-[#689d6a] focus:outline-none disabled:opacity-50"
                placeholder="e.g., CS101"
                required
              />
              {isEditing && (
                <p className="text-[#a89984] text-xs mt-1">Course ID cannot be changed</p>
              )}
            </div>

            {/* Course Title */}
            <div>
              <label className="block text-[#ebdbb2] text-sm font-medium mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-[#282828] border border-[#504945] rounded-lg px-3 py-2 text-[#ebdbb2] focus:border-[#689d6a] focus:outline-none"
                placeholder="Introduction to Computer Science"
                required
              />
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-[#ebdbb2] text-sm font-medium mb-2">
                Instructor *
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full bg-[#282828] border border-[#504945] rounded-lg px-3 py-2 text-[#ebdbb2] focus:border-[#689d6a] focus:outline-none"
                placeholder="Dr. John Smith"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[#ebdbb2] text-sm font-medium mb-2">
                Duration (weeks) *
              </label>
              <input
                type="number"
                name="duration_weeks"
                value={formData.duration_weeks}
                onChange={handleInputChange}
                min="1"
                max="52"
                className="w-full bg-[#282828] border border-[#504945] rounded-lg px-3 py-2 text-[#ebdbb2] focus:border-[#689d6a] focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#ebdbb2] text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#282828] border border-[#504945] rounded-lg px-3 py-2 text-[#ebdbb2] focus:border-[#689d6a] focus:outline-none resize-none"
                placeholder="Course description..."
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[#ebdbb2] text-sm font-medium mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-[#282828] border border-[#504945] rounded-lg px-3 py-2 text-[#ebdbb2] focus:border-[#689d6a] focus:outline-none"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#458588] hover:bg-[#689d6a] text-[#ebdbb2] px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#458588] text-[#ebdbb2] text-sm px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#ebdbb2] hover:text-[#fb4934] font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#504945] hover:bg-[#665c54] text-[#ebdbb2] font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#689d6a] hover:bg-[#98971a] text-[#282828] font-semibold py-2 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
