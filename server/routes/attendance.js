const express = require('express');
const { clockIn, clockOut, getToday, getHistory } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/clock-in', authMiddleware, clockIn);
router.post('/clock-out', authMiddleware, clockOut);
router.get('/today', authMiddleware, getToday);
router.get('/', authMiddleware, getHistory);

module.exports = router;
