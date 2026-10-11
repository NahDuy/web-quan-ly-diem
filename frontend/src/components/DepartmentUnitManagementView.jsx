import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  BookOpen,
  Shield,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Save,
  CheckSquare,
  Square,
  RefreshCw,
  Search,
  KeyRound,
  ShieldAlert,
  UserCheck,
  Award,
  ChevronRight,
  School
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function DepartmentUnitManagementView({ currentUser, initialSubTab = 'departments' }) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'departments' | 'assignments' | 'users'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Dialog xác nhận xóa thay thế window.confirm
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    warningNote: '',
    confirmLabel: 'Xác nhận xóa',
    type: 'danger',
    onConfirm: () => {},
    loading: false
  });

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Data states
  const [departments, setDepartments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  // Assignment tab state
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [deptSubjects, setDeptSubjects] = useState([]);
  const [deptTeachers, setDeptTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [assignedSubjectIds, setAssignedSubjectIds] = useState([]);
  const [assigningLoading, setAssigningLoading] = useState(false);

  // Department Modal
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [deptFormMode, setDeptFormMode] = useState('create'); // 'create' | 'edit'
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptType, setDeptType] = useState('KHOA');

  // Assign Subject to Dept Modal
  const [isAddDeptSubjectModalOpen, setIsAddDeptSubjectModalOpen] = useState(false);
  const [selectedSubjectToAssign, setSelectedSubjectToAssign] = useState('');

  // User Management Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormMode, setUserFormMode] = useState('create'); // 'create' | 'edit'
  const [editingUserId, setEditingUserId] = useState(null);
  const [userUsername, setUserUsername] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoleCode, setUserRoleCode] = useState('ROLE_GIANGVIEN');
  const [userDeptId, setUserDeptId] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const userRole = currentUser?.role || '';
  const isPrivileged = ['ROLE_BGH', 'ROLE_PDT'].includes(userRole);
  const isTruongKhoa = userRole === 'ROLE_TRUONGKHOA' || userRole === 'ROLE_BOMON';

  // Headers helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // Fetch all basic data
  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const headers = getAuthHeaders();
      const [deptRes, usersRes, subRes] = await Promise.all([
        fetch('/api/v1/departments', { headers }),
        fetch('/api/v1/departments/users', { headers }),
        fetch('/api/v1/classes/available-subjects', { headers })
      ]);

      if (deptRes.ok) {
        const dData = await deptRes.json();
        setDepartments(dData);
        if (dData.length > 0 && !selectedDeptId) {
          const khoaList = dData.filter(d => d.type === 'KHOA');
          // If Trưởng Khoa has departmentId, preselect it
          if (currentUser?.departmentId && dData.some(d => d.id === currentUser.departmentId)) {
            setSelectedDeptId(currentUser.departmentId);
          } else if (khoaList.length > 0) {
            setSelectedDeptId(khoaList[0].id);
          } else {
            setSelectedDeptId(dData[0].id);
          }
        }
      }

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setAllUsers(uData);
      }

      if (subRes.ok) {
        const sData = await subRes.json();
        setAllSubjects(sData);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Không thể kết nối đến máy chủ để tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch subjects and teachers for the selected department
  const fetchDeptDetails = async (deptId) => {
    if (!deptId) return;
    try {
      const headers = getAuthHeaders();
      const [subRes, teachRes] = await Promise.all([
        fetch(`/api/v1/departments/${deptId}/subjects`, { headers }),
        fetch(`/api/v1/departments/${deptId}/teachers`, { headers })
      ]);

      if (subRes.ok) {
        const sData = await subRes.json();
        setDeptSubjects(sData);
      }
      if (teachRes.ok) {
        const tData = await teachRes.json();
        setDeptTeachers(tData);
        if (tData.length > 0) {
          setSelectedTeacherId(tData[0].id);
          loadTeacherAssignedSubjects(tData[0].id);
        } else {
          setSelectedTeacherId(null);
          setAssignedSubjectIds([]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedDeptId) {
      fetchDeptDetails(selectedDeptId);
    }
  }, [selectedDeptId]);

  // Load teacher assigned subjects
  const loadTeacherAssignedSubjects = async (teacherId) => {
    if (!teacherId) {
      setAssignedSubjectIds([]);
      return;
    }
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/v1/departments/teachers/${teacherId}/subjects`, { headers });
      if (res.ok) {
        const ids = await res.json();
        setAssignedSubjectIds(ids || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectTeacher = (tId) => {
    setSelectedTeacherId(tId);
    loadTeacherAssignedSubjects(tId);
  };

  // Toggle subject assignment for currently selected teacher
  const handleToggleSubjectAssignment = (subjectId) => {
    setAssignedSubjectIds(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  // Save subject assignment for teacher
  const handleSaveTeacherSubjects = async () => {
    if (!selectedTeacherId) {
      alert('Vui lòng chọn một giáo viên để phân công môn học!');
      return;
    }
    setAssigningLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/v1/departments/teachers/${selectedTeacherId}/assign-subjects`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ subjectIds: assignedSubjectIds })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Đã phân công môn giảng dạy cho giáo viên thành công!');
        fetchData(); // reload users list to update assigned subjects
      } else {
        setErrorMsg(data.message || 'Lỗi khi phân công môn học.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối khi phân công môn học.');
    } finally {
      setAssigningLoading(false);
    }
  };

  // Create / Edit Department
  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    if (!deptCode.trim() || !deptName.trim()) {
      alert('Vui lòng điền đầy đủ Mã và Tên Khoa/Đơn vị!');
      return;
    }

    try {
      const headers = getAuthHeaders();
      let res;
      if (deptFormMode === 'create') {
        res = await fetch('/api/v1/departments', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            code: deptCode.trim().toUpperCase(),
            name: deptName.trim(),
            type: deptType
          })
        });
      } else {
        res = await fetch(`/api/v1/departments/${editingDeptId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            code: deptCode.trim().toUpperCase(),
            name: deptName.trim(),
            type: deptType
          })
        });
      }

      const data = await res.json();
      if (res.ok) {
        setIsDeptModalOpen(false);
        setSuccessMsg(deptFormMode === 'create' ? 'Đã thêm Khoa / Đơn vị mới thành công!' : 'Đã cập nhật thông tin thành công!');
        fetchData();
      } else {
        alert(data.message || 'Lỗi khi lưu Khoa / Đơn vị.');
      }
    } catch (err) {
      alert('Lỗi kết nối khi lưu thông tin.');
    }
  };

  const handleDeleteDepartment = (dept) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận Xóa Khoa / Đơn vị',
      message: 'Bạn có chắc chắn muốn xóa đơn vị này khỏi hệ thống cơ cấu nhà trường?',
      itemName: `${dept.name} (${dept.code})`,
      warningNote: 'Các môn học và cán bộ thuộc đơn vị này sẽ được hủy liên kết tự động.',
      confirmLabel: 'Xác nhận Xóa',
      type: 'danger',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        try {
          const headers = getAuthHeaders();
          const res = await fetch(`/api/v1/departments/${dept.id}`, {
            method: 'DELETE',
            headers
          });
          const data = await res.json();
          if (res.ok) {
            setSuccessMsg(data.message || 'Đã xóa thành công!');
            fetchData();
          } else {
            setErrorMsg(data.message || 'Không thể xóa đơn vị.');
          }
        } catch (err) {
          setErrorMsg('Lỗi kết nối khi xóa đơn vị.');
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  // Assign Subject to Department
  const handleAssignSubjectToDept = async (e) => {
    e.preventDefault();
    if (!selectedDeptId || !selectedSubjectToAssign) {
      alert('Vui lòng chọn môn học cần gán vào khoa!');
      return;
    }
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/v1/departments/${selectedDeptId}/subjects/${selectedSubjectToAssign}`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddDeptSubjectModalOpen(false);
        setSuccessMsg(data.message || 'Đã gán môn học vào khoa thành công!');
        fetchDeptDetails(selectedDeptId);
        fetchData();
      } else {
        alert(data.message || 'Lỗi khi gán môn học vào khoa.');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ.');
    }
  };

  // User Management Actions
  const handleOpenCreateUser = () => {
    setUserFormMode('create');
    setEditingUserId(null);
    setUserUsername('');
    setUserFullName('');
    setUserEmail('');
    setUserPassword('');
    setUserRoleCode('ROLE_GIANGVIEN');
    setUserDeptId(selectedDeptId || (departments[0]?.id ? String(departments[0].id) : ''));
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
          alert('Vui lòng nhập tên đăng nhập và mật khẩu!');
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
        setSuccessMsg(userFormMode === 'create' ? 'Đã tạo tài khoản thành công!' : 'Đã cập nhật tài khoản thành công!');
        fetchData();
        if (selectedDeptId) fetchDeptDetails(selectedDeptId);
      } else {
        alert(data.message || 'Lỗi khi lưu tài khoản.');
      }
    } catch (err) {
      alert('Lỗi kết nối khi lưu tài khoản.');
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận Xóa Tài khoản Người dùng',
      message: 'Bạn có chắc chắn muốn xóa tài khoản cán bộ này khỏi hệ thống?',
      itemName: `${user.fullName} (${user.username}) - ${user.roleName || user.roleCode}`,
      warningNote: 'Tài khoản sẽ bị vô hiệu hóa hoàn toàn và không thể đăng nhập vào hệ thống.',
      confirmLabel: 'Xác nhận Xóa',
      type: 'danger',
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, loading: true }));
        try {
          const headers = getAuthHeaders();
          const res = await fetch(`/api/v1/departments/users/${user.id}`, {
            method: 'DELETE',
            headers
          });
          const data = await res.json();
          if (res.ok) {
            setSuccessMsg(data.message || 'Đã xóa tài khoản thành công!');
            fetchData();
            if (selectedDeptId) fetchDeptDetails(selectedDeptId);
          } else {
            setErrorMsg(data.message || 'Không thể xóa tài khoản.');
          }
        } catch (err) {
          setErrorMsg('Lỗi kết nối khi xóa tài khoản.');
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  // Helper role badge
  const renderRoleBadge = (roleCode) => {
    switch (roleCode) {
      case 'ROLE_BGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            <ShieldAlert className="w-3 h-3 text-amber-700" /> Ban Giám Hiệu
          </span>
        );
      case 'ROLE_PDT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
            <School className="w-3 h-3 text-purple-700" /> Phòng Đào Tạo
          </span>
        );
      case 'ROLE_TRUONGKHOA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-900 border border-sky-300">
            <Award className="w-3 h-3 text-sky-700" /> Trưởng Khoa
          </span>
        );
      case 'ROLE_GIANGVIEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <UserCheck className="w-3 h-3 text-emerald-700" /> Giáo viên bộ môn
          </span>
        );
      case 'ROLE_DONVI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Shield className="w-3 h-3 text-blue-700" /> Đơn vị (Tiểu đoàn)
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

  // Filtered users for search
  const filteredUsers = allUsers.filter(u => {
    if (!userSearchTerm) return true;
    const term = userSearchTerm.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(term)) ||
      (u.roleName && u.roleName.toLowerCase().includes(term))
    );
  });

  // Calculate statistics
  const totalKhoa = departments.filter(d => d.type === 'KHOA').length;
  const totalDonVi = departments.filter(d => d.type === 'DONVI' || d.type === 'DON_VI').length;
  const totalUsers = allUsers.length;
  const totalSubjects = allSubjects.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Quản lý Khoa & Đơn vị — Phân công Giảng dạy
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập cơ cấu Khoa / Đơn vị, danh mục môn học thuộc Khoa, phân công giáo viên nhập điểm và quản lý 5 đối tượng người dùng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="btn btn-secondary btn-sm h-9 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Tải lại toàn bộ dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Khoa chuyên môn</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">{totalKhoa}</div>
          <div className="text-[11px] text-slate-500 mt-1">Khoa đào tạo giảng dạy</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Đơn vị quản lý</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-950 mt-2">{totalDonVi}</div>
          <div className="text-[11px] text-slate-500 mt-1">Tiểu đoàn / Đại đội học viên</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Cán bộ & Người dùng</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-950 mt-2">{totalUsers}</div>
          <div className="text-[11px] text-slate-500 mt-1">5 phân hệ đối tượng người dùng</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tổng số môn học</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950 mt-2">{totalSubjects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Môn học phần trong hệ thống</div>
        </div>
      </div>

      {/* MESSAGES */}
      {successMsg && (
        <div className="alert alert-success font-bold text-xs shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-error font-bold text-xs shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
      )}

      {/* SUB-TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveSubTab('departments')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'departments'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Cơ cấu Khoa & Đơn vị ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('assignments')}
          className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeSubTab === 'assignments'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Môn học theo Khoa & Phân công Giảng dạy</span>
        </button>

        {isPrivileged && (
          <button
            onClick={() => setActiveSubTab('users')}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeSubTab === 'users'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>3. Quản lý Tài khoản & Phân quyền ({allUsers.length})</span>
          </button>
        )}
      </div>

      {/* SUB-TAB 1: DEPARTMENTS MANAGEMENT */}
      {activeSubTab === 'departments' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-xs space-y-4 -mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh mục Khoa Huấn luyện & Đơn vị Học viên</h2>
              <p className="text-xs text-slate-500">Mỗi khoa phụ trách các môn học chuyên môn, mỗi đơn vị (Tiểu đoàn) quản lý học viên.</p>
            </div>
            {isPrivileged && (
              <button
                onClick={() => {
                  setDeptFormMode('create');
                  setEditingDeptId(null);
                  setDeptCode('');
                  setDeptName('');
                  setDeptType('KHOA');
                  setIsDeptModalOpen(true);
                }}
                className="btn btn-primary btn-sm h-9 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Khoa / Đơn vị</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3 w-28">Mã Khoa/ĐV</th>
                  <th className="py-2.5 px-3">Tên Khoa / Đơn vị</th>
                  <th className="py-2.5 px-3 w-36 text-center">Phân loại</th>
                  <th className="py-2.5 px-3 w-28 text-center">Số Môn học</th>
                  <th className="py-2.5 px-3 w-28 text-center">Số Cán bộ</th>
                  {isPrivileged && <th className="py-2.5 px-3 w-24 text-center">Thao tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept, idx) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{dept.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{dept.name}</td>
                    <td className="py-2.5 px-3 text-center">
                      {dept.type === 'KHOA' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          KHOA ĐÀO TẠO
                        </span>
                      ) : (dept.type === 'DON_VI' || dept.type === 'DONVI') ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          ĐƠN VỊ HỌC VIÊN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                          CƠ QUAN CHỈ HUY
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {dept.subjectCount || 0} môn
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                      {dept.userCount || 0} cán bộ
                    </td>
                    {isPrivileged && (
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setDeptFormMode('edit');
                              setEditingDeptId(dept.id);
                              setDeptCode(dept.code);
                              setDeptName(dept.name);
                              setDeptType(dept.type || 'KHOA');
                              setIsDeptModalOpen(true);
                            }}
                            className="p-1 text-amber-600 hover:bg-amber-50 rounded transition cursor-pointer"
                            title="Chỉnh sửa tên và thông tin"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(dept)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                            title="Xóa đơn vị"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SUBJECTS PER DEPARTMENT & TEACHER ASSIGNMENT */}
      {activeSubTab === 'assignments' && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-xs space-y-6 -mt-6">
          {/* Department Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <label htmlFor="select-current-dept" className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Chọn Khoa Chuyên Môn:
              </label>
              <select
                id="select-current-dept"
                value={selectedDeptId || ''}
                onChange={(e) => setSelectedDeptId(parseInt(e.target.value))}
                className="form-input text-xs font-bold text-slate-900 bg-white border-slate-300 rounded-lg px-3 py-1.5 min-w-[260px]"
              >
                {departments
                  .filter(d => d.type === 'KHOA')
                  .filter(d => isPrivileged || (isTruongKhoa && currentUser?.departmentId ? d.id === currentUser.departmentId : true))
                  .map(d => (
                    <option key={d.id} value={d.id}>
                      [{d.code}] {d.name}
                    </option>
                  ))}
              </select>
            </div>

            {isPrivileged && (
              <button
                onClick={() => {
                  if (allSubjects.length > 0) setSelectedSubjectToAssign(String(allSubjects[0].id));
                  setIsAddDeptSubjectModalOpen(true);
                }}
                className="btn btn-secondary btn-sm h-8 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-emerald-800 border-emerald-300 bg-emerald-50"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                <span>+ Gán Môn Học Vào Khoa Này</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: SUBJECTS OWNED BY THIS DEPARTMENT */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  Môn học thuộc Khoa ({deptSubjects.length})
                </h3>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 w-10 text-center">STT</th>
                      <th className="py-2 px-3 w-20">Mã môn</th>
                      <th className="py-2 px-3">Tên môn học</th>
                      <th className="py-2 px-3 w-16 text-center">Số TC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deptSubjects.length > 0 ? (
                      deptSubjects.map((sub, idx) => (
                        <tr key={sub.id} className="hover:bg-slate-50 transition">
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-700">{sub.code}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{sub.name}</td>
                          <td className="py-2 px-3 text-center font-bold text-emerald-700">{sub.credits}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400 text-xs italic">
                          Khoa này chưa được gán môn học nào. Nhấn "+ Gán Môn Học Vào Khoa Này" để bổ sung môn học cho khoa.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT COLUMN: TEACHERS & SUBJECT ASSIGNMENT MATRIX */}
            <div className="lg:col-span-7 space-y-4 border-l border-slate-200 lg:pl-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-700" />
                  Phân công Giảng dạy cho Giáo viên trong Khoa
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chọn giáo viên và tích chọn các môn học mà giáo viên đó phụ trách dạy. Giáo viên sẽ chỉ được nhập điểm các môn được phân công!
                </p>
              </div>

              {/* Teacher selection pills / dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Chọn Giáo viên bộ môn:</label>
                <div className="flex flex-wrap gap-2">
                  {deptTeachers.length > 0 ? (
                    deptTeachers.map((t) => {
                      const isSelected = selectedTeacherId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => handleSelectTeacher(t.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`} />
                          <span>{t.fullName}</span>
                          <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'}`}>
                            {t.username}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                      Khoa này hiện chưa có giáo viên nào trực thuộc. Vui lòng chuyển sang Tab 3 để tạo hoặc phân cán bộ vào khoa này.
                    </div>
                  )}
                </div>
              </div>

              {/* Subject checklist for selected teacher */}
              {selectedTeacherId && deptSubjects.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Danh sách môn học phân công cho: <strong className="text-blue-700">{deptTeachers.find(t => t.id === selectedTeacherId)?.fullName}</strong>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Đã chọn {assignedSubjectIds.filter(id => deptSubjects.some(s => s.id === id)).length} / {deptSubjects.length} môn
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                    {deptSubjects.map((sub) => {
                      const isAssigned = assignedSubjectIds.includes(sub.id);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleToggleSubjectAssignment(sub.id)}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition select-none ${
                            isAssigned
                              ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isAssigned ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0" />
                            )}
                            <div>
                              <div>{sub.name}</div>
                              <div className="text-[10px] font-mono text-slate-500 font-normal">Mã: {sub.code} ({sub.credits} TC)</div>
                            </div>
                          </div>
                          {isAssigned && (
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-black">
                              Được nhập điểm
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveTeacherSubjects}
                      disabled={assigningLoading}
                      className="btn btn-primary btn-sm h-9 px-4 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                      style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
                    >
                      <Save className={`w-3.5 h-3.5 ${assigningLoading ? 'animate-spin' : ''}`} />
                      <span>Lưu Phân Công Giảng Dạy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: USERS & ROLE MANAGEMENT (DÀNH CHO BGH & PĐT) */}
      {activeSubTab === 'users' && isPrivileged && (
        <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-xs space-y-4 -mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quản trị Người dùng & Phân quyền Hệ thống</h2>
              <p className="text-xs text-slate-500">
                5 đối tượng: Ban Giám Hiệu (BGH), Phòng Đào Tạo (PĐT), Trưởng Khoa, Giáo viên bộ môn, Đơn vị (Tiểu đoàn).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tài khoản, họ tên, vai trò..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="form-input text-xs pl-8 pr-3 py-1.5 w-60 rounded-lg border-slate-300"
                />
              </div>

              <button
                onClick={handleOpenCreateUser}
                className="btn btn-primary btn-sm h-9 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
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
                  <th className="py-2.5 px-3 w-44">Cấp bậc / Vai trò</th>
                  <th className="py-2.5 px-3 w-48">Khoa / Đơn vị</th>
                  <th className="py-2.5 px-3">Môn học phụ trách</th>
                  <th className="py-2.5 px-3 w-20 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{user.username}</td>
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
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: THÊM / SỬA KHOA HOẶC ĐƠN VỊ */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                {deptFormMode === 'create' ? 'Thêm Khoa / Đơn vị mới' : 'Chỉnh sửa Khoa / Đơn vị'}
              </h3>
              <button onClick={() => setIsDeptModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveDepartment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mã Khoa / Đơn vị *</label>
                <input
                  type="text"
                  required
                  disabled={deptFormMode === 'edit'}
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value.toUpperCase())}
                  placeholder="vd: KHOA_BC, D1, KHOA_QS..."
                  className="form-input w-full uppercase font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Khoa / Đơn vị *</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="vd: Khoa Binh chủng Hợp thành, Tiểu đoàn 1..."
                  className="form-input w-full"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Loại hình đơn vị *</label>
                <select
                  value={deptType}
                  onChange={(e) => setDeptType(e.target.value)}
                  className="form-input w-full font-bold"
                >
                  <option value="KHOA">Khoa đào tạo chuyên môn</option>
                  <option value="DON_VI">Đơn vị quản lý học viên (Tiểu đoàn / Đại đội)</option>
                  <option value="PHONG_BAN">Cơ quan chỉ huy (BGH / PĐT)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="btn btn-secondary btn-sm px-4 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 text-xs font-bold"
                  style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
                >
                  {deptFormMode === 'create' ? 'Tạo Khoa / Đơn vị' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GÁN MÔN HỌC VÀO KHOA */}
      {isAddDeptSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Gán Môn Học Vào Khoa
              </h3>
              <button onClick={() => setIsAddDeptSubjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAssignSubjectToDept} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khoa tiếp nhận:</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-800">
                  {departments.find(d => d.id === selectedDeptId)?.name}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Môn học từ Danh mục Hệ thống *</label>
                <select
                  value={selectedSubjectToAssign}
                  onChange={(e) => setSelectedSubjectToAssign(e.target.value)}
                  className="form-input w-full font-semibold"
                >
                  {allSubjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      [{sub.code}] {sub.name} ({sub.credits} TC)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddDeptSubjectModalOpen(false)}
                  className="btn btn-secondary btn-sm px-4 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4 text-xs font-bold"
                  style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
                >
                  Xác Nhận Gán Vào Khoa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TẠO / SỬA TÀI KHOẢN NGƯỜI DÙNG */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-700" />
                {userFormMode === 'create' ? 'Thêm Tài khoản Người dùng Mới' : `Sửa Tài khoản: ${userUsername}`}
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
                    placeholder="vd: giaovien_b..."
                    className="form-input w-full font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {userFormMode === 'create' ? 'Mật khẩu *' : 'Mật khẩu mới (bỏ trống nếu không đổi)'}
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
                  placeholder="vd: Thượng úy Nguyễn Văn A..."
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
                    <option value="ROLE_BGH">Ban Giám Hiệu (Toàn quyền)</option>
                    <option value="ROLE_PDT">Phòng Đào Tạo (Toàn quyền)</option>
                    <option value="ROLE_TRUONGKHOA">Trưởng Khoa (Quản lý điểm khoa, phân công)</option>
                    <option value="ROLE_GIANGVIEN">Giáo viên bộ môn (Chỉ nhập điểm môn mình dạy)</option>
                    <option value="ROLE_DONVI">Đơn vị (Chỉ xem điểm các đối tượng)</option>
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
                  style={{ backgroundColor: '#15803d', borderColor: '#166534' }}
                >
                  {userFormMode === 'create' ? 'Tạo Tài Khoản' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        itemName={confirmDialog.itemName}
        warningNote={confirmDialog.warningNote}
        confirmLabel={confirmDialog.confirmLabel}
        type={confirmDialog.type}
        loading={confirmDialog.loading}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
