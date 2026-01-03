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
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* Filter Tabs */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '10px 20px',
                    background: filterStatus === status 
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
                      : '#1f1f1f',
                    color: filterStatus === status ? '#fff' : '#888',
                    border: filterStatus === status ? 'none' : '1px solid #333',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                    boxSizing: 'border-box'
                  }}
                  onMouseOver={(e) => {
                    if (filterStatus !== status) {
                      e.target.style.borderColor = '#555';
                      e.target.style.color = '#ccc';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (filterStatus !== status) {
                      e.target.style.borderColor = '#333';
                      e.target.style.color = '#888';
                    }
                  }}
                >
                  {status} ({leaveRequests.filter(l => status === 'all' || l.status === status).length})
                </button>
              ))}
            </div>

            {/* Leave Requests Grid */}
            <div style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
              gap: '20px',
              boxSizing: 'border-box'
            }}>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((leave) => (
                  <div key={leave.id} style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1px solid #333',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#444';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#333';
                  }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            minWidth: '44px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '700'
                          }}>
                            {leave.User?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p style={{ color: '#fff', fontSize: '16px', fontWeight: '700', margin: '0 0 2px 0' }}>
                              {leave.User?.name || 'Unknown User'}
                            </p>
                            <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                              {leave.User?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
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
                          : '1px solid rgba(239, 68, 68, 0.3)',
                        whiteSpace: 'nowrap'
                      }}>
                        {leave.status}
                      </span>
                    </div>

                    {/* Leave Details */}
                    <div style={{
                      background: '#0a0a0a',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px',
                      border: '1px solid #333'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                          <p style={{ color: '#666', fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                            Leave Type
                          </p>
                          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: 0, textTransform: 'capitalize' }}>
                            {leave.type}
                          </p>
                        </div>
                        <div>
                          <p style={{ color: '#666', fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                            Duration
                          </p>
                          <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', margin: 0 }}>
                            {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                          </p>
                        </div>
                      </div>
                      <div>
                        <p style={{ color: '#666', fontSize: '11px', margin: '0 0 6px 0', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                          Date Range
                        </p>
                        <p style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' → '}
                          {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    {leave.reason && (
                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: '#666', fontSize: '11px', margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>
                          Reason
                        </p>
                        <p style={{ color: '#ccc', fontSize: '14px', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                          "{leave.reason}"
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {leave.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleLeaveAction(leave.id, 'approved')}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '14px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s',
                            boxSizing: 'border-box'
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          <Check size={18} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveAction(leave.id, 'rejected')}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '14px',
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
                          <X size={18} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{
                  gridColumn: '1 / -1',
                  background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                  borderRadius: '16px',
                  padding: '60px',
                  border: '1px solid #333',
                  textAlign: 'center'
                }}>
                  <Calendar size={56} color="#444" style={{ margin: '0 auto 20px' }} />
                  <p style={{ color: '#888', fontSize: '16px', margin: 0 }}>
                    No {filterStatus !== 'all' ? filterStatus : ''} leave requests found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attendance Section */}
        {activeTab === 'attendance' && (
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* Search Bar */}
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <Search size={20} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by employee name..."
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

            {/* Attendance Table */}
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
                        Date
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Clock In
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Clock Out
                      </th>
                      <th style={{ padding: '20px 24px', textAlign: 'left', color: '#fff', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.slice(0, 50).map((record, index) => (
                        <tr key={record.id} style={{
                          borderBottom: index !== Math.min(filteredAttendance.length, 50) - 1 ? '1px solid #333' : 'none',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#252525'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                minWidth: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: '700'
                              }}>
                                {record.User?.name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>
                                {record.User?.name || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ color: '#ccc', fontSize: '14px' }}>
                              {new Date(record.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Clock size={16} color="#10b981" />
                              <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace' }}>
                                {record.checkIn || '--:--'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Clock size={16} color="#f59e0b" />
                              <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '700', fontFamily: 'monospace' }}>
                                {record.checkOut || '--:--'}
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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '60px 24px', textAlign: 'center' }}>
                          <Clock size={48} color="#444" style={{ margin: '0 auto 16px' }} />
                          <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>
                            {searchTerm ? 'No attendance records found matching your search' : 'No attendance records found'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredAttendance.length > 50 && (
                <div style={{
                  padding: '16px 24px',
                  background: '#0a0a0a',
                  borderTop: '1px solid #333',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                    Showing 50 of {filteredAttendance.length} records
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
