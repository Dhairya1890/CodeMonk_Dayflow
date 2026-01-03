const express = require('express');
const { createLeave, getLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, createLeave);
router.get('/', authMiddleware, getLeaves);
router.put('/:id', authMiddleware, updateLeaveStatus);

module.exports = router;
