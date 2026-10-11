import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, Plus, Search, Shield, Edit, Trash2, ShieldCheck, Award, X, CheckCircle2, RefreshCw, Sparkles, FileSpreadsheet } from 'lucide-react';
import AdmissionsImportModal from './AdmissionsImportModal';

export default function StudentManagementView({ currentUser }) {
  // Quyền xóa lớp học: Chỉ dành riêng cho 2 role cao nhất (ROLE_BGH và ROLE_BOMON hoặc ROLE_ADMIN/ROLE_PDT)
  // 4 vai trò:
  // 1. Ban Giám Đốc / Ban Giám Hiệu & Phòng Đào Tạo (ROLE_BGH, ROLE_PDT, ROLE_ADMIN) -> CÓ QUYỀN XÓA LỚP
  // 2. Chủ nhiệm Bộ môn (ROLE_BOMON) -> CÓ QUYỀN XÓA LỚP
  // 3. Giáo viên Huấn luyện (ROLE_GIANGVIEN) -> KHÔNG ĐƯỢC XÓA LỚP
  const userRole = currentUser?.role || 'ROLE_GIANGVIEN';
  const canDeleteClasses = ['ROLE_BGH', 'ROLE_PDT', 'ROLE_BOMON'].includes(userRole);

  const [students, setStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [deletingClasses, setDeletingClasses] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const availableYears = Array.from(
    new Set(classList.map(c => c.academicYear).filter(Boolean))
  ).sort((a, b) => b - a);

  const displayYears = availableYears.length > 0 ? availableYears : [2026];

  const filteredClasses = selectedYear
    ? classList.filter(c => !c.academicYear || c.academicYear === parseInt(selectedYear))
    : classList;

  const handleExportStudents = () => {
    let url = '/api/v1/students/export-excel';
    const params = [];
    if (selectedClassId) params.push(`classId=${selectedClassId}`);
    if (selectedYear) params.push(`year=${selectedYear}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    window.location.href = url;
  };

  // Form State for Adding Student
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState('Học viên SQDB');
  const [newDob, setNewDob] = useState('');
  const [newPob, setNewPob] = useState('');
  const [newGender, setNewGender] = useState('Nam');
  const [newClassId, setNewClassId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State for Editing Student
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editCode, setEditCode] = useState('');
  const [editName, setEditName] = useState('');
  const [editRank, setEditRank] = useState('Học viên SQDB');
  const [editDob, setEditDob] = useState('');
  const [editPob, setEditPob] = useState('');
  const [editGender, setEditGender] = useState('Nam');
  const [editClassId, setEditClassId] = useState('');
  const [editStatus, setEditStatus] = useState('DANG_HUAN_LUYEN');
  const [statusFilter, setStatusFilter] = useState(''); // '' | 'DANG_HUAN_LUYEN' | 'DA_TOT_NGHIEP'

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      let url = '/api/v1/students';
      const params = [];
      if (selectedClassId) params.push(`classId=${selectedClassId}`);
      if (selectedYear) params.push(`year=${selectedYear}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.message || 'Không thể tải danh sách học viên');
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setErrorMsg('Lỗi kết nối máy chủ khi tải danh sách học viên');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setErrorMsg('');
    setNewCode('');
    setNewName('');
    setNewRank('Học viên SQDB');
    setNewDob('');
    setNewPob('');
    setNewGender('Nam');
    setNewClassId(selectedClassId || (classList[0]?.id ? String(classList[0].id) : ''));
    setIsAddModalOpen(true);
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/v1/classes');
      if (res.ok) {
        const data = await res.json();
        setClassList(data);
      }
    } catch (e) {
      console.error('Error fetching classes:', e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClassId, selectedYear]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const filteredStudents = students.filter(s => {
    const matchSearch = (s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.studentCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter === 'DA_TOT_NGHIEP') return s.status === 'DA_TOT_NGHIEP';
    if (statusFilter === 'DANG_HUAN_LUYEN') return s.status !== 'DA_TOT_NGHIEP';
    return true;
  });

  const handleDeleteAllClasses = async () => {
    setDeletingClasses(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/classes/all', {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Đã xóa toàn bộ lớp học thành công!');
        setSelectedClassId('');
        setIsDeleteAllModalOpen(false);
        await fetchClasses();
        await fetchStudents();
        setTimeout(() => setMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Không thể xóa toàn bộ lớp học!');
      }
    } catch (e) {
      setErrorMsg('Lỗi kết nối khi xóa lớp: ' + e.message);
    } finally {
      setDeletingClasses(false);
    }
  };

  const handleDeleteSelectedClass = async () => {
    if (!selectedClassId) return;
    setDeletingClasses(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/classes/${selectedClassId}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'Đã xóa lớp học thành công!');
        setSelectedClassId('');
        setIsDeleteClassModalOpen(false);
        await fetchClasses();
        await fetchStudents();
        setTimeout(() => setMsg(''), 4000);
      } else {
        setErrorMsg(data.message || 'Không thể xóa lớp học!');
      }
    } catch (e) {
      setErrorMsg('Lỗi kết nối khi xóa lớp: ' + e.message);
    } finally {
      setDeletingClasses(false);
    }
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Số hiệu Học viên và Họ tên!');
      return;
    }
    if (!newClassId) {
      setErrorMsg('Vui lòng chọn Lớp Huấn luyện cho học viên!');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const payload = {
        studentCode: newCode.toUpperCase().trim(),
        fullName: newName.trim(),
        dob: newDob ? newDob.trim() : '',
        pob: newPob ? newPob.trim() : '',
        gender: newGender,
        rank: newRank,
        classId: parseInt(newClassId)
      };

      const res = await fetch('/api/v1/students', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedStudent = await res.json();
        setStudents(prev => [savedStudent, ...prev]);
        setIsAddModalOpen(false);
        setMsg(`Đã thêm mới thành công học viên ${newName} (${newCode.toUpperCase()})`);
        setTimeout(() => setMsg(''), 3500);

        // Reset Form
        setNewCode('');
        setNewName('');
        setNewPob('');
        setNewDob('');
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.message || 'Lỗi từ máy chủ khi lưu học viên');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setErrorMsg('Không thể kết nối máy chủ để thêm học viên');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setEditCode(student.studentCode || '');
    setEditName(student.fullName || '');
    setEditRank(student.rank || 'Học viên SQDB');
    setEditDob(student.dob || '');
    setEditPob(student.pob || '');
    setEditGender(student.gender || 'Nam');
    setEditClassId(student.classId ? String(student.classId) : (classList[0]?.id ? String(classList[0].id) : ''));
    setEditStatus(student.status === 'DA_TOT_NGHIEP' ? 'DA_TOT_NGHIEP' : 'DANG_HUAN_LUYEN');
    setErrorMsg('');
    setIsEditModalOpen(true);
  };

  const handleEditStudentSubmit = async (e) => {
    e.preventDefault();
    if (!editCode.trim() || !editName.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Số hiệu Học viên và Họ tên!');
      return;
    }
    if (!editClassId) {
      setErrorMsg('Vui lòng chọn Lớp Huấn luyện cho học viên!');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const payload = {
        studentCode: editCode.toUpperCase().trim(),
        fullName: editName.trim(),
        dob: editDob ? editDob.trim() : '',
        pob: editPob ? editPob.trim() : '',
        gender: editGender,
        rank: editRank,
        classId: parseInt(editClassId),
        status: editStatus
      };

      const res = await fetch(`/api/v1/students/${editingStudent.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updatedStudent = await res.json();
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
        setIsEditModalOpen(false);
        setMsg(`Đã cập nhật thông tin học viên ${editName} (${editCode.toUpperCase()}) thành công!`);
        setTimeout(() => setMsg(''), 3500);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.message || 'Lỗi từ máy chủ khi cập nhật học viên');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      setErrorMsg('Không thể kết nối máy chủ để cập nhật học viên');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Xác nhận xóa dữ liệu học viên ${name}?`)) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/students/${id}`, {
        method: 'DELETE',
        headers
      });

      if (res.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        setMsg(`Đã xóa học viên ${name}`);
        setTimeout(() => setMsg(''), 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.message || `Không thể xóa học viên ${name}`);
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(`Lỗi kết nối khi xóa học viên: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Controls */}
      <div className="glass-panel p-5 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-600 to-yellow-600 text-white rounded-xl shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-military text-lg font-bold text-slate-900">QUẢN LÝ QUÂN SỐ HỌC VIÊN QUÂN SỰ</h2>
            <p className="text-xs text-emerald-700 font-semibold">Import danh sách từ Excel, quản lý số hiệu học viên, cấp bậc, chức vụ và đơn vị huấn luyện</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by Academic Year */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Khóa:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedClassId('');
              }}
              className="bg-transparent text-xs text-slate-800 focus:outline-none font-semibold cursor-pointer"
            >
              <option value="" className="bg-white text-slate-800">Tất cả năm</option>
              {displayYears.map(yr => (
                <option key={yr} value={yr} className="bg-white text-slate-800">Khóa {yr}</option>
              ))}
            </select>
          </div>

          {/* Filter by Class */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold max-w-xs truncate"
          >
            <option value="">Tất cả các lớp {selectedYear ? `(Khóa ${selectedYear})` : ''} ({students.length} học viên)</option>
            {filteredClasses.length > 0 ? (
              filteredClasses.map(c => (
                <option key={c.id} value={c.id}>{c.code} ({c.name})</option>
              ))
            ) : (
              <option value="" disabled>Không có lớp nào trong năm {selectedYear}</option>
            )}
          </select>

          {/* Filter by Status (Đang huấn luyện / Đã tốt nghiệp) */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 font-semibold cursor-pointer"
            title="Lọc học viên theo trạng thái"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DANG_HUAN_LUYEN">🟢 Đang huấn luyện</option>
            <option value="DA_TOT_NGHIEP">🔵 Đã tốt nghiệp</option>
          </select>

          {/* Delete Single Selected Class (Chỉ hiển thị cho 2 vai trò cao nhất: BGH / Bộ Môn) */}
          {canDeleteClasses && selectedClassId && (
            <button
              onClick={() => setIsDeleteClassModalOpen(true)}
              className="btn btn-danger btn-xs"
              title="Xóa lớp học đang chọn và các học viên thuộc lớp (Chỉ huy / Bộ môn)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa lớp này
            </button>
          )}

          {/* Delete All Classes (Chỉ hiển thị cho 2 vai trò cao nhất: BGH / Bộ Môn) */}
          {canDeleteClasses && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="btn btn-danger btn-xs"
              title="Xóa toàn bộ các lớp học và học viên hiện có để chuẩn bị nạp lại từ Excel (Chỉ huy / Bộ môn)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa toàn bộ lớp
            </button>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm tên hoặc Số hiệu (SHHV)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 w-52"
            />
          </div>

          <button onClick={() => { fetchStudents(); fetchClasses(); }} className="btn btn-secondary btn-sm" title="Làm mới">
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => setIsAdmissionsModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #d97706, #ca8a04)', border: '1px solid #b45309' }}
            title="Nhập danh sách học viên đầu vào từ file Excel (.xls / .xlsx)"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Nhập DS Đầu Vào (.xls)
          </button>

          <button
            onClick={handleExportStudents}
            className="btn btn-secondary btn-sm"
            title="Xuất danh sách học viên quân sự ra file Excel"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Học viên</span>
          </button>
        </div>

      </div>

      {msg && (
        <div className="p-3 bg-emerald-950 border border-emerald-600 text-emerald-300 text-sm rounded-lg flex items-center justify-between font-bold shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            {msg}
          </div>
          <button onClick={() => setMsg('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-950 border border-red-600 text-red-300 text-sm rounded-lg flex items-center justify-between font-bold shadow-md">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Military Student List Table */}
      <div className="glass-panel overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="p-3 text-center w-12">TT</th>
              <th className="p-3">Số hiệu Học viên (SHHV)</th>
              <th className="p-3">Họ và tên Học viên</th>
              <th className="p-3 text-center">Khóa / Năm</th>
              <th className="p-3 text-center">Cấp bậc / Chức vụ</th>
              <th className="p-3 text-center">Ngày sinh</th>
              <th className="p-3">Đơn vị Quản lý / Lớp</th>
              <th className="p-3">Quê quán</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-500 text-xs italic">
                  Không tìm thấy học viên nào phù hợp
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => (
                <tr key={student.id || idx} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center text-xs text-slate-500 font-mono">{idx + 1}</td>
                  <td className="p-3 font-mono text-xs text-amber-700 font-bold">{student.studentCode}</td>
                  <td className="p-3 font-bold text-slate-900">{student.fullName}</td>
                  <td className="p-3 text-center font-mono text-xs font-bold text-amber-800">
                    {student.academicYear || '-'}
                  </td>
                  <td className="p-3 text-center text-xs font-semibold text-emerald-700">{student.rank || 'Học viên'}</td>
                  <td className="p-3 text-center text-xs text-slate-600">{student.dob || '-'}</td>
                  <td className="p-3 text-xs text-slate-800 font-semibold">{student.classCode || student.className || '-'}</td>
                  <td className="p-3 text-xs text-slate-600">{student.pob || '-'}</td>
                  <td className="p-3 text-center">
                    {student.status === 'DA_TOT_NGHIEP' ? (
                      <span className="badge badge-info text-[10px] font-bold">Đã tốt nghiệp</span>
                    ) : (
                      <span className="badge badge-success text-[10px] font-bold">Đang huấn luyện</span>
                    )}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(student)}
                      className="p-1 text-slate-400 hover:text-amber-600 transition"
                      title="Sửa hồ sơ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id, student.fullName)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                      title="Xóa học viên"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM HỌC VIÊN MỚI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg p-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl relative">
            
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4 text-yellow-400">
              <Users className="w-6 h-6" />
              <h3 className="font-military-title text-lg font-bold text-yellow-300">Thêm Mới Học Viên Quân Sự</h3>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 text-red-300 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Số hiệu Học viên (SHHV) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 26BB001"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Họ và tên Học viên *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Cường"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cấp bậc / Chức vụ</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Học viên SQDB">Học viên SQDB</option>
                    <option value="Học viên TĐT">Học viên TĐT</option>
                    <option value="Học viên KĐT">Học viên KĐT</option>
                    <option value="Học viên NVKT">Học viên NVKT</option>
                    <option value="Học viên HSQ">Học viên HSQ</option>
                    <option value="Học viên / Binh nhất">Học viên / Binh nhất</option>
                    <option value="Học viên / Hạ sĩ">Học viên / Hạ sĩ</option>
                    <option value="Học viên / Trung sĩ">Học viên / Trung sĩ</option>
                    <option value="Học viên / Thượng sĩ">Học viên / Thượng sĩ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ngày sinh (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    placeholder="15/05/2003"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Quê quán</label>
                  <input
                    type="text"
                    placeholder="VD: Hà Nội"
                    value={newPob}
                    onChange={(e) => setNewPob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Đơn vị / Lớp Huấn luyện *</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    required
                  >
                    <option value="">-- Chọn Lớp Huấn luyện --</option>
                    {classList.map(c => (
                      <option key={c.id} value={c.id}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Đang gửi...' : 'Lưu Học Viên'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA HỌC VIÊN */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg p-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl relative">
            
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4 text-yellow-400">
              <Edit className="w-6 h-6" />
              <h3 className="font-military-title text-lg font-bold text-yellow-300">
                Chỉnh Sửa Hồ Sơ Học Viên Quân Sự
              </h3>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 text-red-300 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEditStudentSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Số hiệu Học viên (SHHV) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 26BB001"
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Họ và tên Học viên *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Cường"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cấp bậc / Chức vụ</label>
                  <select
                    value={editRank}
                    onChange={(e) => setEditRank(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Học viên SQDB">Học viên SQDB</option>
                    <option value="Học viên TĐT">Học viên TĐT</option>
                    <option value="Học viên KĐT">Học viên KĐT</option>
                    <option value="Học viên NVKT">Học viên NVKT</option>
                    <option value="Học viên HSQ">Học viên HSQ</option>
                    <option value="Học viên / Binh nhất">Học viên / Binh nhất</option>
                    <option value="Học viên / Hạ sĩ">Học viên / Hạ sĩ</option>
                    <option value="Học viên / Trung sĩ">Học viên / Trung sĩ</option>
                    <option value="Học viên / Thượng sĩ">Học viên / Thượng sĩ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ngày sinh (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    placeholder="15/05/2003"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Quê quán</label>
                  <input
                    type="text"
                    placeholder="VD: Hà Nội"
                    value={editPob}
                    onChange={(e) => setEditPob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Đơn vị / Lớp Huấn luyện *</label>
                  <select
                    value={editClassId}
                    onChange={(e) => setEditClassId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    required
                  >
                    <option value="">-- Chọn Lớp Huấn luyện --</option>
                    {classList.map(c => (
                      <option key={c.id} value={c.id}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Trạng thái học viên *</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="DANG_HUAN_LUYEN">🟢 Đang huấn luyện</option>
                  <option value="DA_TOT_NGHIEP">🔵 Đã tốt nghiệp</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary bg-yellow-600 hover:bg-yellow-700 text-slate-950 font-bold"
                  disabled={submitting}
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal Confirm Delete All Classes */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">XÓA TOÀN BỘ LỚP HỌC?</h3>
                <p className="text-xs text-red-300 font-semibold">Cảnh báo: Hành động không thể hoàn tác</p>
              </div>
            </div>

            <div className="bg-red-950/40 border border-red-900/60 rounded-xl p-3.5 text-xs text-slate-300 space-y-2">
              <p>Hành động này sẽ <strong>xóa toàn bộ {classList.length} lớp học</strong> cùng toàn bộ dữ liệu điểm số, đánh giá rèn luyện và hồ sơ học viên trong hệ thống.</p>
              <p className="text-amber-300 font-semibold">💡 Bạn có thể dùng chức năng này để dọn sạch dữ liệu cũ và nạp lại danh sách mới từ file Excel.</p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                className="btn-secondary px-4 py-2 text-xs"
                disabled={deletingClasses}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteAllClasses}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-red-900/40"
                disabled={deletingClasses}
              >
                {deletingClasses ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Xác nhận Xóa Toàn Bộ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete Single Class */}
      {isDeleteClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-red-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">XÓA LỚP HỌC ĐÃ CHỌN?</h3>
                <p className="text-xs text-red-300 font-semibold">Lớp: {classList.find(c => String(c.id) === String(selectedClassId))?.code || selectedClassId}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
              Toàn bộ học viên và điểm số thuộc lớp này sẽ bị xóa khỏi cơ sở dữ liệu.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteClassModalOpen(false)}
                className="btn-secondary px-4 py-2 text-xs"
                disabled={deletingClasses}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteSelectedClass}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                disabled={deletingClasses}
              >
                {deletingClasses ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Xác nhận Xóa Lớp
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admissions Batch Import Modal */}
      <AdmissionsImportModal
        isOpen={isAdmissionsModalOpen}
        onClose={() => setIsAdmissionsModalOpen(false)}
        onImportSuccess={() => {
          fetchStudents();
          fetchClasses();
        }}
      />

    </div>
  );
}
