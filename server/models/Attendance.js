const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkIn: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  checkOut: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'on-leave'),
    defaultValue: 'absent',
  },
}, {
  timestamps: true,
});

module.exports = Attendance;
