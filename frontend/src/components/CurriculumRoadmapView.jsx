import React, { useState, useEffect } from 'react';
import { Compass, Upload, Download, CheckCircle2, FileSpreadsheet, Shield, Award, BookOpen, AlertCircle, RefreshCw, X, Plus, Pencil, Trash2, Search, Check, AlertTriangle } from 'lucide-react';

const DEFAULT_TARGET_GROUPS = [
  { code: 'SQDB', name: 'Sĩ quan Dự bị (SQDB)', desc: 'Thời gian 03 - 04 tháng' },
  { code: 'TDT', name: 'Tiểu đội trưởng (TĐT)', desc: 'Thời gian 06 tháng' },
  { code: 'KDT', name: 'Khẩu đội trưởng (KĐT)', desc: 'Thời gian 06 tháng' },
  { code: 'NVKT', name: 'Nhân viên Kỹ thuật (NVKT)', desc: 'Thời gian 06 tháng' },
  { code: 'HSQ', name: 'Hạ sĩ quan Chỉ huy (HSQ)', desc: 'Thời gian 06 tháng' },
];

const TARGET_GROUP_DEFAULT_MAJORS = {
  SQDB: 'BB',
  'SQDB(XN)': 'BB',
  'SQDB(H1)': 'BB',
  'SQDB(SV)': 'BB',
  TDT: 'VTD',
  KDT: 'DL',
  NVKT: 'NVQY',
  HSQ: 'BB',
};

const TARGET_GROUP_MAJORS = {
  SQDB: ['BB', 'BCHT', 'TSBB', 'COI', 'DKZ', 'PK127', 'PB', 'TT'],
  'SQDB(XN)': ['BB', 'BCHT', 'TSBB', 'COI', 'DKZ', 'PK127', 'PB', 'TT'],
  'SQDB(H1)': ['BB', 'BCHT', 'TSBB', 'COI', 'DKZ', 'PK127', 'PB', 'TT'],
  'SQDB(SV)': ['BB', 'BCHT', 'TSBB', 'COI', 'DKZ', 'PK127', 'PB', 'TT'],
  TDT: ['VTD', 'HTD', 'KTPB', 'CB', 'NA', 'TSBB'],
  KDT: ['DL', 'C60', 'COI', 'C100', 'SPG9', 'AGS17', 'DKZ', 'PXK', 'PK37', 'PK57', 'PK127'],
  NVKT: ['NVQY', 'NVBQVK', 'NVBQD', 'BVU'],
  HSQ: ['BB', 'BCHT'],
};

export default function CurriculumRoadmapView({ currentUser }) {
  const isPrivileged = ['ROLE_BGH', 'ROLE_PDT'].includes(currentUser?.role);
  const [targetGroups, setTargetGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('military_target_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading target groups from localStorage', e);
    }
    return DEFAULT_TARGET_GROUPS;
  });

  const [targetGroup, setTargetGroup] = useState(() => {
    try {
      const saved = localStorage.getItem('military_target_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].code;
      }
    } catch (e) {}
    return 'SQDB';
  });

  const [selectedMajor, setSelectedMajor] = useState('BB');
  const [filterType, setFilterType] = useState('ALL'); // ALL, MON_HOC_PHAN, MON_THI_TOT_NGHIEP
  
  const [curriculums, setCurriculums] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Đồng bộ danh mục đối tượng đào tạo từ cấu hình chung
  useEffect(() => {
    try {
      const saved = localStorage.getItem('military_target_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTargetGroups(parsed);
          // Nếu targetGroup hiện tại không nằm trong danh mục, cập nhật về phần tử đầu
          if (!parsed.some(tg => tg.code === targetGroup)) {
            setTargetGroup(parsed[0].code);
          }
        }
      }
    } catch (e) {
      console.error('Error reloading target groups', e);
    }
  }, []);

  const [selectedCourse, setSelectedCourse] = useState('2026');
  const courseOptions = [
    { code: '2026', name: 'Năm huấn luyện 2026 (Khung hiện hành)' },
    { code: '2025', name: 'Năm huấn luyện 2025' },
    { code: '2024', name: 'Năm huấn luyện 2024' },
    { code: 'ALL', name: 'Tất cả các năm áp dụng' },
  ];

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importStatus, setImportStatus] = useState({ type: '', text: '' });

  // Departments & Available Subjects for Curriculum Editing
  const [departments, setDepartments] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);

  // Edit Subject Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  // Add Subject Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addTab, setAddTab] = useState('new'); // 'new' | 'existing'
  const [addSaving, setAddSaving] = useState(false);
  const [selectedExistingSubjectId, setSelectedExistingSubjectId] = useState('');
  const [existingSubjectSearch, setExistingSubjectSearch] = useState('');
  const [newSubjectData, setNewSubjectData] = useState({
    subjectCode: '',
    subjectName: '',
    credits: 3,
    semester: 1,
    departmentId: '',
    type: 'MON_HOC_PHAN',
    isCompulsory: true
  });

  // Delete Confirm Dialog State
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    isOpen: false,
    subject: null,
    loading: false
  });

  // Feedback Notification Banner
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/departments', { headers });
      if (res.ok) {
        const data = await res.json();
        setDepartments(data);
      }
    } catch (e) {
      console.error('Error fetching departments:', e);
    }
  };

  const fetchAvailableSubjects = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/classes/available-subjects', { headers });
      if (res.ok) {
        const data = await res.json();
        setAvailableSubjects(data);
      }
    } catch (e) {
      console.error('Error fetching available subjects:', e);
    }
  };

  const fetchMajors = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/v1/majors', { headers });
      if (res.ok) {
        const data = await res.json();
        setMajors(data);
        if (data.length > 0 && !selectedMajor) {
          setSelectedMajor(data[0].code);
        }
      }
    } catch (e) {
      console.error('Error fetching majors:', e);
    }
  };

  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/curriculums?majorCode=${selectedMajor}&targetGroup=${encodeURIComponent(targetGroup)}&courseCode=${selectedCourse}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCurriculums(data);
      }
    } catch (e) {
      console.error('Error fetching curriculums:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedMajor && targetGroup) {
      fetchCurriculums();
    }
  }, [selectedMajor, targetGroup, selectedCourse]);

  const handleOpenEditModal = (sub) => {
    let deptId = sub.departmentId;
    if (!deptId && sub.departmentName && departments.length > 0) {
      const matchedDept = departments.find(d => d.name === sub.departmentName);
      if (matchedDept) deptId = matchedDept.id;
    }
    setEditingSubject({
      id: sub.id,
      subjectId: sub.subjectId,
      subjectCode: sub.subjectCode || '',
      subjectName: sub.subjectName || '',
      credits: sub.credits || 3,
      semester: sub.semester || 1,
      departmentId: deptId || (departments.length > 0 ? departments[0].id : ''),
      type: sub.type || (sub.subjectCode?.startsWith('TN') ? 'MON_THI_TOT_NGHIEP' : 'MON_HOC_PHAN'),
      isCompulsory: sub.isCompulsory !== undefined ? sub.isCompulsory : true
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingSubject?.subjectName?.trim() || !editingSubject?.subjectCode?.trim()) {
      alert('Vui lòng nhập đầy đủ Mã môn và Tên môn học!');
      return;
    }
    setEditSaving(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/v1/curriculums/subjects/${editingSubject.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          curriculumId: activeCurriculum?.id,
          majorCode: selectedMajor,
          courseCode: selectedCourse,
          targetGroup: targetGroup,
          subjectId: editingSubject.subjectId,
          subjectCode: editingSubject.subjectCode.trim().toUpperCase(),
          subjectName: editingSubject.subjectName.trim(),
          credits: parseInt(editingSubject.credits, 10) || 3,
          semester: parseInt(editingSubject.semester, 10) || 1,
          departmentId: editingSubject.departmentId ? parseInt(editingSubject.departmentId, 10) : null,
          type: editingSubject.type,
          isCompulsory: editingSubject.isCompulsory
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsEditModalOpen(false);
        setFeedbackMsg({ type: 'success', text: data.message || 'Đã cập nhật môn học trong khung chương trình thành công!' });
        setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 5000);
        await fetchCurriculums();
      } else {
        alert(data.message || 'Lỗi khi cập nhật môn học');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ khi lưu môn học');
    } finally {
      setEditSaving(false);
    }
  };

  const handleOpenAddModal = () => {
    fetchAvailableSubjects();
    setNewSubjectData({
      subjectCode: '',
      subjectName: '',
      credits: 3,
      semester: 1,
      departmentId: departments[0]?.id || '',
      type: 'MON_HOC_PHAN',
      isCompulsory: true
    });
    setSelectedExistingSubjectId('');
    setExistingSubjectSearch('');
    setAddTab('new');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    let payload = {
      curriculumId: activeCurriculum?.id,
      majorCode: selectedMajor,
      courseCode: selectedCourse,
      targetGroup: targetGroup,
      semester: parseInt(newSubjectData.semester, 10) || 1,
      isCompulsory: newSubjectData.isCompulsory
    };

    if (addTab === 'new') {
      if (!newSubjectData.subjectCode?.trim() || !newSubjectData.subjectName?.trim()) {
        alert('Vui lòng nhập đầy đủ Mã môn và Tên môn học!');
        return;
      }
      payload = {
        ...payload,
        subjectCode: newSubjectData.subjectCode.trim().toUpperCase(),
        subjectName: newSubjectData.subjectName.trim(),
        credits: parseInt(newSubjectData.credits, 10) || 3,
        departmentId: newSubjectData.departmentId ? parseInt(newSubjectData.departmentId, 10) : null,
        type: newSubjectData.type
      };
    } else {
      if (!selectedExistingSubjectId) {
        alert('Vui lòng chọn một môn học từ danh mục!');
        return;
      }
      payload = {
        ...payload,
        subjectId: parseInt(selectedExistingSubjectId, 10)
      };
    }

    setAddSaving(true);
    try {
      const res = await fetch('/api/v1/curriculums/subjects', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAddModalOpen(false);
        setFeedbackMsg({ type: 'success', text: data.message || 'Đã thêm môn học vào khung chương trình thành công!' });
        setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 5000);
        await fetchCurriculums();
      } else {
        alert(data.message || 'Không thể thêm môn học vào khung chương trình');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ khi thêm môn học');
    } finally {
      setAddSaving(false);
    }
  };

  const handleDeleteSubject = (sub) => {
    setDeleteConfirmDialog({
      isOpen: true,
      subject: sub,
      loading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDialog.subject) return;
    const sub = deleteConfirmDialog.subject;
    setDeleteConfirmDialog(prev => ({ ...prev, loading: true }));
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const params = new URLSearchParams({
        curriculumId: activeCurriculum?.id || '',
        majorCode: selectedMajor || '',
        courseCode: selectedCourse || '',
        subjectId: sub.subjectId || sub.id || ''
      });
      const res = await fetch(`/api/v1/curriculums/subjects/${sub.id}?${params.toString()}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDeleteConfirmDialog({ isOpen: false, subject: null, loading: false });
        setFeedbackMsg({ type: 'success', text: data.message || 'Đã xóa môn học khỏi khung chương trình thành công!' });
        setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 5000);
        await fetchCurriculums();
      } else {
        alert(data.message || 'Lỗi khi xóa môn học khỏi khung chương trình');
        setDeleteConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ khi xóa môn học');
      setDeleteConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSelectTargetGroup = (code) => {
    setTargetGroup(code);
    const cleanKey = code.startsWith('SQDB') ? 'SQDB' : code;
    const defaultMajor = TARGET_GROUP_DEFAULT_MAJORS[code] || TARGET_GROUP_DEFAULT_MAJORS[cleanKey];
    if (defaultMajor && majors.some(m => m.code === defaultMajor)) {
      setSelectedMajor(defaultMajor);
    } else {
      const allowedMajors = TARGET_GROUP_MAJORS[code] || TARGET_GROUP_MAJORS[cleanKey] || [];
      const firstAvailable = majors.find(m => allowedMajors.includes(m.code));
      if (firstAvailable) {
        setSelectedMajor(firstAvailable.code);
      } else if (majors.length > 0) {
        setSelectedMajor(majors[0].code);
      }
    }
  };

  const activeCurriculum = curriculums.length > 0 ? curriculums[0] : null;
  const allSubjects = activeCurriculum?.subjects || [];

  const cleanGroupKey = targetGroup?.startsWith('SQDB') ? 'SQDB' : targetGroup;
  const relevantMajorCodes = TARGET_GROUP_MAJORS[targetGroup] || TARGET_GROUP_MAJORS[cleanGroupKey] || [];
  const relevantMajors = majors.filter(m => relevantMajorCodes.includes(m.code));
  const otherMajors = majors.filter(m => !relevantMajorCodes.includes(m.code));

  const filteredSubjects = allSubjects.filter(sub => {
    if (filterType === 'ALL') return true;
    return sub.type === filterType;
  });

  const countHocPhan = allSubjects.filter(s => s.type === 'MON_HOC_PHAN').length;
  const countThiTN = allSubjects.filter(s => s.type === 'MON_THI_TOT_NGHIEP').length;
  const totalCredits = allSubjects.reduce((acc, s) => acc + (s.credits || 0), 0);
  const totalHours = allSubjects.reduce((acc, s) => acc + (s.hours || s.credits * 15 || 0), 0);

  const handleUploadExcel = async (e) => {
    e.preventDefault();
    if (!importFile) {
      setImportStatus({ type: 'error', text: 'Vui lòng chọn file Excel để tải lên' });
      return;
    }

    setUploading(true);
    setImportStatus({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('courseCode', selectedCourse);

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`/api/v1/curriculums/import-excel?courseCode=${selectedCourse}`, {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportStatus({
          type: 'success',
          text: data.message || `Đã import thành công ${data.importedCount} môn học vào Lộ trình đào tạo khóa ${selectedCourse}!`
        });
        setTimeout(() => {
          setIsImportModalOpen(false);
          fetchCurriculums();
        }, 1500);
      } else {
        setImportStatus({
          type: 'error',
          text: data.message || 'Lỗi khi nhập dữ liệu từ file Excel'
        });
      }
    } catch (e) {
      setImportStatus({
        type: 'error',
        text: 'Lỗi kết nối máy chủ khi tải lên file'
      });
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="glass-panel p-6 bg-white border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-amber-600 to-yellow-600 text-white rounded-xl shadow-md">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-military text-xl font-bold text-slate-900">
                LỘ TRÌNH ĐÀO TẠO & KHUNG NỘI DUNG THI QUÂN SỰ
              </h2>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Quản lý chuẩn hóa danh mục môn học huấn luyện và các nội dung thi tốt nghiệp theo từng Đối tượng và Chuyên ngành
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`/api/v1/curriculums/export-template?majorCode=${selectedMajor}&targetGroup=${targetGroup}&courseCode=${selectedCourse}`}
              download
              className="btn btn-secondary btn-sm flex items-center gap-2 shadow-sm text-slate-700 bg-white hover:bg-slate-50 border-slate-300 font-bold"
              title="Tải về file Excel mẫu chuẩn đã được minh họa sẵn danh sách môn học và thi tốt nghiệp của chuyên ngành này"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Xuất File Excel Mẫu</span>
            </a>

            {isPrivileged && (
              <>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                  title="Thêm môn học mới hoặc nội dung thi vào khung chương trình đào tạo"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Môn Vào Khung</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="btn btn-secondary btn-sm flex items-center gap-2 shadow-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border-slate-300"
                  title="Tải lên file Excel khung chương trình đào tạo để cập nhật vào hệ thống (Quyền PĐT / BGH)"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Import Lộ Trình (Excel)</span>
                </button>
              </>
            )}
          </div>
        </div>

        {feedbackMsg.text && (
          <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-xs mt-3 ${
            feedbackMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {!isPrivileged && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-xl flex items-center gap-2.5 font-medium shadow-xs mt-3">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span><strong>Chế độ Tra cứu Lộ trình đào tạo:</strong> Khung chương trình đào tạo do Phòng Đào Tạo và Ban Giám Hiệu quy định và quản lý. Các đơn vị và giáo viên chỉ xem để huấn luyện theo đúng kế hoạch.</span>
          </div>
        )}
      </div>

      {/* Target Group & Major Selection Bar */}
      <div className="glass-panel p-5 bg-white border border-slate-200 space-y-4">
        {/* Row 1: Target Groups */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="form-label text-xs font-bold text-slate-800 mb-0">
              1. Chọn Đối tượng đào tạo ({targetGroups.length} đối tượng)
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {targetGroups.map((tg) => {
              const active = targetGroup === tg.code;
              return (
                <div
                  key={tg.code}
                  onClick={() => handleSelectTargetGroup(tg.code)}
                  className={`relative group p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    active
                      ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <h4 className={`text-xs font-bold leading-tight ${active ? 'text-amber-900' : 'text-slate-900'}`}>
                      {tg.name}
                    </h4>
                    {active && <Shield className="w-4 h-4 text-amber-600 shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <p className="text-[10px] text-slate-500">{tg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: Major, Course Year & Filter Controls */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="form-label text-[11px] mb-1">
                2. Chọn Chuyên ngành đào tạo
              </label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="form-input text-xs font-bold text-slate-900 min-w-[280px]"
                style={{ cursor: 'pointer' }}
              >
                {relevantMajors.length > 0 ? (
                  <>
                    <optgroup label={`Chuyên ngành thuộc đối tượng ${targetGroup}`}>
                      {relevantMajors.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.code} - {m.name}
                        </option>
                      ))}
                    </optgroup>
                    {otherMajors.length > 0 && (
                      <optgroup label="Tất cả chuyên ngành khác">
                        {otherMajors.map((m) => (
                          <option key={m.code} value={m.code}>
                            {m.code} - {m.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                ) : majors.length > 0 ? (
                  majors.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.code} - {m.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="TSBB">TSBB - Trinh sát Bộ binh</option>
                    <option value="COI">COI - Súng Cối 82mm</option>
                    <option value="DKZ">DKZ - Súng ĐKZ (82-K65, SPG-9)</option>
                    <option value="PK127">PK127 - Súng máy Phòng không 12,7mm</option>
                    <option value="BB">BB - Binh chủng Hợp thành (Bộ binh)</option>
                    <option value="PB">PB - Pháo binh</option>
                    <option value="TT">TT - Thông tin Kỹ thuật</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="form-label text-[11px] mb-1">
                3. Năm huấn luyện áp dụng
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="form-input text-xs font-bold text-slate-900 min-w-[240px]"
                style={{ cursor: 'pointer' }}
              >
                {courseOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-[11px] mb-1">
                Lọc Môn học / Nội dung thi
              </label>
              <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-1 gap-1">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả ({allSubjects.length})
                </button>
                <button
                  onClick={() => setFilterType('MON_HOC_PHAN')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    filterType === 'MON_HOC_PHAN' ? 'bg-emerald-700 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  Học phần ({countHocPhan})
                </button>
                <button
                  onClick={() => setFilterType('MON_THI_TOT_NGHIEP')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    filterType === 'MON_THI_TOT_NGHIEP' ? 'bg-amber-600 text-white shadow-sm font-bold' : 'text-slate-600 hover:text-amber-800'
                  }`}
                >
                  Thi tốt nghiệp ({countThiTN})
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={fetchCurriculums}
            className="btn btn-secondary btn-sm"
            title="Tải lại danh sách môn học"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tổng số nội dung</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{allSubjects.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">môn học và môn thi</p>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Môn học phần</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-1.5">{countHocPhan}</p>
          <p className="text-[11px] text-slate-500 mt-1">huấn luyện toàn khóa</p>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Môn thi tốt nghiệp</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-1.5">{countThiTN}</p>
          <p className="text-[11px] text-slate-500 mt-1">Chính trị, Quân sự & Chuyên ngành</p>
        </div>

        <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Khối lượng đào tạo</span>
            <Compass className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1.5">{totalCredits} <span className="text-sm font-normal text-slate-500">tín chỉ</span></p>
          <p className="text-[11px] text-slate-500 mt-1">tương đương {totalHours} tiết quy đổi</p>
        </div>
      </div>

      {/* Main Table: Subjects & Exam Roadmap */}
      <div className="glass-panel overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            Chi tiết Khung Chương trình Môn học & Nội dung Thi ({filteredSubjects.length} mục)
          </h3>
          <span className="text-xs text-slate-600 font-semibold">
            Khóa áp dụng: <strong className="text-amber-700">{activeCurriculum?.courseName || (selectedCourse === 'ALL' ? 'Tất cả các năm áp dụng' : `Khung huấn luyện năm ${selectedCourse}`)}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <th className="p-3 text-center w-12">TT</th>
                <th className="p-3">Mã Môn / Mã Thi</th>
                <th className="p-3 min-w-[220px]">Tên Môn học / Nội dung Kiểm tra, Thi</th>
                <th className="p-3 text-center">Phân loại</th>
                <th className="p-3 text-center">Tín chỉ / Tiết</th>
                <th className="p-3">Hình thức Thi / Đánh giá</th>
                <th className="p-3 text-center">Hệ số</th>
                <th className="p-3">Khoa / Đơn vị Phụ trách</th>
                {isPrivileged && (
                  <th className="p-3 text-center w-28">Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={isPrivileged ? 9 : 8} className="p-8 text-center text-slate-500 text-xs italic">
                    Chưa có môn học nào trong lộ trình này. Hãy nhấn nút "Thêm Môn Vào Khung" hoặc "Import Lộ Trình (Excel)" để khởi tạo.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((sub, idx) => {
                  const isGradExam = sub.type === 'MON_THI_TOT_NGHIEP';
                  return (
                    <tr
                      key={sub.id || idx}
                      className={`transition hover:bg-slate-50 ${
                        isGradExam
                          ? 'bg-amber-50/40 border-l-4 border-l-amber-500'
                          : ''
                      }`}
                    >
                      <td className="p-3 text-center text-xs text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3 font-mono text-xs font-bold text-amber-800">
                        {sub.subjectCode}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {sub.subjectName}
                      </td>
                      <td className="p-3 text-center">
                        {isGradExam ? (
                          <span className="badge badge-warning text-[10px]">
                            <Award className="w-3 h-3" />
                            Thi tốt nghiệp
                          </span>
                        ) : (
                          <span className="badge badge-success text-[10px]">
                            Học phần
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-xs text-slate-700 font-mono">
                        <strong>{sub.credits} TC</strong> <span className="text-slate-500">({sub.hours || sub.credits * 15} tiết)</span>
                      </td>
                      <td className="p-3 text-xs text-slate-600">
                        {sub.examFormat || 'Lý thuyết & Thao trường'}
                      </td>
                      <td className="p-3 text-center font-mono text-xs font-bold text-amber-700">
                        {sub.weight || (isGradExam ? 2.0 : 1.0)}
                      </td>
                      <td className="p-3 text-xs text-slate-600 font-medium">
                        {sub.departmentName || 'Khoa Binh chủng'}
                      </td>
                      {isPrivileged && (
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(sub)}
                              className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                              title="Chỉnh sửa thông tin môn học trong khung"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubject(sub)}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                              title="Xóa môn học này khỏi khung chương trình"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL IMPORT LỘ TRÌNH TỪ EXCEL */}
      {isImportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImportModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '520px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700">
                <FileSpreadsheet className="w-6 h-6" />
                <h3 className="font-military text-lg font-bold text-slate-900">Import File Lộ Trình & Môn Thi</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="btn btn-icon btn-secondary btn-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 mb-4 space-y-2">
              <p>
                ℹ️ File tải lên cần tuân thủ cấu trúc định dạng chuẩn của nhà trường (chứa danh sách mã môn, tên môn, tín chỉ, số tiết, phân loại và hình thức thi).
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Chưa có file mẫu chuẩn?</span>
                <a
                  href={`/api/v1/curriculums/export-template?majorCode=${selectedMajor}&targetGroup=${targetGroup}&courseCode=${selectedCourse}`}
                  download
                  className="text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải file mẫu Excel ({selectedMajor} - {targetGroup} - {selectedCourse})
                </a>
              </div>
            </div>

            {importStatus.text && (
              <div className={`alert ${importStatus.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 text-xs font-semibold`}>
                {importStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{importStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleUploadExcel}>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-600 transition cursor-pointer bg-slate-50 mb-4">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="curriculum-file-input"
                />
                <label htmlFor="curriculum-file-input" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    {importFile ? importFile.name : 'Nhấp để chọn file Excel (.xlsx / .xls)'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Hỗ trợ Microsoft Excel .xlsx, .xls</p>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={uploading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Đang nạp dữ liệu...' : 'Bắt đầu Import Lộ Trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA MÔN HỌC TRONG KHUNG */}
      {isEditModalOpen && editingSubject && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '580px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-blue-700">
                <Pencil className="w-5 h-5" />
                <h3 className="font-military text-lg font-bold text-slate-900">
                  Điều Chỉnh Môn Học Trong Khung
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-icon btn-secondary btn-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Mã môn / Mã thi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingSubject.subjectCode}
                    onChange={(e) => setEditingSubject({ ...editingSubject, subjectCode: e.target.value.toUpperCase() })}
                    placeholder="VD: QS101, TN01"
                    className="form-input text-xs font-mono font-bold w-full uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Phân loại nội dung
                  </label>
                  <select
                    value={editingSubject.type}
                    onChange={(e) => setEditingSubject({ ...editingSubject, type: e.target.value })}
                    className="form-input text-xs font-semibold w-full cursor-pointer"
                  >
                    <option value="MON_HOC_PHAN">Môn Học phần (Huấn luyện)</option>
                    <option value="MON_THI_TOT_NGHIEP">Môn Thi tốt nghiệp (Chính trị, Quân sự, Chuyên ngành)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 mb-1">
                  Tên môn học / Nội dung kiểm tra, thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingSubject.subjectName}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectName: e.target.value })}
                  placeholder="VD: Bắn súng tiểu liên AK bài 1"
                  className="form-input text-xs font-semibold w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Số tín chỉ
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editingSubject.credits}
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value, 10) || 1 })}
                    className="form-input text-xs font-mono font-bold w-full"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    = {(editingSubject.credits || 0) * 15} tiết quy đổi
                  </p>
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Học kỳ
                  </label>
                  <select
                    value={editingSubject.semester}
                    onChange={(e) => setEditingSubject({ ...editingSubject, semester: parseInt(e.target.value, 10) || 1 })}
                    className="form-input text-xs font-semibold w-full cursor-pointer"
                  >
                    <option value={1}>Học kỳ 1</option>
                    <option value={2}>Học kỳ 2</option>
                    <option value={3}>Học kỳ 3</option>
                    <option value={4}>Học kỳ 4</option>
                  </select>
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Tính chất
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editingSubject.isCompulsory}
                      onChange={(e) => setEditingSubject({ ...editingSubject, isCompulsory: e.target.checked })}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>Bắt buộc</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="form-label text-xs font-bold text-slate-700 mb-1">
                  Khoa / Đơn vị phụ trách giảng dạy
                </label>
                <select
                  value={editingSubject.departmentId || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, departmentId: e.target.value ? parseInt(e.target.value, 10) : '' })}
                  className="form-input text-xs font-semibold w-full cursor-pointer"
                >
                  <option value="">-- Mặc định theo Chuyên ngành --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary text-xs"
                  disabled={editSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs flex items-center gap-1.5 font-bold"
                  disabled={editSaving}
                >
                  {editSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Lưu Điều Chỉnh</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM MÔN VÀO KHUNG */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-panel" style={{ maxWidth: '600px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-emerald-700">
                <Plus className="w-5 h-5" />
                <h3 className="font-military text-lg font-bold text-slate-900">
                  Thêm Môn Học Vào Khung Chương Trình
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-icon btn-secondary btn-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs: Môn mới vs Môn có sẵn */}
            <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1 mb-4">
              <button
                type="button"
                onClick={() => setAddTab('new')}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition cursor-pointer ${
                  addTab === 'new'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Khởi tạo môn mới
              </button>
              <button
                type="button"
                onClick={() => setAddTab('existing')}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition cursor-pointer ${
                  addTab === 'existing'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chọn từ danh mục có sẵn ({availableSubjects.length} môn)
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              {addTab === 'new' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Mã môn / Mã thi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newSubjectData.subjectCode}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, subjectCode: e.target.value.toUpperCase() })}
                        placeholder="VD: QS107, TN04"
                        className="form-input text-xs font-mono font-bold w-full uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Phân loại nội dung
                      </label>
                      <select
                        value={newSubjectData.type}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, type: e.target.value })}
                        className="form-input text-xs font-semibold w-full cursor-pointer"
                      >
                        <option value="MON_HOC_PHAN">Môn Học phần (Huấn luyện)</option>
                        <option value="MON_THI_TOT_NGHIEP">Môn Thi tốt nghiệp (Chính trị, Quân sự, Chuyên ngành)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Tên môn học / Nội dung kiểm tra, thi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newSubjectData.subjectName}
                      onChange={(e) => setNewSubjectData({ ...newSubjectData, subjectName: e.target.value })}
                      placeholder="VD: Kỹ thuật đào bới công sự và ngụy trang"
                      className="form-input text-xs font-semibold w-full"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Số tín chỉ
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={newSubjectData.credits}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, credits: parseInt(e.target.value, 10) || 1 })}
                        className="form-input text-xs font-mono font-bold w-full"
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        = {(newSubjectData.credits || 0) * 15} tiết quy đổi
                      </p>
                    </div>

                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Học kỳ áp dụng
                      </label>
                      <select
                        value={newSubjectData.semester}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, semester: parseInt(e.target.value, 10) || 1 })}
                        className="form-input text-xs font-semibold w-full cursor-pointer"
                      >
                        <option value={1}>Học kỳ 1</option>
                        <option value={2}>Học kỳ 2</option>
                        <option value={3}>Học kỳ 3</option>
                        <option value={4}>Học kỳ 4</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Tính chất
                      </label>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={newSubjectData.isCompulsory}
                          onChange={(e) => setNewSubjectData({ ...newSubjectData, isCompulsory: e.target.checked })}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span>Bắt buộc</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Khoa / Đơn vị phụ trách
                    </label>
                    <select
                      value={newSubjectData.departmentId || ''}
                      onChange={(e) => setNewSubjectData({ ...newSubjectData, departmentId: e.target.value ? parseInt(e.target.value, 10) : '' })}
                      className="form-input text-xs font-semibold w-full cursor-pointer"
                    >
                      <option value="">-- Chọn khoa/bộ môn phụ trách --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Tìm kiếm môn học có sẵn
                    </label>
                    <div className="relative mb-2">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={existingSubjectSearch}
                        onChange={(e) => setExistingSubjectSearch(e.target.value)}
                        placeholder="Tìm theo mã hoặc tên môn học..."
                        className="form-input text-xs pl-9 w-full"
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                      {availableSubjects
                        .filter(s => {
                          if (!existingSubjectSearch) return true;
                          const q = existingSubjectSearch.toLowerCase();
                          return s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q);
                        })
                        .map((s) => {
                          const isSelected = String(selectedExistingSubjectId) === String(s.id);
                          const isAlreadyInCurriculum = allSubjects.some(sub => sub.subjectCode === s.code);
                          return (
                            <div
                              key={s.id}
                              onClick={() => !isAlreadyInCurriculum && setSelectedExistingSubjectId(s.id)}
                              className={`p-2.5 text-xs flex items-center justify-between cursor-pointer transition ${
                                isSelected
                                  ? 'bg-emerald-50 border-l-4 border-l-emerald-600 text-emerald-900 font-bold'
                                  : isAlreadyInCurriculum
                                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                                  : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                                  {s.code}
                                </span>
                                <span className="font-semibold">{s.name}</span>
                                <span className="text-slate-500 font-mono text-[11px]">({s.credits} TC)</span>
                              </div>
                              <div>
                                {isAlreadyInCurriculum ? (
                                  <span className="text-[10px] text-slate-400 italic">Đã có trong khung</span>
                                ) : isSelected ? (
                                  <Check className="w-4 h-4 text-emerald-700" />
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Học kỳ áp dụng
                      </label>
                      <select
                        value={newSubjectData.semester}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, semester: parseInt(e.target.value, 10) || 1 })}
                        className="form-input text-xs font-semibold w-full cursor-pointer"
                      >
                        <option value={1}>Học kỳ 1</option>
                        <option value={2}>Học kỳ 2</option>
                        <option value={3}>Học kỳ 3</option>
                        <option value={4}>Học kỳ 4</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label text-xs font-bold text-slate-700 mb-1">
                        Tính chất
                      </label>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-semibold text-slate-800">
                        <input
                          type="checkbox"
                          checked={newSubjectData.isCompulsory}
                          onChange={(e) => setNewSubjectData({ ...newSubjectData, isCompulsory: e.target.checked })}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                        />
                        <span>Bắt buộc</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary text-xs"
                  disabled={addSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs flex items-center gap-1.5 font-bold bg-emerald-700 hover:bg-emerald-800"
                  disabled={addSaving}
                >
                  {addSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang thêm...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm Vào Khung</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA MÔN KHỎI KHUNG */}
      {deleteConfirmDialog.isOpen && deleteConfirmDialog.subject && (
        <div className="modal-overlay" onClick={() => !deleteConfirmDialog.loading && setDeleteConfirmDialog({ isOpen: false, subject: null, loading: false })}>
          <div className="modal-panel" style={{ maxWidth: '480px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-military text-base font-bold text-slate-900">
                  Xóa Môn Học Khỏi Khung Chương Trình
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xác nhận gỡ bỏ môn học khỏi lộ trình đào tạo hiện tại
                </p>
              </div>
            </div>

            <div className="bg-red-50/70 border border-red-200 rounded-xl p-3.5 text-xs text-red-900 mb-4 space-y-1.5">
              <p className="font-semibold">
                Đồng chí có chắc chắn muốn xóa môn học sau khỏi khung chương trình?
              </p>
              <div className="bg-white/80 p-2.5 rounded-lg border border-red-200 text-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] border border-amber-200">
                    {deleteConfirmDialog.subject.subjectCode}
                  </span>
                  <span className="font-bold">{deleteConfirmDialog.subject.subjectName}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3">
                  <span>Khối lượng: <strong>{deleteConfirmDialog.subject.credits} TC</strong></span>
                  <span>Khoa: <strong>{deleteConfirmDialog.subject.departmentName || 'Khoa Binh chủng'}</strong></span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic pt-1">
                ℹ️ Thao tác này chỉ gỡ môn học khỏi khung đào tạo của chuyên ngành này. Dữ liệu điểm của các lớp học viên đã hoàn thành môn học trước đó vẫn được lưu giữ an toàn.
              </p>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmDialog({ isOpen: false, subject: null, loading: false })}
                className="btn btn-secondary text-xs"
                disabled={deleteConfirmDialog.loading}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn btn-danger text-xs flex items-center gap-1.5 font-bold"
                disabled={deleteConfirmDialog.loading}
              >
                {deleteConfirmDialog.loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xác Nhận Xóa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
