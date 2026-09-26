import React, { useState, useEffect } from 'react';
import { Compass, Upload, Download, CheckCircle2, FileSpreadsheet, Plus, Shield, Award, BookOpen, AlertCircle, RefreshCw, X } from 'lucide-react';

const TARGET_GROUPS = [
  { code: 'SQDB', name: 'Sĩ quan Dự bị (SQDB)', desc: 'Thời gian 03 tháng' },
  { code: 'KHAU_DOI_TRUONG', name: 'Khẩu đội trưởng', desc: 'Thời gian 06 tháng' },
  { code: 'TIEU_DOI_TRUONG', name: 'Tiểu đội trưởng', desc: 'Thời gian 06 tháng' },
];

export default function CurriculumRoadmapView() {
  const [targetGroup, setTargetGroup] = useState('SQDB');
  const [selectedMajor, setSelectedMajor] = useState('TSBB');
  const [filterType, setFilterType] = useState('ALL'); // ALL, MON_HOC_PHAN, MON_THI_TOT_NGHIEP
  
  const [curriculums, setCurriculums] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    fetchCurriculums();
  }, [selectedMajor, targetGroup]);

  // Find active curriculum
  const activeCurriculum = curriculums.find(c => c.majorCode === selectedMajor) || curriculums[0];
  const allSubjects = activeCurriculum?.subjects || [];

  const filteredSubjects = allSubjects.filter(sub => {
    if (filterType === 'ALL') return true;
    return sub.type === filterType;
  });

  const totalCredits = allSubjects.reduce((sum, s) => sum + (s.credits || 0), 0);
  const totalHours = allSubjects.reduce((sum, s) => sum + (s.hours || (s.credits * 15) || 0), 0);
  const countHocPhan = allSubjects.filter(s => s.type === 'MON_HOC_PHAN').length;
  const countThiTN = allSubjects.filter(s => s.type === 'MON_THI_TOT_NGHIEP').length;

  const handleUploadExcel = async (e) => {
    e.preventDefault();
    if (!importFile) {
      setImportStatus({ type: 'error', text: 'Vui lòng chọn file Excel (.xlsx / .xls) trước khi tải lên' });
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
      <div className="glass-panel p-6 bg-slate-900 border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-xl shadow-lg border border-indigo-400/40">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-military-title text-xl font-bold text-yellow-300">
                LỘ TRÌNH ĐÀO TẠO & KHUNG NỘI DUNG THI QUÂN SỰ
              </h2>
              <p className="text-xs text-emerald-400">
                Quản lý chuẩn hóa danh mục môn học huấn luyện và các nội dung thi tốt nghiệp theo từng Đối tượng và Chuyên ngành
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-3">
            <a
              href={`/api/v1/curriculums/export-template?majorCode=${selectedMajor}&targetGroup=${targetGroup}`}
              download
              className="btn-secondary bg-slate-800 hover:bg-slate-700 border-slate-600 text-yellow-400 font-bold text-xs flex items-center gap-1.5 shadow-md"
              title="Tải về file Excel mẫu chuẩn đã được minh họa sẵn danh sách môn học và thi tốt nghiệp của chuyên ngành này"
            >
              <Download className="w-4 h-4 text-yellow-400" />
              Xuất File Excel Mẫu Chuẩn
            </a>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
              title="Tải lên file Excel khung chương trình đào tạo để cập nhật vào hệ thống"
            >
              <Upload className="w-4 h-4" />
              Import Lộ Trình (Excel)
            </button>
          </div>
        </div>
      </div>

      {/* Target Group & Major Selection Bar */}
      <div className="glass-panel p-5 bg-slate-900/90 border border-slate-700 space-y-4">
        {/* Row 1: Target Groups (SQDB, Khẩu đội trưởng, Tiểu đội trưởng) */}
        <div>
          <label className="block text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-2">
            1. Chọn Đối tượng đào tạo
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TARGET_GROUPS.map((tg) => {
              const active = targetGroup === tg.code;
              return (
                <button
                  key={tg.code}
                  onClick={() => setTargetGroup(tg.code)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    active
                      ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div>
                    <h4 className={`text-sm font-bold ${active ? 'text-yellow-300' : 'text-slate-200'}`}>
                      {tg.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{tg.desc}</p>
                  </div>
                  {active && <Shield className="w-5 h-5 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Major & Filter Controls */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-1">
                2. Chọn Chuyên ngành đào tạo
              </label>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500 min-w-[260px]"
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
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Lọc Môn học / Nội dung thi
              </label>
              <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    filterType === 'ALL' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tất cả ({allSubjects.length})
                </button>
                <button
                  onClick={() => setFilterType('MON_HOC_PHAN')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    filterType === 'MON_HOC_PHAN' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Học phần ({countHocPhan})
                </button>
                <button
                  onClick={() => setFilterType('MON_THI_TOT_NGHIEP')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    filterType === 'MON_THI_TOT_NGHIEP' ? 'bg-yellow-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thi tốt nghiệp ({countThiTN})
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={fetchCurriculums}
            className="btn-secondary self-end"
            title="Làm mới dữ liệu lộ trình"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tổng số nội dung</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1.5">{allSubjects.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">môn học và môn thi</p>
        </div>

        <div className="glass-panel p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Môn học phần</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1.5">{countHocPhan}</p>
          <p className="text-[11px] text-slate-400 mt-1">huấn luyện toàn khóa</p>
        </div>

        <div className="glass-panel p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Môn thi tốt nghiệp</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-1.5">{countThiTN}</p>
          <p className="text-[11px] text-slate-400 mt-1">Chính trị, Quân sự & Chuyên ngành</p>
        </div>

        <div className="glass-panel p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Khối lượng đào tạo</span>
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 mt-1.5">{totalCredits} <span className="text-sm font-normal text-slate-400">tín chỉ</span></p>
          <p className="text-[11px] text-slate-400 mt-1">tương đương {totalHours} tiết quy đổi</p>
        </div>
      </div>

      {/* Main Table: Subjects & Exam Roadmap */}
      <div className="glass-panel overflow-hidden rounded-xl border border-slate-700 shadow-2xl">
        <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-yellow-400" />
            Chi tiết Khung Chương trình Môn học & Nội dung Thi ({filteredSubjects.length} mục)
          </h3>
          <span className="text-xs text-slate-400">
            Khóa áp dụng: <strong className="text-yellow-400">{activeCurriculum?.courseName || 'SQDB 2026'}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/90 border-b border-slate-700 text-xs font-bold text-yellow-300 uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 text-xs italic">
                    Chưa có môn học nào trong lộ trình này. Hãy nhấn nút "Import Lộ Trình (Excel)" hoặc xuất file mẫu để khởi tạo.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((sub, idx) => {
                  const isGradExam = sub.type === 'MON_THI_TOT_NGHIEP';
                  return (
                    <tr
                      key={sub.id || idx}
                      className={`transition ${
                        isGradExam
                          ? 'bg-amber-950/20 hover:bg-amber-950/40 border-l-4 border-l-yellow-500'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-3 text-center text-xs text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3 font-mono text-xs font-bold text-yellow-300">
                        {sub.subjectCode}
                      </td>
                      <td className="p-3 font-bold text-slate-100">
                        {sub.subjectName}
                      </td>
                      <td className="p-3 text-center">
                        {isGradExam ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-yellow-300 border border-amber-500/40">
                            <Award className="w-3 h-3" />
                            Thi tốt nghiệp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Học phần
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-xs text-slate-300 font-mono">
                        <strong>{sub.credits} TC</strong> <span className="text-slate-500">({sub.hours || sub.credits * 15} tiết)</span>
                      </td>
                      <td className="p-3 text-center text-xs font-semibold text-slate-300">
                        Học kỳ {sub.semester || 1}
                      </td>
                      <td className="p-3 text-xs text-slate-300">
                        {sub.examFormat || 'Lý thuyết & Thao trường'}
                      </td>
                      <td className="p-3 text-center font-mono text-xs font-bold text-amber-300">
                        {sub.weight || (isGradExam ? 2.0 : 1.0)}
                      </td>
                      <td className="p-3 text-xs text-slate-400 font-semibold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg p-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl relative">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-3 text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Import File Lộ Trình & Môn Thi</h3>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3.5 text-xs text-slate-300 mb-4 space-y-2">
              <p>
                ℹ️ File tải lên cần tuân thủ cấu trúc định dạng chuẩn của nhà trường (chứa danh sách mã môn, tên môn, tín chỉ, học kỳ và phân loại môn thi tốt nghiệp).
              </p>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400">Chưa có file mẫu chuẩn?</span>
                <a
                  href={`/api/v1/curriculums/export-template?majorCode=${selectedMajor}&targetGroup=${targetGroup}`}
                  download
                  className="text-yellow-400 hover:text-yellow-300 font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Tải file mẫu Excel ({selectedMajor} - {targetGroup})
                </a>
              </div>
            </div>

            {importStatus.text && (
              <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/60 border border-red-500/40 text-red-300'
              }`}>
                {importStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                {importStatus.text}
              </div>
            )}

            <form onSubmit={handleUploadExcel}>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500/50 transition cursor-pointer bg-slate-950/50 mb-4">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="curriculum-file-input"
                />
                <label htmlFor="curriculum-file-input" className="cursor-pointer block">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-200">
                    {importFile ? importFile.name : 'Nhấp để chọn file Excel (.xlsx / .xls)'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Hỗ trợ Microsoft Excel .xlsx, .xls</p>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="btn-secondary"
                  disabled={uploading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary bg-emerald-600 hover:bg-emerald-700"
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
