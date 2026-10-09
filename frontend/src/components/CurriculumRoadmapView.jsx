import React, { useState, useEffect } from 'react';
import { Compass, Upload, Download, CheckCircle2, FileSpreadsheet, Shield, Award, BookOpen, AlertCircle, RefreshCw, X } from 'lucide-react';

const TARGET_GROUPS = [
  { code: 'SQDB', name: 'Sĩ quan Dự bị (SQDB)', desc: 'Thời gian 03 tháng' },
  { code: 'KHAU_DOI_TRUONG', name: 'Khẩu đội trưởng (KĐT)', desc: 'Thời gian 06 tháng' },
  { code: 'TIEU_DOI_TRUONG', name: 'Tiểu đội trưởng (TĐT)', desc: 'Thời gian 06 tháng' },
];

export default function CurriculumRoadmapView() {
  const [targetGroup, setTargetGroup] = useState('SQDB');
  const [selectedMajor, setSelectedMajor] = useState('TSBB');
  const [filterType, setFilterType] = useState('ALL'); // ALL, MON_HOC_PHAN, MON_THI_TOT_NGHIEP
  
  const [curriculums, setCurriculums] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importStatus, setImportStatus] = useState({ type: '', text: '' });

  const fetchMajors = async () => {
    try {
      const res = await fetch('/api/v1/majors');
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
      const res = await fetch(`/api/v1/curriculums?majorCode=${selectedMajor}&targetGroup=${targetGroup}`);
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
  }, []);

  useEffect(() => {
    if (selectedMajor && targetGroup) {
      fetchCurriculums();
    }
  }, [selectedMajor, targetGroup]);

  const activeCurriculum = curriculums.length > 0 ? curriculums[0] : null;
  const allSubjects = activeCurriculum?.subjects || [];

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

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch('/api/v1/curriculums/import-excel', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportStatus({
          type: 'success',
          text: data.message || `Đã import thành công ${data.importedCount} môn học vào Lộ trình đào tạo!`
        });
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportFile(null);
          setImportStatus({ type: '', text: '' });
          fetchCurriculums();
        }, 1500);
      } else {
        setImportStatus({ type: 'error', text: data.message || 'Lỗi khi import file Excel' });
      }
    } catch (err) {
      setImportStatus({ type: 'error', text: 'Không thể tải file lên máy chủ' });
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
          <div className="flex items-center space-x-2.5">
            <a
              href={`/api/v1/curriculums/export-template?majorCode=${selectedMajor}&targetGroup=${targetGroup}`}
              download
              className="btn btn-secondary btn-sm"
              title="Tải về file Excel mẫu chuẩn đã được minh họa sẵn danh sách môn học và thi tốt nghiệp của chuyên ngành này"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>Xuất File Excel Mẫu</span>
            </a>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn btn-primary btn-sm"
              title="Tải lên file Excel khung chương trình đào tạo để cập nhật vào hệ thống"
            >
              <Upload className="w-4 h-4" />
              <span>Import Lộ Trình (Excel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Group & Major Selection Bar */}
      <div className="glass-panel p-5 bg-white border border-slate-200 space-y-4">
        {/* Row 1: Target Groups (SQDB, Khẩu đội trưởng, Tiểu đội trưởng) */}
        <div>
          <label className="form-label text-[11px] mb-2">
            1. Chọn Đối tượng đào tạo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TARGET_GROUPS.map((tg) => {
              const active = targetGroup === tg.code;
              return (
                <button
                  key={tg.code}
                  onClick={() => setTargetGroup(tg.code)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    active
                      ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <h4 className={`text-sm font-bold ${active ? 'text-amber-900' : 'text-slate-900'}`}>
                      {tg.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{tg.desc}</p>
                  </div>
                  {active && <Shield className="w-5 h-5 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Major & Filter Controls */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="form-label text-[11px] mb-1">
                2. Chọn Chuyên ngành đào tạo
              </label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="form-input text-xs font-bold text-slate-900 min-w-[260px]"
                style={{ cursor: 'pointer' }}
              >
                {majors.length > 0 ? (
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
            Khóa áp dụng: <strong className="text-amber-700">{activeCurriculum?.courseName || 'SQDB 2026'}</strong>
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
                <th className="p-3 text-center">Học kỳ</th>
                <th className="p-3">Hình thức Thi / Đánh giá</th>
                <th className="p-3 text-center">Hệ số</th>
                <th className="p-3">Khoa / Đơn vị Phụ trách</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 text-xs italic">
                    Chưa có môn học nào trong lộ trình này. Hãy nhấn nút "Import Lộ Trình (Excel)" hoặc xuất file mẫu để khởi tạo.
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
                      <td className="p-3 text-center text-xs font-semibold text-slate-700">
                        Học kỳ {sub.semester || 1}
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
                ℹ️ File tải lên cần tuân thủ cấu trúc định dạng chuẩn của nhà trường (chứa danh sách mã môn, tên môn, tín chỉ, học kỳ và phân loại môn thi tốt nghiệp).
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Chưa có file mẫu chuẩn?</span>
                <a
                  href={`/api/v1/curriculums/export-template?majorCode=${selectedMajor}&targetGroup=${targetGroup}`}
                  download
                  className="text-amber-700 hover:text-amber-800 font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải file mẫu Excel ({selectedMajor} - {targetGroup})
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

    </div>
  );
}
