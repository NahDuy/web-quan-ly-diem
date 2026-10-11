import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Activity,
  Cpu,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Lock,
  Unlock,
  Server,
  Zap,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AdminControlCenterView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('diagnostics'); // 'diagnostics' | 'users' | 'integrity'
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

  // Users state
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormMode, setUserFormMode] = useState('create'); // 'create' | 'edit'
  const [editingUserId, setEditingUserId] = useState(null);
  const [userUsername, setUserUsername] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoleCode, setUserRoleCode] = useState('ROLE_GIANGVIEN');
  const [userDeptId, setUserDeptId] = useState('');

  // Integrity Report
  const [integrityReport, setIntegrityReport] = useState(null);
  const [loadingIntegrity, setLoadingIntegrity] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/v1/admin/health', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (err) {
      console.error('Error fetching health', err);
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchUsersAndDepts = async () => {
    try {
      const headers = getAuthHeaders();
      const [uRes, dRes] = await Promise.all([
        fetch('/api/v1/departments/users', { headers }),
        fetch('/api/v1/departments', { headers })
      ]);
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(uData || []);
      }
      if (dRes.ok) {
        const dData = await dRes.json();
        setDepartments(dData || []);
      }
    } catch (err) {
      console.error('Error fetching users/depts', err);
    }
  };

  const fetchIntegrityReport = async () => {
    setLoadingIntegrity(true);
    try {
      const res = await fetch('/api/v1/admin/integrity-report', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setIntegrityReport(data);
      }
    } catch (err) {
      console.error('Error fetching integrity', err);
    } finally {
      setLoadingIntegrity(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchUsersAndDepts();
  }, []);

  useEffect(() => {
    if (activeTab === 'integrity' && !integrityReport) {
      fetchIntegrityReport();
    }
  }, [activeTab]);

  // Execute Troubleshooting Tool
  const runTroubleshootingAction = async (endpoint, actionKey, successDesc) => {
    setActionLoading(prev => ({ ...prev, [actionKey]: true }));
    setActionMessage({ text: '', type: '' });
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage({
          text: data.message || successDesc,
          type: 'success'
        });
        fetchHealth(); // refresh metrics
      } else {
        setActionMessage({
          text: data.message || 'Thao tác không thành công',
          type: 'error'
        });
      }
    } catch (err) {
      setActionMessage({
        text: 'Lỗi kết nối máy chủ khi thực thi công cụ',
        type: 'error'
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  // User CRUD Handlers
  const handleOpenCreateUser = () => {
    setUserFormMode('create');
    setEditingUserId(null);
    setUserUsername('');
    setUserFullName('');
    setUserEmail('');
    setUserPassword('');
    setUserRoleCode('ROLE_GIANGVIEN');
    setUserDeptId('');
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user) => {
    setUserFormMode('edit');
    setEditingUserId(user.id);
    setUserUsername(user.username);
    setUserFullName(user.fullName);
    setUserEmail(user.email || '');
    setUserPassword('');
    setUserRoleCode(user.roleCode || 'ROLE_GIANGVIEN');
    setUserDeptId(user.departmentId ? String(user.departmentId) : '');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userFullName.trim()) {
      alert('Vui lòng nhập Họ và tên!');
      return;
    }

    try {
      const headers = getAuthHeaders();
      let res;
      if (userFormMode === 'create') {
        if (!userUsername.trim() || !userPassword) {
          alert('Vui lòng nhập Tên đăng nhập và Mật khẩu!');
          return;
        }
        res = await fetch('/api/v1/departments/users', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            username: userUsername.trim().toLowerCase(),
            password: userPassword,
            fullName: userFullName.trim(),
            email: userEmail.trim() || null,
            roleCode: userRoleCode,
            departmentId: userDeptId ? parseInt(userDeptId) : null
          })
        });
      } else {
        res = await fetch(`/api/v1/departments/users/${editingUserId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            fullName: userFullName.trim(),
            email: userEmail.trim() || null,
            password: userPassword ? userPassword : null,
            roleCode: userRoleCode,
            departmentId: userDeptId ? parseInt(userDeptId) : null
          })
        });
      }

      const data = await res.json();
      if (res.ok) {
        setIsUserModalOpen(false);
        setActionMessage({
          text: userFormMode === 'create' ? 'Đã tạo tài khoản mới thành công!' : 'Đã cập nhật thông tin tài khoản thành công!',
          type: 'success'
        });
        fetchUsersAndDepts();
        fetchHealth();
      } else {
        alert(data.message || 'Lỗi khi lưu tài khoản.');
      }
    } catch (err) {
      alert('Lỗi kết nối khi lưu tài khoản.');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.username === 'admin') {
      alert('Không thể xóa tài khoản Quản trị viên tối cao (admin)!');
      return;
    }
    if (!window.confirm(`XÁC NHẬN XÓA TÀI KHOẢN: "${user.fullName}" (${user.username})?`)) {
      return;
    }
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/v1/departments/users/${user.id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage({ text: data.message || 'Đã xóa tài khoản thành công!', type: 'success' });
        fetchUsersAndDepts();
        fetchHealth();
      } else {
        alert(data.message || 'Không thể xóa tài khoản.');
      }
    } catch (err) {
      alert('Lỗi kết nối khi xóa tài khoản.');
    }
  };

  const renderRoleBadge = (roleCode) => {
    switch (roleCode) {
      case 'ROLE_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-900 border border-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-700" /> Quản trị viên Tối cao
          </span>
        );
      case 'ROLE_BGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            ⭐ Ban Giám Hiệu
          </span>
        );
      case 'ROLE_PDT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
            🏛️ Phòng Đào Tạo
          </span>
        );
      case 'ROLE_TRUONGKHOA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-900 border border-sky-300">
            🎖️ Trưởng Khoa
          </span>
        );
      case 'ROLE_GIANGVIEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            👨‍🏫 Giáo viên bộ môn
          </span>
        );
      case 'ROLE_DONVI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            🛡️ Đơn vị (Tiểu đoàn)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800">
            {roleCode}
          </span>
        );
    }
  };

  const filteredUsers = users.filter(u => {
    if (!userSearchTerm) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(term)) ||
      (u.roleName && u.roleName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-rose-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white shadow-xl ring-2 ring-rose-400/30">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">Trung tâm Quản trị Admin & Giám sát Hệ thống</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-300 border border-rose-400/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-rose-200/80 mt-1">
              Phân hệ độc quyền dành cho Quản trị viên: Quản trị tài khoản, giám sát bộ nhớ/server, và bộ công cụ khắc phục sự cố tự động.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchHealth();
              fetchUsersAndDepts();
            }}
            disabled={loadingHealth}
            className="btn btn-secondary btn-sm h-9 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin' : ''}`} />
            <span>Làm mới chỉ số</span>
          </button>
        </div>
      </div>

      {/* ACTION MESSAGES */}
      {actionMessage.text && (
        <div className={`alert ${actionMessage.type === 'success' ? 'alert-success' : 'alert-error'} font-bold text-xs shadow-sm flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage({ text: '', type: '' })} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* HEALTH & DIAGNOSTICS STATS BANNER */}
      {healthData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Bộ nhớ JVM Heap</span>
              <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {healthData.jvmHeapUsedMb} <span className="text-xs font-bold text-slate-400">/ {healthData.jvmHeapMaxMb} MB</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  healthData.jvmHeapUsagePercent > 80 ? 'bg-rose-500' : healthData.jvmHeapUsagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, healthData.jvmHeapUsagePercent)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
              <span>Đang dùng {healthData.jvmHeapUsagePercent}%</span>
              <span>{healthData.availableProcessors} CPU Cores</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Cơ sở dữ liệu PostgreSQL</span>
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-blue-950 mt-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{healthData.dbActiveConnections} Active</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Pool: {healthData.dbTotalConnections} Total | {healthData.dbIdleConnections} Idle
            </div>
            <div className="text-[10px] text-emerald-700 font-bold mt-1">
              ✓ {healthData.dbStatus}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Thời gian hoạt động (Uptime)</span>
              <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-base font-black text-slate-900 mt-2 truncate" title={healthData.uptime}>
              {healthData.uptime}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Máy chủ ổn định, sẵn sàng phục vụ
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Java {healthData.javaVersion}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Quy mô Dữ liệu</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {healthData.totalStudents} <span className="text-xs font-bold text-slate-500">Học viên</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex justify-between font-mono">
              <span>{healthData.totalClasses} Lớp</span>
              <span>{healthData.totalGrades} Đầu điểm</span>
            </div>
            <div className="text-[10px] text-slate-500 flex justify-between font-mono mt-0.5">
              <span>{healthData.totalSubjects} Môn học</span>
              <span>{healthData.totalUsers} Người dùng</span>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'diagnostics'
              ? 'border-rose-600 text-rose-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>1. Bộ Công cụ Khắc phục Sự cố & Sửa lỗi CSDL</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'users'
              ? 'border-rose-600 text-rose-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Quản lý Tài khoản & Phân quyền ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('integrity')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'integrity'
              ? 'border-rose-600 text-rose-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>3. Báo cáo & Kiểm tra Toàn vẹn Dữ liệu</span>
        </button>
      </div>

      {/* TAB 1: TROUBLESHOOTING & AUTO-FIX TOOLKIT */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-xs space-y-6 -mt-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Bộ công cụ Xử lý Sự cố & Khắc phục Lỗi Hệ thống
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Các công cụ tự động hóa dưới đây giúp Quản trị viên xử lý triệt để các sự cố thường gặp trong quá trình vận hành (xung đột ID sequence, tính sai điểm TBC, kẹt khóa bảng điểm, dọn rác CSDL) chỉ với 1 click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TOOL 1: FIX SEQUENCES */}
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  PostgreSQL Sequences
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Đồng bộ lại Sequence ID 16 Bảng dữ liệu</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tự động khắc phục lỗi <code>duplicate key value violates unique constraint</code> khi import học viên hoặc thêm môn học thủ công. Thiết lập lại giá trị đếm serial cho toàn bộ 16 bảng CSDL.
                </p>
              </div>
              <button
                type="button"
                onClick={() => runTroubleshootingAction('/api/v1/admin/fix-sequences', 'fixSequences', 'Đã đồng bộ lại Sequence ID thành công!')}
                disabled={actionLoading['fixSequences']}
                className="btn btn-primary btn-sm w-full h-9 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                style={{ backgroundColor: '#2563eb', borderColor: '#1d4ed8' }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${actionLoading['fixSequences'] ? 'animate-spin' : ''}`} />
                <span>⚡ Đồng bộ Sequence ID Ngay</span>
              </button>
            </div>

            {/* TOOL 2: RECALCULATE GRADES */}
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Grade Engine
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Quét & Tính toán lại Điểm TBC Tất cả Lớp</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Quét toàn bộ học viên trong hệ thống, tự động tính toán lại điểm Trung bình cộng học phần (nhân hệ số tín chỉ), phân loại rèn luyện và cập nhật xếp loại học lực nếu có sai lệch cache hoặc dữ liệu cũ.
                </p>
              </div>
              <button
                type="button"
                onClick={() => runTroubleshootingAction('/api/v1/admin/recalculate-all-grades', 'recalcGrades', 'Đã tính toán lại điểm TBC toàn bộ học viên thành công!')}
                disabled={actionLoading['recalcGrades']}
                className="btn btn-primary btn-sm w-full h-9 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${actionLoading['recalcGrades'] ? 'animate-spin' : ''}`} />
                <span>🔄 Quét & Tính Lại Điểm TBC Toàn Hệ Thống</span>
              </button>
            </div>

            {/* TOOL 3: EMERGENCY UNLOCK */}
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                  <Unlock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                  Grade Locks
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Mở Khóa Khẩn Cấp Bảng Điểm</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Giải phóng ngay lập tức mọi bảng điểm đang bị khóa trong hệ thống. Rất hữu ích khi lớp học bị kẹt trạng thái khóa do mạng chập chờn hoặc chỉ huy cần mở quyền sửa điểm khẩn cấp.
                </p>
              </div>
              <button
                type="button"
                onClick={() => runTroubleshootingAction('/api/v1/admin/emergency-unlock-all', 'unlockAll', 'Đã mở khóa khẩn cấp toàn bộ bảng điểm!')}
                disabled={actionLoading['unlockAll']}
                className="btn btn-sm w-full h-9 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde047' }}
              >
                <Unlock className={`w-3.5 h-3.5 ${actionLoading['unlockAll'] ? 'animate-spin' : ''}`} />
                <span>🔓 Mở Khóa Khẩn Cấp Mọi Lớp</span>
              </button>
            </div>

            {/* TOOL 4: OPTIMIZE & CLEANUP */}
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  Database Optimizer
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Dọn dẹp & Tối ưu hóa Hiệu năng CSDL</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Dọn dẹp các bản ghi nhật ký audit log cũ quá hạn (trên 1 năm), làm sạch vùng nhớ tạm và tối ưu hóa các chỉ mục bảng CSDL giúp tăng tốc độ phản hồi truy vấn bảng điểm.
                </p>
              </div>
              <button
                type="button"
                onClick={() => runTroubleshootingAction('/api/v1/admin/optimize-database', 'optimizeDb', 'Đã dọn dẹp và tối ưu hóa CSDL thành công!')}
                disabled={actionLoading['optimizeDb']}
                className="btn btn-sm w-full h-9 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe' }}
              >
                <Sparkles className={`w-3.5 h-3.5 ${actionLoading['optimizeDb'] ? 'animate-spin' : ''}`} />
                <span>🧹 Dọn Dẹp & Tối Ưu Hóa CSDL</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT (ADMIN ONLY) */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-xs space-y-4 -mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                Quản trị Tài khoản & Phân quyền Toàn Hệ thống
              </h2>
              <p className="text-xs text-slate-500">
                Chức năng dành riêng cho Quản trị viên: Quản lý người dùng, phân cấp vai trò (Admin, BGH, PĐT, Trưởng Khoa, Giáo viên, Đơn vị), đổi mật khẩu.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tài khoản, vai trò..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="form-input text-xs pl-8 pr-3 py-1.5 w-60 rounded-lg border-slate-300"
                />
              </div>

              <button
                onClick={handleOpenCreateUser}
                className="btn btn-primary btn-sm h-9 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: '#991b1b', borderColor: '#7f1d1d' }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Tài khoản</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3 w-32">Username</th>
                  <th className="py-2.5 px-3">Họ và tên</th>
                  <th className="py-2.5 px-3 w-48">Vai trò / Phân quyền</th>
                  <th className="py-2.5 px-3 w-48">Khoa / Đơn vị</th>
                  <th className="py-2.5 px-3">Môn học phụ trách</th>
                  <th className="py-2.5 px-3 w-20 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {user.username}
                      {user.username === 'admin' && (
                        <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] bg-rose-200 text-rose-900 font-black">ROOT</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{user.fullName}</td>
                    <td className="py-2.5 px-3">{renderRoleBadge(user.roleCode)}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {user.departmentName ? (
                        <span className="font-semibold text-slate-800">{user.departmentName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa liên kết</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {user.assignedSubjects && user.assignedSubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.assignedSubjects.map((s) => (
                            <span key={s.id} className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold" title={s.name}>
                              {s.code}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          {user.roleCode === 'ROLE_GIANGVIEN' ? 'Chưa phân công' : '—'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditUser(user)}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded transition cursor-pointer"
                          title="Sửa thông tin hoặc đổi mật khẩu"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {user.username !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRITY REPORT */}
      {activeTab === 'integrity' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-xs space-y-4 -mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Báo cáo Rà soát & Kiểm tra Toàn vẹn Dữ liệu
              </h2>
              <p className="text-xs text-slate-500">
                Tự động rà quét các bản ghi mồ côi (học viên không có lớp, môn học chưa có khoa, lớp học chưa có môn).
              </p>
            </div>
            <button
              onClick={fetchIntegrityReport}
              disabled={loadingIntegrity}
              className="btn btn-secondary btn-sm h-8 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingIntegrity ? 'animate-spin' : ''}`} />
              <span>Rà quét lại</span>
            </button>
          </div>

          {integrityReport && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                integrityReport.isHealthy ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {integrityReport.isHealthy ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />}
                <div>
                  <div className="font-bold text-sm">
                    {integrityReport.isHealthy ? 'Hệ thống đạt chuẩn toàn vẹn dữ liệu 100%' : 'Phát hiện một số điểm cần lưu ý trong cấu trúc dữ liệu'}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {integrityReport.isHealthy
                      ? 'Không có học viên mồ côi, không có môn học thiếu khoa, mọi liên kết khóa ngoại đều nhất quán.'
                      : 'Đồng chí có thể sử dụng các công cụ ở Tab 1 để tự động đồng bộ và khắc phục.'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-500 uppercase">Học viên chưa phân lớp</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{integrityReport.unassignedStudentsCount || 0}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Được lưu tạm trong hệ thống</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-500 uppercase">Môn học chưa gán vào Khoa</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{integrityReport.subjectsWithoutDeptCount || 0}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Môn học tự do trong danh mục</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-500 uppercase">Tài khoản chưa có vai trò</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{integrityReport.usersWithoutRoleCount || 0}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Cần gán vai trò để đăng nhập</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-rose-700" />
                {userFormMode === 'create' ? 'Tạo Tài khoản Người dùng Mới' : `Sửa Tài khoản: ${userUsername}`}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên đăng nhập *</label>
                  <input
                    type="text"
                    required
                    disabled={userFormMode === 'edit'}
                    value={userUsername}
                    onChange={(e) => setUserUsername(e.target.value)}
                    placeholder="vd: canbo_a..."
                    className="form-input w-full font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {userFormMode === 'create' ? 'Mật khẩu *' : 'Mật khẩu mới (bỏ trống nếu giữ nguyên)'}
                  </label>
                  <input
                    type="password"
                    required={userFormMode === 'create'}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Họ và tên cán bộ *</label>
                <input
                  type="text"
                  required
                  value={userFullName}
                  onChange={(e) => setUserFullName(e.target.value)}
                  placeholder="vd: Thượng tá Nguyễn Văn A..."
                  className="form-input w-full font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email liên hệ (tùy chọn)</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="canbo@hocvienquansu.edu.vn"
                  className="form-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vai trò / Phân quyền *</label>
                  <select
                    value={userRoleCode}
                    onChange={(e) => setUserRoleCode(e.target.value)}
                    className="form-input w-full font-bold"
                  >
                    <option value="ROLE_ADMIN">Quản trị viên Tối cao (ROLE_ADMIN)</option>
                    <option value="ROLE_BGH">Ban Giám Hiệu (ROLE_BGH)</option>
                    <option value="ROLE_PDT">Phòng Đào Tạo (ROLE_PDT)</option>
                    <option value="ROLE_TRUONGKHOA">Trưởng Khoa (ROLE_TRUONGKHOA)</option>
                    <option value="ROLE_GIANGVIEN">Giáo viên bộ môn (ROLE_GIANGVIEN)</option>
                    <option value="ROLE_DONVI">Đơn vị (Tiểu đoàn) (ROLE_DONVI)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Thuộc Khoa / Đơn vị</label>
                  <select
                    value={userDeptId}
                    onChange={(e) => setUserDeptId(e.target.value)}
                    className="form-input w-full font-semibold"
                  >
                    <option value="">-- Không trực thuộc --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="btn btn-secondary btn-sm px-4 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 text-xs font-bold"
                  style={{ backgroundColor: '#991b1b', borderColor: '#7f1d1d' }}
                >
                  {userFormMode === 'create' ? 'Tạo Tài Khoản' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
