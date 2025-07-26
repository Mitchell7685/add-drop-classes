# Course Manager - Add/Drop Classes System

A comprehensive course management system built with Next.js, TypeScript, and MongoDB that allows students to enroll in courses and teachers to manage their course offerings.

## 🚀 Features

### For Students

- **Browse Courses**: View available courses with detailed information
- **Course Enrollment**: Enroll in or drop courses with one click
- **User Dashboard**: View enrolled courses and manage account
- **Real-time Updates**: Instant feedback on enrollment actions

### For Teachers

- **Course Management**: Create, edit, and delete courses
- **Course Details**: Add comprehensive course information including:
  - Course title and description
  - Duration in weeks
  - Tags for categorization
  - Instructor information
- **Teacher Dashboard**: Dedicated interface for course administration

### General Features

- **Role-based Authentication**: Separate interfaces for students and teachers
- **Responsive Design**: Modern, accessible UI with Gruvbox color scheme
- **Protected Routes**: Secure access control based on user roles
- **Toast Notifications**: User-friendly feedback for all actions
- **Test User System**: Easy access to demo accounts

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom Gruvbox theme
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom localStorage-based auth (demo purposes)
- **API**: Next.js API routes for backend functionality

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd add-drop-classes
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
add-drop-classes/
├── app/                    # Next.js App Router pages
│   ├── courses/           # Course listing and management
│   ├── login/             # Authentication page
│   ├── schedule/          # Schedule view (placeholder)
│   ├── test-users/        # Demo user accounts
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── CourseModal.tsx    # Course creation/editing modal
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── Toast.tsx          # Notification component
├── lib/                   # Utility functions and configurations
│   ├── auth.ts            # Authentication utilities
│   └── mongo/             # Database connection and queries
│       ├── index.js       # MongoDB client setup
│       ├── courses.js     # Course-related database operations
│       └── users.js       # User-related database operations
├── pages/api/             # API endpoints
│   ├── auth/login.js      # Login authentication
│   ├── courses/index.js   # Course CRUD operations
│   └── users/index.js     # User management and enrollment
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login

### Courses

- `GET /api/courses` - Fetch all courses
- `POST /api/courses` - Create new course (teachers only)
- `PUT /api/courses` - Update existing course (teachers only)
- `DELETE /api/courses` - Delete course (teachers only)

### Users

- `GET /api/users` - Fetch all users (for test page)
- `POST /api/users` - Handle course enrollment/unenrollment

## 👤 User Roles

### Student

- View and browse all available courses
- Enroll in or drop courses
- View enrollment status for each course
- Access personal dashboard

### Teacher

- All student permissions
- Create new courses
- Edit existing courses
- Delete courses they manage
- Access teacher dashboard

## 🎨 Design System

The application uses a custom Gruvbox-inspired color scheme:

- **Background**: Dark grey (`#282828`)
- **Surface**: Medium grey (`#3c3836`)
- **Primary**: Yellow (`#fabd2f`)
- **Secondary**: Blue (`#458588`)
- **Success**: Green (`#689d6a`)
- **Error**: Red (`#fb4934`)
- **Text**: Light beige (`#ebdbb2`)

## 🔐 Authentication System

The current implementation uses localStorage for session management (suitable for demo purposes). In a production environment, consider implementing:

- JWT tokens with secure HTTP-only cookies
- Session-based authentication
- OAuth integration
- Password hashing (currently passwords are stored in plain text for demo)

## 🧪 Test Users

The application includes a test user system accessible at `/test-users`. This page displays available demo accounts for testing different user roles and functionalities.

## 📱 Pages Overview

### Home (`/`)

- Welcome page with role-based navigation
- User status display
- Quick access to main features

### Login (`/login`)

- User authentication form
- Role-based redirect after login
- Link to test users page

### Courses (`/courses`)

- Main course listing page
- Role-specific functionality (student vs teacher)
- Course enrollment/management interface
- Search and filter capabilities

### Test Users (`/test-users`)

- Demo account information
- Easy testing of different user roles
- Account credentials display

## 🚀 Getting Started for Development

1. **Database Setup**: Ensure MongoDB is running and accessible
2. **Sample Data**: Add sample courses and users to the database
3. **Environment**: Configure environment variables
4. **Testing**: Use the test users page to explore functionality

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. See license file for details.

