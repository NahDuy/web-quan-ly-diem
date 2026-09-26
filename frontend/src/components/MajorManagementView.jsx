import React, { useState, useEffect } from 'react';
import { 
  BookmarkCheck, Plus, Edit2, Trash2, Search, Building2, 
  Layers, CheckCircle2, AlertTriangle, X, Hash, BookOpen, Sparkles, Shield
} from 'lucide-react';

export default function MajorManagementView() {
  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Notification State
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const [resMajors, resDepts] = await Promise.all([
        fetch('/api/v1/majors', { headers }),
        fetch('/api/v1/majors/departments', { headers })
      ]);

      if (resMajors.ok) {
        const data = await resMajors.json();
        setMajors(data);
      }
      if (resDepts.ok) {
        const depts = await resDepts.json();
        setDepartments(depts);
      }
    } catch (err) {
      console.error('Error fetching majors:', err);
      setErrorMsg('Không thể tải danh sách chuyên ngành từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const showNotification = (successText, errorText = '') => {
    if (successText) {
      setMsg(successText);
      setTimeout(() => setMsg(''), 3500);
    }
    if (errorText) {
      setErrorMsg(errorText);
      setTimeout(() => setErrorMsg(''), 4500);
    }
  };

  const handleOpenAdd = () => {
    setEditingMajor(null);
    setFormCode('');
    setFormName('');
    setFormDeptId(departments.length > 0 ? departments[0].id : '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (major) => {
    setEditingMajor(major);
    setFormCode(major.code);
    setFormName(major.name);
    setFormDeptId(major.departmentId || (departments.length > 0 ? departments[0].id : ''));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      showNotification('', 'Vui lòng nhập đầy đủ Mã và Tên chuyên ngành');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const payload = {
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        departmentId: formDeptId ? parseInt(formDeptId) : null
      };

      const url = editingMajor ? `/api/v1/majors/${editingMajor.id}` : '/api/v1/majors';
      const method = editingMajor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        showNotification(editingMajor ? `Đã cập nhật chuyên ngành "${payload.name}"` : `Đã thêm chuyên ngành "${payload.name}" thành công!`);
        fetchMajors();
      } else {
        showNotification('', resData.message || 'Lỗi khi lưu chuyên ngành');
      }
    } catch (err) {
      showNotification('', 'Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`XÁC NHẬN XÓA CHUYÊN NGÀNH?\n\nBạn có chắc chắn muốn xóa chuyên ngành "${name}"?`)) return;

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`/api/v1/majors/${id}`, {
        method: 'DELETE',
        headers
      });

      const resData = await res.json();
      if (res.ok) {
        showNotification(`Đã xóa chuyên ngành "${name}" thành công`);
        fetchMajors();
      } else {
        showNotification('', resData.message || 'Không thể xóa chuyên ngành');
      }
    } catch (err) {
      showNotification('', 'Lỗi kết nối khi xóa chuyên ngành');
    }
  };

  const filteredMajors = majors.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-slate-900 border border-amber-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-amber-600 to-yellow-600 text-yellow-100 rounded-xl border border-yellow-400 shadow-md">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Quản lý Danh mục Chuyên ngành & Quy ước Đào tạo
              </h2>
              <p className="text-xs text-slate-400">
                Khai báo mã quy ước và tên các chuyên ngành phục vụ tự động sinh <b className="text-yellow-300">Mã Lớp</b> và <b className="text-yellow-300">Mã Học viên (MSSV)</b> khi import đầu khóa
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
          >
            <Plus className="w-4 h-4" />
            Thêm Chuyên ngành Mới
          </button>
        </div>
      </div>

      {/* Notifications */}
      {msg && (
        <div className="p-3 bg-emerald-950 border border-emerald-600 text-emerald-300 text-sm rounded-lg flex items-center gap-2 font-bold shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          {msg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-950 border border-red-600 text-red-300 text-sm rounded-lg flex items-center gap-2 font-bold shadow-md">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 bg-slate-900/80 border border-slate-700 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Tổng số Chuyên ngành</p>
          <p className="text-2xl font-extrabold text-yellow-300 mt-1">{majors.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Bao quát Bộ binh, Hỏa lực & Binh chủng</p>
        </div>
        <div className="glass-panel p-4 bg-slate-900/80 border border-slate-700 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Chuyên ngành Đang Đào tạo</p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {majors.filter(m => m.classCount > 0).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Có ít nhất 1 lớp học trực thuộc</p>
        </div>
        <div className="glass-panel p-4 bg-slate-900/80 border border-slate-700 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Khoa / Bộ môn Phụ trách</p>
          <p className="text-2xl font-extrabold text-blue-400 mt-1">{departments.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Đơn vị quản lý chương trình khung</p>
        </div>
      </div>

      {/* Military Training Targets Showcase */}
      <div className="glass-panel p-5 bg-slate-900/90 border border-amber-500/40 rounded-xl space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-yellow-200 uppercase font-military-title">
              QUY ƯỚC CÁC ĐỐI TƯỢNG ĐÀO TẠO TẠI NHÀ TRƯỜNG
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            Được tự động áp dụng khi nhập file danh sách đầu vào (.xls / .xlsx)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-yellow-500/60 transition">
            <span className="px-2 py-0.5 bg-amber-950 text-yellow-300 border border-amber-700 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              SQDB
            </span>
            <p className="text-xs font-bold text-white">Sĩ quan Dự bị</p>
            <p className="text-[10px] text-slate-400 mt-1">Mã lớp: <code className="text-emerald-400 font-mono">SQDB2026-TSBB1</code></p>
            <p className="text-[10px] text-slate-400">Mã HV: <code className="text-yellow-300 font-mono">26TSBB001</code></p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-yellow-500/60 transition">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-700 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              TDT
            </span>
            <p className="text-xs font-bold text-white">Tiểu đội trưởng</p>
            <p className="text-[10px] text-slate-400 mt-1">Mã lớp: <code className="text-emerald-400 font-mono">TDT2026-BB1</code></p>
            <p className="text-[10px] text-slate-400">Mã HV: <code className="text-yellow-300 font-mono">26TDT-BB001</code></p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-yellow-500/60 transition">
            <span className="px-2 py-0.5 bg-red-950 text-red-300 border border-red-700 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              KDT
            </span>
            <p className="text-xs font-bold text-white">Khẩu đội trưởng</p>
            <p className="text-[10px] text-slate-400 mt-1">Mã lớp: <code className="text-emerald-400 font-mono">KDT2026-COI1</code></p>
            <p className="text-[10px] text-slate-400">Mã HV: <code className="text-yellow-300 font-mono">26KDT-COI001</code></p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-yellow-500/60 transition">
            <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-700 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              NVKT
            </span>
            <p className="text-xs font-bold text-white">Nhân viên Kỹ thuật</p>
            <p className="text-[10px] text-slate-400 mt-1">Mã lớp: <code className="text-emerald-400 font-mono">NVKT2026-TT1</code></p>
            <p className="text-[10px] text-slate-400">Mã HV: <code className="text-yellow-300 font-mono">26NVKT-TT001</code></p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-yellow-500/60 transition">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              HSQ
            </span>
            <p className="text-xs font-bold text-white">Hạ sĩ quan Chỉ huy</p>
            <p className="text-[10px] text-slate-400 mt-1">Mã lớp: <code className="text-emerald-400 font-mono">HSQ2026-BB1</code></p>
            <p className="text-[10px] text-slate-400">Mã HV: <code className="text-yellow-300 font-mono">26HSQ-BB001</code></p>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã ngành, tên chuyên ngành, bộ môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Hiển thị <b className="text-yellow-400">{filteredMajors.length}</b> / {majors.length} chuyên ngành
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 w-12 text-center">STT</th>
                <th className="p-3 w-28 text-center">Mã Quy Ước</th>
                <th className="p-3">Tên Chuyên ngành</th>
                <th className="p-3">Khoa / Bộ môn Quản lý</th>
                <th className="p-3 text-center w-24">Số Lớp</th>
                <th className="p-3 text-emerald-400">Mẫu Mã Lớp (2026)</th>
                <th className="p-3 text-yellow-400">Mẫu Mã Học viên (2026)</th>
                <th className="p-3 w-28 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Đang tải danh sách chuyên ngành...
                  </td>
                </tr>
              ) : filteredMajors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    Không tìm thấy chuyên ngành nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredMajors.map((major, idx) => (
                  <tr key={major.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-amber-950/80 text-yellow-300 border border-amber-600/60 rounded font-mono font-bold text-xs shadow-sm">
                        {major.code}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white text-sm">
                      {major.name}
                    </td>
                    <td className="p-3 text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {major.departmentName}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {major.classCount > 0 ? (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-600/40 rounded-full text-[11px]">
                          {major.classCount} lớp
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">0</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-emerald-300">
                      SQDB2026-{major.code}1
                    </td>
                    <td className="p-3 font-mono text-[11px] text-yellow-300 font-semibold">
                      26{major.code}001
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(major)}
                          className="p-1.5 text-slate-400 hover:text-yellow-300 hover:bg-slate-800 rounded transition"
                          title="Sửa chuyên ngành"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(major.id, major.name)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition"
                          title="Xóa chuyên ngành"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 text-yellow-300 rounded-lg border border-yellow-500/40">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <h3 className="text-md font-bold text-white">
                  {editingMajor ? 'Chỉnh sửa Chuyên ngành' : 'Thêm mới Chuyên ngành Đào tạo'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">
                  Mã Quy ước Chuyên ngành <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: TSBB, COI, DKZ, PK127, PB, TT, CB..."
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-yellow-200 font-mono font-bold uppercase focus:outline-none focus:border-yellow-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Mã ngắn gọn (2-5 ký tự viết hoa) dùng để sinh Mã Lớp và Mã Học viên
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">
                  Tên Chuyên ngành <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trinh sát Bộ binh, Súng Cối 82mm, Súng ĐKZ..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">
                  Khoa / Bộ môn Quản lý
                </label>
                <select
                  value={formDeptId}
                  onChange={(e) => setFormDeptId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-yellow-400"
                >
                  <option value="">-- Chưa gán khoa bộ môn --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Preview Box */}
              {formCode.trim() && (
                <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-yellow-400 uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Xem trước Quy ước Mã Tự động Năm 2026:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-[10px] text-slate-400 block">Mã Lớp dự kiến:</span>
                      <span className="font-mono text-emerald-400 font-bold">SQDB2026-{formCode.trim().toUpperCase()}1</span>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <span className="text-[10px] text-slate-400 block">Mã Học viên dự kiến:</span>
                      <span className="font-mono text-yellow-300 font-bold">26{formCode.trim().toUpperCase()}001</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary px-4 py-2 text-xs"
                  disabled={submitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white"
                  disabled={submitting}
                >
                  {submitting ? 'Đang lưu...' : (editingMajor ? 'Cập nhật Chuyên ngành' : 'Thêm mới Chuyên ngành')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}