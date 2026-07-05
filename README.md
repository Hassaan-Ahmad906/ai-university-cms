# 🎓 University of the Punjab — Campus Management System (PU CMS)

> A flagship full-stack Campus Management System built with the MERN stack (MongoDB, Express, React, Node.js) featuring AI integration, role-based access control for 10 university roles, and a premium glassmorphic UI.

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

---

## ✨ Features

### 🎯 For Students
- **Dashboard** — CGPA, enrolled courses, pending assignments, attendance stats
- **My Courses** — Enrolled courses with progress tracking
- **Assignments** — View and submit assignments with deadline tracking
- **Grades** — CGPA ring chart, semester tabs, GPA trend bars
- **Timetable** — Weekly visual grid with color-coded class blocks
- **Quizzes & Exams** — Take quizzes, view scores with progress bars
- **Fee & Payments** — Fee breakdown, payment history, installment tracking
- **Transcripts** — Request official transcripts, track status
- **AI Study Buddy** — Floating chatbot for course help & study tips

### 👨‍🏫 For Teachers
- **Dashboard** — Today's classes, recent submissions, quick actions
- **My Courses** — View and manage assigned courses
- **Assignments** — Create, manage, grade assignments with status filters
- **Gradebook** — Spreadsheet-style grading with color-coded scores
- **Attendance** — Interactive Present/Absent/Late toggles with live counters
- **Quizzes & Exams** — Create quizzes, track submissions, manage grading

### 🔑 For Administrators
- **Dashboard** — University-wide stats, system health, quick actions
- **User Management** — CRUD with search, pagination, role management
- **Academic Calendar** — University-wide event management
- **Fee Management** — Revenue tracking, fee collections overview
- **Announcements** — Publish university-wide notices

### 🏛️ Other Roles
- **Vice Chancellor** — Executive dashboard with approvals, rankings, budget
- **Dean** — Faculty performance, department results
- **HOD** — Course oversight, timetable management
- **Registrar** — Transcript processing, student records
- **Treasurer** — Revenue tracking, fee collections, scholarship management
- **Clerk** — Document queue, transcript processing
- **Controller** — Examination management

### 🤖 AI Features (Google Gemini)
- **AI Study Buddy** (Student) — Explains concepts, study tips, exam prep
- **AI Teaching Assistant** (Teacher) — Rubric generation, quiz creation
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
# Navigate to the project
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
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://pulmsadmin:PuLms2026Secure@cluster0.xxxxx.mongodb.net/pu-lms?retryWrites=true&w=majority

# JWT Secret (change in production)
JWT_SECRET=pu-lms-super-secret-jwt-key-2026-change-me
JWT_EXPIRE=7d

# Server Port
PORT=5000

# Google Gemini AI API Key (optional — leave as 'mock' for demo mode)
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

# Terminal 2: Start frontend
npm run dev
```

### Step 4: Add Google AI (Optional)

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

| Role | Email | Access |
|------|-------|--------|
| 👨‍🎓 **Student** | `student@pu.edu.pk` | Courses, Grades, Timetable, Fees, Assignments |
| 👨‍🎓 Student 2 | `student2@pu.edu.pk` | Same as above |
| 👨‍🎓 Student 3 | `student3@pu.edu.pk` | Same as above |
| 👨‍🎓 Student 4 | `student4@pu.edu.pk` | Same as above |
| 👨‍🎓 Student 5 | `student5@pu.edu.pk` | Same as above |
| 👨‍🏫 **Teacher** | `teacher@pu.edu.pk` | Courses, Assignments, Gradebook, Attendance |
| 👨‍🏫 Teacher 2 | `teacher2@pu.edu.pk` | Same as above |
| 🔑 **Admin** | `admin@pu.edu.pk` | User Management, Calendar, Fees, Settings |
| 🎓 **Vice Chancellor** | `vc@pu.edu.pk` | Executive Dashboard, Announcements |
| 🏛️ **Dean** | `dean@pu.edu.pk` | Announcements, Calendar |
| 📋 **HOD** | `hod@pu.edu.pk` | Courses, Timetable, Announcements |
| 📝 **Registrar** | `registrar@pu.edu.pk` | Transcripts, Announcements |
| 💰 **Treasurer** | `treasurer@pu.edu.pk` | Fee Management |
| 📄 **Clerk** | `clerk@pu.edu.pk` | Transcripts, Calendar |
| 🎯 **Controller** | `controller@pu.edu.pk` | Examinations, Calendar |

---

## 📁 Project Structure

```
NEW PRoject Lms/
│
├── .env                              # Environment configuration
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration
├── index.html                        # HTML entry point
├── README.md                         # This file
│
├── server/                           # ═══ BACKEND (25 files) ═══
│   ├── index.js                      # Express server entry
│   ├── config/db.js                  # MongoDB Atlas connection
│   ├── middleware/auth.js            # JWT auth + RBAC
│   ├── models/ (9 schemas)           # User, Course, Assignment, etc.
│   ├── routes/ (11 files)            # REST API endpoints
│   ├── services/geminiService.js     # Google Gemini AI service
│   └── utils/seedData.js             # Database seeder
│
├── src/                              # ═══ FRONTEND (74 files) ═══
│   ├── App.jsx                       # Router (19 routes)
│   ├── main.jsx                      # React entry
│   ├── contexts/                     # Auth + Theme providers
│   ├── components/                   # 12 reusable components
│   ├── layouts/                      # Dashboard layout + role menus
│   ├── pages/ (19 folders)           # All feature pages
│   ├── styles/                       # Design system tokens
│   └── utils/api.js                  # API client
│
└── dist/                             # Production build
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (returns JWT) |
| POST | `/auth/register` | Register user |
| GET | `/auth/me` | Current user profile |
| GET/POST/PUT/DELETE | `/users` | User CRUD (Admin) |
| GET/POST | `/courses` | Course management |
| GET/POST | `/assignments` | Assignment CRUD |
| POST | `/assignments/:id/submit` | Student submission |
| GET/POST | `/grades` | Grade management |
| GET | `/grades/cgpa` | Student CGPA |
| GET/POST | `/attendance` | Attendance marking |
| GET/PUT/DELETE | `/notifications` | Notifications |
| GET/POST | `/messages` | Messaging |
| GET/POST | `/transcripts` | Transcript requests |
| GET | `/dashboard/stats` | Role-aware stats |
| POST | `/ai/chat` | AI chat (role-aware) |
| POST | `/ai/auto-grade` | AI grading assist |
| GET | `/health` | Server health check |

---

## 🤖 AI Integration

| Mode | When | Behavior |
|------|------|----------|
| **Real AI** | Valid `GEMINI_API_KEY` in `.env` | Full Gemini responses |
| **Mock AI** | Key is `mock` or missing | Intelligent pre-built responses |
| **Auto-retry** | Quota limit hit | Keeps key, retries on next request |

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

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| "MongoServerError: bad auth" | Check password in `.env` |
| "connect ECONNREFUSED" | Whitelist IP in Atlas → Network Access |
| "Cannot find module" | Run `npm install` |
| Frontend shows "Network Error" | Backend must be running: `npm run server` |
| Login doesn't work | Start backend first, OR use mock mode (works without DB) |
| AI shows "mock response" | Gemini quota may be exhausted — resets daily |

---

<p align="center">
  <strong>Built with ❤️ for University of the Punjab</strong><br>
  <em>MERN Stack • Google Gemini AI • 99 Source Files • 19 Pages • 10 Roles</em>
</p>
