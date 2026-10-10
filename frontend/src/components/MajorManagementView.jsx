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
      <div className="glass-panel p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 shadow-xs">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-military-title flex items-center gap-2">
                Quản lý Danh mục Chuyên ngành & Quy ước Đào tạo
              </h2>
              <p className="text-xs text-slate-500">
                Khai báo mã quy ước và tên các chuyên ngành phục vụ tự động sinh <b className="text-amber-800">Mã Lớp</b> và <b className="text-amber-800">Mã Học viên (MSSV)</b> khi import đầu khóa
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn btn-primary btn-sm flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm Chuyên ngành Mới
          </button>
        </div>
      </div>

      {/* Notifications */}
      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm rounded-lg flex items-center gap-2 font-bold shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {msg}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 text-sm rounded-lg flex items-center gap-2 font-bold shadow-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-bold uppercase">Tổng số Chuyên ngành</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{majors.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Bao quát Bộ binh, Hỏa lực & Binh chủng</p>
        </div>
        <div className="glass-panel p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-bold uppercase">Chuyên ngành Đang Đào tạo</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {majors.filter(m => m.classCount > 0).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Có ít nhất 1 lớp học trực thuộc</p>
        </div>
        <div className="glass-panel p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-bold uppercase">Khoa / Bộ môn Phụ trách</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{departments.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Đơn vị quản lý chương trình khung</p>
        </div>
      </div>

      {/* Military Training Targets Showcase */}
      <div className="glass-panel p-5 bg-white border border-amber-200 rounded-xl space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-900 uppercase font-military-title">
              QUY ƯỚC CÁC ĐỐI TƯỢNG ĐÀO TẠO TẠI NHÀ TRƯỜNG
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            Được tự động áp dụng khi nhập file danh sách đầu vào (.xls / .xlsx)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/30 transition">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              SQDB(XN)
            </span>
            <p className="text-xs font-bold text-slate-900">SQDB Xuất ngũ</p>
            <p className="text-[10px] text-slate-500 mt-1">Mã lớp: <code className="text-emerald-700 font-mono font-bold">SQDB-XN-TSBB-01</code></p>
            <p className="text-[10px] text-slate-500">Mã HV: <code className="text-amber-800 font-mono font-bold">26XN-TSBB001</code></p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/30 transition">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              SQDB(H1)
            </span>
            <p className="text-xs font-bold text-slate-900">SQDB Hạng 1</p>
            <p className="text-[10px] text-slate-500 mt-1">Mã lớp: <code className="text-emerald-700 font-mono font-bold">SQDB-H1-TSBB-01</code></p>
            <p className="text-[10px] text-slate-500">Mã HV: <code className="text-amber-800 font-mono font-bold">26H1-TSBB001</code></p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/30 transition">
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              SQDB(SV)
            </span>
            <p className="text-xs font-bold text-slate-900">SQDB Sinh viên</p>
            <p className="text-[10px] text-slate-500 mt-1">Mã lớp: <code className="text-emerald-700 font-mono font-bold">SQDB-SV-BCHT-01</code></p>
            <p className="text-[10px] text-slate-500">Mã HV: <code className="text-amber-800 font-mono font-bold">26SV-BCHT001</code></p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-red-400 hover:bg-red-50/30 transition">
            <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              KDT
            </span>
            <p className="text-xs font-bold text-slate-900">Khẩu đội trưởng</p>
            <p className="text-[10px] text-slate-500 mt-1">Mã lớp: <code className="text-emerald-700 font-mono font-bold">KDT-DL-01</code></p>
            <p className="text-[10px] text-slate-500">Mã HV: <code className="text-amber-800 font-mono font-bold">26KDT-DL001</code></p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50/30 transition">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              TDT
            </span>
            <p className="text-xs font-bold text-slate-900">Tiểu đội trưởng</p>
            <p className="text-[10px] text-slate-500 mt-1">Mã lớp: <code className="text-emerald-700 font-mono font-bold">TDT-BB-01</code></p>
            <p className="text-[10px] text-slate-500">Mã HV: <code className="text-amber-800 font-mono font-bold">26TDT-BB001</code></p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-purple-400 hover:bg-purple-50/30 transition">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
              NVKT
            </span>
            <p className="text-xs font-bold text-slate-900">Nhân viên Kỹ thuật</p>
            <p className="text-[10px] text-slate-500 mt-1">Mã lớp: <code className="text-emerald-700 font-mono font-bold">NVKT-NVQY-01</code></p>
            <p className="text-[10px] text-slate-500">Mã HV: <code className="text-amber-800 font-mono font-bold">26NVKT-NVQY001</code></p>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-panel bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo mã ngành, tên chuyên ngành, bộ môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Hiển thị <b className="text-amber-800">{filteredMajors.length}</b> / {majors.length} chuyên ngành
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">STT</th>
                <th className="p-3 w-28 text-center">Mã Quy Ước</th>
                <th className="p-3">Tên Chuyên ngành</th>
                <th className="p-3">Khoa / Bộ môn Quản lý</th>
                <th className="p-3 text-center w-24">Số Lớp</th>
                <th className="p-3 text-emerald-800">Mẫu Mã Lớp (2026)</th>
                <th className="p-3 text-amber-800">Mẫu Mã Học viên (2026)</th>
                <th className="p-3 w-28 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
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
                  <tr key={major.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded font-mono font-bold text-xs shadow-xs">
                        {major.code}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 text-sm">
                      {major.name}
                    </td>
                    <td className="p-3 text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {major.departmentName || 'Chưa phân khoa'}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {major.classCount > 0 ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px]">
                          {major.classCount} lớp
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-emerald-700 font-semibold">
                      SQDB-XN-{major.code}-01
                    </td>
                    <td className="p-3 font-mono text-[11px] text-amber-800 font-bold">
                      26XN-{major.code}001
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(major)}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Sửa chuyên ngành"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(major.id, major.name)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg border border-amber-300">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-military-title">
                  {editingMajor ? 'Chỉnh sửa Chuyên ngành' : 'Thêm mới Chuyên ngành Đào tạo'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mã Quy ước Chuyên ngành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: TSBB, COI, DKZ, PK127, PB, TT, CB..."
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-amber-900 font-mono font-bold uppercase focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Mã ngắn gọn (2-5 ký tự viết hoa) dùng để sinh Mã Lớp và Mã Học viên
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tên Chuyên ngành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trinh sát Bộ binh, Súng Cối 82mm, Súng ĐKZ..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Khoa / Bộ môn Quản lý
                </label>
                <select
                  value={formDeptId}
                  onChange={(e) => setFormDeptId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
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
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Xem trước Quy ước Mã Tự động Năm 2026:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white border border-amber-200 rounded">
                      <span className="text-[10px] text-slate-500 block">Mã Lớp dự kiến:</span>
                      <span className="font-mono text-emerald-700 font-bold">SQDB-XN-{formCode.trim().toUpperCase()}-01</span>
                    </div>
                    <div className="p-2.5 bg-white border border-amber-200 rounded">
                      <span className="text-[10px] text-slate-500 block">Mã Học viên dự kiến:</span>
                      <span className="font-mono text-amber-800 font-bold">26XN-{formCode.trim().toUpperCase()}001</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 text-xs cursor-pointer"
                  disabled={submitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2 text-xs font-bold cursor-pointer"
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