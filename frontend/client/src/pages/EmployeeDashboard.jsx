import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, Calendar, HistoryIcon, User, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [leaveForm, setLeaveForm] = useState({
    type: 'sick',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');

  // Fetch today's attendance on mount
  useEffect(() => {
    fetchTodayAttendance();
    fetchHistory();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const response = await api.get('/attendance/today');
      const att = response.data.attendance;
      setTodayAttendance(att);
      setClockedIn(att && att.checkIn && !att.checkOut);
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const [attRes, leaveRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/leave'),
      ]);
      setAttendanceHistory(attRes.data.attendance || []);
      setLeaveHistory(leaveRes.data.leaves || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/attendance/clock-in');
      setMessage('✓ Clocked in successfully');
      fetchTodayAttendance();
    } catch (error) {
      setMessage('✗ ' + (error.response?.data?.error || 'Clock in failed'));
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/attendance/clock-out');
      setMessage('✓ Clocked out successfully');
      fetchTodayAttendance();
    } catch (error) {
      setMessage('✗ ' + (error.response?.data?.error || 'Clock out failed'));
    }
    setLoading(false);
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormMessage('');
    setFormLoading(true);

    try {
      await api.post('/leave/add', leaveForm);
      setFormMessage('✓ Leave request submitted');
      setLeaveForm({ type: 'sick', startDate: '', endDate: '', reason: '' });
      fetchHistory();
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to submit leave request');
    }
    setFormLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dayflow</h1>
            <p className="text-sm text-slate-600">Employee Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{user?.name}</h2>
              <p className="text-slate-600">{user?.department || 'Department not set'}</p>
              <p className="text-sm text-slate-500">
                Salary: {user?.salary ? `₹${parseFloat(user.salary).toLocaleString('en-IN')}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Clock In/Out Widget */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center">
            <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Attendance</h3>
            
            {todayAttendance && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-slate-600 text-sm mb-2">Today's Status</p>
                <div className="flex justify-around items-center">
                  <div>
                    <p className="text-xs text-slate-500">Clock In</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {todayAttendance.checkIn || '--:--'}
                    </p>
                  </div>
                  <div className="text-slate-300">→</div>
                  <div>
                    <p className="text-xs text-slate-500">Clock Out</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {todayAttendance.checkOut || '--:--'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                {message}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleClockIn}
                disabled={clockedIn || loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Processing...' : 'Clock In'}
              </button>
              <button
                onClick={handleClockOut}
                disabled={!clockedIn || loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Processing...' : 'Clock Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Leave Request Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Request Leave
          </h3>

          {formError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{formError}</p>
            </div>
          )}

          {formMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {formMessage}
            </div>
          )}

          <form onSubmit={handleLeaveSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leave Type
                </label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sick">Sick Leave</option>
                  <option value="paid">Paid Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="flex items-center text-slate-400">to</span>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason
              </label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Enter reason for leave..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors"
            >
              {formLoading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-blue-600" />
            My History
          </h3>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'attendance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Logs
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'leave'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Leave Requests
            </button>
          </div>

          {/* Attendance Logs */}
          {activeTab === 'attendance' && (
            <div className="space-y-2">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-600">
                        {record.checkIn || '--'} to {record.checkOut || '--'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-700'
                        : record.status === 'on-leave'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-600">No attendance records yet</p>
              )}
            </div>
          )}

          {/* Leave Requests */}
          {activeTab === 'leave' && (
            <div className="space-y-2">
              {leaveHistory.length > 0 ? (
                leaveHistory.map((leave) => (
                  <div key={leave.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-slate-900 capitalize">{leave.type} Leave</p>
                        <p className="text-sm text-slate-600">
                          {new Date(leave.startDate).toLocaleDateString()} to{' '}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                        {leave.reason && (
                          <p className="text-sm text-slate-600 mt-1">{leave.reason}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                        leave.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : leave.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-600">No leave requests yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
