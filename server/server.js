const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./db');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database associations
User.hasMany(Attendance, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Leave, { foreignKey: 'userId', onDelete: 'CASCADE' });
Attendance.belongsTo(User, { foreignKey: 'userId' });
Leave.belongsTo(User, { foreignKey: 'userId' });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/employees', require('./routes/employee'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  console.log('✓ Database synced successfully');
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('✗ Database sync failed:', err);
  process.exit(1);
});
