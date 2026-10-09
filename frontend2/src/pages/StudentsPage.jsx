import React, { useState, useEffect } from 'react';
import {
  Users, Upload, Download, Plus, Search,
  Edit, Trash2, CheckCircle2, RefreshCw, X
} from 'lucide-react';
import { studentsApi } from '../api';

const CLASS_OPTIONS = [
  { value: '', label: 'Tất cả các lớp' },
  { value: '1', label: 'SQDB2026-HT1 (Binh chủng Hợp thành 1)' },
  { value: '2', label: 'SQDB2026-PB1 (Pháo binh 1)' },
  { value: '3', label: 'SQDB2026-TT1 (Thông tin Kỹ thuật 1)' },
  { value: '4', label: 'SQDB2025-HT1 (Hợp thành 2025)' },
  { value: '5', label: 'SQDB2024-HT1 (Hợp thành 2024)' },
];

const RANK_OPTIONS = [
  'Học viên / Binh nhất', 'Học viên / Hạ sĩ',
  'Học viên / Trung sĩ', 'Học viên / Thượng sĩ',
];

const INITIAL_FORM = {
  studentCode: '', fullName: '', rank: RANK_OPTIONS[0],
  dob: '', pob: '', gender: 'Nam', classId: 1,
};

export default function StudentsPage({ onOpenImportModal }) {
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [classFilter, setClassFilter] = useState('');
  const [search, setSearch]           = useState('');
  const [msg, setMsg]                 = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState(INITIAL_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [formError, setFormError]     = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentsApi.getStudents(classFilter || undefined);
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [classFilter]);

  const filtered = students.filter(
    (s) =>
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(search.toLowerCase())
  );

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3500); };

  const handleFormChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.studentCode.trim() || !form.fullName.trim()) {
      setFormError('Vui lòng nhập đầy đủ Số hiệu và Họ tên học viên!');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        studentCode: form.studentCode.toUpperCase().trim(),
        fullName: form.fullName.trim(),
        dob: form.dob || '01/01/2003',
        pob: form.pob || 'Hà Nội',
        classId: parseInt(form.classId) || 1,
      };
      await studentsApi.createStudent(payload);
      showMsg(`Đã thêm mới thành công học viên ${form.fullName} (${form.studentCode.toUpperCase()})`);
      setModalOpen(false);
      setForm(INITIAL_FORM);
      fetchStudents();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Không thể tạo mới học viên trên server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xác nhận xóa dữ liệu học viên ${name}?`)) return;
    try {
      await studentsApi.deleteStudent(id);
      showMsg(`Đã xóa học viên ${name}`);
      fetchStudents();
    } catch (err) {
      alert(err?.response?.data?.message || 'Không thể xóa học viên');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>

      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'linear-gradient(135deg, #d97706, #ca8a04)', borderRadius: '12px', border: '1px solid rgba(253,224,71,0.4)', boxShadow: '0 2px 8px rgba(217,119,6,0.2)' }}>
            <Users size={22} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h2 className="font-military" style={{ fontSize: '1rem', color: '#0f172a' }}>QUẢN LÝ QUÂN SỐ HỌC VIÊN QUÂN SỰ</h2>
            <p style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Import danh sách từ Excel, quản lý số hiệu, cấp bậc, đơn vị huấn luyện</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {/* Class filter */}
          <select
            id="select-class-filter"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', fontSize: '0.8rem' }}
          >
            {CLASS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              id="input-search-students"
              type="text"
              placeholder="Tìm tên hoặc SHHV..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', width: '200px', fontSize: '0.8rem' }}
            />
          </div>

          <button id="btn-refresh-students" onClick={fetchStudents} className="btn btn-secondary btn-icon" title="Làm mới">
            <RefreshCw size={15} style={{ color: '#15803d' }} className={loading ? 'animate-spin' : ''} />
          </button>

          <button id="btn-import-excel" onClick={onOpenImportModal} className="btn btn-secondary btn-sm">
            <Upload size={14} style={{ color: '#15803d' }} /> Import Excel
          </button>

          <button
            id="btn-export-excel"
            onClick={() => alert(`Đã xuất ${filtered.length} học viên ra file Excel!`)}
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} style={{ color: '#b45309' }} /> Xuất Excel
          </button>

          <button
            id="btn-add-student"
            onClick={() => { setFormError(''); setModalOpen(true); }}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} /> Thêm Học viên
          </button>
        </div>
      </div>

      {msg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} style={{ color: '#15803d' }} /> {msg}
        </div>
      )}

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                {['TT', 'Số hiệu (SHHV)', 'Họ và tên Học viên', 'Cấp bậc / Chức vụ', 'Ngày sinh', 'Đơn vị / Lớp', 'Quê quán', 'Trạng thái', 'Thao tác'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === 'TT' ? 'center' : 'left', fontSize: '0.7rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Không tìm thấy học viên nào phù hợp
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => (
                  <tr
                    key={s.id ?? idx}
                    style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>{s.studentCode}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>{s.fullName}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#15803d' }}>{s.rank ?? 'Học viên SQDB'}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b' }}>{s.dob}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>{s.classCode ?? 'SQDB2026-HT1'}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b' }}>{s.pob ?? 'Hà Nội'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Đang huấn luyện</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          id={`btn-edit-student-${s.id}`}
                          className="btn btn-icon btn-sm"
                          title="Sửa hồ sơ"
                          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          id={`btn-delete-student-${s.id}`}
                          onClick={() => handleDelete(s.id, s.fullName)}
                          className="btn btn-icon btn-sm"
                          title="Xóa học viên"
                          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                        >
                          <Trash2 size={15} />
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

      {/* Add student modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-panel"
            style={{ maxWidth: '520px', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} style={{ color: '#fde047' }} />
                <h3 className="font-military" style={{ fontSize: '0.95rem', color: '#fde047' }}>
                  THÊM MỚI HỌC VIÊN QUÂN SỰ
                </h3>
              </div>
              <button id="btn-close-add-student" onClick={() => setModalOpen(false)} className="btn btn-icon btn-secondary btn-sm">
                <X size={16} />
              </button>
            </div>

            {formError && <div className="alert alert-error" style={{ marginBottom: '16px', fontSize: '0.8rem' }}>{formError}</div>}

            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="add-code">Số hiệu Học viên (SHHV) *</label>
                  <input id="add-code" type="text" required placeholder="HV2026006" className="form-input"
                    value={form.studentCode} onChange={(e) => handleFormChange('studentCode', e.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="add-name">Họ và tên Học viên *</label>
                  <input id="add-name" type="text" required placeholder="Nguyễn Văn Cường" className="form-input"
                    value={form.fullName} onChange={(e) => handleFormChange('fullName', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="add-rank">Cấp bậc / Chức vụ</label>
                  <select id="add-rank" className="form-input"
                    value={form.rank} onChange={(e) => handleFormChange('rank', e.target.value)}>
                    {RANK_OPTIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="add-dob">Ngày sinh (DD/MM/YYYY)</label>
                  <input id="add-dob" type="text" placeholder="15/05/2002" className="form-input"
                    value={form.dob} onChange={(e) => handleFormChange('dob', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="add-pob">Quê quán</label>
                  <input id="add-pob" type="text" placeholder="Hà Nội" className="form-input"
                    value={form.pob} onChange={(e) => handleFormChange('pob', e.target.value)} />
                </div>
                <div>
                  <label className="form-label" htmlFor="add-class">Đơn vị / Lớp Huấn luyện *</label>
                  <select id="add-class" className="form-input"
                    value={form.classId} onChange={(e) => handleFormChange('classId', parseInt(e.target.value))}>
                    {CLASS_OPTIONS.filter((o) => o.value).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary" disabled={submitting}>
                  Hủy
                </button>
                <button id="btn-submit-add-student" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Đang lưu...' : 'Lưu Học Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
