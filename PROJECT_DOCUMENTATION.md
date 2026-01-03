# Dayflow HRMS - Complete Project Documentation

**Version:** 1.0 MVP  
**Date:** January 3, 2026  
**Project Type:** Human Resource Management System  
**Development Time:** < 8 Hours

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Features Breakdown](#features-breakdown)
9. [API Documentation](#api-documentation)
10. [Setup & Deployment](#setup--deployment)
11. [Known Issues & Limitations](#known-issues--limitations)
12. [Future Enhancements](#future-enhancements)

---

## Project Overview

Dayflow is a modern, minimalist HR Management System built as an MVP for managing employee attendance, leave requests, and basic HR operations. The system supports two user roles: **Admin** and **Employee**, each with role-specific dashboards and permissions.

### Design Philosophy
- **"Dayflow Clean"** aesthetic - Minimalist corporate design
- Primary Color: Royal Blue (#2563EB)
- Background: Slate-50 (#F8FAFC)
- Text: Slate-800 (#1E293B)
- Mobile-first responsive design

### Key Objectives
- Fast MVP development (< 8 hours)
- Role-based access control
- Real-time attendance tracking
- Leave management workflow
- Clean, intuitive UI/UX

---

## Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 4.1.18
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Icons:** Lucide React 0.562.0

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **ORM:** Sequelize 6.37.7
- **Database:** MySQL 8+ (mysql2 3.16.0)
- **Authentication:** JSON Web Tokens (jsonwebtoken 9.0.3)
- **Password Hashing:** BCrypt.js 3.0.3
- **CORS:** CORS 2.8.5
- **Environment:** dotenv 17.2.3
- **Dev Tool:** Nodemon 3.1.11

### Database
- **Type:** Relational Database
- **Engine:** MySQL 8+
- **Database Name:** DayflowDB

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React App (Vite)                                   │  │
│  │   - Auth Context (Global State)                      │  │
│  │   - Protected Routes                                 │  │
│  │   - Employee Dashboard                               │  │
│  │   - Admin Dashboard                                  │  │
│  │   - Login/Register                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│                    Axios API Service                        │
│                    (JWT in Headers)                         │
└─────────────────────────────────────────────────────────────┘
                          ▼
                    HTTP/JSON API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                         SERVER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Express.js App                                     │  │
│  │   - CORS Middleware                                  │  │
│  │   - JSON Parser                                      │  │
│  │   - Auth Middleware (JWT Verification)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Controllers (Business Logic)                       │  │
│  │   - authController                                   │  │
│  │   - attendanceController                             │  │
│  │   - leaveController                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Models (Sequelize ORM)                             │  │
│  │   - User (with BCrypt hooks)                         │  │
│  │   - Attendance                                       │  │
│  │   - Leave                                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ▼
                    Sequelize ORM
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                         │
│   Tables: Users, Attendances, Leaves                       │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
Dayflow/
├── server/                           # Backend Application
│   ├── controllers/                  # Business Logic
│   │   ├── authController.js        # Register, Login, Verify
│   │   ├── attendanceController.js  # Clock In/Out, History
│   │   └── leaveController.js       # Leave CRUD, Approval
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT Token Verification
│   ├── models/                      # Sequelize Models
│   │   ├── User.js                  # User Model (with BCrypt)
│   │   ├── Attendance.js            # Attendance Model
│   │   └── Leave.js                 # Leave Model
│   ├── routes/                      # API Routes
│   │   ├── auth.js                  # Auth Endpoints
│   │   ├── attendance.js            # Attendance Endpoints
│   │   ├── leave.js                 # Leave Endpoints
│   │   └── employee.js              # Admin-only Endpoints
│   ├── db.js                        # Sequelize Connection
│   ├── server.js                    # Express App Entry Point
│   ├── .env                         # Environment Variables (gitignored)
│   ├── .env.example                 # Environment Template
│   ├── .gitignore                   # Git Ignore Rules
│   └── package.json                 # Dependencies
│
├── frontend/client/                  # Frontend Application
│   ├── src/
│   │   ├── components/              # Reusable Components
│   │   │   └── ProtectedRoute.jsx   # Route Guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global Auth State
│   │   ├── pages/                   # Page Components
│   │   │   ├── Login.jsx            # Login Form
│   │   │   ├── Register.jsx         # Registration Form
│   │   │   ├── EmployeeDashboard.jsx # Employee Dashboard
│   │   │   └── AdminDashboard.jsx   # Admin Dashboard
│   │   ├── services/
│   │   │   └── api.js               # Axios Configuration
│   │   ├── App.jsx                  # Main App with Routing
│   │   ├── main.jsx                 # React Entry Point
│   │   ├── index.css                # Global Styles + Tailwind
│   │   └── App.css                  # Component Styles
│   ├── public/                      # Static Assets
│   ├── index.html                   # HTML Entry Point
│   ├── vite.config.js               # Vite Configuration
│   ├── .gitignore                   # Git Ignore Rules
│   └── package.json                 # Dependencies
│
├── .gitignore                        # Root Git Ignore
├── README.md                         # Setup Instructions
├── ADMIN_PANEL_VERIFICATION.md      # Admin Features Doc
└── PROJECT_DOCUMENTATION.md         # This File
```

---

## Database Schema

### ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────┐
│               Users                     │
├─────────────────────────────────────────┤
│ PK │ id              INT               │
│    │ name            VARCHAR(255)      │
│    │ email           VARCHAR(255) UNIQUE│
│    │ password        VARCHAR(255)      │
│    │ phone           VARCHAR(255)      │
│    │ companyName     VARCHAR(255)      │
│    │ employeeId      VARCHAR(255) UNIQUE│
│    │ role            ENUM(admin,employee)│
│    │ department      VARCHAR(255)      │
│    │ salary          DECIMAL(10,2)     │
│    │ createdAt       DATETIME          │
│    │ updatedAt       DATETIME          │
└─────────────────────────────────────────┘
           │                    │
           │ 1:N                │ 1:N
           ▼                    ▼
┌──────────────────────┐  ┌──────────────────────┐
│    Attendances       │  │       Leaves         │
├──────────────────────┤  ├──────────────────────┤
│ PK │ id         INT  │  │ PK │ id         INT  │
│ FK │ userId     INT  │  │ FK │ userId     INT  │
│    │ date       DATE │  │    │ type       ENUM │
│    │ checkIn    TIME │  │    │ startDate  DATE │
│    │ checkOut   TIME │  │    │ endDate    DATE │
│    │ status     ENUM │  │    │ reason     TEXT │
│    │ createdAt  DT   │  │    │ status     ENUM │
│    │ updatedAt  DT   │  │    │ createdAt  DT   │
└──────────────────────┘  │    │ updatedAt  DT   │
                          └──────────────────────┘
```

### Table Definitions

#### 1. Users Table
Stores all user information including employees and admins.

| Column       | Type                      | Constraints         | Description                          |
|--------------|---------------------------|---------------------|--------------------------------------|
| id           | INTEGER                   | PK, AUTO_INCREMENT  | Unique user identifier               |
| name         | VARCHAR(255)              | NOT NULL            | Full name                            |
| email        | VARCHAR(255)              | NOT NULL, UNIQUE    | Login email                          |
| password     | VARCHAR(255)              | NOT NULL            | BCrypt hashed password               |
| phone        | VARCHAR(255)              | NULL                | Contact number                       |
| companyName  | VARCHAR(255)              | NULL                | Organization name                    |
| employeeId   | VARCHAR(255)              | NULL, UNIQUE        | Auto-generated ID (OIJODO20260001)   |
| role         | ENUM('admin','employee')  | DEFAULT 'employee'  | User role                            |
| department   | VARCHAR(255)              | NULL                | Employee department                  |
| salary       | DECIMAL(10,2)             | NULL                | Monthly/Annual salary                |
| createdAt    | DATETIME                  | NOT NULL            | Registration timestamp               |
| updatedAt    | DATETIME                  | NOT NULL            | Last update timestamp                |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- UNIQUE INDEX on `employeeId`

**Hooks:**
- `beforeCreate`: Hash password with BCrypt (salt rounds: 10)
- `beforeUpdate`: Hash password if changed

#### 2. Attendances Table
Records daily clock in/out times for employees.

| Column     | Type                                    | Constraints        | Description                    |
|------------|-----------------------------------------|--------------------|--------------------------------|
| id         | INTEGER                                 | PK, AUTO_INCREMENT | Unique record identifier       |
| userId     | INTEGER                                 | FK, NOT NULL       | References Users(id)           |
| date       | DATE                                    | NOT NULL           | Attendance date                |
| checkIn    | TIME                                    | NULL               | Clock-in time (HH:MM:SS)       |
| checkOut   | TIME                                    | NULL               | Clock-out time (HH:MM:SS)      |
| status     | ENUM('present','absent','on-leave')     | DEFAULT 'absent'   | Attendance status              |
| createdAt  | DATETIME                                | NOT NULL           | Record creation time           |
| updatedAt  | DATETIME                                | NOT NULL           | Last update time               |

**Relationships:**
- `userId` → Users.id (CASCADE on DELETE)

#### 3. Leaves Table
Stores leave requests and their approval status.

| Column     | Type                                 | Constraints        | Description                      |
|------------|--------------------------------------|--------------------|----------------------------------|
| id         | INTEGER                              | PK, AUTO_INCREMENT | Unique leave request ID          |
| userId     | INTEGER                              | FK, NOT NULL       | References Users(id)             |
| type       | ENUM('sick','paid','unpaid')         | NOT NULL           | Leave type                       |
| startDate  | DATE                                 | NOT NULL           | Leave start date                 |
| endDate    | DATE                                 | NOT NULL           | Leave end date                   |
| reason     | TEXT                                 | NULL               | Reason for leave                 |
| status     | ENUM('pending','approved','rejected')| DEFAULT 'pending'  | Approval status                  |
| createdAt  | DATETIME                             | NOT NULL           | Request submission time          |
| updatedAt  | DATETIME                             | NOT NULL           | Last status update time          |

**Relationships:**
- `userId` → Users.id (CASCADE on DELETE)

**Business Logic:**
- When status changes to 'approved', attendance records are auto-created with `status = 'on-leave'` for all dates in range

---

## Authentication & Authorization

### Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    REGISTRATION                          │
└──────────────────────────────────────────────────────────┘
User fills form → POST /api/auth/register
    ↓
Server validates input
    ↓
Email already exists? → 400 Error
    ↓ No
BCrypt hashes password (10 rounds)
    ↓
Save user to DB (role: 'employee')
    ↓
Generate JWT Token (7 days expiry)
    ↓
Return {token, user}
    ↓
Frontend stores token in localStorage
    ↓
Redirect to /dashboard

┌──────────────────────────────────────────────────────────┐
│                       LOGIN                              │
└──────────────────────────────────────────────────────────┘
User submits credentials → POST /api/auth/login
    ↓
Find user by email
    ↓
User not found? → 401 Error
    ↓ No
BCrypt compare(password, hashedPassword)
    ↓
Password invalid? → 401 Error
    ↓ No
Generate JWT Token with user data
    ↓
Return {token, user{id, name, email, role, ...}}
    ↓
Frontend stores token in localStorage
    ↓
Redirect to /dashboard
    ↓
DashboardRouter checks role:
    - admin? → AdminDashboard
    - employee? → EmployeeDashboard
```

### JWT Token Structure

```javascript
{
  // Header
  "alg": "HS256",
  "typ": "JWT",
  
  // Payload
  "id": 1,
  "email": "user@example.com",
  "role": "admin", // or "employee"
  "iat": 1704278400,
  "exp": 1704883200 // 7 days from issue
}
```

**Secret:** Stored in `.env` as `JWT_SECRET`  
**Expiration:** 7 days

### Authorization Middleware

**File:** `server/middleware/authMiddleware.js`

```javascript
// Token extraction from Authorization header
Authorization: Bearer <token>

// Validation steps:
1. Extract token from header
2. Verify signature with JWT_SECRET
3. Check expiration
4. Decode payload
5. Attach user data to req.user
6. Continue to route handler

// Errors:
- No token → 401 "No token provided"
- Invalid/expired → 401 "Invalid or expired token"
```

### Admin-Only Middleware

**File:** `server/routes/employee.js`

```javascript
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

// Usage:
router.get('/', authMiddleware, adminOnly, handler);
```

### Protected Routes (Frontend)

**File:** `frontend/client/src/components/ProtectedRoute.jsx`

```javascript
// Checks:
1. Loading state → Show spinner
2. Not authenticated → Redirect to /login
3. adminOnly && role !== 'admin' → Redirect to /dashboard
4. Otherwise → Render children
```

---

## Backend Implementation

### Server Entry Point

**File:** `server/server.js`

- Express app initialization
- CORS enabled (all origins in dev)
- JSON body parser
- Database sync with `alter: true` (auto-updates schema)
- Model associations setup
- Routes mounted at `/api/*`
- Health check at `/api/health`
- Listens on port 5000 (configurable via .env)

### Controllers

#### Auth Controller
**File:** `server/controllers/authController.js`

**Functions:**
- `register(req, res)` - Create new user
  - Validates: name, email, password required
  - Checks: email uniqueness
  - Hashes password via BCrypt hook
  - Saves: name, email, password, phone, companyName, employeeId
  - Returns: JWT token + user object
  
- `login(req, res)` - Authenticate user
  - Validates: email, password required
  - Finds user by email
  - Compares password with BCrypt
  - Generates JWT with id, email, role
  - Returns: JWT token + user object (with department, salary)
  
- `verify(req, res)` - Verify JWT token
  - Requires: authMiddleware
  - Fetches user by req.user.id
  - Returns: user object

#### Attendance Controller
**File:** `server/controllers/attendanceController.js`

**Functions:**
- `clockIn(req, res)` - Mark clock-in
  - Gets userId from JWT
  - Checks if already clocked in today
  - Creates attendance record with checkIn time and status='present'
  
- `clockOut(req, res)` - Mark clock-out
  - Gets userId from JWT
  - Finds today's attendance record
  - Updates checkOut time
  
- `getToday(req, res)` - Get today's status
  - Returns today's attendance record for current user
  
- `getHistory(req, res)` - Get attendance history
  - Employee: Returns own records
  - Admin: Returns all records with user details
  - Ordered by date DESC
  - Includes User association

#### Leave Controller
**File:** `server/controllers/leaveController.js`

**Functions:**
- `createLeave(req, res)` - Submit leave request
  - Validates: type, startDate, endDate required
  - Validates: startDate <= endDate
  - Creates leave with status='pending'
  
- `getLeaves(req, res)` - Get leave requests
  - Employee: Returns own requests
  - Admin: Returns all (filterable by status query param)
  - Ordered by createdAt DESC
  - Includes User association
  
- `updateLeaveStatus(req, res)` - Approve/reject leave (Admin only)
  - Validates: admin role
  - Validates: status in ['pending', 'approved', 'rejected']
  - Updates leave status
  - If approved: Creates attendance records with status='on-leave' for date range

### Routes

All routes prefixed with `/api`

#### Auth Routes
**File:** `server/routes/auth.js`

| Method | Endpoint           | Auth Required | Description      |
|--------|--------------------|---------------|------------------|
| POST   | /auth/register     | No            | Create account   |
| POST   | /auth/login        | No            | Login            |
| GET    | /auth/verify       | Yes           | Verify token     |

#### Attendance Routes
**File:** `server/routes/attendance.js`

| Method | Endpoint              | Auth Required | Description            |
|--------|-----------------------|---------------|------------------------|
| POST   | /attendance/clock-in  | Yes           | Clock in for today     |
| POST   | /attendance/clock-out | Yes           | Clock out for today    |
| GET    | /attendance/today     | Yes           | Get today's status     |
| GET    | /attendance           | Yes           | Get history (all if admin) |

#### Leave Routes
**File:** `server/routes/leave.js`

| Method | Endpoint       | Auth Required | Admin Only | Description              |
|--------|----------------|---------------|------------|--------------------------|
| POST   | /leave/add     | Yes           | No         | Create leave request     |
| GET    | /leave         | Yes           | No*        | Get requests (*see note) |
| PUT    | /leave/:id     | Yes           | Yes        | Update status            |

*Note: Employees see own requests, admins see all/filtered

#### Employee Routes (Admin Only)
**File:** `server/routes/employee.js`

| Method | Endpoint         | Auth Required | Admin Only | Description              |
|--------|------------------|---------------|------------|--------------------------|
| GET    | /employees       | Yes           | Yes        | List all users           |
| PUT    | /employees/:id   | Yes           | Yes        | Update dept/salary       |

### Models

#### User Model
**File:** `server/models/User.js`

- Sequelize model definition
- BCrypt hooks for password hashing
- Instance method: `comparePassword(password)`
- Returns boolean for password validation

#### Attendance Model
**File:** `server/models/Attendance.js`

- belongsTo User relationship
- Date stored as DATE type
- Times stored as TIME type

#### Leave Model
**File:** `server/models/Leave.js`

- belongsTo User relationship
- Dates stored as DATE type
- Reason as TEXT (supports long descriptions)

---

## Frontend Implementation

### Context API

#### AuthContext
**File:** `frontend/client/src/context/AuthContext.jsx`

**State:**
- `user` - Current user object
- `token` - JWT token string
- `loading` - Token verification loading state

**Methods:**
- `register(name, email, password, phone, companyName, employeeId)` - Create account
- `login(email, password)` - Authenticate user
- `logout()` - Clear token and user state
- `isAuthenticated` - Boolean computed value

**Effect:**
- On mount, if token exists, calls `/auth/verify` to validate and load user
- If verification fails, clears token

### Components

#### ProtectedRoute
**File:** `frontend/client/src/components/ProtectedRoute.jsx`

**Props:**
- `children` - Component to render if authorized
- `adminOnly` - Boolean, requires admin role

**Logic:**
1. Show loading spinner while token is being verified
2. Redirect to /login if not authenticated
3. Redirect to /dashboard if adminOnly=true and role !== 'admin'
4. Otherwise render children

### Pages

#### Login
**File:** `frontend/client/src/pages/Login.jsx`

**Features:**
- Email and password inputs with icons
- Form validation
- Error message display
- Link to registration
- Calls AuthContext.login()
- Redirects to /dashboard on success

**UI Elements:**
- Dayflow branding header
- White card with shadow
- Royal blue primary button
- Form error alerts
- "Sign Up" link

#### Register
**File:** `frontend/client/src/pages/Register.jsx`

**Features:**
- Company name input
- Full name input
- **Auto-generated Employee ID** (format: OIJODO20260001)
  - First 2 letters of company name
  - First 2 letters of first + last name
  - Current year
  - Serial number (hardcoded 0001 for now)
- Copy button for employee ID
- Email input
- Phone number input
- Password inputs with confirmation
- Client-side validation:
  - Password match check
  - Minimum 6 characters
  - Required fields
  - Phone minimum 10 digits
- Calls AuthContext.register()

**Employee ID Generation Logic:**
```javascript
const employeeId = useMemo(() => {
  const companyPrefix = companyName.substring(0, 2).toUpperCase();
  const namePrefix = (firstName.substring(0, 2) + lastName.substring(0, 2)).toUpperCase();
  const year = new Date().getFullYear();
  const serialNumber = '0001';
  return `${companyPrefix}${namePrefix}${year}${serialNumber}`;
}, [companyName, name]);
```

#### Employee Dashboard
**File:** `frontend/client/src/pages/EmployeeDashboard.jsx`

**Layout:**
- Header with name and logout button
- Profile card with avatar, name, department, salary
- Clock In/Out widget (center)
- Leave request form
- History tabs (Attendance / Leave Requests)

**Features:**

**1. Profile Card**
- Displays user.name, user.department, user.salary
- Gradient avatar icon

**2. Clock In/Out Widget**
- Shows today's checkIn and checkOut times
- "Clock In" button (disabled if already clocked in)
- "Clock Out" button (disabled if not clocked in)
- Success/error messages
- API calls: POST /attendance/clock-in, POST /attendance/clock-out

**3. Leave Request Form**
- Leave type dropdown (sick/paid/unpaid)
- Date range picker (start to end)
- Reason textarea
- Submit button
- API call: POST /leave/add
- Form resets on success

**4. History Tabs**
- **Attendance Logs:**
  - Date, checkIn, checkOut, status badge
  - Last 10 records
  - Status colors: green (present), blue (on-leave), red (absent)
  
- **Leave Requests:**
  - Type, date range, reason, status badge
  - Status colors: yellow (pending), green (approved), red (rejected)

**State Management:**
- `todayAttendance` - Current day's record
- `clockedIn` - Boolean flag
- `attendanceHistory` - Array of records
- `leaveHistory` - Array of requests
- `activeTab` - 'attendance' or 'leave'

#### Admin Dashboard
**File:** `frontend/client/src/pages/AdminDashboard.jsx`

**Layout:**
- Header with "Admin Dashboard" label and logout
- Tab navigation (Employees / Leave Requests / Attendance)
- Tab content area

**Features:**

**1. Employees Tab**
- Data table with columns: Name, Email, Department, Salary, Role
- Total employee count display
- Loading spinner during fetch
- Role badge (red for admin, blue for employee)
- Salary formatted as ₹X,XXX
- API call: GET /employees

**2. Leave Requests Tab**
- Card-based layout for each pending request
- Shows employee name, email, leave type, date range, reason
- Status badge (yellow for pending)
- "Approve" button (green)
- "Reject" button (red)
- Success message after action
- Auto-refreshes data after approval/rejection
- API calls: GET /leave?status=pending, PUT /leave/:id

**3. Attendance Tab**
- Data table with columns: Employee, Date, Clock In, Clock Out, Status
- Shows last 20 records
- Includes employee names via association
- Status badges (green/blue/red)
- API call: GET /attendance

**State Management:**
- `employees` - Array of all users
- `leaveRequests` - Array of pending leaves
- `attendanceRecords` - Array of attendance records
- `activeTab` - Current tab ('employees', 'leaves', 'attendance')
- `loading` - Data fetch loading state
- `message` - Success/error message

**Admin Check:**
- useEffect checks if user.role === 'admin'
- Redirects to /dashboard if not admin

### App Routing

**File:** `frontend/client/src/App.jsx`

**Routes:**
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/dashboard` - Protected, role-based routing:
  - Uses `DashboardRouter` component
  - Checks user.role
  - Admin → AdminDashboard
  - Employee → EmployeeDashboard
- `/` - Redirects to /dashboard

**DashboardRouter Component:**
```javascript
function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  return <EmployeeDashboard />;
}
```

### API Service

**File:** `frontend/client/src/services/api.js`

- Axios instance with baseURL: `http://localhost:5000/api`
- Request interceptor: Adds JWT token to Authorization header
- Token retrieved from localStorage
- Format: `Bearer <token>`

---

## Features Breakdown

### Employee Features

#### 1. Clock In/Out
**User Story:** As an employee, I want to mark my daily attendance.

**Flow:**
1. Employee opens dashboard
2. Sees current clock-in status
3. Clicks "Clock In" → API creates attendance record with current time
4. Clock In button becomes disabled
5. Clicks "Clock Out" → API updates record with clock-out time
6. Both buttons disabled until next day

**Business Rules:**
- Can only clock in once per day
- Can only clock out if already clocked in
- Times stored in HH:MM:SS format
- Date is automatically set to today

#### 2. View Profile
**User Story:** As an employee, I want to see my personal information.

**Display:**
- Name
- Department (or "Department not set")
- Salary (formatted with ₹ symbol, or "N/A")

**Note:** Profile is read-only; no edit functionality in MVP

#### 3. Request Leave
**User Story:** As an employee, I want to apply for leave.

**Form Fields:**
- Leave Type: Sick / Paid / Unpaid
- Start Date: Date picker
- End Date: Date picker
- Reason: Optional text area

**Validation:**
- Start date must be before or equal to end date
- All required fields must be filled
- Status automatically set to 'pending'

**Submission:**
- POST /api/leave/add
- Form clears on success
- Success message displayed
- Leave appears in "My History" tab

#### 4. My History
**User Story:** As an employee, I want to see my attendance and leave history.

**Attendance Tab:**
- Shows last 10 attendance records
- Displays: Date, Check-In, Check-Out, Status
- Status badges with colors

**Leave Requests Tab:**
- Shows all leave requests (newest first)
- Displays: Type, Date Range, Reason, Status
- Status badges: Pending (yellow), Approved (green), Rejected (red)

### Admin Features

#### 1. Employee List
**User Story:** As an admin, I want to see all registered employees.

**Display:**
- Table with all users
- Columns: Name, Email, Department, Salary, Role
- Total employee count
- Includes both admins and employees

**Future Enhancement:** Filter, search, update capabilities

#### 2. Leave Management
**User Story:** As an admin, I want to approve or reject employee leave requests.

**Display:**
- Card-based layout for each pending request
- Shows employee details and request information
- Two action buttons per request

**Actions:**
- **Approve:** Changes status to 'approved'
  - Auto-creates attendance records with status='on-leave'
  - For all dates in the leave range
- **Reject:** Changes status to 'rejected'

**API:** PUT /api/leave/:id

**Business Logic:**
```javascript
// When leave is approved:
for (date = startDate; date <= endDate; date++) {
  Attendance.findOrCreate({
    where: { userId, date },
    defaults: { status: 'on-leave' }
  });
}
```

#### 3. Global Attendance
**User Story:** As an admin, I want to see attendance records for all employees.

**Display:**
- Table with last 20 records
- Columns: Employee Name, Date, Clock In, Clock Out, Status
- Sorted by date (descending)
- Includes employee names via Sequelize association

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Response Format
All responses are JSON.

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### Status Codes
- 200: Success (GET, PUT)
- 201: Created (POST)
- 400: Bad Request (validation error)
- 401: Unauthorized (no/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

### Endpoints Reference

#### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "companyName": "Odoo India",
  "employeeId": "OIJODO20260001"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee"
  }
}
```

#### POST /auth/login
Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "Engineering",
    "salary": "50000.00"
  }
}
```

#### GET /auth/verify
Verify JWT token and get user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "Engineering",
    "salary": "50000.00"
  }
}
```

#### POST /attendance/clock-in
Mark clock-in for today.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (201):**
```json
{
  "message": "Clocked in successfully",
  "attendance": {
    "id": 1,
    "userId": 1,
    "date": "2026-01-03",
    "checkIn": "09:15:30",
    "checkOut": null,
    "status": "present"
  }
}
```

#### POST /attendance/clock-out
Mark clock-out for today.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Clocked out successfully",
  "attendance": {
    "id": 1,
    "userId": 1,
    "date": "2026-01-03",
    "checkIn": "09:15:30",
    "checkOut": "18:00:45",
    "status": "present"
  }
}
```

#### GET /attendance/today
Get today's attendance status.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "attendance": {
    "id": 1,
    "userId": 1,
    "date": "2026-01-03",
    "checkIn": "09:15:30",
    "checkOut": null,
    "status": "present"
  }
}
```

#### GET /attendance
Get attendance history.
- Employee: Returns own records
- Admin: Returns all records

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "attendance": [
    {
      "id": 1,
      "userId": 1,
      "date": "2026-01-03",
      "checkIn": "09:15:30",
      "checkOut": "18:00:45",
      "status": "present",
      "User": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "department": "Engineering"
      }
    }
  ]
}
```

#### POST /leave/add
Create a leave request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "sick",
  "startDate": "2026-01-10",
  "endDate": "2026-01-12",
  "reason": "Medical checkup"
}
```

**Response (201):**
```json
{
  "message": "Leave request submitted",
  "leave": {
    "id": 1,
    "userId": 1,
    "type": "sick",
    "startDate": "2026-01-10",
    "endDate": "2026-01-12",
    "reason": "Medical checkup",
    "status": "pending"
  }
}
```

#### GET /leave
Get leave requests.
- Employee: Returns own requests
- Admin: Returns all (or filtered by status query param)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `status` (optional): 'pending', 'approved', 'rejected'

**Response (200):**
```json
{
  "leaves": [
    {
      "id": 1,
      "userId": 1,
      "type": "sick",
      "startDate": "2026-01-10",
      "endDate": "2026-01-12",
      "reason": "Medical checkup",
      "status": "pending",
      "User": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "department": "Engineering"
      }
    }
  ]
}
```

#### PUT /leave/:id
Update leave status (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response (200):**
```json
{
  "message": "Leave request approved",
  "leave": {
    "id": 1,
    "userId": 1,
    "type": "sick",
    "startDate": "2026-01-10",
    "endDate": "2026-01-12",
    "reason": "Medical checkup",
    "status": "approved"
  }
}
```

#### GET /employees
List all employees (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "employees": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "companyName": "Odoo India",
      "employeeId": "OIJODO20260001",
      "role": "employee",
      "department": "Engineering",
      "salary": "50000.00",
      "createdAt": "2026-01-03T10:00:00.000Z",
      "updatedAt": "2026-01-03T10:00:00.000Z"
    }
  ]
}
```

#### PUT /employees/:id
Update employee details (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "department": "HR",
  "salary": "60000.00"
}
```

**Response (200):**
```json
{
  "message": "Employee updated successfully",
  "employee": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "department": "HR",
    "salary": "60000.00"
  }
}
```

---

## Setup & Deployment

### Local Development Setup

**Prerequisites:**
- Node.js v16+
- MySQL 8+
- npm or yarn

**Steps:**

1. **Clone repository**
```bash
git clone <repository-url>
cd Dayflow
```

2. **Database setup**
```sql
CREATE DATABASE DayflowDB;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON DayflowDB.* TO 'your_username'@'localhost';
```

3. **Backend setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

4. **Frontend setup** (new terminal)
```bash
cd frontend/client
npm install
npm run dev
```

5. **Create admin user**
```sql
UPDATE Users SET role = 'admin' WHERE email = 'your_email@example.com';
```

### Environment Variables

**server/.env:**
```env
DB_NAME=DayflowDB
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secure_random_secret_key
NODE_ENV=development
```

### Production Deployment Considerations

**Backend:**
- Use environment variables for all config
- Set NODE_ENV=production
- Use stronger JWT_SECRET
- Enable HTTPS
- Set CORS to specific origins
- Use connection pooling for MySQL
- Add rate limiting middleware
- Add logging (Winston/Morgan)
- Use PM2 or similar for process management

**Frontend:**
- Build with `npm run build`
- Serve static files from CDN
- Update API base URL to production backend
- Enable gzip compression
- Add error boundary
- Add Google Analytics / monitoring

**Database:**
- Use managed MySQL service (AWS RDS, DigitalOcean)
- Enable SSL connection
- Regular backups
- Set up read replicas for scaling

**Recommended Platforms:**
- Frontend: Vercel, Netlify
- Backend: Railway, Render, Heroku
- Database: AWS RDS, DigitalOcean Managed MySQL

---

## Known Issues & Limitations

### Current Limitations

1. **Employee ID Serial Number**
   - Currently hardcoded to "0001"
   - Should auto-increment based on year and existing employees
   - **Fix:** Query database for max serial number per year

2. **Profile Management**
   - Users cannot update their own profile
   - Department and salary can only be set by admin
   - No password change functionality
   - No profile picture upload

3. **Authentication**
   - No refresh token mechanism
   - Token expires after 7 days (hard refresh required)
   - No "Remember Me" option
   - No password reset/forgot password flow

4. **Leave Management**
   - No leave balance tracking
   - No leave policy configuration
   - No automatic rejection of overlapping leaves
   - No notification system for approvals

5. **Attendance**
   - Cannot edit past attendance records
   - Cannot clock in/out for past dates
   - No late/early warnings
   - No break time tracking
   - No shift management

6. **Admin Features**
   - Cannot create users directly (must register)
   - Cannot delete users
   - Cannot bulk update employees
   - No analytics/reports dashboard
   - No audit logs

7. **UI/UX**
   - No pagination on large datasets
   - No search/filter on tables
   - No date range filters
   - No export functionality (CSV/PDF)
   - Mobile responsiveness could be improved
   - No dark mode

8. **Data Validation**
   - Limited client-side validation
   - No duplicate leave request check
   - No business day validation
   - Salary/phone format not enforced

9. **Performance**
   - No caching mechanism
   - All data fetched on page load
   - No lazy loading for tables
   - No optimistic UI updates

10. **Security**
    - No rate limiting
    - No CSRF protection
    - No input sanitization (XSS protection)
    - CORS set to allow all origins in dev

### Known Bugs

1. **Admin Dashboard - useEffect Dependency**
   - Fixed: Added `user` to dependency array
   - Data now loads correctly after authentication

2. **JWT Token Role Update**
   - Issue: Role changes in DB don't reflect until re-login
   - Workaround: Logout and login again after role update
   - Fix needed: Implement token refresh or force re-auth

3. **Date Format Inconsistency**
   - Dates sometimes display in different formats
   - Should standardize to locale-specific format

---

## Future Enhancements

### Phase 2 Enhancements

**User Management:**
- Admin can create/delete/suspend users
- Bulk employee import (CSV)
- Role management (add custom roles)
- Employee onboarding workflow

**Attendance:**
- Edit past attendance (admin only)
- Break time tracking
- Shift management
- Overtime calculation
- Geolocation-based clock-in
- QR code check-in

**Leave Management:**
- Leave balance tracking
- Leave policies (max days per type)
- Leave calendar view
- Email notifications
- Auto-approval rules
- Half-day leaves
- Compensatory off

**Reports & Analytics:**
- Attendance reports (daily/monthly)
- Leave reports
- Late/absent analysis
- Export to CSV/PDF/Excel
- Dashboard widgets with charts
- Payroll integration readiness

**Communication:**
- In-app notifications
- Email notifications (nodemailer)
- Push notifications
- Announcement system

**Profile Management:**
- Edit personal details
- Change password
- Upload profile picture
- Document upload (ID, certificates)
- Emergency contact

**Advanced Features:**
- Payroll calculation
- Performance reviews
- Task management
- Project allocation
- Training management
- Asset management
- Expense management

### Technical Improvements

**Backend:**
- Add Redis caching
- Implement refresh tokens
- Add input sanitization (express-validator)
- Rate limiting (express-rate-limit)
- API versioning
- WebSocket for real-time updates
- Microservices architecture

**Frontend:**
- Add React Query for caching
- Implement virtualization for large tables
- Progressive Web App (PWA)
- Offline support
- Better error boundaries
- Skeleton loaders
- Toast notifications library
- Form library (React Hook Form)
- Validation library (Yup/Zod)

**DevOps:**
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Automated testing (Jest, Cypress)
- Database migrations (Sequelize CLI)
- Monitoring (Sentry, LogRocket)
- Performance monitoring

**Security:**
- Two-factor authentication (2FA)
- Password strength meter
- Account lockout after failed attempts
- Security headers (Helmet.js)
- SQL injection prevention
- XSS protection
- HTTPS enforcement

---

## Conclusion

Dayflow HRMS MVP successfully demonstrates a functional HR management system with:
- ✅ Role-based authentication & authorization
- ✅ Employee attendance tracking
- ✅ Leave request workflow
- ✅ Admin management capabilities
- ✅ Clean, modern UI
- ✅ Secure backend with JWT
- ✅ Scalable architecture

**Development Time:** < 8 hours  
**Status:** MVP Complete ✓  
**Ready for:** User testing, feedback, and Phase 2 development

---

**Last Updated:** January 3, 2026  
**Version:** 1.0.0  
**Author:** Dayflow Development Team
