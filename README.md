# Doctor Tracker — Clinical Administration & Patient Management System

## Description

**Doctor Tracker** is a full-stack, enterprise-grade clinical management web application designed for healthcare administrators to track physician workloads, manage doctor rosters, monitor patient enrollments, and analyze diagnostic distributions in real time. Built with performance optimization, clean UX hierarchy, and responsive data visualization, Doctor Tracker enables seamless doctor-patient allocation, server-side search and filtering, and automated CSV/JSON data exports.

---

## Demo Credentials

- **Admin Email**: `admin@doctortracker.com`
- **Password**: `Admin123!`

---

## Setup Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local instance or MongoDB Atlas cluster connection string

### 1. Repository Clone & Setup
```bash
git clone https://github.com/your-username/Doctor-Tracker.git
cd Doctor-Tracker
```

### 2. Backend Server Setup
```bash
cd server
npm install
cp .env.example .env
```
*Configure environment variables in `server/.env`:*
```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/doctorTracker?retryWrites=true&w=majority"
JWT_SECRET="doctor_tracker_jwt_secret_key_2026"
ACCESS_TOKEN_SECRET="doctor_tracker_access_secret_key_2026"
REFRESH_TOKEN_SECRET="doctor_tracker_refresh_secret_key_2026"
PORT=5000
CLIENT_URL="http://localhost:3000"
```

#### Seed Demo Dataset (12 Doctors & 25 Patients)
```bash
npm run seed
```

#### Start Backend Server
```bash
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

---

### 3. Frontend Client Setup
In a new terminal window:
```bash
cd client
npm install
cp .env.example .env.local
```
*Configure `client/.env.local`:*
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

#### Start Frontend Client
```bash
npm run dev
```
*(Frontend runs on `http://localhost:3000`)*

---

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│               Next.js Client (Port 3000)               │
│  - App Router Dashboard Layout                         │
│  - React Query Data Caching & Optimistic State         │
│  - Shadcn UI + Tailwind CSS Clinical Design System    │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / REST API (JWT Bearer)
┌──────────────────────────▼─────────────────────────────┐
│             Node.js / Express API (Port 5000)          │
│  - JWT Authentication & Authorization Middleware      │
│  - Zod Request Schema Validation                       │
│  - Server-Side Pagination, Filtering & Search         │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼─────────────────────────────┐
│                 MongoDB Atlas Cluster                  │
│  - Compound Query Indexes ({ doctorId: 1, name: 1 })   │
│  - Doctor & Patient Relational Collections             │
└────────────────────────────────────────────────────────┘
```

---

## Technical Decisions

### Decision 1: TanStack Query (React Query) for Server State Management
Rather than storing remote API data in global Redux stores or Context API, we adopted **TanStack Query**. 
- **Benefits**: Automatic background refetching, cached query results, optimistic mutation invalidation (`queryClient.invalidateQueries`), and built-in loading/error states.
- **Debounced Search**: Text search inputs use local state with 300ms debouncing before updating query keys, eliminating rapid API requests while providing instant UI typing feedback.

### Decision 2: Decoupled Standalone Express Backend & Next.js Client Architecture
We deliberately separated the Node.js/Express backend API server from the Next.js frontend application rather than using Next.js API routes.
- **Benefits**: Clean Separation of Concerns (SoC), independent scalability, dedicated security middleware scoping, and strict adherence to RESTful microservices architecture principles.

---

## Visual Evidence & UI Features

### Key Features Summary
1. **Clinical Overview Dashboard (`/dashboard`)**:
   - Live KPI Stat Cards (Total Doctors, Total Patients, Active Hospitals, Specializations).
   - Recharts Visualizations: Workload Bar Chart per Doctor, Patient Enrollment Trend Area Chart, Diagnostic Condition Donut Chart.

2. **Doctor Roster Directory (`/doctors`)**:
   - Search, filter by Specialization and Hospital, pagination.
   - Add Doctor Modal (with dynamic "+ Add Custom..." option).
   - Edit Doctor Modal & Delete Doctor Confirmation Dialog.
   - Export CSV & JSON downloading.

3. **Doctor Patient Roster View (`/doctors/[id]`)**:
   - Individual physician profile, specialization badge, hospital metadata, and direct patient assignment.

4. **Global Patients Directory (`/patients`)**:
   - Multi-field search (Name, Diagnosis, Phone, Email).
   - Multi-dropdown filter (Condition, Assigned Physician, Gender).
   - Edit Patient Modal (with doctor reassignment) & Delete Patient confirmation dialog.
   - Export CSV & JSON data downloads.
