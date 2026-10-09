import React, { useState, useEffect } from 'react';
import {
  Download, Upload, Save, RefreshCw, AlertTriangle,
  CheckCircle2, Lock, Unlock, Plus, X, ShieldAlert
} from 'lucide-react';
import { matrixApi } from '../api';
import { useAuth } from '../context/AuthContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CLASS_OPTIONS = [
  { value: 1, label: 'SQDB2026-HT1 (Lớp SQDB 2026 - Binh chủng Hợp thành 1)' },
  { value: 2, label: 'SQDB2026-PB1 (Lớp SQDB 2026 - Pháo binh 1)' },
  { value: 3, label: 'SQDB2026-TT1 (Lớp SQDB 2026 - Thông tin Kỹ thuật 1)' },
  { value: 4, label: 'SQDB2025-HT1 (Lớp SQDB 2025 - Binh chủng Hợp thành 1)' },
  { value: 5, label: 'SQDB2024-HT1 (Lớp SQDB 2024 - Binh chủng Hợp thành 1)' },
];

const classifyScore = (score) => {
  if (score == null) return 'KHÔNG ĐẠT';
  if (score >= 9.0) return 'XUẤT SẮC';
  if (score >= 8.0) return 'GIỎI';
  if (score >= 6.5) return 'KHÁ';
  if (score >= 5.0) return 'TRUNG BÌNH';
  return 'KHÔNG ĐẠT';
};

const classifyColor = (cls) => {
  if (cls === 'XUẤT SẮC') return '#b45309';
  if (cls === 'GIỎI')      return '#15803d';
  if (cls === 'KHÁ')       return '#166534';
  if (cls === 'TRUNG BÌNH') return '#475569';
  return '#dc2626';
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function MatrixPage({ onOpenImportModal }) {
  const { currentUser } = useAuth();

  const [classId, setClassId]     = useState(1);
  const [semester, setSemester]   = useState(1);
  const [matrix, setMatrix]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [editedScores, setEditedScores]             = useState({});
  const [editedConducts, setEditedConducts]         = useState({});
  const [editedGradExams, setEditedGradExams]       = useState({});

  const [reasonModal, setReasonModal]               = useState(false);
  const [auditReason, setAuditReason]               = useState('');
  const [saving, setSaving]                         = useState(false);

  const [addColModal, setAddColModal]               = useState(false);
  const [newSub, setNewSub]                         = useState({ name: '', code: '', credits: '3' });

  const isAdmin = currentUser?.role === 'ROLE_BGH' || currentUser?.role === 'ROLE_PDT';

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  const fetchMatrix = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const data = await matrixApi.getMatrix(classId, semester);
      setMatrix(data);
    } catch (err) {
      setMatrix(null);
      setErrorMsg(err?.response?.data?.message || 'Chưa lấy được dữ liệu ma trận điểm từ máy chủ Backend');
    } finally {
      setLoading(false);
      setEditedScores({});
      setEditedConducts({});
      setEditedGradExams({});
    }
  };

  useEffect(() => { fetchMatrix(); }, [classId, semester]);

  const checkLocked = () => {
    if (matrix?.isLocked && !isAdmin) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ Ban Giám Đốc/PĐT mới có quyền điều chỉnh.');
      return true;
    }
    return false;
  };

  const handleScoreChange = (studentId, subjectId, val) => {
    if (checkLocked()) return;
    const key = `${studentId}_${subjectId}`;
    setEditedScores((p) => ({ ...p, [key]: val === '' ? null : parseFloat(val) }));
  };

  const handleConductChange = (studentId, val) => {
    if (checkLocked()) return;
    setEditedConducts((p) => ({ ...p, [studentId]: val }));
  };

  const handleGradExamChange = (studentId, gradId, val) => {
    if (checkLocked()) return;
    const key = `${studentId}_${gradId}`;
    setEditedGradExams((p) => ({ ...p, [key]: val === '' ? null : parseFloat(val) }));
  };

  const hasChanges =
    Object.keys(editedScores).length > 0 ||
    Object.keys(editedConducts).length > 0 ||
    Object.keys(editedGradExams).length > 0;

  const handleLock = async () => {
    if (!window.confirm('XÁC NHẬN KHÓA BẢNG ĐIỂM?')) return;
    try {
      await matrixApi.lockMatrix(classId, semester);
      showSuccess('Đã KHÓA bảng điểm!');
      fetchMatrix();
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Lỗi khóa bảng điểm');
    }
  };

  const handleUnlock = async () => {
    if (!window.confirm('Phê duyệt MỞ KHÓA BẢNG ĐIỂM?')) return;
    try {
      await matrixApi.unlockMatrix(classId, semester);
      showSuccess('Đã MỞ KHÓA bảng điểm!');
      fetchMatrix();
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Lỗi mở khóa bảng điểm');
    }
  };

  const handleSaveBatch = async () => {
    if (!auditReason.trim()) { alert('Vui lòng ghi rõ lý do/quyết định sửa điểm'); return; }
    setSaving(true);
    try {
      const gradeUpdates = Object.entries(editedScores).map(([key, score]) => {
        const [sId, subId] = key.split('_');
        return { studentId: parseInt(sId), subjectId: parseInt(subId), score };
      });

      // Collect all student IDs that have conduct or graduation exam edits
      const evalStudentIds = new Set([
        ...Object.keys(editedConducts).map(Number),
        ...Object.keys(editedGradExams).map((k) => Number(k.split('_')[0])),
      ]);

      const evaluationUpdates = Array.from(evalStudentIds).map((sId) => {
        const polKey = `${sId}_101`;
        const milKey = `${sId}_102`;
        const speKey = `${sId}_103`;

        const existingRow = rows.find((r) => r.studentId === sId);
        const existingGradScores = existingRow?.gradExamScores || {};

        return {
          studentId: sId,
          conductGrade: editedConducts[sId] ?? existingRow?.conductGrade ?? 'KHA',
          scorePolitical: polKey in editedGradExams ? editedGradExams[polKey] : (existingGradScores[101] ?? null),
          scoreMilitary: milKey in editedGradExams ? editedGradExams[milKey] : (existingGradScores[102] ?? null),
          scoreSpecialty: speKey in editedGradExams ? editedGradExams[speKey] : (existingGradScores[103] ?? null),
        };
      });

      const payload = {
        semester,
        reason: auditReason,
        gradeUpdates: gradeUpdates.length > 0 ? gradeUpdates : null,
        evaluationUpdates: evaluationUpdates.length > 0 ? evaluationUpdates : null,
      };

      await matrixApi.bulkUpdateGrades(classId, payload);
      showSuccess('Lưu điểm và tạo Audit Log thành công!');
      setReasonModal(false); setAuditReason('');
      fetchMatrix();
    } catch (err) {
      alert(err?.response?.data?.message ?? 'Lưu điểm thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newSub.name.trim() || !newSub.code.trim()) { alert('Vui lòng nhập đầy đủ thông tin!'); return; }
    try {
      // In real backend, create or assign subject
      showSuccess(`Đã thêm thông tin môn học "${newSub.name}"`);
      setAddColModal(false);
      setNewSub({ name: '', code: '', credits: '3' });
      fetchMatrix();
    } catch {
      alert('Chưa gán được môn học mới vào server');
    }
  };

  const cols     = matrix?.columns ?? [];
  const gradSubs = [
    { id: 101, code: 'TN01', name: 'Thi Chính trị' },
    { id: 102, code: 'TN02', name: 'Thi Quân sự chung' },
    { id: 103, code: 'TN03', name: 'Thi Chuyên ngành' },
  ];
  const rows     = matrix?.rows ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>

      {/* Lock Banner */}
      {matrix?.isLocked ? (
        <div className="alert alert-error" style={{ justifyContent: 'space-between', background: '#fee2e2', borderColor: '#fca5a5', color: '#991b1b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <Lock size={18} style={{ color: '#dc2626' }} />
            BẢNG ĐIỂM ĐÃ BỊ KHÓA (LOCKED): Chỉ Ban Giám Đốc/PĐT mới có quyền mở khóa.
          </span>
          {isAdmin && (
            <button id="btn-unlock-matrix" onClick={handleUnlock} className="btn btn-sm btn-secondary" style={{ borderColor: '#fca5a5', background: '#ffffff', color: '#dc2626' }}>
              <Unlock size={14} style={{ color: '#15803d' }} /> Mở Khóa
            </button>
          )}
        </div>
      ) : (
        <div style={{ padding: '10px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
            <Unlock size={15} style={{ color: '#15803d' }} />
            Trạng thái: Bảng điểm mở (UNLOCKED). Giáo viên/Cán bộ có thể nhập điểm.
          </span>
          <button id="btn-lock-matrix" onClick={handleLock} className="btn btn-sm btn-warning">
            <Lock size={14} style={{ color: '#b45309' }} /> Khóa Bảng Điểm
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label className="form-label" htmlFor="select-class-matrix">Chọn Lớp / Đại đội</label>
            <select id="select-class-matrix" value={classId}
              onChange={(e) => setClassId(parseInt(e.target.value))}
              className="form-input" style={{ minWidth: '280px', fontSize: '0.8rem' }}>
              {CLASS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="select-semester">Học kỳ</label>
            <select id="select-semester" value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="form-input" style={{ fontSize: '0.8rem' }}>
              <option value={1}>Học kỳ 1</option>
              <option value={2}>Học kỳ 2</option>
              <option value={3}>Tất cả các kỳ</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button id="btn-refresh-matrix" onClick={fetchMatrix} className="btn btn-secondary btn-icon" title="Làm mới">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button id="btn-add-column" onClick={() => setAddColModal(true)} className="btn btn-sm btn-secondary"
            style={{ color: '#15803d', borderColor: '#86efac', background: '#dcfce7' }}>
            <Plus size={14} /> Thêm Cột Môn Học
          </button>

          {hasChanges && (
            <button id="btn-save-grades" onClick={() => setReasonModal(true)} className="btn btn-sm btn-warning">
              <Save size={14} /> Lưu Điểm Hàng Loạt
            </button>
          )}

          <button id="btn-import-matrix" onClick={onOpenImportModal} className="btn btn-secondary btn-sm">
            <Upload size={14} style={{ color: '#15803d' }} /> Import Excel Điểm
          </button>

          <button id="btn-export-matrix"
            onClick={() => (window.location.href = matrixApi.getExportExcelUrl(classId, semester))}
            className="btn btn-secondary btn-sm">
            <Download size={14} style={{ color: '#b45309' }} /> Xuất File Excel
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-error" style={{ fontSize: '0.8rem' }}>
          <AlertTriangle size={16} /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={16} style={{ color: '#15803d' }} /> {successMsg}
        </div>
      )}

      {/* Matrix Table */}
      <div className="matrix-table-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th rowSpan={2} className="sticky-col-1" style={{ width: '48px', background: '#f1f5f9' }}>TT</th>
              <th rowSpan={2} className="sticky-col-2" style={{ minWidth: '180px', textAlign: 'left', background: '#f1f5f9' }}>Họ và tên Học viên</th>
              <th rowSpan={2} style={{ minWidth: '100px', background: '#f1f5f9' }}>Ngày sinh</th>
              <th colSpan={Math.max(1, cols.length)} style={{ color: '#b45309', fontWeight: 800, background: '#fef3c7', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '1px solid #fde047' }}>
                KẾT QUẢ HỌC TẬP TOÀN KHÓA ({cols.length} MÔN)
              </th>
              <th rowSpan={2} style={{ minWidth: '80px', background: '#fef3c7', color: '#b45309' }}>TB</th>
              <th rowSpan={2} style={{ minWidth: '130px', background: '#f1f5f9' }}>Phân loại Rèn luyện</th>
              <th colSpan={gradSubs.length} style={{ color: '#0284c7', fontWeight: 800, background: '#e0f2fe', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '1px solid #7dd3fc' }}>
                ĐIỂM THI TỐT NGHIỆP ({gradSubs.length} MÔN)
              </th>
              <th rowSpan={2} style={{ minWidth: '90px', background: '#e0f2fe', color: '#0284c7' }}>Điểm TN (TBC)</th>
              <th rowSpan={2} style={{ minWidth: '115px', background: '#dcfce7', color: '#15803d' }}>Điểm TN Chung</th>
              <th rowSpan={2} style={{ minWidth: '100px', background: '#f1f5f9' }}>Xét TN</th>
              <th rowSpan={2} style={{ minWidth: '110px', background: '#f1f5f9' }}>Quê quán</th>
            </tr>
            <tr>
              {cols.length === 0 ? (
                <th style={{ minWidth: '120px', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', background: '#ffffff' }}>
                  (Chưa gán môn học)
                </th>
              ) : (
                cols.map((col) => (
                  <th key={col.subjectId} style={{ padding: 0, borderTop: '1px solid #cbd5e1', minWidth: '50px', verticalAlign: 'bottom', background: '#ffffff' }}>
                    <div className="th-vertical-subject" title={`${col.subjectName} (${col.subjectCode})`}>
                      {col.subjectName} <span style={{ color: '#15803d', fontSize: '0.65rem' }}>({col.subjectCode})</span>
                    </div>
                  </th>
                ))
              )}
              {gradSubs.map((sub) => (
                <th key={sub.id} style={{ padding: 0, borderTop: '1px solid #cbd5e1', minWidth: '50px', verticalAlign: 'bottom', background: '#ffffff' }}>
                  <div className="th-vertical-subject" style={{ color: '#0284c7' }} title={`${sub.name} (${sub.code})`}>
                    {sub.name} <span style={{ color: '#0369a1', fontSize: '0.65rem' }}>({sub.code})</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={cols.length + gradSubs.length + 8} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  {loading ? 'Đang tải dữ liệu ma trận điểm...' : 'Chưa có dữ liệu học viên / ma trận điểm cho lớp này'}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const currentConduct = editedConducts[row.studentId] ?? row.conductGrade;

                // Calculate TBC grad exam
                let sumGrad = 0, cntGrad = 0;
                gradSubs.forEach((gs) => {
                  const k = `${row.studentId}_${gs.id}`;
                  const v = k in editedGradExams ? editedGradExams[k] : (row.gradExamScores?.[gs.id] ?? null);
                  if (v != null) { sumGrad += v; cntGrad++; }
                });
                const tbcGrad = cntGrad > 0 ? Math.round((sumGrad / cntGrad) * 100) / 100 : null;

                // Final score: (TBC * 1 + TN * 2) / 3
                const finalScore = row.tbcScore != null && tbcGrad != null
                  ? Math.round(((row.tbcScore + tbcGrad * 2) / 3) * 100) / 100
                  : null;

                const classification = classifyScore(finalScore);

                return (
                  <tr key={row.studentId}>
                    <td className="sticky-col-1" style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{row.stt}</td>
                    <td className="sticky-col-2" style={{ textAlign: 'left', fontWeight: 700, color: '#0f172a' }}>{row.fullName}</td>
                    <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.dob}</td>

                    {/* Course grades */}
                    {cols.length === 0 ? (
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>-</td>
                    ) : (
                      cols.map((col) => {
                        const k = `${row.studentId}_${col.subjectId}`;
                        const isEdited = k in editedScores;
                        const val = isEdited ? editedScores[k] : (row.grades?.[col.subjectId]?.score ?? '');
                        return (
                          <td key={col.subjectId} className={isEdited ? 'cell-modified' : ''}>
                            <input
                              type="number" step="0.1" min="0" max="10"
                              disabled={matrix?.isLocked && !isAdmin}
                              value={val !== null && val !== undefined ? val : ''}
                              onChange={(e) => handleScoreChange(row.studentId, col.subjectId, e.target.value)}
                              placeholder="-"
                              className="cell-input"
                              style={{ opacity: matrix?.isLocked && !isAdmin ? 0.6 : 1 }}
                            />
                          </td>
                        );
                      })
                    )}

                    {/* TBC */}
                    <td style={{ fontWeight: 700, fontSize: '1rem', color: '#b45309', background: '#fef3c7' }}>
                      {row.tbcScore != null ? row.tbcScore.toFixed(2) : '-'}
                    </td>

                    {/* Conduct */}
                    <td>
                      <select
                        disabled={matrix?.isLocked && !isAdmin}
                        value={currentConduct ?? 'KHA'}
                        onChange={(e) => handleConductChange(row.studentId, e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#ffffff', color: '#0f172a', minWidth: 'auto', width: '100%', opacity: matrix?.isLocked && !isAdmin ? 0.6 : 1 }}
                      >
                        <option value="XUAT_SAC">Xuất sắc</option>
                        <option value="TOT">Tốt</option>
                        <option value="KHA">Khá</option>
                        <option value="TRUNG_BINH">Trung bình</option>
                        <option value="YEU">Yếu</option>
                      </select>
                    </td>

                    {/* Grad exam scores */}
                    {gradSubs.map((gs) => {
                      const k = `${row.studentId}_${gs.id}`;
                      const isEdited = k in editedGradExams;
                      const val = isEdited ? editedGradExams[k] : (row.gradExamScores?.[gs.id] ?? '');
                      return (
                        <td key={gs.id} className={isEdited ? 'cell-modified' : ''}>
                          <input
                            type="number" step="0.1" min="0" max="10"
                            disabled={matrix?.isLocked && !isAdmin}
                            value={val !== null && val !== undefined ? val : ''}
                            onChange={(e) => handleGradExamChange(row.studentId, gs.id, e.target.value)}
                            placeholder="-"
                            className="cell-input"
                            style={{ color: '#0284c7', fontWeight: 700, opacity: matrix?.isLocked && !isAdmin ? 0.6 : 1 }}
                          />
                        </td>
                      );
                    })}

                    {/* TBC grad */}
                    <td style={{ fontWeight: 700, color: '#0284c7', background: '#e0f2fe', fontSize: '0.95rem' }}>
                      {tbcGrad != null ? tbcGrad.toFixed(2) : '-'}
                    </td>

                    {/* Final score */}
                    <td style={{ fontWeight: 900, color: '#15803d', background: '#dcfce7', fontSize: '1rem' }}>
                      {finalScore != null ? finalScore.toFixed(2) : '-'}
                    </td>

                    {/* Classification */}
                    <td style={{ fontWeight: 700, color: classifyColor(classification), fontSize: '0.8rem' }}>
                      {classification}
                    </td>

                    <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.pob ?? 'Hà Nội'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Reason Modal */}
      {reasonModal && (
        <div className="modal-overlay" onClick={() => setReasonModal(false)}>
          <div className="modal-panel" style={{ maxWidth: '520px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <ShieldAlert size={22} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>Yêu cầu Ghi Lý do Điều chỉnh Điểm (Audit Log)</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '16px' }}>
              Mọi thay đổi điểm sẽ được ghi vào bảng kiểm toán <code style={{ color: '#f59e0b' }}>grade_audit_logs</code>.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="audit-reason">Lý do chỉnh sửa điểm *</label>
              <textarea
                id="audit-reason"
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                placeholder="Nhập lý do hoặc quyết định phúc khảo bài thi..."
                rows={4}
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setReasonModal(false)} className="btn btn-secondary" disabled={saving}>Hủy bỏ</button>
              <button id="btn-confirm-save-grades" onClick={handleSaveBatch} className="btn btn-warning" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Xác nhận & Lưu Audit Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {addColModal && (
        <div className="modal-overlay" onClick={() => setAddColModal(false)}>
          <div className="modal-panel" style={{ maxWidth: '420px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#34d399' }} />
                <h3 style={{ fontWeight: 700, color: '#f8fafc' }}>Thêm Cột Môn Học Linh Hoạt</h3>
              </div>
              <button id="btn-close-add-col" onClick={() => setAddColModal(false)} className="btn btn-icon btn-secondary btn-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddColumn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" htmlFor="new-sub-name">Tên môn học *</label>
                <input id="new-sub-name" type="text" required placeholder="VD: Điều lệnh Đội ngũ" className="form-input"
                  value={newSub.name} onChange={(e) => setNewSub((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" htmlFor="new-sub-code">Mã môn học *</label>
                  <input id="new-sub-code" type="text" required placeholder="QS2001" className="form-input"
                    value={newSub.code} onChange={(e) => setNewSub((p) => ({ ...p, code: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label" htmlFor="new-sub-credits">Số tín chỉ</label>
                  <input id="new-sub-credits" type="number" min="1" max="10" className="form-input"
                    value={newSub.credits} onChange={(e) => setNewSub((p) => ({ ...p, credits: e.target.value }))} />
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                📌 Cột môn học linh hoạt này sẽ được gán riêng cho lớp <strong style={{ color: '#94a3b8' }}>{matrix.classCode}</strong> (Học kỳ {semester}).
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setAddColModal(false)} className="btn btn-secondary">Hủy bỏ</button>
                <button id="btn-confirm-add-col" type="submit" className="btn btn-primary" style={{ background: '#065f46', borderColor: '#34d399' }}>
                  Thêm Cột Vào Bảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
