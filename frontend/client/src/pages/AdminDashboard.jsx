import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Calendar, Clock, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('employees');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, leaveRes, attRes] = await Promise.all([
        api.get('/employees'),
        api.get('/leave?status=pending'),
        api.get('/attendance'),
      ]);
      setEmployees(empRes.data.employees || []);
      setLeaveRequests(leaveRes.data.leaves || []);
      setAttendanceRecords(attRes.data.attendance || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await api.put(`/leave/${leaveId}`, { status });
      setMessage(`✓ Leave request ${status}`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Action failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dayflow</h1>
            <p className="text-sm text-slate-600">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700">{user?.name} (Admin)</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'employees'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Employees
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'leaves'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Leave Requests
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-5 h-5" />
            Attendance
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.startsWith('✓')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Employees Section */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-900 font-medium">{emp.name}</td>
                        <td className="px-6 py-4 text-slate-600">{emp.email}</td>
                        <td className="px-6 py-4 text-slate-600">{emp.department || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {emp.salary ? `₹${parseFloat(emp.salary).toLocaleString('en-IN')}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.role === 'admin'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {emp.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-600">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leave Requests Section */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            {leaveRequests.length > 0 ? (
              leaveRequests.map((leave) => (
                <div key={leave.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{leave.User?.name}</p>
                      <p className="text-sm text-slate-600">{leave.User?.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      {leave.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Leave Type</p>
                      <p className="font-medium text-slate-900 capitalize">{leave.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Duration</p>
                      <p className="font-medium text-slate-900">
                        {new Date(leave.startDate).toLocaleDateString()} to{' '}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {leave.reason && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 uppercase mb-1">Reason</p>
                      <p className="text-slate-700">{leave.reason}</p>
                    </div>
                  )}

                  {leave.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLeaveAction(leave.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleLeaveAction(leave.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-slate-600">
                No pending leave requests
              </div>
            )}
          </div>
        )}

        {/* Attendance Section */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Employee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Clock In</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Clock Out</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.slice(0, 20).map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-900 font-medium">
                          {record.User?.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{record.checkIn || '--'}</td>
                        <td className="px-6 py-4 text-slate-600">{record.checkOut || '--'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'present'
                              ? 'bg-green-100 text-green-700'
                              : record.status === 'on-leave'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-600">
                        No attendance records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
