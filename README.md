# Class Management App

A comprehensive web application for managing educational classes, students, attendance, assignments, and grades. Built with Next.js, React, Node.js, and MongoDB.

## Features

- **Class Management**: Create, edit, and remove classes
- **Teacher Assignment**: Assign teachers to classes
- **Student Management**: Add, edit, and remove students from classes
- **Attendance Tracking**: Track student attendance for each class session
- **Content Management**: Describe class content and attach files
- **Assignment System**: Create and manage homework, tests, and projects
- **Grade Tracking**: Track and calculate student grades
- **User Authentication**: Secure login and registration system

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 🚀 Quick Start

### Option 1: Full Stack Development
```bash
# Start both frontend and backend
./start-dev.sh
```

### Option 2: Individual Servers
```bash
# Install all dependencies
npm run install:all

# Start backend (in one terminal)
npm run backend

# Start frontend (in another terminal)
npm run dev
```

### Option 3: Production Deployment
```bash
# Deploy to Vercel + Railway + MongoDB Atlas
./deploy.sh
```

## 📖 Detailed Setup

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd class-management-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   cd ..
   ```

5. **Start MongoDB**
   - Local: `mongod`
   - Cloud: Use MongoDB Atlas or similar service

6. **Start the development servers**
   ```bash
   npm run dev:full
   ```

## 🌐 Deployment

### Frontend (Vercel)
- Automatically deploys from GitHub
- Configured for Next.js
- Custom domain support

### Backend (Railway)
- Free tier available
- Automatic deployments
- Environment variable management

### Database (MongoDB Atlas)
- Free tier available
- Automatic backups
- Global distribution

**📋 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

## Project Structure

```
class-management-app/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   │   ├── page.tsx       # Main dashboard
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Global styles
│   ├── lib/               # Utility libraries
│   │   └── api.ts         # API client configuration
│   └── components/        # React components
├── backend/               # Backend API
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── config/        # Configuration files
│   │   └── server.js      # Express server
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── package.json           # Frontend dependencies
├── start-dev.sh           # Development startup script
├── deploy.sh              # Deployment script
├── DEPLOYMENT.md          # Complete deployment guide
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `GET /api/users/role/:role` - Get users by role

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `POST /api/classes/:id/enroll` - Enroll student
- `DELETE /api/classes/:id/enroll/:studentId` - Remove student

### Class Sessions
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session
- `POST /api/sessions/:id/attendance` - Record attendance
- `GET /api/sessions/class/:classId/attendance-summary` - Get attendance summary

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- `POST /api/assignments/:id/submit` - Submit assignment
- `PUT /api/assignments/:id/grade/:submissionId` - Grade submission
- `GET /api/assignments/class/:classId/grades` - Get grades summary

## Database Models

### User
- Basic info (name, email, password)
- Role (teacher, student, admin)
- Authentication fields

### Class
- Class details (name, description, subject)
- Teacher assignment
- Student enrollment
- Schedule and academic info

### ClassSession
- Individual class meetings
- Attendance records
- Content and materials
- Session notes

### Assignment
- Assignment details (title, description, type)
- Due dates and scoring
- Student submissions
- Grades and feedback

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start frontend only
npm run backend          # Start backend only
npm run dev:full         # Start both frontend and backend
npm run install:all      # Install all dependencies

# Production
npm run build            # Build frontend
npm run start            # Start production frontend
npm run lint             # Lint code

# Deployment
./deploy.sh              # Deploy to production
./start-dev.sh           # Start development environment
```

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Backend (.env)
```bash
MONGODB_URI=mongodb://localhost:27017/class-management
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

### Quick Deploy
1. **Push to GitHub** - triggers Vercel deployment
2. **Deploy backend** to Railway
3. **Set up MongoDB Atlas** database
4. **Configure environment variables**

### Manual Deploy
See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**🎯 Ready to deploy?** Run `./deploy.sh` to get started!
