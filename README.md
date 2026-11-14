# JobNova – Advanced Job Portal Application

[![React](https://img.shields.io/badge/Frontend-React_18_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Security-JWT_Authentication-black?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **JobNova** is a modern, enterprise-grade, full-stack Job Portal and Applicant Tracking System (ATS) inspired by **Naukri.com**, **Indeed**, and **LinkedIn Jobs**. Tailored specifically for the Indian technology ecosystem, JobNova offers transparent compensation ranges in INR (₹ LPA), verified corporate credentials, real-time 6-stage application tracking, and role-tailored dashboards.

---

## Table of Contents

1. [Key Features & Highlights](#1-key-features--highlights)
2. [Technology Stack](#2-technology-stack)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [The 30 Job Categories](#4-the-30-job-categories)
5. [The 20 Job Posting Fields](#5-the-20-job-posting-fields)
6. [Website Pages & Routing Map](#6-website-pages--routing-map)
7. [Database Architecture & Mongoose Models](#7-database-architecture--mongoose-models)
8. [REST API Documentation](#8-rest-api-documentation)
9. [Pre-Seeded Demo Accounts](#9-pre-seeded-demo-accounts)
10. [Local Installation & Setup Guide](#10-local-installation--setup-guide)
11. [Security & File Uploads](#11-security--file-uploads)
12. [Project Folder Structure](#12-project-folder-structure)

---

## 1. Key Features & Highlights

- **Dark & Light Mode**: Seamless theme toggle persisted via `localStorage` with Tailwind's dark utility class system.
- **Indian Market Focus**: Upfront salary ranges in Indian Rupees (₹ LPA) across Bengaluru, Mumbai, Pune, Hyderabad, Delhi NCR, Chennai, Ahmedabad, Indore, and Remote.
- **Strict Role-Based Access Control (RBAC)**: Distinct layouts, navigations, and guarded routes for Job Seekers, Employers, and Admins.
- **Interactive 6-Stage ATS Pipeline**: Real-time progress through `Applied` → `Under Review` → `Shortlisted` → `Interview Scheduled` → `Hired` or `Rejected`.
- **Interview Scheduling**: Recruiter interview invitation system with Google Meet/Zoom links, IST time picker, and calendar integration.
- **Resume Upload & Parsing Support**: Multer disk-based file uploads supporting PDF, DOC, and DOCX up to 5MB.
- **In-App Real-Time Notifications**: Unread badges, mark-as-read, notification filter tabs, and instant links.
- **Platform Governance & Content Moderation**: Full admin moderation suite for job approvals, reports resolution, and user suspension.

---

## 2. Technology Stack

### Frontend
- **React.js 18** with **Vite 5** (Blazing fast HMR and optimized production bundling)
- **Tailwind CSS v3** (Custom tokens, animations, dark mode)
- **React Router DOM v6** (Nested routes, role guards, scroll restoration)
- **Axios** (Centralized API client with JWT bearer interceptors)
- **Lucide React** (Clean, uniform iconography)

### Backend
- **Node.js** & **Express.js** (Modular controller-service-route REST architecture)
- **JWT (JSON Web Tokens)** (Stateless authentication with 30-day token expiry)
- **Bcrypt.js** (Salted password hashing with 10 salt rounds)
- **Multer** (Multipart file upload middleware with MIME-type restriction)
- **Morgan & CORS** (Logging and cross-origin resource sharing)

### Database
- **MongoDB** (NoSQL document database)
- **Mongoose ODM v8** (Schema validation, pre-save hooks, virtuals, and compound indexing)

---

## 3. User Roles & Permissions

JobNova implements 3 distinct roles:

### 1. Job Seeker (`jobseeker` / `candidate`)
- **Profile Management**: Profile photo, resume upload (PDF/DOC/DOCX), education history, work experience, technical skills tag manager.
- **Job Discovery**: Advanced search (keyword, company, skills, location), filter by 30 categories, INR salary range slider, experience level, work mode, and job type.
- **Application Workflow**: 1-click apply using saved resume or custom upload, cover letter, expected salary, notice period.
- **Tracking**: Real-time 6-stage timeline tracker, withdraw applications, view interview links, bookmark/save jobs.
- **Notifications**: Instant alerts on status changes, recruiter shortlists, and scheduled interviews.

### 2. Employer / Recruiter (`employer` / `recruiter`)
- **Corporate Branding**: Company profile, logo, website, industry, employee size, headquarters location.
- **Job Posting & Management**: Create and edit jobs with all 20 required fields, toggle status (`Active`, `Paused`, `Closed`), and delete posts.
- **Candidate Evaluation**: View full applicant profiles, download candidate resumes directly, view candidate education and past work experience.
- **Hiring Pipeline**: Move candidates across the 6 application stages, add internal recruiter evaluation notes.
- **Interview Scheduler**: Schedule interviews with date, IST time, interview type (Google Meet, Zoom, In-Person), meeting URL, and instructions.
- **Hiring Analytics**: Metric cards for active jobs, total candidates, stage breakdown, and recent applications.

### 3. Administrator (`admin`)
- **Platform Analytics**: Total users, total job seekers, total employers, active jobs, total applications, pending job approvals.
- **User Governance**: Search users, toggle account suspension, delete inappropriate accounts.
- **Job Governance**: Review pending job listings, approve or reject job posts, delete fraudulent posts.
- **Reports Moderation**: Review candidate-reported job listings (scam, fake salary, offensive content) with direct dismiss or delete actions.
- **Category Management**: View and manage all 30 job categories with real-time live job counts.

---

## 4. The 30 Job Categories

Pre-seeded and fully searchable across the entire platform:

1. Software Development
2. Web Development
3. Frontend Development
4. Backend Development
5. Full Stack Development
6. Mobile App Development
7. UI/UX Design
8. Graphic Design
9. Data Science
10. Data Analytics
11. Artificial Intelligence
12. Machine Learning
13. Cyber Security
14. Cloud Computing
15. DevOps
16. Digital Marketing
17. SEO
18. Content Writing
19. Business Development
20. Sales & Marketing
21. Human Resources
22. Finance & Accounting
23. Banking
24. Customer Support
25. Education & Teaching
26. Healthcare
27. Engineering
28. Mechanical Engineering
29. Civil Engineering
30. Government Jobs

---

## 5. The 20 Job Posting Fields

Every job post in JobNova captures:

| # | Field Name | Description & Example Values |
|---|---|---|
| 1 | `title` | Job Title (e.g. *Senior Full Stack Engineer (MERN)*) |
| 2 | `companyName` | Display Company Name (e.g. *Infosys Technologies*) |
| 3 | `companyLogo` | URL or uploaded logo graphic |
| 4 | `description` | Comprehensive role overview and company mission |
| 5 | `category` | One of the 30 standardized Job Categories |
| 6 | `skills` | Array of technical & soft skills (e.g. `['React', 'Node.js', 'MongoDB', 'AWS']`) |
| 7 | `location` | Indian metro or city (e.g. *Bengaluru, Karnataka*) |
| 8 | `workMode` | `Remote`, `Hybrid`, or `On-site` |
| 9 | `jobType` | `Full-time`, `Part-time`, `Internship`, or `Contract` |
| 10 | `experience` | Required experience (e.g. `0-1 Years`, `1-3 Years`, `3-5 Years`, `5+ Years`) |
| 11 | `salaryMin` | Minimum annual salary in INR LPA (e.g. `18` for ₹18,00,000) |
| 12 | `salaryMax` | Maximum annual salary in INR LPA (e.g. `30` for ₹30,00,000) |
| 13 | `vacancies` | Total number of open positions (e.g. `5`) |
| 14 | `education` | Minimum qualification (e.g. *B.Tech / B.E. in CS / MCA*) |
| 15 | `deadline` | Application closing date |
| 16 | `responsibilities` | Core duties array (architecting services, code reviews, etc.) |
| 17 | `requirements` | Prerequisites (system design proficiency, 3+ years production React) |
| 18 | `benefits` | Perks array (Health insurance, gym, ESOPs, remote stipend) |
| 19 | `status` | Listing status (`Active`, `Paused`, `Closed`) |
| 20 | `createdAt` | Automated Mongoose ISO timestamp |

---

## 6. Website Pages & Routing Map

JobNova implements all 21 website pages:

| # | Page Name | Route Path | Access Level | Description |
|---|---|---|---|---|
| 1 | **Home** | `/` | Public | Hero banner with search, statistics, featured jobs, top companies, categories |
| 2 | **All Jobs** | `/jobs` | Public | Advanced search, sidebar filters, sorting, active filter chips, pagination |
| 3 | **Job Details** | `/jobs/:id` | Public | Full 20 fields overview, company card, apply modal, bookmark, report modal |
| 4 | **Companies** | `/companies` | Public | Directory of 20 verified Indian companies with search & industry filters |
| 5 | **Company Details** | `/companies/:id` | Public | Company profile, about description, all active jobs posted by company |
| 6 | **Login** | `/login` | Public | Sign in with 1-click test credentials for Seeker, Employer, and Admin |
| 7 | **Register** | `/register` | Public | Onboarding with Job Seeker vs. Employer role switcher |
| 8 | **Forgot Password** | `/forgot-password` | Public | 3-step password recovery flow |
| 9 | **Job Seeker Dashboard** | `/dashboard/seeker` | Candidate | Profile completeness meter, recent applications, interview alerts, recommendations |
| 10 | **Employer Dashboard** | `/dashboard/employer` | Employer | Job analytics, applicant pipeline distribution bar, quick candidate actions |
| 11 | **Admin Dashboard** | `/dashboard/admin` | Admin | Platform KPI counters, user management, job approvals, reports, category stats |
| 12 | **My Profile** | `/profile` | Authenticated | Photo & resume upload, personal info, skills manager, education, experience |
| 13 | **My Applications** | `/my-applications` | Candidate | Tabbed application stages, interview details card, withdrawal modal |
| 14 | **Saved Jobs** | `/saved-jobs` | Candidate | Bookmarked job openings grid with quick apply and remove |
| 15 | **Post a Job** | `/post-job` | Employer/Admin | Form capturing all 20 required job attributes with validation |
| 16 | **Manage Jobs** | `/employer/manage-jobs` | Employer/Admin | Employer listings table, status switcher, applicants count link, edit & delete |
| 17 | **Manage Applicants** | `/employer/applicants` | Employer/Admin | Candidate cards by job, view full profile modal, schedule interview modal |
| 18 | **Notifications** | `/notifications` | Authenticated | Notification list with type icons, filter tabs, mark read, mark all read, delete |
| 19 | **Contact Us** | `/contact` | Public | Interactive contact form, Indian office addresses, email/phone helpdesk, FAQs |
| 20 | **About Us** | `/about` | Public | Mission, platform stats, core values, leadership team, employer/candidate CTAs |
| 21 | **404 Not Found** | `*` | Public | Polished error page with navigation shortcuts |

---

## 7. Database Architecture & Mongoose Models

JobNova's database architecture contains 8 models with relations, validation, and compound indexes:

```
┌───────────────────────────────────────────────────────────┐
│                    MongoDB: jobnova                       │
└───────────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
   ┌───────────┐              ┌───────────┐
   │   User    │◄────1:1─────►│  Company  │
   └───────────┘              └───────────┘
         │                          │
         │ 1:N                      │ 1:N
         ▼                          ▼
   ┌───────────┐              ┌───────────┐
   │ SavedJob  │              │    Job    │◄───N:1─── Category
   └───────────┘              └───────────┘
         │                          │
         └──────────┐  ┌────────────┘
                    ▼  ▼
             ┌───────────────┐
             │  Application  │
             └───────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   ┌──────────────┐      ┌───────────┐
   │ Notification │      │  Report   │
   └──────────────┘      └───────────┘
```

### Critical Database Indexes
- `Job`: Indexes on `title`, `category`, `location`, `jobType`, `status`, `employer`
- `Application`: **Unique Compound Index** on `{ job: 1, applicant: 1 }` to prevent duplicate applications by the same user
- `SavedJob`: **Unique Compound Index** on `{ user: 1, job: 1 }`
- `Notification`: Index on `{ recipient: 1, isRead: 1, createdAt: -1 }`

---

## 8. REST API Documentation

Base URL: `http://localhost:5004/api`

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user (jobseeker or employer)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Fetch current authenticated user
- `PUT /api/auth/profile` — Update user profile details
- `POST /api/auth/upload-avatar` — Upload profile photo / company logo (Multer)
- `POST /api/auth/upload-resume` — Upload candidate resume (PDF/DOC/DOCX)
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Set new password

### Jobs (`/api/jobs`)
- `GET /api/jobs` — Search & filter jobs (keyword, category, location, salary, experience, mode, pagination)
- `GET /api/jobs/:id` — Get single job details with company and similar jobs
- `POST /api/jobs` — Create new job post (Employer/Admin)
- `PUT /api/jobs/:id` — Update job post (Job Owner/Admin)
- `DELETE /api/jobs/:id` — Delete job post (Job Owner/Admin)
- `GET /api/jobs/recruiter/my-jobs` — Fetch all jobs posted by current employer
- `POST /api/jobs/:id/report` — Report a job listing

### Applications (`/api/applications`)
- `POST /api/applications` — Submit application with resume and cover letter
- `GET /api/applications/my` — Get current candidate's applications
- `GET /api/applications/job/:jobId` — Get all applicants for a specific job (Employer)
- `PUT /api/applications/:id/status` — Update stage (`Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Hired`, `Rejected`)
- `POST /api/applications/:id/schedule-interview` — Schedule candidate interview
- `DELETE /api/applications/:id` — Withdraw application (Candidate)

### Companies (`/api/companies`)
- `GET /api/companies` — Get all companies with search and pagination
- `GET /api/companies/:id` — Get company profile with all active jobs
- `POST /api/companies` — Create company profile
- `PUT /api/companies/:id` — Update company profile

### Saved Jobs (`/api/saved-jobs`)
- `POST /api/saved-jobs/:jobId` — Toggle bookmark on a job
- `GET /api/saved-jobs` — Get candidate's saved jobs
- `DELETE /api/saved-jobs/:jobId` — Remove job from bookmarks

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Get user notifications and unread count
- `PUT /api/notifications/:id/read` — Mark notification as read
- `PUT /api/notifications/read-all` — Mark all notifications as read
- `DELETE /api/notifications/:id` — Delete notification

### Categories (`/api/categories`)
- `GET /api/categories` — Get all 30 categories with live job counts
- `POST /api/categories` — Create category (Admin)
- `DELETE /api/categories/:id` — Delete category (Admin)

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` — Platform overview statistics
- `GET /api/admin/users` — User management list
- `PUT /api/admin/users/:id/toggle-status` — Suspend or activate user
- `DELETE /api/admin/users/:id` — Delete user account
- `GET /api/admin/jobs` — Job listings moderation list
- `PUT /api/admin/jobs/:id/approve` — Approve pending job
- `PUT /api/admin/jobs/:id/reject` — Reject job post
- `GET /api/admin/reports` — Get reported job listings
- `PUT /api/admin/reports/:id/resolve` — Mark report resolved

---

## 9. Pre-Seeded Demo Accounts

The database comes pre-seeded with realistic data for immediate testing. You can use the 1-click login buttons on `/login` or enter the credentials below:

| Role | Email Address | Password | Account Name & Notes |
|---|---|---|---|
| **System Administrator** | `admin@jobnova.com` | `admin123` | System Administrator (Full governance) |
| **Employer / Recruiter** | `hr.infosys@jobnova.com` | `employer123` | Priyanka Sen (Infosys Recruiter) |
| **Job Seeker** | `rahul.sharma@example.com` | `seeker123` | Rahul Sharma (Full Stack Engineer) |

Additional pre-seeded employer accounts:
- `hr.tcs@jobnova.com` / `employer123` (Tata Consultancy Services)
- `hr.wipro@jobnova.com` / `employer123` (Wipro Limited)
- `hr.swiggy@jobnova.com` / `employer123` (Swiggy India)
- `hr.zomato@jobnova.com` / `employer123` (Zomato Media)

---

## 10. Local Installation & Setup Guide

### Prerequisites
- **Node.js** (v18.x or v20.x+)
- **MongoDB** (v7.0+ or v8.0+ running on `mongodb://127.0.0.1:27017`)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/jobnova.git
cd jobnova
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` inside `backend/` (or copy from `.env.example`):
```env
PORT=5004
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/jobnova
JWT_SECRET=jobnova_super_secret_jwt_key_2026_production_grade
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5177
```

Seed the database with all 30 categories, 20 companies, 120 Indian tech jobs, and demo accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server running on http://localhost:5004
```

### Step 3: Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
```

Create `.env` inside `frontend/` (or copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5004/api
VITE_APP_NAME=JobNova
```

Start the Vite development server:
```bash
npm run dev
# Web app running on http://localhost:5177
```

---

## 11. Security & File Uploads

- **Password Hashing**: Passwords hashed with `bcryptjs` using 10 salt rounds before storage.
- **JWT Protection**: Secure bearer tokens checked via `protect` middleware on all private endpoints.
- **Role Guarding**: `authorize('jobseeker', 'employer', 'admin')` verifies user role permissions.
- **Resume Upload Restriction**: Multer disk storage restricted to `.pdf`, `.doc`, and `.docx` with a 5MB limit.
- **Image Upload Restriction**: Avatars and logos restricted to `.jpg`, `.jpeg`, `.png`, `.webp`, and `.svg` with a 3MB limit.
- **Anti-Duplicate Application Guard**: MongoDB compound unique index ensures a candidate can only apply once to any given job listing.
- **Immutable User Role**: Role changes are strictly forbidden in profile update endpoints.

---

## 12. Project Folder Structure

```
jobnova/
├── backend/
│   ├── data/                   # Local MongoDB data directory
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Mongoose MongoDB connection
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── applicationController.js
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── companyController.js
│   │   │   ├── jobController.js
│   │   │   ├── notificationController.js
│   │   │   └── savedJobController.js
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verify & authorize()
│   │   │   ├── errorHandler.js # Central error formatter
│   │   │   └── upload.js       # Multer file validation
│   │   ├── models/
│   │   │   ├── Application.js
│   │   │   ├── Category.js
│   │   │   ├── Company.js
│   │   │   ├── Job.js
│   │   │   ├── Notification.js
│   │   │   ├── Report.js
│   │   │   ├── SavedJob.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── applicationRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── companyRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── savedJobRoutes.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── seeder.js       # Seeds 30 categories, 20 companies, 120 jobs
│   │   └── server.js           # Express app entry point
│   ├── uploads/
│   │   ├── avatars/
│   │   └── resumes/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── CandidateProfileModal.jsx
│   │   │   │   ├── ConfirmationModal.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── SkeletonLoader.jsx
│   │   │   └── jobs/
│   │   │       ├── ApplyModal.jsx
│   │   │       ├── InterviewModal.jsx
│   │   │       ├── JobCard.jsx
│   │   │       ├── JobFilters.jsx
│   │   │       └── ReportModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AboutUs.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── CompanyDetail.jsx
│   │   │   ├── ContactUs.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageApplicants.jsx
│   │   │   ├── ManageJobs.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SavedJobs.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios client
│   │   ├── App.jsx             # 21 routes & role guards
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 13. License

This project is licensed under the MIT License — see the LICENSE file for details.
