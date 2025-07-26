// Authentication utility functions
export interface User {
  _id: string;
  username: string;
  full_name: string;
  user_type: 'teacher' | 'student';
}

export const authUtils = {
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Set user in localStorage
  setCurrentUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Remove user from localStorage
  clearCurrentUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return authUtils.getCurrentUser() !== null;
  },

  // Check if user is a teacher
  isTeacher: (): boolean => {
    const user = authUtils.getCurrentUser();
    return user?.user_type === 'teacher';
  },

  // Check if user is a student
  isStudent: (): boolean => {
    const user = authUtils.getCurrentUser();
    return user?.user_type === 'student';
  },

  // Login user
  login: async (username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
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
        return { success: false, error: data.error || 'Login failed' };
      }

      authUtils.setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  },

  // Logout user
  logout: (): void => {
    authUtils.clearCurrentUser();
  }
};
