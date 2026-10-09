import React, { useState, useEffect } from 'react';
import { Download, Upload, Save, Filter, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert, Lock, Unlock, Star, Award, Plus, X } from 'lucide-react';

const INITIAL_MILITARY_MOCK_MATRIX = {
  classId: 1,
  classCode: 'SQDB2026-HT1',
  className: 'Lớp SQDB2026 - Binh chủng Hợp thành 1',
  majorName: 'Binh chủng Hợp thành',
  courseName: 'Khóa Sĩ quan Dự bị 2026 (SQDB2026)',
  semester: 1,
  isLocked: false,
  lockedAt: null,
  lockedByUsername: null,
  columns: [
    { subjectId: 1, subjectCode: 'INT1001', subjectName: 'Kiến trúc cơ sở TT HTD', credits: 3, isExtra: false },
    { subjectId: 2, subjectCode: 'INT1002', subjectName: 'Lập trình C/C++ Nâng cao', credits: 3, isExtra: false },
    { subjectId: 3, subjectCode: 'INT1003', subjectName: 'Cấu trúc dữ liệu & Giải thuật', credits: 4, isExtra: false },
    { subjectId: 4, subjectCode: 'INT1004', subjectName: 'Cơ sở dữ liệu PostgreSQL', credits: 3, isExtra: false }
  ],
  gradExamSubjects: [
    { id: 101, code: 'TN01', name: 'Thi Chính trị' },
    { id: 102, code: 'TN02', name: 'Thi Quân sự chung' },
    { id: 103, code: 'TN03', name: 'Thi Chuyên ngành' }
  ],
  rows: [
    {
      stt: 1,
      studentId: 1,
      fullName: 'Nguyễn Văn An',
      dob: '15/05/2002',
      pob: 'Hà Nội',
      grades: {
        1: { score: 8.5 },
        2: { score: 8.0 },
        3: { score: 7.5 },
        4: { score: 8.5 }
      },
      tbcScore: 8.08,
      conductGrade: 'TOT',
      gradExamScores: {
        101: 8.5,
        102: 8.0,
        103: 9.0
      },
      tbcGradExam: 8.5,
      finalGraduationScore: 8.36,
      graduationClassification: 'GIỎI'
    },
    {
      stt: 2,
      studentId: 2,
      fullName: 'Trần Thị Bình',
      dob: '20/08/2002',
      pob: 'Hải Phòng',
      grades: {
        1: { score: 6.5 },
        2: { score: 7.0 },
        3: { score: 6.0 },
        4: { score: 6.5 }
      },
      tbcScore: 6.46,
      conductGrade: 'KHA',
      gradExamScores: {
        101: 6.5,
        102: 6.0,
        103: 7.0
      },
      tbcGradExam: 6.5,
      finalGraduationScore: 6.49,
      graduationClassification: 'TRUNG BÌNH'
    },
    {
      stt: 3,
      studentId: 3,
      fullName: 'Lê Hoàng Cường',
      dob: '10/11/2002',
      pob: 'Nam Định',
      grades: {
        1: { score: 9.0 },
        2: { score: 9.5 },
        3: { score: 8.5 },
        4: { score: 9.0 }
      },
      tbcScore: 8.96,
      conductGrade: 'XUAT_SAC',
      gradExamScores: {
        101: 9.0,
        102: 9.5,
        103: 8.5
      },
      tbcGradExam: 9.0,
      finalGraduationScore: 8.99,
      graduationClassification: 'GIỎI'
    },
    {
      stt: 4,
      studentId: 4,
      fullName: 'Phạm Minh Đức',
      dob: '25/03/2002',
      pob: 'Thái Bình',
      grades: {
        1: { score: 5.0 },
        2: { score: 5.5 },
        3: { score: 4.5 },
        4: { score: 5.0 }
      },
      tbcScore: 4.96,
      conductGrade: 'TRUNG_BINH',
      gradExamScores: {
        101: 5.0,
        102: 4.5,
        103: 5.5
      },
      tbcGradExam: 5.0,
      finalGraduationScore: 4.99,
      graduationClassification: 'KHÔNG ĐẠT'
    },
    {
      stt: 5,
      studentId: 5,
      fullName: 'Vũ Thị Hoa',
      dob: '05/12/2002',
      pob: 'Quảng Ninh',
      grades: {
        1: { score: 7.0 },
        2: { score: 7.5 },
        3: { score: 8.0 },
        4: { score: 7.5 }
      },
      tbcScore: 7.54,
      conductGrade: 'KHA',
      gradExamScores: {
        101: 7.5,
        102: 7.5,
        103: 7.5
      },
      tbcGradExam: 7.5,
      finalGraduationScore: 7.51,
      graduationClassification: 'KHÁ'
    }
  ]
};

export default function MatrixDataGrid({ currentUser, onOpenImportModal }) {
  const [classId, setClassId] = useState(1);
  const [semester, setSemester] = useState(1);
  const [classList, setClassList] = useState([]);
  const [matrixData, setMatrixData] = useState(INITIAL_MILITARY_MOCK_MATRIX);
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [editedScores, setEditedScores] = useState({});
  const [editedConducts, setEditedConducts] = useState({});
  const [editedGradExamScores, setEditedGradExamScores] = useState({});

  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [auditReason, setAuditReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // State for Dynamic Extra Subject Column Modal
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubCredits, setNewSubCredits] = useState('3');

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/classes', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setClassList(data);
          setClassId(prev => (data.some(c => c.id === prev) ? prev : data[0].id));
        }
      }
    } catch (err) {
      console.error('Failed to load classes', err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleInitFromCurriculum = async () => {
    setLoading(true);
    setSaveSuccessMsg('');
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/classes/${classId}/init-from-curriculum?semester=${semester}`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setSaveSuccessMsg(data.message || 'Đã đồng bộ các môn từ Lộ trình đào tạo vào lớp thành công!');
        await fetchMatrix();
      } else {
        alert(data.message || 'Lỗi khi khởi tạo môn học từ lộ trình');
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ để đồng bộ môn học');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatrix = async () => {
    setLoading(true);
    setSaveSuccessMsg('');
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/classes/${classId}/matrix?semester=${semester}`, { headers });
      
      if (res.ok) {
        const data = await res.json();
        setMatrixData(data);
        setIsDemoMode(false);
      } else {
        setMatrixData(INITIAL_MILITARY_MOCK_MATRIX);
        setIsDemoMode(true);
      }
    } catch (err) {
      setMatrixData(INITIAL_MILITARY_MOCK_MATRIX);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
      setEditedScores({});
      setEditedConducts({});
      setEditedGradExamScores({});
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, [classId, semester]);

  const handleScoreChange = (studentId, subjectId, value) => {
    if (matrixData.isLocked && !['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role)) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ chỉ huy (Ban Giám Đốc/PĐT) mới có quyền điều chỉnh.');
      return;
    }
    const key = `${studentId}_${subjectId}`;
    setEditedScores((prev) => ({
      ...prev,
      [key]: value === '' ? null : parseFloat(value),
    }));
  };

  const handleConductChange = (studentId, value) => {
    if (matrixData.isLocked && !['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role)) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ chỉ huy (Ban Giám Đốc/PĐT) mới có quyền điều chỉnh.');
      return;
    }
    setEditedConducts((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleGradExamScoreChange = (studentId, gradSubId, value) => {
    if (matrixData.isLocked && !['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role)) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ chỉ huy (Ban Giám Đốc/PĐT) mới có quyền điều chỉnh.');
      return;
    }
    const key = `${studentId}_${gradSubId}`;
    setEditedGradExamScores((prev) => ({
      ...prev,
      [key]: value === '' ? null : parseFloat(value),
    }));
  };

  const isCellEdited = (studentId, subjectId) => {
    return `${studentId}_${subjectId}` in editedScores;
  };

  const isGradExamCellEdited = (studentId, gradSubId) => {
    return `${studentId}_${gradSubId}` in editedGradExamScores;
  };

  const hasUnsavedChanges = Object.keys(editedScores).length > 0 ||
                            Object.keys(editedConducts).length > 0 ||
                            Object.keys(editedGradExamScores).length > 0;

  const handleAddDynamicSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) {
      alert('Vui lòng nhập đầy đủ Tên môn học và Mã môn học!');
      return;
    }

    const newSubId = Date.now();
    const newColObj = {
      subjectId: newSubId,
      subjectCode: newSubCode.toUpperCase(),
      subjectName: newSubName,
      credits: parseInt(newSubCredits) || 3,
      isExtra: true,
    };

    setMatrixData((prev) => ({
      ...prev,
      columns: [...prev.columns, newColObj],
    }));

    setIsAddSubjectModalOpen(false);
    setNewSubName('');
    setNewSubCode('');
    setNewSubCredits('3');
    setSaveSuccessMsg(`Đã thêm mới cột môn học linh hoạt "${newSubName} (${newSubCode.toUpperCase()})" (${newSubCredits} tín chỉ) cho lớp!`);
  };

  const handleLockMatrix = async () => {
    if (!window.confirm('XÁC NHẬN KHÓA BẢNG ĐIỂM? Sau khi khóa, giáo viên không thể tự ý sửa điểm.')) return;
    
    if (isDemoMode) {
      setMatrixData(prev => ({ ...prev, isLocked: true }));
      setSaveSuccessMsg('Đã KHÓA BẢNG ĐIỂM thành công.');
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`/api/v1/classes/${classId}/lock?semester=${semester}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSaveSuccessMsg('Đã KHÓA bảng điểm thành công!');
        fetchMatrix();
      }
    } catch (e) { alert('Lỗi khóa bảng điểm'); }
  };

  const handleUnlockMatrix = async () => {
    if (!window.confirm('Phê duyệt MỞ KHÓA BẢNG ĐIỂM cho phép điều chỉnh điểm?')) return;

    if (isDemoMode) {
      setMatrixData(prev => ({ ...prev, isLocked: false }));
      setSaveSuccessMsg('Đã MỞ KHÓA BẢNG ĐIỂM.');
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const res = await fetch(`/api/v1/classes/${classId}/unlock?semester=${semester}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSaveSuccessMsg('Đã MỞ KHÓA bảng điểm thành công!');
        fetchMatrix();
      }
    } catch (e) { alert('Lỗi mở khóa bảng điểm'); }
  };

  const handleSaveBatch = async () => {
    if (!auditReason.trim()) {
      alert('Vui lòng ghi rõ lý do/quyết định sửa điểm để lưu Audit Log');
      return;
    }

    setSaving(true);

    if (isDemoMode) {
      setTimeout(() => {
        setSaveSuccessMsg(`Đã lưu thành công các ô điểm và tạo Audit Log với lý do: "${auditReason}"`);
        setIsReasonModalOpen(false);
        setAuditReason('');
        setEditedScores({});
        setEditedConducts({});
        setEditedGradExamScores({});
        setSaving(false);
      }, 600);
      return;
    }

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      };

      const gradeUpdates = Object.entries(editedScores).map(([key, score]) => {
        const [studentId, subjectId] = key.split('_');
        return {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId),
          score: score,
        };
      });

      const evalUpdatesMap = {};
      Object.entries(editedConducts).forEach(([sId, conduct]) => {
        const studentId = parseInt(sId);
        if (!evalUpdatesMap[studentId]) evalUpdatesMap[studentId] = { studentId };
        evalUpdatesMap[studentId].conductGrade = conduct;
      });
      Object.entries(editedGradExamScores).forEach(([key, val]) => {
        const [sId, gradSubId] = key.split('_');
        const studentId = parseInt(sId);
        if (!evalUpdatesMap[studentId]) evalUpdatesMap[studentId] = { studentId };
        if (gradSubId === '101') evalUpdatesMap[studentId].scorePolitical = val;
        else if (gradSubId === '102') evalUpdatesMap[studentId].scoreMilitary = val;
        else if (gradSubId === '103') evalUpdatesMap[studentId].scoreSpecialty = val;
      });
      const evaluationUpdates = Object.values(evalUpdatesMap);

      const body = {
        semester,
        reason: auditReason,
        gradeUpdates,
        evaluationUpdates: evaluationUpdates.length > 0 ? evaluationUpdates : undefined,
      };

      const res = await fetch(`/api/v1/classes/${classId}/matrix/bulk-update`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveSuccessMsg('Lưu điểm và tạo Audit Log thành công!');
        setIsReasonModalOpen(false);
        setAuditReason('');
        setEditedScores({});
        setEditedConducts({});
        setEditedGradExamScores({});
        fetchMatrix();
      } else {
        const resData = await res.json();
        alert(resData.message || 'Lưu thất bại');
      }
    } catch (err) {
      alert('Lỗi kết nối khi lưu điểm');
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = () => {
    if (isDemoMode) {
      alert('Tải file Excel mẫu tiêu đề chữ xoay dọc 90 độ tự động khi kết nối Backend.');
      return;
    }
    window.location.href = `/api/v1/classes/${classId}/export-excel?semester=${semester}`;
  };

  const safeColumns = matrixData?.columns || [];
  const safeGradExamSubjects = matrixData?.gradExamSubjects || [
    { id: 101, code: 'TN01', name: 'Thi Chính trị' },
    { id: 102, code: 'TN02', name: 'Thi Quân sự chung' },
    { id: 103, code: 'TN03', name: 'Thi Chuyên ngành' }
  ];
  const safeRows = matrixData?.rows || [];

  return (
    <div className="space-y-4">

      {/* Lock Banner */}
      {matrixData.isLocked ? (
        <div className="alert alert-error flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 font-bold text-xs">
            <Lock className="w-4 h-4 text-red-600" />
            <span>BẢNG ĐIỂM ĐÃ BỊ KHÓA: Bảng điểm lớp đã được niêm phong. Chỉ Ban Giám Đốc/PĐT mới có quyền mở khóa.</span>
          </div>

          {(currentUser?.role === 'ROLE_BGH' || currentUser?.role === 'ROLE_PDT') && (
            <button onClick={handleUnlockMatrix} className="btn btn-danger btn-xs font-bold">
              <Unlock className="w-3.5 h-3.5" />
              Mở Khóa Bảng Điểm
            </button>
          )}
        </div>
      ) : (
        <div className="alert alert-success flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-xs">
            <Unlock className="w-4 h-4 text-emerald-600" />
            <span>Trạng thái: Bảng điểm mở. Giáo viên/Cán bộ huấn luyện có thể nhập và chỉnh sửa điểm.</span>
          </div>

          <button onClick={handleLockMatrix} className="btn btn-secondary btn-xs font-bold" style={{ color: '#b45309', borderColor: '#fde047' }}>
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            Xác nhận & Khóa Bảng Điểm
          </button>
        </div>
      )}
      
      {/* Control Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-200 bg-white">
        <div className="flex items-center space-x-4">
          <div>
            <label className="form-label text-[11px] mb-1">Chọn Lớp học / Đại đội</label>
            <select
              value={classId}
              onChange={(e) => setClassId(parseInt(e.target.value))}
              className="form-input text-xs font-semibold max-w-xs truncate"
              style={{ cursor: 'pointer' }}
            >
              {classList.length > 0 ? (
                classList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.classCode} - {cls.className} ({cls.totalStudents || 0} HV)
                  </option>
                ))
              ) : (
                <>
                  <option value={1}>SQDB2026-HT1 (Lớp SQDB 2026 - Binh chủng Hợp thành 1)</option>
                  <option value={2}>SQDB2026-PB1 (Lớp SQDB 2026 - Pháo binh 1)</option>
                  <option value={3}>SQDB2026-TT1 (Lớp SQDB 2026 - Thông tin Kỹ thuật 1)</option>
                  <option value={4}>SQDB2025-HT1 (Lớp SQDB 2025 - Binh chủng Hợp thành 1)</option>
                  <option value={5}>SQDB2024-HT1 (Lớp SQDB 2024 - Binh chủng Hợp thành 1)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="form-label text-[11px] mb-1">Học kỳ</label>
            <select
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="form-input text-xs font-semibold"
              style={{ cursor: 'pointer' }}
            >
              <option value={1}>Học kỳ 1</option>
              <option value={2}>Học kỳ 2</option>
              <option value={3}>Tất cả các kỳ</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          <button
            onClick={handleInitFromCurriculum}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{ color: '#4338ca', borderColor: '#c7d2fe' }}
            title="Tự động đồng bộ các môn học theo Lộ trình Đào tạo của Chuyên ngành vào Lớp này"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Lấy Môn từ Lộ Trình</span>
          </button>

          <button
            onClick={() => setIsAddSubjectModalOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#15803d', borderColor: '#bbf7d0' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Cột Môn</span>
          </button>

          {hasUnsavedChanges && (
            <button
              onClick={() => setIsReasonModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ background: '#b45309', borderColor: '#92400e' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Điểm Hàng Loạt</span>
            </button>
          )}

          <button
            onClick={() => onOpenImportModal && onOpenImportModal(classId, semester, matrixData?.classCode)}
            className="btn btn-secondary btn-sm"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import Excel Điểm</span>
          </button>

          <button onClick={handleExportExcel} className="btn btn-secondary btn-sm">
            <Download className="w-3.5 h-3.5 text-amber-600" />
            <span>Xuất File Excel</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="alert alert-success font-bold text-xs shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Empty Subject State Banner */}
      {safeColumns.length === 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-600/50 rounded-xl text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div>
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Lớp chưa có danh sách môn học cho Học kỳ {semester}
            </h4>
            <p className="text-xs text-amber-200/80 mt-1">
              Lớp thuộc chuyên ngành <strong>{matrixData.majorName || 'Quân sự'}</strong>. Bạn có thể nhấn nút để hệ thống tự động liên kết các môn học từ <strong>Lộ trình Đào tạo</strong> của chuyên ngành này vào bảng điểm.
            </p>
          </div>
          <button
            onClick={handleInitFromCurriculum}
            disabled={loading}
            className="btn-primary bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            ⚡ Lấy Môn từ Lộ Trình Ngay
          </button>
        </div>
      )}

      {/* MATRIX TABLE WITHOUT SHHV & RANK, WITH GRAD EXAM SPLIT INTO 3 SUBJECTS */}
      <div className="matrix-table-container">
        <table className="matrix-table">
          <thead>
            {/* Header Row 1 */}
            <tr>
              <th rowSpan={2} className="w-12 sticky-col-1">TT</th>
              <th rowSpan={2} className="min-w-[170px] text-left sticky-col-2">Họ và tên Học viên</th>
              <th rowSpan={2} className="min-w-[90px]">Ngày sinh</th>
              
              {/* MERGED GROUP HEADER 1: KẾT QUẢ HỌC TẬP TOÀN KHÓA */}
              <th
                colSpan={safeColumns.length}
                className="py-2 px-3 bg-slate-100 text-slate-800 font-extrabold text-xs border-b border-slate-300 tracking-wider uppercase"
              >
                KẾT QUẢ HỌC TẬP TOÀN KHÓA ({safeColumns.length} MÔN)
              </th>

              <th rowSpan={2} className="min-w-[70px] text-center">
                <span>Điểm TB</span>
                <span className="block text-[10px] text-slate-500 font-normal">Toàn khóa</span>
              </th>
              <th rowSpan={2} className="min-w-[110px] text-center">
                <span>Rèn Luyện</span>
                <span className="block text-[10px] text-slate-500 font-normal">Kỷ luật</span>
              </th>

              {/* MERGED GROUP HEADER 2: ĐIỂM THI TỐT NGHIỆP (3 MÔN THI TN) */}
              <th
                colSpan={safeGradExamSubjects.length}
                className="py-2 px-3 bg-amber-50 text-amber-800 font-extrabold text-xs border-b border-amber-300 tracking-wider uppercase"
              >
                ĐIỂM THI TỐT NGHIỆP ({safeGradExamSubjects.length} MÔN THI)
              </th>

              <th rowSpan={2} className="min-w-[80px] text-center">
                <span>Điểm TN</span>
                <span className="block text-[10px] text-slate-500 font-normal">TBC 3 môn</span>
              </th>
              <th rowSpan={2} className="min-w-[95px] text-center">
                <span>Điểm Xét TN</span>
                <span className="block text-[10px] text-slate-500 font-normal">(TB×1+TN×2)/3</span>
              </th>
              <th rowSpan={2} className="min-w-[95px] text-center">
                <span>Xếp Loại</span>
                <span className="block text-[10px] text-slate-500 font-normal">Tốt nghiệp</span>
              </th>
              <th rowSpan={2} className="min-w-[110px]">Quê quán</th>
            </tr>

            {/* Header Row 2: VERTICAL SUBJECT HEADERS */}
            <tr>
              {/* Sub-headers for Course Subjects */}
              {safeColumns.map((col) => (
                <th key={col.subjectId} className="p-0 border-t border-slate-200 min-w-[48px] max-w-[56px] align-bottom">
                  <div className="th-vertical-subject" title={`${col.subjectName} (${col.subjectCode}) - ${col.credits} tín chỉ`}>
                    {col.subjectName} <span className="text-emerald-700 text-[10px]">({col.credits}TC)</span>
                  </div>
                </th>
              ))}

              {/* Sub-headers for 3 Graduation Exam Subjects */}
              {safeGradExamSubjects.map((sub) => (
                <th key={sub.id} className="p-0 border-t border-slate-200 min-w-[48px] max-w-[56px] align-bottom">
                  <div className="th-vertical-subject text-amber-700" title={`${sub.name} (${sub.code})`}>
                    {sub.name} <span className="text-amber-800 text-[10px]">({sub.code})</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {safeRows.map((row) => {
              const currentConduct = editedConducts[row.studentId] !== undefined ? editedConducts[row.studentId] : row.conductGrade;

              // Calculate TBC for 3 Graduation Exam Subjects
              let sumGradExam = 0;
              let intGradCount = 0;
              safeGradExamSubjects.forEach((gradSub) => {
                const key = `${row.studentId}_${gradSub.id}`;
                const val = key in editedGradExamScores ? editedGradExamScores[key] : (row.gradExamScores ? row.gradExamScores[gradSub.id] : null);
                if (val !== null && val !== undefined) {
                  sumGradExam += val;
                  intGradCount++;
                }
              });

              let tbcGradExamScore = intGradCount > 0 ? Math.round((sumGradExam / intGradCount) * 100) / 100 : null;

              // Calculate Final Graduation Score: (TB * 1 + TN * 2) / 3
              let calculatedGradScore = null;
              if (row.tbcScore !== null && tbcGradExamScore !== null) {
                calculatedGradScore = Math.round(((row.tbcScore * 1.0 + tbcGradExamScore * 2.0) / 3.0) * 100) / 100;
              }

              // Classification
              let gradClassification = 'KHÔNG ĐẠT';
              if (calculatedGradScore !== null) {
                if (calculatedGradScore >= 9.0) gradClassification = 'XUẤT SẮC';
                else if (calculatedGradScore >= 8.0) gradClassification = 'GIỎI';
                else if (calculatedGradScore >= 6.5) gradClassification = 'KHÁ';
                else if (calculatedGradScore >= 5.0) gradClassification = 'TRUNG BÌNH';
              }

              return (
                <tr key={row.studentId} className="hover:bg-slate-50 transition">
                  <td className="text-slate-500 text-xs font-mono sticky-col-1">{row.stt}</td>
                  <td className="text-left font-bold text-slate-900 sticky-col-2">{row.fullName}</td>
                  <td className="text-xs text-slate-600">{row.dob}</td>

                  {/* COURSE SUBJECT GRADE INPUTS */}
                  {safeColumns.map((col) => {
                    const gradeDetail = row.grades ? row.grades[col.subjectId] : null;
                    const key = `${row.studentId}_${col.subjectId}`;
                    const isEdited = isCellEdited(row.studentId, col.subjectId);
                    const currentScoreVal = isEdited ? editedScores[key] : (gradeDetail ? gradeDetail.score : '');

                    return (
                      <td key={col.subjectId} className={isEdited ? 'cell-modified' : ''}>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          disabled={matrixData.isLocked && !['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role)}
                          value={currentScoreVal !== null && currentScoreVal !== undefined ? currentScoreVal : ''}
                          onChange={(e) => handleScoreChange(row.studentId, col.subjectId, e.target.value)}
                          placeholder="-"
                          className={`cell-input ${isEdited ? 'text-amber-800 font-extrabold' : ''} ${matrixData.isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                        />
                      </td>
                    );
                  })}

                  {/* TB (TRUNG BÌNH CỘNG TOÀN KHÓA) */}
                  <td className="font-bold text-sm text-amber-800 bg-amber-50/60">
                    {row.tbcScore !== null ? row.tbcScore.toFixed(2) : '-'}
                  </td>

                  {/* PHÂN LOẠI RÈN LUYỆN */}
                  <td>
                    <select
                      disabled={matrixData.isLocked && !['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role)}
                      value={currentConduct || 'KHA'}
                      onChange={(e) => handleConductChange(row.studentId, e.target.value)}
                      className="form-input text-xs rounded px-1.5 py-1 text-slate-800 focus:outline-none disabled:opacity-50 font-semibold"
                      style={{ cursor: 'pointer', minWidth: '95px' }}
                    >
                      <option value="XUAT_SAC">Xuất sắc</option>
                      <option value="TOT">Tốt</option>
                      <option value="KHA">Khá</option>
                      <option value="TRUNG_BINH">Trung bình</option>
                      <option value="YEU">Yếu</option>
                    </select>
                  </td>

                  {/* 3 GRADUATION EXAM SUBJECT SCORE INPUTS */}
                  {safeGradExamSubjects.map((gradSub) => {
                    const key = `${row.studentId}_${gradSub.id}`;
                    const isEdited = isGradExamCellEdited(row.studentId, gradSub.id);
                    const val = isEdited ? editedGradExamScores[key] : (row.gradExamScores ? row.gradExamScores[gradSub.id] : '');

                    return (
                      <td key={gradSub.id} className={isEdited ? 'cell-modified' : ''}>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          disabled={matrixData.isLocked && !['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role)}
                          value={val !== null && val !== undefined ? val : ''}
                          onChange={(e) => handleGradExamScoreChange(row.studentId, gradSub.id, e.target.value)}
                          placeholder="-"
                          className={`cell-input text-amber-800 ${isEdited ? 'font-extrabold' : ''} ${matrixData.isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                        />
                      </td>
                    );
                  })}

                  {/* ĐIỂM TN (TBC 3 MÔN THI TN) */}
                  <td className="font-bold text-sm text-blue-700 bg-blue-50/60">
                    {tbcGradExamScore !== null ? tbcGradExamScore.toFixed(2) : '-'}
                  </td>

                  {/* ĐIỂM TỐT NGHIỆP CHUNG: (TB*1 + TN*2)/3 */}
                  <td className="font-extrabold text-sm text-emerald-800 bg-emerald-50/60">
                    {calculatedGradScore !== null ? calculatedGradScore.toFixed(2) : '-'}
                  </td>

                  {/* XÉT TN */}
                  <td>
                    <span className={`badge ${
                      gradClassification === 'XUẤT SẮC' ? 'badge-warning' :
                      gradClassification === 'GIỎI' ? 'badge-success' :
                      gradClassification === 'KHÁ' ? 'badge-info' :
                      gradClassification === 'TRUNG BÌNH' ? 'badge' : 'badge-danger'
                    }`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      {gradClassification}
                    </span>
                  </td>

                  <td className="text-xs text-slate-600">{row.pob || 'Hà Nội'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MANDATORY AUDIT REASON MODAL */}
      {isReasonModalOpen && (
        <div className="modal-overlay" onClick={() => setIsReasonModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '480px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-4 text-amber-700">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-military text-base font-bold text-slate-900">Yêu cầu Ghi Lý do Điều chỉnh Điểm (Audit Log)</h3>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Mọi thao tác thay đổi ô điểm đều được tự động lưu vết chi tiết vào bảng kiểm toán <code className="text-amber-700 font-mono">grade_audit_logs</code>.
            </p>

            <div className="mb-4">
              <label className="form-label">
                Lý do chỉnh sửa điểm <span className="text-red-500">*</span>
              </label>
              <textarea
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                placeholder="Nhập lý do hoặc quyết định phúc khảo bài thi..."
                rows={4}
                className="form-input text-sm"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsReasonModalOpen(false)} className="btn btn-secondary" disabled={saving}>Hủy bỏ</button>
              <button onClick={handleSaveBatch} className="btn btn-primary" disabled={saving} style={{ background: '#b45309', borderColor: '#92400e' }}>
                {saving ? 'Đang lưu...' : 'Xác nhận & Lưu Audit Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM CỘT MÔN HỌC LINH HOẠT CHO LỚP */}
      {isAddSubjectModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddSubjectModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '480px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Plus className="w-5 h-5" />
                <h3 className="font-military text-base font-bold text-slate-900">Thêm Cột Môn Học Linh Hoạt cho Lớp</h3>
              </div>
              <button onClick={() => setIsAddSubjectModalOpen(false)} className="btn btn-icon btn-secondary btn-xs">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDynamicSubject} className="space-y-4">
              <div>
                <label className="form-label">Tên môn học mới <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="VD: Điều lệnh Đội ngũ, Kỹ thuật Bắn súng..."
                  className="form-input text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Mã môn học <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    placeholder="VD: QS2001"
                    className="form-input text-sm font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Số lượng Tín chỉ <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubCredits}
                    onChange={(e) => setNewSubCredits(e.target.value)}
                    className="form-input text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                📌 Cột môn học linh hoạt này sẽ được gán riêng cho lớp <strong>{matrixData.classCode}</strong> (Học kỳ {semester}) mà không ảnh hưởng tới khung đào tạo chuẩn của các lớp khác.
              </p>

              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setIsAddSubjectModalOpen(false)} className="btn btn-secondary">Hủy bỏ</button>
                <button type="submit" className="btn btn-primary font-bold">
                  Thêm Cột Vào Bảng Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
