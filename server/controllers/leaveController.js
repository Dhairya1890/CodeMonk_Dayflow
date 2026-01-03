const Leave = require('../models/Leave');
const User = require('../models/User');

// Create leave request
const createLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    if (!type || !startDate || !endDate) {
      return res.status(400).json({ error: 'Type, startDate, and endDate are required' });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    const leaveRequest = await Leave.create({
      userId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Leave request submitted',
      leave: leaveRequest,
    });
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(500).json({ error: 'Failed to create leave request' });
  }
};

// Get leave requests
const getLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let whereClause = {};
    if (!isAdmin) {
      whereClause = { userId };
    } else {
      // Admin can filter by status if provided
      if (req.query.status) {
        whereClause.status = req.query.status;
      }
    }

    const leaveRequests = await Leave.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['id', 'name', 'email', 'department'] }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      leaves: leaveRequests,
    });
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
};

// Update leave status (Admin only)
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update leave status' });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leaveRequest = await Leave.findByPk(id);
    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    // If approved, mark as on-leave in attendance
    if (status === 'approved') {
      const Attendance = require('../models/Attendance');
      const { Op } = require('sequelize');
      
      // Mark all dates between startDate and endDate as on-leave
      const currentDate = new Date(leaveRequest.startDate);
      const endDate = new Date(leaveRequest.endDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        await Attendance.findOrCreate({
          where: {
            userId: leaveRequest.userId,
            date: new Date(dateStr),
          },
          defaults: {
            status: 'on-leave',
            date: new Date(dateStr),
          },
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    res.status(200).json({
      message: `Leave request ${status}`,
      leave: leaveRequest,
    });
  } catch (error) {
    console.error('Update leave status error:', error);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
};

module.exports = { createLeave, getLeaves, updateLeaveStatus };
