import React, { useState, useEffect, useMemo } from 'react';
import { Download, Upload, Save, Filter, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert, Lock, Unlock, Star, Award, Plus, X, ChevronDown, FileSpreadsheet, Layers, BookOpen, ArrowLeftRight, Trash2, ClipboardCheck, Edit } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const EMPTY_MATRIX = {
  classId: null,
  classCode: '',
  className: '',
  majorName: '',
  courseName: '',
  semester: 1,
  isLocked: false,
  lockedAt: null,
  lockedByUsername: null,
  columns: [],
  gradExamSubjects: [
    { id: 101, code: 'TN01', name: 'Giáo dục Chính trị' },
    { id: 102, code: 'TN02', name: 'Quân sự chung' },
    { id: 103, code: 'TN03', name: 'Chuyên ngành' }
  ],
  rows: []
};

export default function MatrixDataGrid({ currentUser, onOpenImportModal }) {
  const [classId, setClassId] = useState(1);
  const [semester, setSemester] = useState(1);
  const [classList, setClassList] = useState([]);
  const [matrixData, setMatrixData] = useState(EMPTY_MATRIX);
  const [loading, setLoading] = useState(true);
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
  const [addSubjectTab, setAddSubjectTab] = useState('existing'); // 'existing' | 'new' | 'replace'
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubCredits, setNewSubCredits] = useState('3');
  const [addingSubject, setAddingSubject] = useState(false);

  // State for swapping / replacing subject in class
  const [replaceOldSubjectId, setReplaceOldSubjectId] = useState('');
  const [replaceNewSubjectId, setReplaceNewSubjectId] = useState('');
  const [replacingSubject, setReplacingSubject] = useState(false);

  // State for editing subject
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editSubName, setEditSubName] = useState('');
  const [editSubCode, setEditSubCode] = useState('');
  const [editSubCredits, setEditSubCredits] = useState('3');
  const [editingSubject, setEditingSubject] = useState(false);
  const [deleteSubjectId, setDeleteSubjectId] = useState('');

  // Dialog xác nhận hành động chuẩn quân sự thay thế window.confirm
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    warningNote: '',
    confirmLabel: 'Xác nhận',
    type: 'danger',
    onConfirm: null,
    loading: false
  });

  // State for Export Format Dropdown & Class Selection Modal
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [selectClassesModalOpen, setSelectClassesModalOpen] = useState(false);
  const [selectedExportClassIds, setSelectedExportClassIds] = useState([]);
  const [classFilterTerm, setClassFilterTerm] = useState('');

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
        // Tự động liên kết môn học từ Lộ trình nếu lớp chưa có cột môn nào
        if ((!data.columns || data.columns.length === 0) && classId) {
          try {
            const initRes = await fetch(`/api/v1/classes/${classId}/init-from-curriculum?semester=${semester}`, {
              method: 'POST',
              headers
            });
            if (initRes.ok) {
              const refreshedRes = await fetch(`/api/v1/classes/${classId}/matrix?semester=${semester}`, { headers });
              if (refreshedRes.ok) {
                const refreshedData = await refreshedRes.json();
                setMatrixData(refreshedData);
                setIsDemoMode(false);
                return;
              }
            }
          } catch (initErr) {
            console.error('Auto-init curriculum error:', initErr);
          }
        }

        setMatrixData(data);
        setIsDemoMode(false);
      } else {
        setMatrixData(EMPTY_MATRIX);
        setIsDemoMode(false);
      }
    } catch (err) {
      setMatrixData(EMPTY_MATRIX);
      setIsDemoMode(false);
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

  const userRole = currentUser?.role || matrixData?.userRole || '';
  const isPrivilegedUser = ['ROLE_BGH', 'ROLE_PDT'].includes(userRole);
  const isTruongKhoa = ['ROLE_TRUONGKHOA', 'ROLE_BOMON'].includes(userRole);
  const isDonVi = userRole === 'ROLE_DONVI';
  const isGiangVien = userRole === 'ROLE_GIANGVIEN';
  const canManageSubjects = isPrivilegedUser || isTruongKhoa;

  // Navigation between grid cells using Arrow keys & Enter (giống Excel)
  const handleGridKeyDown = (e, rowIdx, colIdx, isGradExam = false) => {
    let targetRow = rowIdx;
    let targetCol = colIdx;
    const prefix = isGradExam ? 'grad-score-input' : 'score-input';

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      targetRow = rowIdx + 1;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetRow = rowIdx - 1;
    } else if (e.key === 'ArrowRight' && (e.target.selectionEnd === e.target.value.length || e.target.selectionStart === 0)) {
      targetCol = colIdx + 1;
    } else if (e.key === 'ArrowLeft' && e.target.selectionStart === 0) {
      targetCol = colIdx - 1;
    } else {
      return;
    }

    const nextElem = document.getElementById(`${prefix}-${targetRow}-${targetCol}`);
    if (nextElem && !nextElem.disabled) {
      nextElem.focus();
      nextElem.select();
    } else if (nextElem && nextElem.disabled && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      // Nhảy tiếp qua học viên bị khóa điểm
      let r = targetRow + 1;
      const totalRows = matrixData?.rows?.length || 0;
      while (r < totalRows) {
        const candidate = document.getElementById(`${prefix}-${r}-${targetCol}`);
        if (candidate && !candidate.disabled) {
          candidate.focus();
          candidate.select();
          break;
        }
        r++;
      }
    }
  };

  const handleScoreChange = (studentId, subjectId, value) => {
    if (matrixData.isLocked && !isPrivilegedUser) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ chỉ huy (Ban Giám Đốc/PĐT) mới có quyền điều chỉnh.');
      return;
    }

    // Yêu cầu: Giáo viên chỉ được nhập 1 lần, chỉ có admin với PĐT mới có quyền sửa
    if (!isPrivilegedUser) {
      const studentRow = matrixData?.rows?.find((r) => r.studentId === studentId);
      const existingGrade = studentRow?.grades?.[subjectId];
      if (existingGrade && existingGrade.score !== null && existingGrade.score !== undefined) {
        alert('Giáo viên chỉ được nhập điểm 1 lần. Điểm đã lưu trong hệ thống chỉ có Ban Đào Tạo (PĐT) hoặc Quản trị viên (ADMIN) mới có quyền chỉnh sửa!');
        return;
      }
    }

    const key = `${studentId}_${subjectId}`;
    if (value === '' || value === null || value === undefined) {
      setEditedScores((prev) => ({
        ...prev,
        [key]: null,
      }));
      return;
    }

    const sanitized = typeof value === 'string' ? value.replace(/,/g, '.') : value.toString();
    setEditedScores((prev) => ({
      ...prev,
      [key]: sanitized,
    }));
  };

  // Helper nhập điểm môn học phần: Quy định dấu '.' thay vì ',', hỗ trợ tự động đổi ',' sang '.'
  const handleScoreInputChange = (studentId, subjectId, rawVal) => {
    let val = (rawVal || '').replace(/,/g, '.');
    // Chỉ cho phép số và tối đa 1 dấu chấm (ví dụ: "9", "9.", "9.5", "10")
    if (!/^\d*\.?\d*$/.test(val)) return;

    if (val !== '' && val !== '.') {
      const num = parseFloat(val);
      if (num > 10) {
        alert('Điểm số chỉ được phép nhập trong phạm vi từ 0 đến 10!');
        return;
      }
    }

    handleScoreChange(studentId, subjectId, val);
  };

  const handleScoreBlur = (studentId, subjectId, rawVal) => {
    let val = (rawVal || '').toString().replace(/,/g, '.');
    if (val.endsWith('.')) {
      val = val.slice(0, -1);
      handleScoreChange(studentId, subjectId, val);
    }
  };

  const handleConductChange = (studentId, value) => {
    if (!isPrivilegedUser) {
      alert('Giáo viên không có quyền chỉnh sửa xếp loại rèn luyện.');
      return;
    }
    if (matrixData.isLocked && !isPrivilegedUser) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ chỉ huy (Ban Giám Đốc/PĐT) mới có quyền điều chỉnh.');
      return;
    }
    setEditedConducts((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleGradExamScoreChange = (studentId, gradSubId, value) => {
    if (!isPrivilegedUser) {
      alert('Giáo viên không có quyền chỉnh sửa điểm thi tốt nghiệp.');
      return;
    }
    if (matrixData.isLocked && !isPrivilegedUser) {
      alert('BẢNG ĐIỂM ĐÃ BỊ KHÓA: Chỉ chỉ huy (Ban Giám Đốc/PĐT) mới có quyền điều chỉnh.');
      return;
    }
    const key = `${studentId}_${gradSubId}`;
    if (value === '' || value === null || value === undefined) {
      setEditedGradExamScores((prev) => ({
        ...prev,
        [key]: null,
      }));
      return;
    }

    const sanitized = typeof value === 'string' ? value.replace(/,/g, '.') : value.toString();
    setEditedGradExamScores((prev) => ({
      ...prev,
      [key]: sanitized,
    }));
  };

  const handleGradExamScoreInputChange = (studentId, gradSubId, rawVal) => {
    let val = (rawVal || '').replace(/,/g, '.');
    if (!/^\d*\.?\d*$/.test(val)) return;
    if (val !== '' && val !== '.') {
      const num = parseFloat(val);
      if (num > 10) {
        alert('Điểm thi tốt nghiệp chỉ được phép nhập trong phạm vi từ 0 đến 10!');
        return;
      }
    }
    handleGradExamScoreChange(studentId, gradSubId, val);
  };

  const handleGradExamScoreBlur = (studentId, gradSubId, rawVal) => {
    let val = (rawVal || '').toString().replace(/,/g, '.');
    if (val.endsWith('.')) {
      val = val.slice(0, -1);
      handleGradExamScoreChange(studentId, gradSubId, val);
    }
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

  const totalChangesCount = Object.keys(editedScores).length +
                            Object.keys(editedConducts).length +
                            Object.keys(editedGradExamScores).length;

  // Phát hiện các ô đang sửa có phải là "SỬA ĐIỂM CŨ ĐÃ CÓ" không
  const oldScoreChanges = useMemo(() => {
    const list = [];
    if (!matrixData?.rows) return list;

    // 1. Kiểm tra điểm môn học phần
    Object.entries(editedScores).forEach(([key, newScore]) => {
      const [sId, subId] = key.split('_');
      const studentId = parseInt(sId);
      const subjectId = parseInt(subId);
      const studentRow = matrixData.rows.find((r) => r.studentId === studentId);
      const gradeDetail = studentRow?.grades ? studentRow.grades[subjectId] : null;
      const oldScore = gradeDetail?.score;

      if (oldScore !== null && oldScore !== undefined && oldScore !== '') {
        const parsedNew = (newScore !== '' && newScore !== null && newScore !== undefined) ? parseFloat(newScore) : null;
        const parsedOld = parseFloat(oldScore);
        if (parsedNew !== parsedOld) {
          const colInfo = (matrixData.columns || []).find(c => c.subjectId === subjectId);
          list.push({
            type: 'Môn học',
            studentName: studentRow?.fullName || `Học viên #${studentId}`,
            subjectName: colInfo?.subjectName || `Môn #${subjectId}`,
            oldVal: parsedOld,
            newVal: parsedNew !== null ? parsedNew : 'Xóa điểm'
          });
        }
      }
    });

    // 2. Kiểm tra điểm rèn luyện
    Object.entries(editedConducts).forEach(([sId, newConduct]) => {
      const studentId = parseInt(sId);
      const studentRow = matrixData.rows.find((r) => r.studentId === studentId);
      const oldConduct = studentRow?.conductGrade;
      if (oldConduct && oldConduct !== newConduct) {
        list.push({
          type: 'Rèn luyện',
          studentName: studentRow?.fullName || `Học viên #${studentId}`,
          subjectName: 'Rèn luyện',
          oldVal: oldConduct,
          newVal: newConduct
        });
      }
    });

    // 3. Kiểm tra điểm thi tốt nghiệp
    Object.entries(editedGradExamScores).forEach(([key, newScore]) => {
      const [sId, gradSubId] = key.split('_');
      const studentId = parseInt(sId);
      const studentRow = matrixData.rows.find((r) => r.studentId === studentId);
      const oldGradScore = studentRow?.gradExamScores ? studentRow.gradExamScores[parseInt(gradSubId)] : null;
      if (oldGradScore !== null && oldGradScore !== undefined && oldGradScore !== '') {
        const parsedNew = (newScore !== '' && newScore !== null && newScore !== undefined) ? parseFloat(newScore) : null;
        const parsedOld = parseFloat(oldGradScore);
        if (parsedNew !== parsedOld) {
          const gradSubName = gradSubId === '101' ? 'Thi Chính trị' : gradSubId === '102' ? 'Thi Quân sự chung' : 'Thi Chuyên ngành';
          list.push({
            type: 'Tốt nghiệp',
            studentName: studentRow?.fullName || `Học viên #${studentId}`,
            subjectName: gradSubName,
            oldVal: parsedOld,
            newVal: parsedNew !== null ? parsedNew : 'Xóa điểm'
          });
        }
      }
    });

    return list;
  }, [editedScores, editedConducts, editedGradExamScores, matrixData]);

  const hasOldScoreModification = oldScoreChanges.length > 0;

  const fetchAvailableSubjects = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/classes/available-subjects', { headers });
      if (res.ok) {
        const data = await res.json();
        setAvailableSubjects(data || []);
        if (data && data.length > 0) {
          if (!selectedSubjectId) setSelectedSubjectId(data[0].id);
          if (!replaceNewSubjectId) setReplaceNewSubjectId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh mục môn học:', err);
    }
  };

  const handleAddExistingSubject = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      alert('Vui lòng chọn một môn học từ danh mục!');
      return;
    }
    setAddingSubject(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/classes/${classId}/add-subject?subjectId=${selectedSubjectId}&semester=${semester}&isExtra=true`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddSubjectModalOpen(false);
        setSaveSuccessMsg(data.message || 'Đã thêm cột môn học vào bảng điểm của lớp thành công!');
        await fetchMatrix();
      } else {
        alert(data.message || 'Không thể thêm môn học vào lớp');
      }
    } catch (err) {
      alert('Lỗi kết nối khi thêm môn học');
    } finally {
      setAddingSubject(false);
    }
  };

  const handleAddNewSubject = async (e) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) {
      alert('Vui lòng nhập đầy đủ Tên môn học và Mã môn học!');
      return;
    }
    setAddingSubject(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const params = new URLSearchParams({
        subjectCode: newSubCode.trim().toUpperCase(),
        subjectName: newSubName.trim(),
        credits: newSubCredits || '3',
        semester: semester || 1,
      });
      const res = await fetch(`/api/v1/classes/${classId}/create-and-add-subject?${params.toString()}`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddSubjectModalOpen(false);
        setNewSubName('');
        setNewSubCode('');
        setNewSubCredits('3');
        setSaveSuccessMsg(data.message || 'Đã tạo và thêm cột môn học mới thành công!');
        await fetchMatrix();
      } else {
        alert(data.message || 'Không thể tạo môn học mới');
      }
    } catch (err) {
      alert('Lỗi kết nối khi tạo môn học');
    } finally {
      setAddingSubject(false);
    }
  };

  const handleReplaceSubject = async (e) => {
    e.preventDefault();
    if (!replaceOldSubjectId || !replaceNewSubjectId) {
      alert('Vui lòng chọn cả môn hiện tại cần đổi và môn mới thay thế!');
      return;
    }
    if (String(replaceOldSubjectId) === String(replaceNewSubjectId)) {
      alert('Môn mới thay thế phải khác môn hiện tại!');
      return;
    }

    setReplacingSubject(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/classes/${classId}/replace-subject?semester=${semester}&oldSubjectId=${replaceOldSubjectId}&newSubjectId=${replaceNewSubjectId}`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddSubjectModalOpen(false);
        setReplaceOldSubjectId('');
        setReplaceNewSubjectId('');
        setSaveSuccessMsg(data.message || 'Đã đổi môn học thành công cho riêng lớp này mà không ảnh hưởng chương trình đào tạo chung!');
        await fetchMatrix();
      } else {
        alert(data.message || 'Không thể đổi môn học cho lớp này');
      }
    } catch (err) {
      alert('Lỗi kết nối khi đổi môn học');
    } finally {
      setReplacingSubject(false);
    }
  };

  const handleOpenEditSubject = (col) => {
    fetchAvailableSubjects();
    setEditSubjectId(col.subjectId);
    setEditSubName(col.subjectName || '');
    setEditSubCode(col.subjectCode || '');
    setEditSubCredits(col.credits != null ? String(col.credits) : '3');
    setAddSubjectTab('edit');
    setIsAddSubjectModalOpen(true);
  };

  const handleSaveEditSubject = async (e) => {
    e.preventDefault();
    if (!editSubjectId) {
      alert('Vui lòng chọn môn học cần chỉnh sửa!');
      return;
    }
    if (!editSubName.trim() || !editSubCode.trim()) {
      alert('Vui lòng nhập đầy đủ Tên môn học và Mã môn học!');
      return;
    }
    setEditingSubject(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const params = new URLSearchParams({
        subjectCode: editSubCode.trim().toUpperCase(),
        subjectName: editSubName.trim(),
        credits: editSubCredits || '3',
      });
      const res = await fetch(`/api/v1/classes/subjects/${editSubjectId}?${params.toString()}`, {
        method: 'PUT',
        headers,
      });
      const data = await res.json();
      if (res.ok) {
        setIsAddSubjectModalOpen(false);
        setSaveSuccessMsg(data.message || 'Đã cập nhật thông tin môn học thành công!');
        await fetchMatrix();
      } else {
        alert(data.message || 'Không thể cập nhật môn học');
      }
    } catch (err) {
      alert('Lỗi kết nối khi cập nhật môn học');
    } finally {
      setEditingSubject(false);
    }
  };

  const handleRemoveSubjectFromClass = (subjectId, subjectName) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận gỡ cột môn khỏi lớp',
      message: 'Đồng chí có chắc chắn muốn xóa cột môn học này khỏi bảng điểm của lớp?',
      itemName: subjectName,
      warningNote: 'Thao tác này chỉ áp dụng riêng cho lớp này, hoàn toàn không ảnh hưởng đến chương trình đào tạo chung.',
      confirmLabel: 'Xóa cột môn',
      type: 'danger',
      onConfirm: async () => {
        try {
          setConfirmDialog(prev => ({ ...prev, loading: true }));
          const token = localStorage.getItem('jwt_token');
          const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
          const res = await fetch(`/api/v1/classes/${classId}/remove-subject/${subjectId}?semester=${semester}`, {
            method: 'DELETE',
            headers,
          });
          const data = await res.json();
          if (res.ok) {
            setSaveSuccessMsg(data.message || 'Đã xóa cột môn khỏi lớp thành công!');
            await fetchMatrix();
          } else {
            alert(data.message || 'Không thể xóa môn khỏi lớp');
          }
        } catch (err) {
          alert('Lỗi kết nối khi xóa môn khỏi lớp');
        } finally {
          setConfirmDialog({ isOpen: false, title: '', message: '', itemName: '', warningNote: '', confirmLabel: '', type: 'danger', onConfirm: null, loading: false });
        }
      }
    });
  };

  const handleLockMatrix = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xác nhận Khóa Bảng Điểm',
      message: 'Đồng chí có chắc chắn muốn tiến hành Khóa Bảng Điểm lớp này?',
      itemName: `${matrixData?.className || 'Lớp hiện tại'}`,
      warningNote: 'Sau khi khóa, giáo viên bộ môn sẽ không thể tự ý sửa điểm, trừ khi có phê duyệt mở khóa từ Ban Giám hiệu hoặc PĐT.',
      confirmLabel: 'Khóa Bảng Điểm',
      type: 'warning',
      onConfirm: async () => {
        if (isDemoMode) {
          setMatrixData(prev => ({ ...prev, isLocked: true }));
          setSaveSuccessMsg('Đã KHÓA BẢNG ĐIỂM thành công.');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          return;
        }

        try {
          setConfirmDialog(prev => ({ ...prev, loading: true }));
          const token = localStorage.getItem('jwt_token');
          const res = await fetch(`/api/v1/classes/${classId}/lock?semester=${semester}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setSaveSuccessMsg('Đã KHÓA bảng điểm thành công!');
            fetchMatrix();
          }
        } catch (e) {
          alert('Lỗi khóa bảng điểm');
        } finally {
          setConfirmDialog({ isOpen: false, title: '', message: '', itemName: '', warningNote: '', confirmLabel: '', type: 'danger', onConfirm: null, loading: false });
        }
      }
    });
  };

  const handleUnlockMatrix = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Phê duyệt Mở Khóa Bảng Điểm',
      message: 'Đồng chí có chắc chắn phê duyệt Mở Khóa Bảng Điểm cho lớp học này?',
      itemName: `${matrixData?.className || 'Lớp hiện tại'}`,
      warningNote: 'Bảng điểm sẽ được mở khóa cho phép giáo viên bộ môn và người phụ trách điều chỉnh điểm số.',
      confirmLabel: 'Mở Khóa Bảng Điểm',
      type: 'info',
      onConfirm: async () => {
        if (isDemoMode) {
          setMatrixData(prev => ({ ...prev, isLocked: false }));
          setSaveSuccessMsg('Đã MỞ KHÓA BẢNG ĐIỂM.');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          return;
        }

        try {
          setConfirmDialog(prev => ({ ...prev, loading: true }));
          const token = localStorage.getItem('jwt_token');
          const res = await fetch(`/api/v1/classes/${classId}/unlock?semester=${semester}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setSaveSuccessMsg('Đã MỞ KHÓA bảng điểm thành công!');
            fetchMatrix();
          }
        } catch (e) {
          alert('Lỗi mở khóa bảng điểm');
        } finally {
          setConfirmDialog({ isOpen: false, title: '', message: '', itemName: '', warningNote: '', confirmLabel: '', type: 'danger', onConfirm: null, loading: false });
        }
      }
    });
  };

  // Hàm điều phối lưu điểm thông minh & chống lỗ hổng bypass
  const handleTriggerSave = () => {
    if (!hasUnsavedChanges) return;

    // Kiểm tra phạm vi điểm từ 0 đến 10 trước khi lưu
    for (const [key, score] of Object.entries(editedScores)) {
      if (score !== '' && score !== null && score !== undefined) {
        const num = parseFloat(score);
        if (isNaN(num) || num < 0 || num > 10) {
          alert(`Điểm môn học không hợp lệ (${score}). Điểm số bắt buộc phải nằm trong phạm vi từ 0 đến 10!`);
          return;
        }
      }
    }
    for (const [key, score] of Object.entries(editedGradExamScores)) {
      if (score !== '' && score !== null && score !== undefined) {
        const num = parseFloat(score);
        if (isNaN(num) || num < 0 || num > 10) {
          alert(`Điểm thi tốt nghiệp không hợp lệ (${score}). Điểm số bắt buộc phải nằm trong phạm vi từ 0 đến 10!`);
          return;
        }
      }
    }

    // Nếu phát hiện có chỉnh sửa điểm cũ: BẮT BUỘC 100% mở modal nhập lý do
    if (hasOldScoreModification) {
      setAuditReason('');
      setIsReasonModalOpen(true);
    } else {
      // Chỉ nhập mới hoàn toàn: lưu trực tiếp
      handleSaveDirect();
    }
  };

  // Quick direct save (chỉ dành cho nhập điểm mới lần đầu)
  const handleSaveDirect = async () => {
    if (!hasUnsavedChanges) return;

    // Chặn triệt để lỗ hổng: Nếu có sửa điểm cũ, không bao giờ được lưu trực tiếp
    if (hasOldScoreModification) {
      setAuditReason('');
      setIsReasonModalOpen(true);
      return;
    }

    // Kiểm tra phạm vi điểm từ 0 đến 10 trước khi lưu
    for (const [key, score] of Object.entries(editedScores)) {
      if (score !== '' && score !== null && score !== undefined) {
        const num = parseFloat(score);
        if (isNaN(num) || num < 0 || num > 10) {
          alert(`Điểm môn học không hợp lệ (${score}). Điểm số bắt buộc phải nằm trong phạm vi từ 0 đến 10!`);
          return;
        }
      }
    }
    for (const [key, score] of Object.entries(editedGradExamScores)) {
      if (score !== '' && score !== null && score !== undefined) {
        const num = parseFloat(score);
        if (isNaN(num) || num < 0 || num > 10) {
          alert(`Điểm thi tốt nghiệp không hợp lệ (${score}). Điểm số bắt buộc phải nằm trong phạm vi từ 0 đến 10!`);
          return;
        }
      }
    }

    setSaving(true);
    setSaveSuccessMsg('');

    const defaultReason = `Cập nhật điểm định kỳ - Lớp ${matrixData?.classCode || classId}`;

    if (isDemoMode) {
      setTimeout(() => {
        setSaveSuccessMsg(`Đã lưu thành công ${totalChangesCount} mục điểm vào hệ thống!`);
        setEditedScores({});
        setEditedConducts({});
        setEditedGradExamScores({});
        setSaving(false);
      }, 500);
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
        let parsedScore = null;
        if (score !== '' && score !== null && score !== undefined) {
          parsedScore = parseFloat(score);
          if (isNaN(parsedScore)) parsedScore = null;
        }
        return {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId),
          score: parsedScore,
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
        let parsedVal = null;
        if (val !== '' && val !== null && val !== undefined) {
          parsedVal = parseFloat(val);
          if (isNaN(parsedVal)) parsedVal = null;
        }
        if (gradSubId === '101') evalUpdatesMap[studentId].scorePolitical = parsedVal;
        else if (gradSubId === '102') evalUpdatesMap[studentId].scoreMilitary = parsedVal;
        else if (gradSubId === '103') evalUpdatesMap[studentId].scoreSpecialty = parsedVal;
      });
      const evaluationUpdates = Object.values(evalUpdatesMap);

      const body = {
        semester,
        reason: defaultReason,
        gradeUpdates,
        evaluationUpdates: evaluationUpdates.length > 0 ? evaluationUpdates : undefined,
      };

      const res = await fetch(`/api/v1/classes/${classId}/matrix/bulk-update`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaveSuccessMsg(`Đã lưu thành công ${totalChangesCount} mục điểm vừa nhập vào cơ sở dữ liệu!`);
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

  const handleSaveBatch = async () => {
    if (!auditReason.trim()) {
      alert('Vui lòng ghi rõ lý do/quyết định sửa điểm để lưu Audit Log');
      return;
    }

    // Kiểm tra phạm vi điểm từ 0 đến 10 trước khi lưu
    for (const [key, score] of Object.entries(editedScores)) {
      if (score !== '' && score !== null && score !== undefined) {
        const num = parseFloat(score);
        if (isNaN(num) || num < 0 || num > 10) {
          alert(`Điểm môn học không hợp lệ (${score}). Điểm số bắt buộc phải nằm trong phạm vi từ 0 đến 10!`);
          return;
        }
      }
    }
    for (const [key, score] of Object.entries(editedGradExamScores)) {
      if (score !== '' && score !== null && score !== undefined) {
        const num = parseFloat(score);
        if (isNaN(num) || num < 0 || num > 10) {
          alert(`Điểm thi tốt nghiệp không hợp lệ (${score}). Điểm số bắt buộc phải nằm trong phạm vi từ 0 đến 10!`);
          return;
        }
      }
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
        let parsedScore = null;
        if (score !== '' && score !== null && score !== undefined) {
          parsedScore = parseFloat(score);
          if (isNaN(parsedScore)) parsedScore = null;
        }
        return {
          studentId: parseInt(studentId),
          subjectId: parseInt(subjectId),
          score: parsedScore,
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
        let parsedVal = null;
        if (val !== '' && val !== null && val !== undefined) {
          parsedVal = parseFloat(val);
          if (isNaN(parsedVal)) parsedVal = null;
        }
        if (gradSubId === '101') evalUpdatesMap[studentId].scorePolitical = parsedVal;
        else if (gradSubId === '102') evalUpdatesMap[studentId].scoreMilitary = parsedVal;
        else if (gradSubId === '103') evalUpdatesMap[studentId].scoreSpecialty = parsedVal;
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
        setSaveSuccessMsg('Lưu điểm và ghi nhận Audit Log thành công!');
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

  const handleExportHocPhan = () => {
    if (isDemoMode) {
      alert('Tải file Kết quả Học phần mẫu (KetQuaHocPhan.xlsx) tự động khi kết nối Backend.');
      return;
    }
    window.location.href = `/api/v1/classes/${classId}/export-hoc-phan?semester=${semester}`;
  };

  const handleExportTotNghiep = () => {
    if (isDemoMode) {
      alert('Tải file Kết quả Tốt nghiệp mẫu (KetQuaTotNghiep.xls/.xlsx) tự động khi kết nối Backend.');
      return;
    }
    window.location.href = `/api/v1/classes/${classId}/export-tot-nghiep?semester=${semester}`;
  };

  const handleExportAllClassesHocPhan = () => {
    if (isDemoMode) {
      alert('Chức năng xuất toàn bộ lớp khả dụng khi kết nối Backend.');
      return;
    }
    window.location.href = `/api/v1/classes/export-all-classes-hoc-phan?semester=${semester}`;
  };

  const handleExportAllClassesTotNghiep = () => {
    if (isDemoMode) {
      alert('Chức năng xuất toàn bộ lớp khả dụng khi kết nối Backend.');
      return;
    }
    window.location.href = `/api/v1/classes/export-all-classes-tot-nghiep?semester=${semester}`;
  };

  const handleExportTongHopXetDieuKien = () => {
    if (isDemoMode) {
      alert('Tải Báo cáo Tổng hợp Xét ĐK Dự thi Tốt nghiệp tự động khi kết nối Backend.');
      return;
    }
    window.location.href = `/api/v1/classes/export-tong-hop-xet-dieu-kien?semester=${semester}`;
  };

  const handleOpenSelectClassesModal = () => {
    setExportDropdownOpen(false);
    setSelectedExportClassIds(classList.map(c => c.id));
    setClassFilterTerm('');
    setSelectClassesModalOpen(true);
  };

  const handleToggleClassSelection = (id) => {
    setSelectedExportClassIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAllClasses = () => {
    setSelectedExportClassIds(classList.map(c => c.id));
  };

  const handleDeselectAllClasses = () => {
    setSelectedExportClassIds([]);
  };

  const handleExportCustomClassesTongHop = () => {
    if (selectedExportClassIds.length === 0) {
      alert('Vui lòng chọn ít nhất một lớp học để xuất báo cáo.');
      return;
    }
    setSelectClassesModalOpen(false);
    window.location.href = `/api/v1/classes/export-tong-hop-xet-dieu-kien?semester=${semester}&classIds=${selectedExportClassIds.join(',')}`;
  };

  const filteredExportClasses = useMemo(() => {
    if (!classFilterTerm.trim()) return classList;
    const term = classFilterTerm.toLowerCase();
    return classList.filter(c =>
      (c.code && c.code.toLowerCase().includes(term)) ||
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.majorName && c.majorName.toLowerCase().includes(term))
    );
  }, [classList, classFilterTerm]);

  const handleExportExcel = () => {
    handleExportHocPhan();
  };

  const rawColumns = matrixData?.columns || [];
  const safeColumns = useMemo(() => {
    if (isPrivilegedUser) return rawColumns;
    if (currentUser?.departmentId) {
      return rawColumns.filter((c) => c.departmentId === currentUser.departmentId);
    }
    return rawColumns;
  }, [rawColumns, isPrivilegedUser, currentUser?.departmentId]);

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

          {isPrivilegedUser && (
            <button onClick={handleLockMatrix} className="btn btn-secondary btn-xs font-bold" style={{ color: '#b45309', borderColor: '#fde047' }}>
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Xác nhận & Khóa Bảng Điểm
            </button>
          )}
        </div>
      )}

      {/* Thông báo phân quyền giáo viên theo Khoa/Bộ môn */}
      {!isPrivilegedUser && (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-blue-900 shadow-xs">
          <div className="flex items-center gap-2.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
            <span>
              Phân quyền Giáo viên/Bộ môn: Đang hiển thị các môn thuộc <strong>{matrixData?.departmentFilterName || currentUser?.departmentName || 'Khoa/Bộ môn phụ trách'}</strong>. Các môn khác và cột điểm tổng kết, rèn luyện, tốt nghiệp được ẩn theo quy định.
            </span>
          </div>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 shrink-0">
            {safeColumns.length} môn phụ trách
          </span>
        </div>
      )}
      
      {/* Control Bar - Cân đối, chuyên nghiệp chuẩn Quân sự */}
      <div className="glass-panel p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* KHỐI 1: BỘ LỌC CHỌN LỚP ĐÀO TẠO */}
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Lớp:
            </span>
            <span className="text-[11px] text-emerald-800 font-bold font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
              {classList.length}
            </span>
          </div>
          <select
            value={classId}
            onChange={(e) => setClassId(parseInt(e.target.value))}
            className="form-input text-xs font-bold text-slate-900 flex-1 max-w-md h-9 py-1 px-3 shadow-xs border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-lg cursor-pointer"
          >
            {classList.length > 0 ? (
              classList.map((cls) => {
                const displayCode = cls.code || cls.classCode || `Lớp #${cls.id}`;
                const displayName = cls.name || cls.className || '';
                const studentCount = cls.totalStudents !== undefined && cls.totalStudents !== null ? cls.totalStudents : (cls.students ? cls.students.length : 0);
                return (
                  <option key={cls.id} value={cls.id}>
                    {displayCode}{displayName ? ` — ${displayName}` : ''} ({studentCount} Học viên)
                  </option>
                );
              })
            ) : (
              <>
                <option value={1}>SQDB2026-HT1 — Lớp SQDB 2026 Binh chủng Hợp thành 1</option>
                <option value={2}>SQDB2026-PB1 — Lớp SQDB 2026 Pháo binh 1</option>
                <option value={3}>SQDB2026-TT1 — Lớp SQDB 2026 Thông tin Kỹ thuật 1</option>
                <option value={4}>SQDB2025-HT1 — Lớp SQDB 2025 Binh chủng Hợp thành 1</option>
                <option value={5}>SQDB2024-HT1 — Lớp SQDB 2024 Binh chủng Hợp thành 1</option>
              </>
            )}
          </select>

          {/* Badge trạng thái niêm phong / mở */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shrink-0">
            {matrixData.isLocked ? (
              <span className="inline-flex items-center gap-1 text-red-700">
                <Lock className="w-3.5 h-3.5 text-red-600" /> Đã khóa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" /> Đang mở
              </span>
            )}
          </div>
        </div>

        {/* KHỐI 2: CỤM NÚT CHỨC NĂNG CÂN ĐỐI (ĐỒNG BỘ CHIỀU CAO h-9) */}
        <div className="flex items-center gap-2 shrink-0">
          {!isDonVi ? (
            <>
              {/* NÚT LƯU ĐIỂM DUY NHẤT & CHẶT CHẼ BẢO MẬT */}
              <button
                onClick={handleTriggerSave}
                disabled={!hasUnsavedChanges || saving}
                className={`btn btn-sm h-9 px-3.5 flex items-center gap-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                  !hasUnsavedChanges
                    ? 'btn-secondary text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : hasOldScoreModification
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700'
                    : 'btn-primary font-bold shadow-sm'
                }`}
                style={
                  !hasUnsavedChanges
                    ? {}
                    : hasOldScoreModification
                    ? { backgroundColor: '#d97706', borderColor: '#b45309', color: '#ffffff' }
                    : { backgroundColor: '#15803d', borderColor: '#166534', color: '#ffffff' }
                }
                title={
                  !hasUnsavedChanges
                    ? 'Chưa có thay đổi nào cần lưu'
                    : hasOldScoreModification
                    ? `Phát hiện ${oldScoreChanges.length} ô điểm cũ bị điều chỉnh — Bắt buộc nhập lý do/quyết định vào Nhật ký Audit Log!`
                    : `Lưu nhanh ${totalChangesCount} ô điểm mới nhập`
                }
              >
                {hasOldScoreModification ? (
                  <ShieldAlert className="w-4 h-4 text-white" />
                ) : (
                  <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                )}
                <span>
                  {!hasUnsavedChanges
                    ? 'Lưu Điểm'
                    : hasOldScoreModification
                    ? `Lưu Sửa Điểm (${totalChangesCount}) *`
                    : `Lưu Điểm Mới (${totalChangesCount})`}
                </span>
              </button>

              {/* NÚT THÊM / SỬA MÔN */}
              {canManageSubjects && (
                <button
                  type="button"
                  onClick={() => {
                    fetchAvailableSubjects();
                    setAddSubjectTab('existing');
                    setIsAddSubjectModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm h-9 px-3 flex items-center gap-1.5 text-xs font-bold rounded-lg border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
                  title="Thêm cột môn mới, sửa thông tin môn học hoặc đổi môn cho lớp"
                >
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>Thêm / Sửa Môn</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 h-9 px-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-xs font-bold">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Quyền Đơn vị: Xem điểm</span>
            </div>
          )}

          {/* NÚT XUẤT BÁO CÁO (ĐỒNG BỘ CHIỀU CAO h-9, BỎ KHUNG XÁM THỪA) */}
          <div className="relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="btn btn-secondary btn-sm h-9 px-3 text-xs font-bold flex items-center gap-1.5 rounded-lg border-slate-300 hover:border-slate-400 text-slate-800 bg-white shadow-2xs cursor-pointer"
              title="Chọn định dạng xuất báo cáo kết quả chính thức"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Xuất Báo Cáo</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {exportDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExportDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  {/* BÁO CÁO LỚP HIỆN TẠI */}
                  <div className="px-3.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Báo cáo lớp đang chọn</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      {matrixData?.classCode || `Lớp #${classId}`}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      handleExportHocPhan();
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-emerald-50/70 flex items-start gap-3 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 shrink-0 mt-0.5">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        1. Kết quả Học phần (Lớp này)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Điểm kiểm tra thường xuyên theo môn, TBC học phần và phân loại rèn luyện
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      handleExportTotNghiep();
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-amber-50/70 flex items-start gap-3 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200 shrink-0 mt-0.5">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        2. Kết quả Tốt nghiệp (Lớp này)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Số vào sổ gốc, điểm thi tốt nghiệp các môn, điểm TB khóa và xếp loại tốt nghiệp
                      </div>
                    </div>
                  </button>

                  <div className="h-px bg-slate-200 my-1.5 mx-3"></div>

                  {/* PHẦN 3: XUẤT TOÀN BỘ CÁC LỚP (MỖI LỚP 1 SHEET) */}
                  <div className="px-3.5 py-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Xuất toàn bộ các lớp (Mỗi lớp 1 sheet)</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      {classList.length} lớp
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      handleExportAllClassesHocPhan();
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-emerald-50/70 flex items-start gap-3 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg border border-emerald-700 shrink-0 mt-0.5 shadow-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        3. Sổ Kết quả Học phần — Toàn bộ các lớp
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Tổng hợp tất cả các lớp đào tạo trong khóa, mỗi lớp lưu trên một sheet riêng biệt
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      handleExportAllClassesTotNghiep();
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-amber-50/70 flex items-start gap-3 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-amber-600 text-white rounded-lg border border-amber-700 shrink-0 mt-0.5 shadow-xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-950">
                        4. Sổ Kết quả Tốt nghiệp — Toàn bộ các lớp
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Tổng hợp kết quả và phân loại tốt nghiệp toàn khóa, mỗi lớp lưu trên một sheet riêng biệt
                      </div>
                    </div>
                  </button>

                  <div className="h-px bg-slate-200 my-1.5 mx-3"></div>

                  {/* PHẦN 4: BÁO CÁO TỔNG HỢP XÉT ĐK DỰ THI */}
                  <div className="px-3.5 py-1 text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Báo cáo Tổng hợp Xét ĐK Dự thi Tốt nghiệp</span>
                  </div>

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      handleExportTongHopXetDieuKien();
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-blue-50/70 flex items-start gap-3 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-blue-700 text-white rounded-lg border border-blue-800 shrink-0 mt-0.5 shadow-xs">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-950">
                        5. Báo cáo Tổng hợp Xét ĐK Dự thi — Toàn trường
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Thống kê phân loại học lực, tỷ lệ rèn luyện và quân số đủ điều kiện dự thi của toàn trường
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleOpenSelectClassesModal}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-blue-50/70 flex items-start gap-3 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg border border-blue-300 shrink-0 mt-0.5 shadow-xs">
                      <Filter className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-950">
                        6. Báo cáo Tổng hợp Xét ĐK Dự thi — Chọn danh sách lớp
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        Lựa chọn cụ thể các lớp cần lập bảng tổng hợp xét điều kiện dự thi tốt nghiệp
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="alert alert-success font-bold text-xs shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Empty Subject State Banner - Chỉ hiển thị khi đã nạp xong (không loading) và thực sự chưa có môn */}
      {!loading && safeColumns.length === 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-600/50 rounded-xl text-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div>
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Lớp chưa có danh mục môn học đào tạo
            </h4>
            <p className="text-xs text-amber-200/80 mt-1">
              Lớp thuộc chuyên ngành <strong>{matrixData.majorName || 'Quân sự'}</strong>. Bạn có thể nhấn nút để hệ thống tự động liên kết các môn học từ <strong>Lộ trình Đào tạo</strong> của chuyên ngành này vào bảng điểm.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInitFromCurriculum}
              disabled={loading}
              className="btn btn-primary font-bold text-xs whitespace-nowrap shadow-md flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: '#d97706', borderColor: '#b45309' }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>⚡ Lấy Môn từ Lộ Trình Ngay</span>
            </button>
            <button
              type="button"
              onClick={() => {
                fetchAvailableSubjects();
                setIsAddSubjectModalOpen(true);
              }}
              className="btn btn-secondary font-bold text-xs whitespace-nowrap shadow-md flex items-center gap-1.5 cursor-pointer text-slate-800"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>+ Thêm Cột Thủ Công</span>
            </button>
          </div>
        </div>
      )}

      {/* KHU VỰC BẢNG ĐIỂM HOẶC TRẠNG THÁI TĨNH ĐANG TẢI */}
      {loading ? (
        <div className="glass-panel p-12 bg-white border border-slate-200 rounded-xl shadow-xs text-center flex flex-col items-center justify-center my-6 min-h-[360px]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3.5 shadow-inner">
            <RefreshCw className="w-7 h-7 text-emerald-700 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-wide uppercase">
            Đang tải dữ liệu Bảng điểm Quân sự...
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-md leading-relaxed">
            Hệ thống đang đồng bộ danh sách học viên, nạp danh mục môn học đào tạo và cấu trúc điểm. Vui lòng đợi trong giây lát.
          </p>
        </div>
      ) : (
        /* MATRIX TABLE WITHOUT SHHV & RANK, WITH GRAD EXAM SPLIT INTO 3 SUBJECTS */
        <div className="matrix-table-container">
          <table className="matrix-table">
          <thead>
            {/* Header Row 1 */}
            <tr>
              <th rowSpan={2} className="w-12 sticky-col-1">TT</th>
              <th rowSpan={2} className="min-w-[170px] text-left sticky-col-2">Họ và tên Học viên</th>
              <th rowSpan={2} className="min-w-[78px] whitespace-nowrap px-1 text-center font-bold text-xs">
                Ngày sinh
              </th>
              
              {/* MERGED GROUP HEADER 1: KẾT QUẢ HỌC TẬP TOÀN KHÓA */}
              <th
                colSpan={safeColumns.length}
                className="py-2 px-3 bg-slate-100 text-slate-800 font-extrabold text-xs border-b border-slate-300 tracking-wider uppercase"
              >
                {isPrivilegedUser
                  ? `KẾT QUẢ HỌC TẬP TOÀN KHÓA (${safeColumns.length} MÔN)`
                  : `CÁC MÔN HỌC THUỘC KHOA PHỤ TRÁCH (${safeColumns.length} MÔN)`}
              </th>

              {isPrivilegedUser && (
                <>
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
                </>
              )}
              <th rowSpan={2} className="min-w-[110px]">Quê quán</th>
            </tr>

            {/* Header Row 2: VERTICAL SUBJECT HEADERS */}
            <tr>
              {/* Sub-headers for Course Subjects */}
              {safeColumns.map((col) => {
                const userAssignedSubjects = currentUser?.assignedSubjectIds || matrixData?.assignedSubjectIds || [];
                const isAssignedToTeacher = isGiangVien && userAssignedSubjects.includes(col.subjectId);
                return (
                <th key={col.subjectId} className="p-0 border-t border-slate-200 min-w-[48px] max-w-[56px] align-bottom relative group">
                  <div className="th-vertical-subject" title={`${col.subjectName} (${col.subjectCode}) - ${col.credits} tín chỉ${isAssignedToTeacher ? ' (Bạn phụ trách môn này)' : ''}`}>
                    {col.subjectName} <span className="text-emerald-700 text-[10px]">({col.credits}TC)</span>
                    {isAssignedToTeacher && (
                      <span className="ml-1 text-[9px] text-emerald-800 font-extrabold bg-emerald-200/90 px-1 py-0.5 rounded shadow-2xs">✓ Dạy</span>
                    )}
                  </div>
                  {isPrivilegedUser && (
                    <div className="absolute top-1 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 z-10 bg-white/90 rounded p-0.5 shadow-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditSubject(col);
                        }}
                        className="p-0.5 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded transition cursor-pointer"
                        title={`Sửa môn "${col.subjectName}" (${col.subjectCode})`}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSubjectFromClass(col.subjectId, col.subjectName);
                        }}
                        className="p-0.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition cursor-pointer"
                        title={`Xóa môn "${col.subjectName}" khỏi lớp này (không ảnh hưởng chương trình đào tạo)`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </th>
              );
            })}

              {/* Sub-headers for 3 Graduation Exam Subjects */}
              {isPrivilegedUser && safeGradExamSubjects.map((sub) => (
                <th key={sub.id} className="p-0 border-t border-slate-200 min-w-[48px] max-w-[56px] align-bottom">
                  <div className="th-vertical-subject text-amber-700" title={`${sub.name} (${sub.code})`}>
                    {sub.name} <span className="text-amber-800 text-[10px]">({sub.code})</span>
                  </div>
                </th>
              ))}
            </tr>

            {/* Header Row 3: HÀNG HIỂN THỊ SỐ TÍN CHỈ CỦA CÁC MÔN HỌC */}
            <tr className="bg-slate-100/90 border-t border-b border-slate-300">
              <th className="sticky-col-1 py-1.5 px-1 text-center font-bold text-[10px] text-slate-500 bg-slate-100 border-r border-slate-200">
                TC
              </th>
              <th className="sticky-col-2 py-1.5 px-2 text-right font-extrabold text-[11px] text-slate-700 bg-slate-100 uppercase tracking-wider">
                Số tín chỉ:
              </th>
              <th className="py-1.5 px-1 text-center font-bold text-[10px] text-slate-400 bg-slate-100">
                —
              </th>

              {/* Số tín chỉ của từng môn học */}
              {safeColumns.map((col) => (
                <th
                  key={`credit_${col.subjectId}`}
                  className="py-1 px-0.5 text-center bg-emerald-50 text-emerald-900 border-x border-slate-200 font-mono"
                  title={`${col.subjectName}: ${col.credits || 3} Tín chỉ`}
                >
                  <span className="inline-flex items-center justify-center w-full px-1 py-0.5 rounded bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 font-bold text-[11px]">
                    {col.credits || 3}
                  </span>
                </th>
              ))}

              {/* Các cột tổng kết và thi tốt nghiệp */}
              {isPrivilegedUser && (
                <>
                  <th className="py-1 px-1 bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-x border-slate-200">
                    —
                  </th>
                  <th className="py-1 px-1 bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-x border-slate-200">
                    —
                  </th>

                  {safeGradExamSubjects.map((sub) => (
                    <th
                      key={`credit_grad_${sub.id}`}
                      className="py-1 px-1 text-center bg-amber-50 text-amber-700 font-bold text-[10px] border-x border-slate-200"
                      title="Môn thi tốt nghiệp"
                    >
                      —
                    </th>
                  ))}

                  <th className="py-1 px-1 bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-x border-slate-200">
                    —
                  </th>
                  <th className="py-1 px-1 bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-x border-slate-200">
                    —
                  </th>
                  <th className="py-1 px-1 bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-x border-slate-200">
                    —
                  </th>
                </>
              )}

              <th className="py-1 px-1 bg-slate-50 text-center text-[10px] text-slate-400 font-bold">
                —
              </th>
            </tr>
          </thead>

          <tbody>
            {safeRows.length === 0 ? (
              <tr>
                <td colSpan={15 + (matrixData?.columns?.length || 0)} className="py-16 text-center text-slate-400 font-medium bg-slate-50/50">
                  {loading ? 'Đang tải bảng điểm học viên...' : 'Lớp học hiện chưa có dữ liệu học viên trong hệ thống. Vui lòng thêm học viên hoặc import danh sách.'}
                </td>
              </tr>
            ) : (
              safeRows.map((row, rowIdx) => {
              const currentConduct = editedConducts[row.studentId] !== undefined ? editedConducts[row.studentId] : row.conductGrade;

              // Calculate TBC for 3 Graduation Exam Subjects
              let sumGradExam = 0;
              let intGradCount = 0;
              safeGradExamSubjects.forEach((gradSub) => {
                const key = `${row.studentId}_${gradSub.id}`;
                const rawVal = key in editedGradExamScores ? editedGradExamScores[key] : (row.gradExamScores ? row.gradExamScores[gradSub.id] : null);
                if (rawVal !== null && rawVal !== undefined && rawVal !== '') {
                  const val = parseFloat(rawVal);
                  if (!isNaN(val)) {
                    sumGradExam += val;
                    intGradCount++;
                  }
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
                  <td className="text-[11px] text-slate-600 font-mono whitespace-nowrap px-1 text-center" title={row.dob}>
                    {row.dob}
                  </td>

                  {/* COURSE SUBJECT GRADE INPUTS (Hỗ trợ phím mũi tên & Enter như Excel, chuẩn dấu '.') */}
                  {safeColumns.map((col, colIdx) => {
                    const gradeDetail = row.grades ? row.grades[col.subjectId] : null;
                    const key = `${row.studentId}_${col.subjectId}`;
                    const isEdited = isCellEdited(row.studentId, col.subjectId);
                    const currentScoreVal = isEdited ? editedScores[key] : (gradeDetail ? gradeDetail.score : '');
                    const hasExistingScore = gradeDetail && gradeDetail.score !== null && gradeDetail.score !== undefined;
                    const isLockedForTeacher = !isPrivilegedUser && hasExistingScore;
                    const userAssignedSubjects = currentUser?.assignedSubjectIds || matrixData?.assignedSubjectIds || [];
                    const isSubjectAllowedForTeacher = !isGiangVien || userAssignedSubjects.includes(col.subjectId);
                    const isCellDisabled = !currentUser || isDonVi || (matrixData.isLocked && !isPrivilegedUser) || isLockedForTeacher || !isSubjectAllowedForTeacher;

                    let cellTitle = 'Nhập điểm (0-10, ví dụ 9.5). Nhấn mũi tên xuống hoặc Enter để chuyển sang học viên tiếp theo';
                    if (!currentUser) {
                      cellTitle = 'Đồng chí cần đăng nhập tài khoản để thực hiện thao tác nhập điểm';
                    } else if (isDonVi) {
                      cellTitle = 'Tài khoản Đơn vị chỉ có quyền tra cứu/xem điểm (chế độ Read-only)';
                    } else if (!isSubjectAllowedForTeacher) {
                      cellTitle = 'Bạn không được phân công giảng dạy môn học này';
                    } else if (isLockedForTeacher) {
                      cellTitle = 'Điểm đã lưu vào hệ thống. Giáo viên chỉ được nhập điểm 1 lần, chỉ Ban Đào Tạo (PĐT) hoặc Quản trị viên mới có quyền chỉnh sửa.';
                    } else if (matrixData.isLocked && !isPrivilegedUser) {
                      cellTitle = 'Bảng điểm đang bị khóa bởi Ban Đào Tạo';
                    }

                    return (
                      <td key={col.subjectId} className={isEdited ? 'cell-modified' : ''}>
                        <input
                          type="text"
                          inputMode="decimal"
                          id={`score-input-${rowIdx}-${colIdx}`}
                          data-row-idx={rowIdx}
                          data-col-idx={colIdx}
                          disabled={isCellDisabled}
                          value={currentScoreVal !== null && currentScoreVal !== undefined ? currentScoreVal : ''}
                          onChange={(e) => handleScoreInputChange(row.studentId, col.subjectId, e.target.value)}
                          onKeyDown={(e) => handleGridKeyDown(e, rowIdx, colIdx, false)}
                          onBlur={(e) => handleScoreBlur(row.studentId, col.subjectId, e.target.value)}
                          placeholder="-"
                          title={cellTitle}
                          className={`cell-input text-center font-bold ${isEdited ? 'text-amber-800 font-extrabold' : ''} ${
                            isDonVi
                              ? 'bg-slate-50 text-slate-700 cursor-not-allowed font-medium'
                              : !isSubjectAllowedForTeacher
                              ? 'bg-slate-100/70 text-slate-400 cursor-not-allowed opacity-75'
                              : isLockedForTeacher
                              ? 'bg-slate-100 text-slate-700 cursor-not-allowed font-medium opacity-90'
                              : matrixData.isLocked && !isPrivilegedUser
                              ? 'cursor-not-allowed opacity-50'
                              : ''
                          }`}
                        />
                      </td>
                    );
                  })}

                  {isPrivilegedUser && (
                    <>
                      {/* TB (TRUNG BÌNH CỘNG TOÀN KHÓA) */}
                      <td className="font-bold text-sm text-amber-800 bg-amber-50/60">
                        {row.tbcScore !== null ? row.tbcScore.toFixed(2) : '-'}
                      </td>

                      {/* PHÂN LOẠI RÈN LUYỆN */}
                      <td>
                        <select
                          disabled={matrixData.isLocked && !isPrivilegedUser}
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

                      {/* 3 GRADUATION EXAM SUBJECT SCORE INPUTS (Hỗ trợ phím mũi tên & Enter như Excel, chuẩn dấu '.') */}
                      {safeGradExamSubjects.map((gradSub, gradIdx) => {
                        const key = `${row.studentId}_${gradSub.id}`;
                        const isEdited = isGradExamCellEdited(row.studentId, gradSub.id);
                        const val = isEdited ? editedGradExamScores[key] : (row.gradExamScores ? row.gradExamScores[gradSub.id] : '');

                        return (
                          <td key={gradSub.id} className={isEdited ? 'cell-modified' : ''}>
                            <input
                              type="text"
                              inputMode="decimal"
                              id={`grad-score-input-${rowIdx}-${gradIdx}`}
                              data-row-idx={rowIdx}
                              data-grad-idx={gradIdx}
                              disabled={!currentUser || (matrixData.isLocked && !isPrivilegedUser)}
                              value={val !== null && val !== undefined ? val : ''}
                              onChange={(e) => handleGradExamScoreInputChange(row.studentId, gradSub.id, e.target.value)}
                              onKeyDown={(e) => handleGridKeyDown(e, rowIdx, gradIdx, true)}
                              onBlur={(e) => handleGradExamScoreBlur(row.studentId, gradSub.id, e.target.value)}
                              placeholder="-"
                              title={!currentUser ? "Đồng chí cần đăng nhập tài khoản để thực hiện thao tác nhập điểm" : "Điểm thi tốt nghiệp (0-10). Nhấn mũi tên xuống hoặc Enter để chuyển sang học viên tiếp theo"}
                              className={`cell-input text-center text-amber-800 font-bold ${isEdited ? 'font-extrabold' : ''} ${!currentUser || matrixData.isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
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
                    </>
                  )}

                  <td className="text-xs text-slate-600">{row.pob || 'Hà Nội'}</td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>
      )}

      {/* MANDATORY AUDIT REASON MODAL (CHO TRƯỜNG HỢP SỬA ĐIỂM CẦN GHI NHẬN AUDIT LOG) */}
      {isReasonModalOpen && (
        <div className="modal-overlay" onClick={() => setIsReasonModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '520px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2.5 text-amber-800">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <h3 className="font-military text-base font-bold text-slate-900">
                  Lưu Kèm Lý Do Sửa Điểm (Audit Log)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReasonModalOpen(false)}
                className="btn btn-icon btn-secondary btn-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl mb-3 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center justify-between">
                <span>⚠️ Chuẩn bị lưu <strong className="text-red-700">{totalChangesCount}</strong> ô điểm (trong đó có <strong className="text-red-700">{oldScoreChanges.length}</strong> ô sửa điểm cũ).</span>
              </p>
              <p className="text-[11px] text-amber-800">
                Toàn bộ dữ liệu điểm cũ, điểm mới, tài khoản thao tác và địa chỉ IP sẽ được lưu vết vào bảng Kiểm toán (Audit Log) theo điều lệnh quân sự.
              </p>
            </div>

            {/* BẢNG TÓM TẮT CÁC Ô ĐIỂM CŨ BỊ SỬA */}
            {oldScoreChanges.length > 0 && (
              <div className="mb-3 border border-amber-200/80 bg-amber-50/40 rounded-xl p-3 text-xs">
                <div className="font-bold text-amber-950 mb-1.5 flex items-center justify-between">
                  <span>Chi tiết các điểm cũ bị sửa đổi ({oldScoreChanges.length}):</span>
                  <span className="text-[10px] font-bold text-red-700 uppercase bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                    Bắt buộc có lý do
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto divide-y divide-amber-200/60 font-mono text-[11px] pr-1">
                  {oldScoreChanges.map((item, idx) => (
                    <div key={idx} className="py-1 flex items-center justify-between gap-2">
                      <span className="text-slate-800 font-sans font-medium truncate">
                        {item.studentName} — <strong className="text-amber-900">{item.subjectName}</strong>
                      </span>
                      <span className="shrink-0 text-slate-700">
                        <span className="text-red-700 font-bold line-through">{item.oldVal}</span> ➔ <span className="text-emerald-700 font-bold">{item.newVal}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div>
                <label className="form-label text-xs font-bold text-slate-800 mb-1">
                  Chọn nhanh lý do mẫu:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Chấm phúc khảo bài thi kết thúc môn',
                    'Cập nhật điểm kiểm tra bổ sung',
                    'Điều chỉnh điểm sau thanh tra đào tạo',
                    'Đối chiếu khớp với sổ điểm giảng viên',
                    'Hội đồng khoa phê duyệt sửa điểm'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAuditReason(preset)}
                      className="px-2 py-1 text-[11px] rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-800 mb-1">
                  Nội dung lý do / Số quyết định <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  placeholder="Ghi rõ lý do hoặc số quyết định (VD: Quyết định phúc khảo số 45/QĐ-ĐTT...)"
                  rows={3}
                  className="form-input text-xs leading-relaxed"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsReasonModalOpen(false)}
                className="btn btn-secondary btn-sm px-4"
                disabled={saving}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveBatch}
                className="btn btn-primary btn-sm px-4 font-bold flex items-center gap-1.5"
                disabled={saving || !auditReason.trim()}
                style={{
                  background: auditReason.trim() ? '#b45309' : '#cbd5e1',
                  borderColor: auditReason.trim() ? '#92400e' : '#94a3b8'
                }}
              >
                <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
                <span>{saving ? 'Đang lưu...' : 'Xác Nhận & Lưu Audit Log'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM CỘT MÔN HỌC LINH HOẠT CHO LỚP */}
      {isAddSubjectModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddSubjectModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '520px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-military text-base font-bold text-slate-900">Quản Lý & Thêm / Sửa Môn Học Cho Lớp</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR: CHỌN MÔN CÓ SẴN, TẠO MÔN MỚI, SỬA MÔN, ĐỔI MÔN HOẶC XÓA MÔN CHO RIÊNG LỚP */}
            <div className="flex items-center gap-1.5 mb-4 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setAddSubjectTab('existing')}
                className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                  addSubjectTab === 'existing'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>1. Môn Có Sẵn</span>
              </button>
              <button
                type="button"
                onClick={() => setAddSubjectTab('new')}
                className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                  addSubjectTab === 'new'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>2. Tạo Môn Mới</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddSubjectTab('edit');
                  if (!editSubjectId && rawColumns.length > 0) {
                    const firstCol = rawColumns[0];
                    setEditSubjectId(firstCol.subjectId);
                    setEditSubName(firstCol.subjectName || '');
                    setEditSubCode(firstCol.subjectCode || '');
                    setEditSubCredits(firstCol.credits != null ? String(firstCol.credits) : '3');
                  }
                }}
                className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                  addSubjectTab === 'edit'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>3. Sửa Môn</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddSubjectTab('replace');
                  if (!replaceOldSubjectId && rawColumns.length > 0) {
                    setReplaceOldSubjectId(rawColumns[0].subjectId);
                  }
                  if (!replaceNewSubjectId && availableSubjects.length > 0) {
                    setReplaceNewSubjectId(availableSubjects[0].id);
                  }
                }}
                className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                  addSubjectTab === 'replace'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>4. Đổi Môn</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddSubjectTab('delete');
                  if (!deleteSubjectId && rawColumns.length > 0) {
                    setDeleteSubjectId(rawColumns[0].subjectId);
                  }
                }}
                className={`flex-1 py-1.5 px-1.5 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-1 ${
                  addSubjectTab === 'delete'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>5. Xóa Môn</span>
              </button>
            </div>

            {addSubjectTab === 'existing' && (
              <form onSubmit={handleAddExistingSubject} className="space-y-4">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Chọn môn học từ danh mục của Nhà trường <span className="text-red-500">*</span>
                  </label>
                  {availableSubjects.length > 0 ? (
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="form-input text-xs font-semibold text-slate-900"
                      required
                    >
                      {availableSubjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.code} — {sub.name} ({sub.credits} Tín chỉ)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      Đang tải danh mục môn học hoặc chưa có môn học trong hệ thống. Bạn có thể chuyển sang tab <strong>Tạo Môn Mới</strong>.
                    </div>
                  )}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 space-y-1">
                  <p>
                    📌 Môn học được chọn sẽ được gán làm cột bổ sung linh hoạt cho lớp <strong>{matrixData?.classCode}</strong>.
                  </p>
                  <p className="text-slate-500">
                    Cán bộ huấn luyện có thể nhập điểm trực tiếp trên bảng ma trận hoặc qua file Excel sau khi thêm.
                  </p>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddSubjectModalOpen(false)}
                    disabled={addingSubject}
                    className="btn btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-100 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={addingSubject || availableSubjects.length === 0}
                    className="btn btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{addingSubject ? 'Đang thêm...' : 'Gán Cột Môn Này Vào Lớp'}</span>
                  </button>
                </div>
              </form>
            )}

            {addSubjectTab === 'new' && (
              <form onSubmit={handleAddNewSubject} className="space-y-4">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Tên môn học mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="VD: Điều lệnh Đội ngũ, Kỹ thuật Bắn súng..."
                    className="form-input text-xs font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Mã môn học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newSubCode}
                      onChange={(e) => setNewSubCode(e.target.value.toUpperCase())}
                      placeholder="VD: QS2001"
                      className="form-input text-xs font-mono font-bold uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Số lượng Tín chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newSubCredits}
                      onChange={(e) => setNewSubCredits(e.target.value)}
                      className="form-input text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
                  📌 Cột môn học mới này sẽ được tạo và lưu trực tiếp vào cơ sở dữ liệu cho lớp <strong>{matrixData?.classCode}</strong>.
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddSubjectModalOpen(false)}
                    disabled={addingSubject}
                    className="btn btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-100 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={addingSubject}
                    className="btn btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{addingSubject ? 'Đang tạo...' : 'Tạo & Gán Cột Vào Bảng Điểm'}</span>
                  </button>
                </div>
              </form>
            )}

            {addSubjectTab === 'edit' && (
              <form onSubmit={handleSaveEditSubject} className="space-y-4">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Chọn môn học cần sửa thông tin <span className="text-red-500">*</span>
                  </label>
                  {rawColumns.length > 0 ? (
                    <select
                      value={editSubjectId}
                      onChange={(e) => {
                        const sid = e.target.value;
                        setEditSubjectId(sid);
                        const found = rawColumns.find(c => String(c.subjectId) === String(sid));
                        if (found) {
                          setEditSubName(found.subjectName || '');
                          setEditSubCode(found.subjectCode || '');
                          setEditSubCredits(found.credits != null ? String(found.credits) : '3');
                        }
                      }}
                      className="form-input text-xs font-semibold text-slate-900"
                      required
                    >
                      <option value="">-- Chọn môn của lớp cần sửa --</option>
                      {rawColumns.map((col) => (
                        <option key={col.subjectId} value={col.subjectId}>
                          {col.subjectCode} — {col.subjectName} ({col.credits} TC)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      Lớp này hiện chưa có cột môn học nào để chỉnh sửa.
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Tên môn học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editSubName}
                    onChange={(e) => setEditSubName(e.target.value)}
                    placeholder="VD: Điều lệnh Đội ngũ..."
                    className="form-input text-xs font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Mã môn học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editSubCode}
                      onChange={(e) => setEditSubCode(e.target.value.toUpperCase())}
                      placeholder="VD: QS2001"
                      className="form-input text-xs font-mono font-bold uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Số lượng Tín chỉ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editSubCredits}
                      onChange={(e) => setEditSubCredits(e.target.value)}
                      className="form-input text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                  ✏️ Thay đổi sẽ cập nhật trực tiếp tên, mã môn và số tín chỉ của môn học này trong hệ thống.
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddSubjectModalOpen(false)}
                    disabled={editingSubject}
                    className="btn btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-100 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={editingSubject || !editSubjectId}
                    className="btn btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm rounded-lg"
                    style={{ backgroundColor: '#b45309', borderColor: '#92400e' }}
                  >
                    <Edit className={`w-4 h-4 ${editingSubject ? 'animate-spin' : ''}`} />
                    <span>{editingSubject ? 'Đang lưu...' : 'Lưu Cập Nhật Môn Học'}</span>
                  </button>
                </div>
              </form>
            )}

            {addSubjectTab === 'replace' && (
              <form onSubmit={handleReplaceSubject} className="space-y-4">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Môn học hiện tại của lớp cần thay thế <span className="text-red-500">*</span>
                  </label>
                  {rawColumns.length > 0 ? (
                    <select
                      value={replaceOldSubjectId}
                      onChange={(e) => setReplaceOldSubjectId(e.target.value)}
                      className="form-input text-xs font-semibold text-slate-900"
                      required
                    >
                      <option value="">-- Chọn môn hiện tại cần đổi --</option>
                      {rawColumns.map((col) => (
                        <option key={col.subjectId} value={col.subjectId}>
                          {col.subjectCode} — {col.subjectName} ({col.credits} TC)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      Lớp này hiện chưa có cột môn học nào để thay thế.
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Môn học mới thay thế <span className="text-red-500">*</span>
                  </label>
                  {availableSubjects.length > 0 ? (
                    <select
                      value={replaceNewSubjectId}
                      onChange={(e) => setReplaceNewSubjectId(e.target.value)}
                      className="form-input text-xs font-semibold text-slate-900"
                      required
                    >
                      <option value="">-- Chọn môn mới thay thế từ danh mục --</option>
                      {availableSubjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.code} — {sub.name} ({sub.credits} Tín chỉ)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      Đang tải danh mục môn học...
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
                  <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-700" />
                    <span>Phạm vi áp dụng riêng biệt cho lớp:</span>
                  </p>
                  <p>
                    Thao tác đổi môn này chỉ áp dụng <strong>riêng cho lớp {matrixData?.classCode}</strong>, hoàn toàn <strong>KHÔNG</strong> ảnh hưởng đến chương trình đào tạo chung hay bất kỳ lớp nào khác.
                  </p>
                  <p className="text-amber-700">
                    Môn mới sẽ xuất hiện trên bảng điểm và thay thế vị trí của môn cũ trong lớp này.
                  </p>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddSubjectModalOpen(false)}
                    disabled={replacingSubject}
                    className="btn btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-100 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={replacingSubject || !replaceOldSubjectId || !replaceNewSubjectId}
                    className="btn btn-primary px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm rounded-lg"
                    style={{ backgroundColor: '#b45309', borderColor: '#92400e' }}
                  >
                    <ArrowLeftRight className={`w-4 h-4 ${replacingSubject ? 'animate-spin' : ''}`} />
                    <span>{replacingSubject ? 'Đang đổi môn...' : 'Xác Nhận Đổi Môn Cho Lớp'}</span>
                  </button>
                </div>
              </form>
            )}

            {addSubjectTab === 'delete' && (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!deleteSubjectId) return;
                const found = rawColumns.find(c => String(c.subjectId) === String(deleteSubjectId));
                if (found) {
                  await handleRemoveSubjectFromClass(found.subjectId, found.subjectName);
                  setIsAddSubjectModalOpen(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Chọn môn học của lớp cần xóa <span className="text-red-500">*</span>
                  </label>
                  {rawColumns.length > 0 ? (
                    <select
                      value={deleteSubjectId}
                      onChange={(e) => setDeleteSubjectId(e.target.value)}
                      className="form-input text-xs font-semibold text-slate-900"
                      required
                    >
                      <option value="">-- Chọn môn cần xóa khỏi lớp này --</option>
                      {rawColumns.map((col) => (
                        <option key={col.subjectId} value={col.subjectId}>
                          {col.subjectCode} — {col.subjectName} ({col.credits} TC)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                      Lớp này hiện không có môn học nào để xóa.
                    </div>
                  )}
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-red-800">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cảnh báo xóa cột môn học:</span>
                  </p>
                  <p>
                    Cột môn này sẽ bị gỡ bỏ khỏi bảng điểm của lớp <strong>{matrixData?.classCode}</strong>. Toàn bộ điểm số đã nhập cho môn này của lớp sẽ bị xóa.
                  </p>
                  <p className="text-red-700 font-semibold">
                    Thao tác này chỉ xóa riêng trong lớp này, hoàn toàn không xóa môn học trong Lộ trình chung.
                  </p>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddSubjectModalOpen(false)}
                    className="btn btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-100 transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={!deleteSubjectId}
                    className="btn btn-danger px-5 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xác Nhận Xóa Cột Môn Này</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Chọn danh sách lớp xuất Báo cáo Tổng hợp Xét ĐK Dự thi */}
      {selectClassesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-300">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-military-title">
                    Chọn danh sách lớp xuất Báo cáo Xét ĐK Dự thi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Báo cáo sẽ tổng hợp kết quả của các lớp được tích chọn bên dưới
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectClassesModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Quick Actions toolbar */}
            <div className="p-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm theo mã lớp, tên lớp, chuyên ngành..."
                  value={classFilterTerm}
                  onChange={(e) => setClassFilterTerm(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAllClasses}
                  className="px-2.5 py-1 text-blue-700 hover:bg-blue-50 rounded border border-blue-200 font-semibold cursor-pointer"
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllClasses}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded border border-slate-200 font-semibold cursor-pointer"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>

            {/* Class List */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-100">
              {filteredExportClasses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Không tìm thấy lớp học nào phù hợp với từ khóa
                </div>
              ) : (
                filteredExportClasses.map((c) => {
                  const isChecked = selectedExportClassIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleClassSelection(c.id);
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition cursor-pointer select-none ${
                        isChecked 
                          ? 'bg-blue-50/60 border-blue-200 hover:bg-blue-50' 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer pointer-events-none"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-900">
                            {c.code || `Lớp #${c.id}`}
                          </span>
                          {c.majorName && (
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[10px] rounded font-medium truncate">
                              {c.majorName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {c.name || 'Lớp đào tạo'}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                        {c.studentCount != null ? `${c.studentCount} HV` : ''}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-600">
                Đã chọn: <span className="font-bold text-blue-700">{selectedExportClassIds.length}</span> / {classList.length} lớp
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectClassesModalOpen(false)}
                  className="btn btn-secondary px-3.5 py-1.5 text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleExportCustomClassesTongHop}
                  disabled={selectedExportClassIds.length === 0}
                  className="btn btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Báo cáo ({selectedExportClassIds.length} lớp)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal xác nhận thao tác chuẩn quân sự */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        itemName={confirmDialog.itemName}
        warningNote={confirmDialog.warningNote}
        confirmLabel={confirmDialog.confirmLabel}
        type={confirmDialog.type}
        loading={confirmDialog.loading}
      />

    </div>
  );
}
