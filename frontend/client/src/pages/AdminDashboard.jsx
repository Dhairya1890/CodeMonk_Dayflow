import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Users, Calendar, Clock, Check, X, AlertCircle, 
  TrendingUp, UserCheck, UserX, ClipboardList, Search,
  Edit2, Trash2, Plus, Eye, Download, Filter, BarChart3,
  Shield, Briefcase, DollarSign, Mail, Phone, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeaveToday: 0,
    pendingLeaves: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
        api.get('/leave'),
        api.get('/attendance'),
      ]);
      
      const employeesData = empRes.data.employees || [];
      const leavesData = leaveRes.data.leaves || [];
      const attendanceData = attRes.data.attendance || [];
      
      setEmployees(employeesData);
      setLeaveRequests(leavesData);
      setAttendanceRecords(attendanceData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendanceData.filter(a => 
        new Date(a.date).toISOString().split('T')[0] === today
      );
      
      setStats({
        totalEmployees: employeesData.length,
        presentToday: todayAttendance.filter(a => a.status === 'present').length,
        onLeaveToday: todayAttendance.filter(a => a.status === 'on-leave').length,
        pendingLeaves: leavesData.filter(l => l.status === 'pending').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('✗ Failed to load data');
    }
    setLoading(false);
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await api.put(`/leave/${leaveId}`, { status });
      setMessage(`✓ Leave request ${status} successfully`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Action failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaves = leaveRequests.filter(leave => 
    filterStatus === 'all' || leave.status === filterStatus
  );

  const filteredAttendance = attendanceRecords.filter(record =>
    record.User?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendance = attendanceRecords.filter(record =>
    record.User?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderBottom: '1px solid #333',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        padding: '20px 60px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              color: '#fff', 
              fontSize: '28px', 
              fontWeight: '800', 
              margin: '0 0 4px 0',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Dayflow Admin
            </h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#8b5cf6" />
              HR Management Panel
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#fff', fontSize: '15px', fontWeight: '700', margin: '0 0 2px 0' }}>{user?.name}</p>
              <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ width: '100%', padding: '40px 60px', boxSizing: 'border-box' }}>
        
        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div style={{ width: '100%', marginBottom: '30px', boxSizing: 'border-box' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 24px 0' }}>
              Dashboard Overview
            </h2>
            <div style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '30px',
              boxSizing: 'border-box'
            }}>
              {/* Total Employees */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #333',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    minWidth: '64px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                  }}>
                    <Users size={32} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Employees</p>
                    <p style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: 0 }}>
                      {stats.totalEmployees}
                    </p>
                  </div>
                </div>
              </div>

              {/* Present Today */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #333',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    minWidth: '64px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}>
                    <UserCheck size={32} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Present Today</p>
                    <p style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: 0 }}>
                      {stats.presentToday}
                    </p>
                  </div>
                </div>
              </div>

              {/* On Leave */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #333',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    minWidth: '64px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}>
                    <Calendar size={32} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>On Leave Today</p>
                    <p style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: 0 }}>
                      {stats.onLeaveToday}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Requests */}
              <div style={{
                width: '100%',
                background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #333',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                boxSizing: 'border-box',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    minWidth: '64px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                  }}>
                    <ClipboardList size={32} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#888', fontSize: '13px', margin: '0 0 6px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Requests</p>
                    <p style={{ color: '#fff', fontSize: '32px', fontWeight: '800', margin: 0 }}>
                      {stats.pendingLeaves}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          width: '100%',
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '2px solid #333',
          paddingBottom: '0',
          boxSizing: 'border-box',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 24px',
              background: 'transparent',
              color: activeTab === 'overview' ? '#8b5cf6' : '#888',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '3px solid #8b5cf6' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <BarChart3 size={20} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 24px',
              background: 'transparent',
              color: activeTab === 'employees' ? '#8b5cf6' : '#888',
              border: 'none',
              borderBottom: activeTab === 'employees' ? '3px solid #8b5cf6' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <Users size={20} />
            Employees ({employees.length})
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 24px',
              background: 'transparent',
              color: activeTab === 'leaves' ? '#8b5cf6' : '#888',
              border: 'none',
              borderBottom: activeTab === 'leaves' ? '3px solid #8b5cf6' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <Calendar size={20} />
            Leave Requests ({stats.pendingLeaves})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 24px',
              background: 'transparent',
              color: activeTab === 'attendance' ? '#8b5cf6' : '#888',
              border: 'none',
              borderBottom: activeTab === 'attendance' ? '3px solid #8b5cf6' : '3px solid transparent',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <Clock size={20} />
            Attendance
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: '12px',
            marginBottom: '24px',
            background: message.startsWith('✓') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: message.startsWith('✓') ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: message.startsWith('✓') ? '#10b981' : '#ef4444',
            fontSize: '15px',
            fontWeight: '600',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {message.startsWith('✓') ? <Check size={20} /> : <AlertCircle size={20} />}
            {message}
          </div>
        )}

        {/* Employees Section */}
        {activeTab === 'employees' && (
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search employees by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: '#1f1f1f',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>
            </div>

            {/* Employees Table */}
            <div style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
              borderRadius: '16px',
              border: '1px solid #333',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0a0a0a', borderBottom: '2px solid #333' }}>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Employee
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Contact
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Department
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Salary
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp, index) => (
                        <tr key={emp.id} style={{
                          borderBottom: index !== filteredEmployees.length - 1 ? '1px solid #333' : 'none',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#252525'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                minWidth: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '18px',
                                fontWeight: '700'
                              }}>
                                {emp.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p style={{ color: '#fff', fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0' }}>
                                  {emp.name}
                                </p>
                                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                                  ID: {emp.employeeId || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div>
                              <p style={{ color: '#ccc', fontSize: '14px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={14} color="#888" />
                                {emp.email}
                              </p>
                              {emp.phone && (
                                <p style={{ color: '#888', fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Phone size={14} color="#666" />
                                  {emp.phone}
                                </p>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Building2 size={16} color="#888" />
                              <span style={{ color: '#ccc', fontSize: '14px' }}>
                                {emp.department || 'Not Assigned'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <DollarSign size={16} color="#10b981" />
                              <span style={{ color: '#10b981', fontSize: '15px', fontWeight: '700' }}>
                                {emp.salary ? `₹${parseFloat(emp.salary).toLocaleString('en-IN')}` : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              background: emp.role === 'admin' 
                                ? 'rgba(239, 68, 68, 0.15)' 
                                : 'rgba(59, 130, 246, 0.15)',
                              color: emp.role === 'admin' ? '#ef4444' : '#3b82f6',
                              border: emp.role === 'admin'
                                ? '1px solid rgba(239, 68, 68, 0.3)'
                                : '1px solid rgba(59, 130, 246, 0.3)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {emp.role === 'admin' && <Shield size={14} />}
                              {emp.role}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '60px 24px', textAlign: 'center' }}>
                          <Users size={48} color="#444" style={{ margin: '0 auto 16px' }} />
                          <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>
                            {searchTerm ? 'No employees found matching your search' : 'No employees found'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
