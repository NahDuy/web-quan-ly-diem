import React, { useState, useEffect } from 'react';
import { 
  BookmarkCheck, Plus, Edit2, Trash2, Search, Building2, 
  Layers, CheckCircle2, AlertTriangle, X, Hash, BookOpen, Sparkles, Shield, Download
} from 'lucide-react';

const DEFAULT_TARGET_GROUPS = [
  { code: 'SQDB(XN)', shortCode: 'XN', name: 'SQDB Xuất ngũ', desc: 'Hạ sĩ quan xuất ngũ', classPattern: 'SQDB-XN-[NGÀNH]-01', studentPattern: '26XN-[NGÀNH]001', isCustom: false },
  { code: 'SQDB(H1)', shortCode: 'H1', name: 'SQDB Hạng 1', desc: 'Quân nhân DB hạng 1', classPattern: 'SQDB-H1-[NGÀNH]-01', studentPattern: '26H1-[NGÀNH]001', isCustom: false },
  { code: 'SQDB(SV)', shortCode: 'SV', name: 'SQDB Sinh viên', desc: 'Sinh viên tốt nghiệp ĐH', classPattern: 'SQDB-SV-[NGÀNH]-01', studentPattern: '26SV-[NGÀNH]001', isCustom: false },
  { code: 'KDT', shortCode: 'KDT', name: 'Khẩu đội trưởng', desc: 'Khẩu đội trưởng Hỏa lực & Pháo', classPattern: 'KDT-DL-01', studentPattern: '26KDT-DL001', isCustom: false },
  { code: 'TDT', shortCode: 'TDT', name: 'Tiểu đội trưởng', desc: 'Tiểu đội trưởng Bộ binh & Trinh sát', classPattern: 'TDT-BB-01', studentPattern: '26TDT-BB001', isCustom: false },
  { code: 'NVKT', shortCode: 'NVKT', name: 'Nhân viên Kỹ thuật', desc: 'Nhân viên Chuyên môn Kỹ thuật', classPattern: 'NVKT-NVQY-01', studentPattern: '26NVKT-NVQY001', isCustom: false },
  { code: 'HSQ', shortCode: 'HSQ', name: 'Hạ sĩ quan Chỉ huy', desc: 'Hạ sĩ quan Chỉ huy Quân sự', classPattern: 'HSQ-CH-01', studentPattern: '26HSQ-CH001', isCustom: false },
];

export default function MajorManagementView() {
  const [majors, setMajors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);

  // Target Groups State
  const [targetGroups, setTargetGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('military_target_groups_major');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading target groups', e);
    }
    return DEFAULT_TARGET_GROUPS;
  });

  // Modal State for Target Group
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);
  const [newTargetCode, setNewTargetCode] = useState('');
  const [newTargetName, setNewTargetName] = useState('');
  const [newTargetDesc, setNewTargetDesc] = useState('Thời gian 06 tháng');
  const [addTargetError, setAddTargetError] = useState('');

  // Modal State for Major
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

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/majors/export-excel', { headers });
      if (!res.ok) throw new Error('Không thể tải file Excel danh mục');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Danh_Muc_Chuyen_Nganh_Quan_Su_${new Date().getFullYear()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showNotification('Đã xuất danh sách chuyên ngành ra file Excel chuẩn in A4 thành công!');
    } catch (err) {
      console.error(err);
      showNotification('', 'Lỗi khi tải file Excel danh mục chuyên ngành');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveTargetGroup = (e) => {
    e.preventDefault();
    if (!newTargetCode.trim() || !newTargetName.trim()) {
      setAddTargetError('Vui lòng nhập đầy đủ Mã và Tên đối tượng đào tạo!');
      return;
    }
    const cleanCode = newTargetCode.trim().toUpperCase();
    if (targetGroups.some(tg => tg.code.toUpperCase() === cleanCode)) {
      setAddTargetError(`Mã đối tượng "${cleanCode}" đã tồn tại trong danh mục!`);
      return;
    }

    const cleanShort = cleanCode.replace(/[^A-Za-z0-9]/g, '');
    const newTarget = {
      code: cleanCode,
      shortCode: cleanCode,
      name: newTargetName.trim(),
      desc: newTargetDesc.trim() || 'Thời gian 06 tháng',
      classPattern: `${cleanCode}-[NGÀNH]-01`,
      studentPattern: `26${cleanShort}-[NGÀNH]001`,
      isCustom: true
    };

    const updated = [...targetGroups, newTarget];
    setTargetGroups(updated);
    try {
      localStorage.setItem('military_target_groups_major', JSON.stringify(updated));
    } catch (err) {}

    setIsAddTargetModalOpen(false);
    setNewTargetCode('');
    setNewTargetName('');
    setNewTargetDesc('Thời gian 06 tháng');
    setAddTargetError('');
    showNotification(`Đã thêm đối tượng đào tạo "${newTarget.name}" (${newTarget.code}) thành công!`);
  };

  const handleDeleteTargetGroup = (code, name) => {
    if (!window.confirm(`XÁC NHẬN XÓA ĐỐI TƯỢNG ĐÀO TẠO?\n\nBạn có chắc muốn xóa "${name}" (${code})?`)) return;
    const updated = targetGroups.filter(tg => tg.code !== code);
    setTargetGroups(updated);
    try {
      localStorage.setItem('military_target_groups_major', JSON.stringify(updated));
    } catch (err) {}
    showNotification(`Đã xóa đối tượng đào tạo "${name}"`);
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="btn btn-secondary btn-sm flex items-center gap-2 shadow-sm text-slate-700 bg-white hover:bg-slate-50 border-slate-300 font-bold"
              title="Xuất toàn bộ danh sách chuyên ngành ra file Excel chuẩn in A4 ngang"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{exporting ? 'Đang xuất file...' : 'Xuất DS Chuyên Ngành (Excel)'}</span>
            </button>

            <button
              onClick={() => {
                setNewTargetCode('');
                setNewTargetName('');
                setNewTargetDesc('Thời gian 06 tháng');
                setAddTargetError('');
                setIsAddTargetModalOpen(true);
              }}
              className="btn btn-sm flex items-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                border: '1px solid #fde047',
                fontWeight: 700
              }}
              title="Thêm đối tượng đào tạo mới vào hệ thống"
            >
              <Plus className="w-4 h-4 text-amber-700" />
              <span>+ Thêm Đối Tượng</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Chuyên ngành Mới</span>
            </button>
          </div>
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-900 uppercase font-military-title">
              QUY ƯỚC CÁC ĐỐI TƯỢNG ĐÀO TẠO TẠI NHÀ TRƯỜNG ({targetGroups.length})
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-700 font-semibold hidden sm:inline">
              Tự động áp dụng khi nhập file danh sách đầu vào (.xls / .xlsx)
            </span>
            <button
              onClick={() => {
                setNewTargetCode('');
                setNewTargetName('');
                setNewTargetDesc('Thời gian 06 tháng');
                setAddTargetError('');
                setIsAddTargetModalOpen(true);
              }}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              Thêm Đối Tượng
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {targetGroups.map((tg) => (
            <div 
              key={tg.code} 
              className="relative group p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/30 transition flex flex-col justify-between"
            >
              {tg.isCustom && (
                <button
                  type="button"
                  onClick={() => handleDeleteTargetGroup(tg.code, tg.name)}
                  title="Xóa đối tượng này"
                  className="absolute top-1.5 right-1.5 text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10px] font-mono font-bold block w-fit mb-1.5">
                  {tg.code}
                </span>
                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-1" title={tg.name}>
                  {tg.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Mã lớp: <code className="text-emerald-700 font-mono font-bold">{tg.classPattern || `${tg.code}-[NGÀNH]-01`}</code>
                </p>
                <p className="text-[10px] text-slate-500">
                  Mã HV: <code className="text-amber-800 font-mono font-bold">{tg.studentPattern || `26${tg.code.replace(/[^A-Za-z0-9]/g, '')}-[NGÀNH]001`}</code>
                </p>
              </div>
            </div>
          ))}
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

      {/* Add Target Group Modal */}
      {isAddTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg border border-amber-300">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-military-title">
                    Thêm Đối Tượng Đào Tạo Mới
                  </h3>
                  <p className="text-[11px] text-amber-900">
                    Khai báo quy ước mã lớp và mã học viên chuẩn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTargetModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error */}
            {addTargetError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-lg flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                {addTargetError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveTargetGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mã Quy ước Đối tượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SQDB(XN), SQDB(H1), KDT, TDT, NVKT, HSQ..."
                  value={newTargetCode}
                  onChange={(e) => setNewTargetCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-amber-900 font-mono font-bold uppercase focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Mã viết tắt chuẩn hóa để nhận diện trong file đầu vào và sinh mã
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tên Đối tượng Đào tạo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sĩ quan Dự bị Xuất ngũ, Khẩu đội trưởng..."
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mô tả / Thời gian Đào tạo
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thời gian 06 tháng, Đào tạo theo chỉ tiêu..."
                  value={newTargetDesc}
                  onChange={(e) => setNewTargetDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Dynamic Preview Box */}
              {newTargetCode.trim() && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Mẫu quy ước tự động sinh:
                  </div>
                  <div className="text-[11px] space-y-1">
                    <p className="text-slate-600">
                      Mẫu mã lớp: <code className="font-mono text-emerald-700 font-bold">{newTargetCode.trim().toUpperCase()}-[NGÀNH]-01</code>
                    </p>
                    <p className="text-slate-600">
                      Mẫu mã học viên: <code className="font-mono text-amber-800 font-bold">26{newTargetCode.trim().replace(/[^A-Za-z0-9]/g, '').toUpperCase()}-[NGÀNH]001</code>
                    </p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddTargetModalOpen(false)}
                  className="btn btn-secondary px-4 py-2 text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2 text-xs font-bold cursor-pointer"
                >
                  Lưu Đối Tượng Đào Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}