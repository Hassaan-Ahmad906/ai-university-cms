# 🎓 University of the Punjab — Learning Management System (PU LMS)

> A flagship full-stack Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js) featuring AI integration, role-based access control for 10 university roles, and a premium glassmorphic UI.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Express](https://img.shields.io/badge/Express-5-000000?logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb) ![AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Setup Guide](#-detailed-setup-guide)
- [Login Credentials](#-login-credentials)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [AI Integration](#-ai-integration)
- [Screenshots](#-pages--routes)

---

## ✨ Features

### 🎯 For Students
- **Dashboard** — CGPA, enrolled courses, pending assignments, attendance stats
- **Courses** — Enrolled courses with progress tracking
- **Grades** — CGPA ring chart, semester tabs, GPA trend bars
- **Timetable** — Weekly visual grid with color-coded class blocks
- **Assignments** — View, submit assignments with deadline tracking
- **Quizzes & Exams** — Take quizzes, view scores with progress bars
- **Fee & Payments** — Fee breakdown, payment history, installment tracking
- **Transcripts** — Request official transcripts, track status
- **AI Study Buddy** — Floating chatbot for course help & study tips

### 👨‍🏫 For Teachers
- **Dashboard** — Today's classes, recent submissions, quick actions
- **Assignments** — Create, manage, grade assignments with status filters
- **Gradebook** — Spreadsheet-style grading with color-coded scores
- **Attendance** — Interactive Present/Absent/Late toggles with live counters
- **Exam Management** — Create quizzes, track submissions, AI-assisted grading

### 🔑 For Administrators
- **Dashboard** — University-wide stats, system health, quick actions
- **User Management** — CRUD with search, pagination, role management
- **Department Management** — Faculty and department oversight
- **Reports & Analytics** — Data-driven insights

### 🏛️ For Other Roles
- **Vice Chancellor** — Executive dashboard with approvals, rankings, budget
- **Dean** — Faculty performance, department results
- **HOD** — Faculty management, course allocation, workload
- **Registrar** — Student records, transcript processing pipeline
- **Treasurer** — Revenue tracking, fee collections, scholarship management
- **Clerk** — Document queue, transcript processing
- **Controller** — Examination management

### 🤖 AI Features (Google Gemini)
- **AI Study Buddy** (Student) — Explains concepts, study tips, exam prep
- **AI Teaching Assistant** (Teacher) — Rubric generation, auto-grading, quiz creation
- **AI Admin Assistant** (Admin) — Data analysis, report summaries

### 🎨 Design
- **Dark & Light Mode** — Full theme support with one-click toggle
- **Glassmorphic UI** — Premium frosted glass effects throughout
- **Responsive** — Works on desktop, tablet, and mobile
- **Smooth Animations** — Fade-in, slide-in, hover effects on every element
- **University Branding** — Punjab University navy, gold, and crimson colors

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite 7 | UI framework |
| Routing | React Router v7 | Client-side routing |
| Icons | Lucide React | Icon library |
| Styling | Vanilla CSS + CSS Variables | Design system (380+ tokens) |
| Backend | Express 5 (Node.js) | REST API server |
| Database | MongoDB Atlas (Mongoose 8) | Cloud database |
| Auth | JSON Web Tokens (JWT) | Authentication |
| Encryption | bcryptjs | Password hashing |
| AI | Google Generative AI (Gemini) | AI chatbot & services |

---

## 🚀 Quick Start

```bash
# Clone or navigate to the project
cd "c:\Users\User\Desktop\NEW PRoject Lms"

# Install dependencies
npm install

# Seed the database with demo data
npm run seed

# Start the backend server (Terminal 1)
npm run server

# Start the frontend dev server (Terminal 2)
npm run dev
```

**Open:** http://localhost:3000  
**Login:** `student@pu.edu.pk` / `demo123`

---

## 📖 Detailed Setup Guide

### Prerequisites
- **Node.js** v18+ installed ([download](https://nodejs.org))
- **MongoDB Atlas** account (free) — [sign up](https://www.mongodb.com/cloud/atlas/register)
- **Google AI API Key** (optional) — [get one](https://aistudio.google.com/apikey)

### Step 1: MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Click **"Create Deployment"** → Choose **"M0 FREE"**
4. Region: **Mumbai (ap-south-1)** — closest to Pakistan
5. Click **"Create Deployment"**

**Create Database User:**
- Username: `pulmsadmin`
- Password: `PuLms2026Secure` *(no special characters like @#%)*
- Click **"Create Database User"**

**Network Access:**
- Click **"Add My Current IP Address"** or **"Allow Access from Anywhere"** (`0.0.0.0/0`)

**Get Connection String:**
- Click **"Connect"** → **"Drivers"** → Copy the string
- Replace `<password>` with your actual password

### Step 2: Configure Environment

Edit the `.env` file in the project root:

```env
# Paste your MongoDB Atlas connection string here
MONGODB_URI=mongodb+srv://pulmsadmin:PuLms2026Secure@cluster0.xxxxx.mongodb.net/pu-lms?retryWrites=true&w=majority

# JWT Secret (change in production)
JWT_SECRET=pu-lms-super-secret-jwt-key-2026-change-me
JWT_EXPIRE=7d

# Server Port
PORT=5000

# Google Gemini AI API Key (optional — set to 'mock' for now)
GEMINI_API_KEY=mock

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Step 3: Install, Seed & Run

```bash
# Install all dependencies
npm install

# Seed database with demo data (15 users, 6 courses, grades, etc.)
npm run seed

# Terminal 1: Start backend
npm run server
# Expected output:
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
# 🚀 PU LMS Server running on port 5000

# Terminal 2: Start frontend
npm run dev
# Expected output:
# VITE v7.3.5 ready in ~500ms
# ➜ Local: http://localhost:3000/
```

### Step 4: Add Google AI (Optional — When Ready)

1. Go to https://aistudio.google.com/apikey
2. Sign in with Google → Click **"Create API Key"**
3. Copy the key and update `.env`:
   ```
   GEMINI_API_KEY=AIzaSy...your-key-here
   ```
4. Restart the backend: `npm run server`

---

## 🔐 Login Credentials

All demo accounts use password: **`demo123`**

| Role | Email | Access Level |
|------|-------|-------------|
| 👨‍🎓 **Student** | `student@pu.edu.pk` | Courses, Grades, Timetable, Fees, Transcripts, AI Buddy |
| 👨‍🎓 Student 2 | `student2@pu.edu.pk` | Same as above |
| 👨‍🎓 Student 3 | `student3@pu.edu.pk` | Same as above |
| 👨‍🎓 Student 4 | `student4@pu.edu.pk` | Same as above |
| 👨‍🎓 Student 5 | `student5@pu.edu.pk` | Same as above |
| 👨‍🏫 **Teacher** | `teacher@pu.edu.pk` | Assignments, Gradebook, Attendance, AI Assistant |
| 👨‍🏫 Teacher 2 | `teacher2@pu.edu.pk` | Same as above |
| 🔑 **Admin** | `admin@pu.edu.pk` | Full system access, User Management, Settings |
| 🎓 **Vice Chancellor** | `vc@pu.edu.pk` | Executive dashboard, Approvals, Analytics |
| 🏛️ **Dean** | `dean@pu.edu.pk` | Faculty oversight, Department Performance |
| 📋 **HOD** | `hod@pu.edu.pk` | Department management, Faculty, Courses |
| 📝 **Registrar** | `registrar@pu.edu.pk` | Student records, Transcripts, Admissions |
| 💰 **Treasurer** | `treasurer@pu.edu.pk` | Fee management, Financial reports |
| 📄 **Clerk** | `clerk@pu.edu.pk` | Document processing, Transcript queue |
| 🎯 **Controller** | `controller@pu.edu.pk` | Examination management |

---

## 📁 Project Structure

```
NEW PRoject Lms/
│
├── .env                              # Environment configuration
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration
├── index.html                        # HTML entry point
│
├── server/                           # ═══ BACKEND (25 files) ═══
│   ├── index.js                      # Express server entry
│   ├── config/
│   │   └── db.js                     # MongoDB Atlas connection
│   ├── middleware/
│   │   └── auth.js                   # JWT auth + RBAC middleware
│   ├── models/
│   │   ├── User.js                   # User schema (10 roles)
│   │   ├── Course.js                 # Course with teacher/students
│   │   ├── Assignment.js             # Teacher assignments
│   │   ├── Submission.js             # Student submissions
│   │   ├── Grade.js                  # Grade records + GPA
│   │   ├── Attendance.js             # Attendance records
│   │   ├── Notification.js           # Notifications
│   │   ├── Message.js                # Direct messages
│   │   └── Transcript.js             # Document requests
│   ├── routes/
│   │   ├── auth.js                   # Login, Register, Profile
│   │   ├── users.js                  # User CRUD (admin)
│   │   ├── courses.js                # Course CRUD + enrollment
│   │   ├── assignments.js            # Assignments + grading
│   │   ├── grades.js                 # Grades + CGPA
│   │   ├── attendance.js             # Attendance marking
│   │   ├── notifications.js          # Notification management
│   │   ├── messages.js               # Messaging system
│   │   ├── transcripts.js            # Transcript requests
│   │   ├── dashboard.js              # Role-aware stats
│   │   └── ai.js                     # AI chatbot + auto-grade
│   ├── services/
│   │   └── geminiService.js          # Google Gemini AI wrapper
│   └── utils/
│       └── seedData.js               # Database seeder
│
├── src/                              # ═══ FRONTEND (74 files) ═══
│   ├── App.jsx                       # Router (19 routes)
│   ├── main.jsx                      # React entry point
│   ├── contexts/
│   │   ├── AuthContext.jsx           # Authentication state
│   │   └── ThemeContext.jsx          # Dark/Light theme
│   ├── utils/
│   │   └── api.js                    # API client with JWT
│   ├── styles/
│   │   ├── variables.css             # Design system (380+ tokens)
│   │   └── index.css                 # Global styles & animations
│   ├── layouts/
│   │   ├── DashboardLayout.jsx       # Main layout + sidebar menus
│   │   └── DashboardLayout.css
│   ├── components/
│   │   ├── AIChatWidget/             # Floating AI chat bubble
│   │   └── common/                   # 11 reusable components
│   │       ├── Button/
│   │       ├── Input/
│   │       ├── Card/
│   │       ├── Modal/
│   │       ├── Sidebar/
│   │       ├── Topbar/
│   │       ├── StatCard/
│   │       ├── DataTable/
│   │       ├── Avatar/
│   │       ├── Badge/
│   │       └── LoadingSpinner/
│   └── pages/                        # 19 page directories
│       ├── Login/
│       ├── Dashboard/                # 9 role-specific dashboards
│       ├── Courses/
│       ├── Users/
│       ├── Profile/
│       ├── Assignments/
│       ├── Gradebook/
│       ├── Attendance/
│       ├── Grades/
│       ├── Timetable/
│       ├── Transcripts/
│       ├── Fees/
│       ├── Calendar/
│       ├── Announcements/
│       ├── Exams/
│       ├── Notifications/
│       ├── Messages/
│       ├── Settings/
│       └── NotFound/
│
└── dist/                             # Production build output
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/auth/login` | Login → returns JWT token | ❌ |
| POST | `/auth/register` | Register new user | ❌ |
| GET | `/auth/me` | Get current user profile | ✅ |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users?role=student&search=ali&page=1` | List users with filters |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Deactivate user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List courses (role-filtered) |
| POST | `/courses` | Create course (Admin/HOD) |
| GET | `/courses/:id` | Get course with students |
| POST | `/courses/:id/enroll` | Enroll student |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assignments` | List assignments |
| POST | `/assignments` | Create assignment (Teacher) |
| POST | `/assignments/:id/submit` | Submit assignment (Student) |
| PUT | `/assignments/:id/grade` | Grade submission (Teacher) |

### Grades
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/grades` | List grades (role-filtered) |
| POST | `/grades` | Set grade (Teacher) |
| GET | `/grades/cgpa` | Calculate student CGPA |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/chat` | Chat with AI (role-aware) |
| GET | `/ai/study-recommendations` | Study tips (Student) |
| POST | `/ai/auto-grade` | AI-assisted grading (Teacher) |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Role-aware dashboard data |
| GET/PUT/DELETE | `/notifications/*` | Notification management |
| GET/POST | `/messages/*` | Messaging system |
| GET/POST | `/transcripts/*` | Transcript requests |
| GET/POST | `/attendance/*` | Attendance management |

---

## 🤖 AI Integration

The app uses **Google Gemini AI** with automatic fallback:

| Mode | When | Behavior |
|------|------|----------|
| **Real AI** | `GEMINI_API_KEY` is set in `.env` | Full Gemini responses |
| **Mock AI** | Key is `mock` or missing | Intelligent pre-built responses |
| **Fallback** | Gemini API fails | Auto-switches to mock |

**To enable real AI:**
1. Get API key: https://aistudio.google.com/apikey
2. Update `.env`: `GEMINI_API_KEY=AIzaSy...`
3. Restart server: `npm run server`

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Frontend Dev | `npm run dev` | Start Vite dev server (port 3000) |
| Frontend Build | `npm run build` | Production build to `dist/` |
| Backend Server | `npm run server` | Start Express server (port 5000) |
| Seed Database | `npm run seed` | Populate DB with demo data |
| Preview Build | `npm run preview` | Preview production build |

---

## 📝 License

This project is developed for **University of the Punjab** as a flagship LMS solution.

---

<p align="center">
  <strong>Built with ❤️ for University of the Punjab</strong><br>
  <em>MERN Stack • Google Gemini AI • 99 Source Files • 19 Pages • 10 Roles</em>
</p>
