# Dayflow HRMS

A modern HR Management System built with MERN stack and MySQL.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MySQL with Sequelize ORM
- **Authentication:** JWT + BCrypt

## Local Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Dayflow
```

### 2. Database Setup

1. Start MySQL server
2. Create a new database:

```sql
CREATE DATABASE DayflowDB;
```

3. Create a MySQL user (or use existing credentials):

```sql
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON DayflowDB.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials:
# DB_NAME=DayflowDB
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=3306
# PORT=5000
# JWT_SECRET=your_secure_random_secret_key
# NODE_ENV=development

# Start the server
npm run dev
```

The backend server will start on `http://localhost:5000` and automatically sync the database schema.

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend/client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Credentials

After setting up, you'll need to register a new account. The first user will be an **employee** by default.

To create an **admin** user, manually update the role in the database:

```sql
USE DayflowDB;
UPDATE Users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## Features

### Employee Features
- Clock in/out for daily attendance
- View personal profile (name, department, salary)
- Request leave (sick/paid/unpaid)
- View attendance history
- View leave request status

### Admin Features
- View all employees
- Approve/reject leave requests
- View global attendance records
- Manage employee details

## Project Structure

```
Dayflow/
├── server/                 # Backend
│   ├── controllers/        # Business logic
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── db.js              # Database connection
│   └── server.js          # Entry point
│
└── frontend/client/       # Frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Page components
    │   └── services/      # API services
    └── public/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify JWT token

### Attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance/today` - Get today's status
- `GET /api/attendance` - Get attendance history

### Leave
- `POST /api/leave/add` - Create leave request
- `GET /api/leave` - Get leave requests
- `PUT /api/leave/:id` - Update leave status (admin)

### Employees (Admin only)
- `GET /api/employees` - List all employees
- `PUT /api/employees/:id` - Update employee details

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check if the database exists

### Port Already in Use
- Change the port in `server/.env` (PORT=5001)
- Or kill the process using the port

### Frontend Not Loading
- Clear browser cache
- Check if backend is running on port 5000
- Verify API base URL in `frontend/client/src/services/api.js`

## License

MIT

## Contributors

Built as an HRMS MVP project.
