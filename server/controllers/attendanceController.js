const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { Op } = require('sequelize');

// Clock in
const clockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    // Check if already clocked in today
    const existingRecord = await Attendance.findOne({
      where: {
        userId,
        date: {
          [Op.gte]: new Date(today),
          [Op.lt]: new Date(new Date(today).getTime() + 86400000), // Next day
        },
      },
    });

    if (existingRecord && existingRecord.checkIn) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }

    const now = new Date();
    const checkInTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    const attendance = await Attendance.create({
      userId,
      date: new Date(today),
      checkIn: checkInTime,
      status: 'present',
    });

    res.status(201).json({
      message: 'Clocked in successfully',
      attendance,
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ error: 'Clock in failed' });
  }
};

// Clock out
const clockOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      where: {
        userId,
        date: {
          [Op.gte]: new Date(today),
          [Op.lt]: new Date(new Date(today).getTime() + 86400000),
        },
      },
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No attendance record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ error: 'Already clocked out today' });
    }

    const now = new Date();
    const checkOutTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

    attendance.checkOut = checkOutTime;
    await attendance.save();

    res.status(200).json({
      message: 'Clocked out successfully',
      attendance,
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({ error: 'Clock out failed' });
  }
};

// Get today's attendance status
const getToday = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      where: {
        userId,
        date: {
          [Op.gte]: new Date(today),
          [Op.lt]: new Date(new Date(today).getTime() + 86400000),
        },
      },
    });

    res.status(200).json({
      attendance: attendance || { message: 'No attendance record for today' },
    });
  } catch (error) {
    console.error('Get today error:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s attendance' });
  }
};

// Get attendance history
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let whereClause = {};
    if (!isAdmin) {
      whereClause = { userId };
    }

    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['id', 'name', 'email', 'department'] }],
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
};

module.exports = { clockIn, clockOut, getToday, getHistory };
