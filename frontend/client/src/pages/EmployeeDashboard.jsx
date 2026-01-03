import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, Calendar, HistoryIcon, User, AlertCircle, FileText, Timer, TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function EmployeeDashboard() {
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
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(90deg, #1f1f1f 0%, #2a2a2a 100%)',
        borderBottom: '1px solid #333',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '100%',
          padding: '20px 60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: '700', margin: 0, letterSpacing: '-0.5px' }}>Dayflow</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: '4px 0 0 0' }}>Employee Dashboard</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#fff', fontWeight: '600', margin: 0, fontSize: '15px' }}>{user?.name}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: '2px 0 0 0' }}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ 
        width: '100%',
        padding: '40px 60px',
        boxSizing: 'border-box'
      }}>
        
        {/* Profile Card */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '30px',
          border: '1px solid #333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              minWidth: '100px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}>
              <User size={48} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: '700', margin: '0 0 10px 0' }}>{user?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#aaa', fontSize: '15px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} />
                  {user?.department || 'Department not set'}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} />
                  Salary: {user?.salary ? `₹${parseFloat(user.salary).toLocaleString('en-IN')}` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '30px',
          boxSizing: 'border-box'
        }}>
          {/* Status Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #333',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                minWidth: '56px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <Activity size={28} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '500' }}>Today's Status</p>
                <p style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 }}>
                  {clockedIn ? 'Active' : todayAttendance ? 'Completed' : 'Not Started'}
                </p>
              </div>
            </div>
          </div>

          {/* Clock In Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #333',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                minWidth: '56px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}>
                <Clock size={28} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '500' }}>Clock In Time</p>
                <p style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0, fontFamily: 'monospace' }}>
                  {todayAttendance?.checkIn || '--:--'}
                </p>
              </div>
            </div>
          </div>

          {/* Clock Out Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #333',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                minWidth: '56px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <Timer size={28} color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '500' }}>Clock Out Time</p>
                <p style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0, fontFamily: 'monospace' }}>
                  {todayAttendance?.checkOut || '--:--'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ 
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px',
          marginBottom: '30px',
          boxSizing: 'border-box'
        }}>
          
          {/* Attendance Actions Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #333',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
          }}>
            <Clock size={40} color="#fff" />
          </div>
          <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>Mark Attendance</h3>
          <p style={{ color: '#888', fontSize: '15px', margin: '0 0 32px 0' }}>Clock in to start your day, clock out when you're done</p>

          {message && (
            <div style={{
              padding: '16px 24px',
              borderRadius: '12px',
              marginBottom: '24px',
              background: message.startsWith('✓') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: message.startsWith('✓') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              color: message.startsWith('✓') ? '#10b981' : '#ef4444',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={handleClockIn}
              disabled={clockedIn || loading}
              style={{
                padding: '16px 48px',
                background: clockedIn || loading ? '#4b5563' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: clockedIn || loading ? 'not-allowed' : 'pointer',
                boxShadow: clockedIn || loading ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s',
                opacity: clockedIn || loading ? 0.5 : 1
              }}
              onMouseOver={(e) => !clockedIn && !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Processing...' : 'Clock In'}
            </button>
            <button
              onClick={handleClockOut}
              disabled={!clockedIn || loading}
              style={{
                padding: '16px 48px',
                background: !clockedIn || loading ? '#4b5563' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: !clockedIn || loading ? 'not-allowed' : 'pointer',
                boxShadow: !clockedIn || loading ? 'none' : '0 6px 20px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.3s',
                opacity: !clockedIn || loading ? 0.5 : 1
              }}
              onMouseOver={(e) => clockedIn && !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Processing...' : 'Clock Out'}
            </button>
          </div>
          </div>

          {/* Leave Request Form */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #333',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={24} color="#fff" />
            </div>
            <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Request Leave</h3>
          </div>

          {formError && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{formError}</p>
            </div>
          )}

          {formMessage && (
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {formMessage}
            </div>
          )}

          <form onSubmit={handleLeaveSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', color: '#ccc', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Leave Type
                </label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#0a0a0a',
                    border: '1px solid #444',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = '#444'}
                >
                  <option value="sick">Sick Leave</option>
                  <option value="paid">Paid Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#ccc', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Duration
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    required
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #444',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#444'}
                  />
                  <span style={{ color: '#666' }}>→</span>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    required
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      background: '#0a0a0a',
                      border: '1px solid #444',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                    onBlur={(e) => e.target.style.borderColor = '#444'}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#ccc', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Reason
              </label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Enter reason for leave..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#0a0a0a',
                  border: '1px solid #444',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: formLoading ? '#4b5563' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: formLoading ? 'not-allowed' : 'pointer',
                boxShadow: formLoading ? 'none' : '0 6px 20px rgba(139, 92, 246, 0.3)',
                transition: 'all 0.3s',
                opacity: formLoading ? 0.5 : 1,
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => !formLoading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {formLoading ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </form>
          </div>
        </div>

        {/* History Section - Full Width */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid #333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HistoryIcon size={24} color="#fff" />
            </div>
            <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: 0 }}>My History</h3>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '2px solid #333', marginBottom: '32px' }}>
            <button
              onClick={() => setActiveTab('attendance')}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                color: activeTab === 'attendance' ? '#8b5cf6' : '#888',
                border: 'none',
                borderBottom: activeTab === 'attendance' ? '2px solid #8b5cf6' : '2px solid transparent',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.3s'
              }}
            >
              Attendance Logs
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                color: activeTab === 'leave' ? '#8b5cf6' : '#888',
                border: 'none',
                borderBottom: activeTab === 'leave' ? '2px solid #8b5cf6' : '2px solid transparent',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.3s'
              }}
            >
              Leave Requests
            </button>
          </div>

          {/* Attendance Tab - Grid Layout */}
          {activeTab === 'attendance' && (
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px', boxSizing: 'border-box' }}>
              {attendanceHistory.length > 0 ? (
                attendanceHistory.slice(0, 10).map((record) => (
                  <div key={record.id} style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px',
                    background: '#0a0a0a',
                    borderRadius: '16px',
                    border: '1px solid #333',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#444'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                  >
                    <div>
                      <p style={{ color: '#fff', fontWeight: '600', fontSize: '15px', margin: '0 0 6px 0' }}>
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p style={{ color: '#888', fontSize: '14px', margin: 0, fontFamily: 'monospace' }}>
                        {record.checkIn || '--:--'} → {record.checkOut || '--:--'}
                      </p>
                    </div>
                    <span style={{
                      padding: '8px 20px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: record.status === 'present' 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : record.status === 'on-leave'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(239, 68, 68, 0.15)',
                      color: record.status === 'present'
                        ? '#10b981'
                        : record.status === 'on-leave'
                        ? '#3b82f6'
                        : '#ef4444',
                      border: record.status === 'present'
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : record.status === 'on-leave'
                        ? '1px solid rgba(59, 130, 246, 0.3)'
                        : '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      {record.status}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <Clock size={48} color="#444" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>No attendance records yet</p>
                </div>
              )}
            </div>
          )}

          {/* Leave Tab - Grid Layout */}
          {activeTab === 'leave' && (
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px', boxSizing: 'border-box' }}>
              {leaveHistory.length > 0 ? (
                leaveHistory.map((leave) => (
                  <div key={leave.id} style={{
                    width: '100%',
                    padding: '24px',
                    background: '#0a0a0a',
                    borderRadius: '16px',
                    border: '1px solid #333',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#444'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontWeight: '700', fontSize: '16px', margin: '0 0 8px 0', textTransform: 'capitalize' }}>
                          {leave.type} Leave
                        </p>
                        <p style={{ color: '#888', fontSize: '14px', margin: '0 0 8px 0' }}>
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' → '}
                          {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {leave.reason && (
                          <p style={{ color: '#aaa', fontSize: '14px', margin: 0, fontStyle: 'italic' }}>
                            "{leave.reason}"
                          </p>
                        )}
                      </div>
                      <span style={{
                        padding: '8px 20px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginLeft: '16px',
                        whiteSpace: 'nowrap',
                        background: leave.status === 'pending'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : leave.status === 'approved'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                        color: leave.status === 'pending'
                          ? '#f59e0b'
                          : leave.status === 'approved'
                          ? '#10b981'
                          : '#ef4444',
                        border: leave.status === 'pending'
                          ? '1px solid rgba(245, 158, 11, 0.3)'
                          : leave.status === 'approved'
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : '1px solid rgba(239, 68, 68, 0.3)'
                      }}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <Calendar size={48} color="#444" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>No leave requests yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
