import React, { useState } from 'react';
import { 
  Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X, 
  Sparkles, Layers, Users, ChevronDown, ChevronUp, ArrowRight, Shield
} from 'lucide-react';

const TRAINING_TARGETS = [
  { code: 'SQDB', name: 'Sĩ quan Dự bị (SQDB)', classPrefix: 'SQDB', studentPrefix: '26' },
  { code: 'TDT', name: 'Tiểu đội trưởng (TĐT)', classPrefix: 'TDT', studentPrefix: '26TDT-' },
  { code: 'KDT', name: 'Khẩu đội trưởng (KĐT)', classPrefix: 'KDT', studentPrefix: '26KDT-' },
  { code: 'NVKT', name: 'Nhân viên Kỹ thuật (NVKT)', classPrefix: 'NVKT', studentPrefix: '26NVKT-' },
  { code: 'HSQ', name: 'Hạ sĩ quan Chỉ huy (HSQCH)', classPrefix: 'HSQ', studentPrefix: '26HSQ-' }
];

export default function AdmissionsImportModal({ isOpen, onClose, onImportSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetType, setTargetType] = useState('SQDB');
  const [academicYear, setAcademicYear] = useState(2026);
  const [classNamingMode, setClassNamingMode] = useState('THEO_NAM');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewData(null);
      setErrorMsg('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMsg('Vui lòng chọn file Excel danh sách đầu vào (.xls hoặc .xlsx)');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('jwt_token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetType', targetType);
      formData.append('academicYear', academicYear);
      formData.append('classNamingMode', classNamingMode);

      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch('/api/v1/admissions/preview', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setPreviewData(data);
      } else {
        setErrorMsg(data.message || 'Lỗi khi phân tích file Excel');
      }
    } catch (err) {
      setErrorMsg('Không thể kết nối đến máy chủ để đọc file');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!previewData || !previewData.sections) return;

    setImporting(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const payload = {
        academicYear: previewData.academicYear,
        sections: previewData.sections
      };

      const res = await fetch('/api/v1/admissions/execute', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok) {
        setSuccessMsg(resData.message || 'Đã nạp thành công toàn bộ học viên và lớp học!');
        setTimeout(() => {
          onImportSuccess?.();
          onClose();
        }, 2200);
      } else {
        setErrorMsg(resData.message || 'Lỗi khi lưu dữ liệu học viên');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối máy chủ khi thực thi import');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-300 rounded-xl border border-yellow-500/40 shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-200 flex items-center gap-2 font-military-title">
                NHẬP DANH SÁCH HỌC VIÊN ĐẦU VÀO TỰ ĐỘNG
              </h3>
              <p className="text-xs text-emerald-400">
                Hỗ trợ SQDB, Khẩu đội trưởng, Tiểu đội trưởng — Tự động bóc tách lớp & sinh Mã HV
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 bg-red-950 border border-red-600 text-red-300 text-xs rounded-lg flex items-center gap-2 font-bold shadow-md">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 bg-emerald-950 border border-emerald-600 text-emerald-300 text-sm rounded-lg flex items-center gap-2.5 font-bold shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 animate-bounce" />
              {successMsg}
            </div>
          )}

          {/* Configuration Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            
            {/* Target Selection */}
            <div>
              <label className="block text-[11px] font-bold text-yellow-300 uppercase mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-yellow-400" />
                Đối tượng Đào tạo
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-yellow-400"
              >
                {TRAINING_TARGETS.map(t => (
                  <option key={t.code} value={t.code}>{t.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Quyết định tiền tố mã lớp và mã học viên</p>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-[11px] font-bold text-yellow-300 uppercase mb-1">
                Năm Đào tạo / Tuyển sinh
              </label>
              <input
                type="number"
                value={academicYear}
                onChange={(e) => setAcademicYear(parseInt(e.target.value) || 2026)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-yellow-200 font-mono font-bold focus:outline-none focus:border-yellow-400"
              />
              <p className="text-[10px] text-slate-500 mt-1">Ví dụ: 2026 (tiền tố sinh mã là "26")</p>
            </div>

            {/* Class Naming Scheme */}
            <div>
              <label className="block text-[11px] font-bold text-yellow-300 uppercase mb-1">
                Quy cách Đặt Mã Lớp
              </label>
              <select
                value={classNamingMode}
                onChange={(e) => setClassNamingMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-yellow-400"
              >
                <option value="THEO_NAM">Theo Năm (SQDB2026-TSBB1, TDT2026-BB1)</option>
                <option value="THEO_KHOA">Theo Số Khóa (K225-TSBB, K226-DKZ)</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Cấu trúc định danh bảng điểm</p>
            </div>

          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-700 hover:border-yellow-500/80 rounded-xl p-6 text-center bg-slate-950/60 transition group">
            <input
              type="file"
              accept=".xls, .xlsx"
              onChange={handleFileChange}
              id="admissions-file"
              className="hidden"
            />
            <label htmlFor="admissions-file" className="cursor-pointer block space-y-2">
              <div className="w-12 h-12 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-yellow-400 group-hover:scale-110 transition border border-slate-700">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-200">
                {selectedFile ? (
                  <span className="text-emerald-400 font-semibold">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                ) : (
                  'Nhấp để chọn file danh sách học viên đầu vào (.xls hoặc .xlsx)'
                )}
              </p>
              <p className="text-[11px] text-slate-500">
                Hệ thống tự động đọc cả file gốc gồm nhiều khóa, nhiều lớp (như file 795 dòng)
              </p>
            </label>

            {selectedFile && !previewData && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="btn-primary px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold rounded-lg shadow-lg flex items-center gap-2 mx-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  {analyzing ? 'Đang phân tích dữ liệu...' : 'Phân tích & Xem trước Dữ liệu'}
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {previewData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950 border border-emerald-500/40 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tổng số Học viên Tìm thấy</span>
                  <span className="text-2xl font-extrabold text-emerald-400">{previewData.totalStudents} đồng chí</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Số Khối / Lớp Phân tách</span>
                  <span className="text-2xl font-extrabold text-yellow-300">{previewData.totalSections} lớp</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Năm & Hệ Đào tạo</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {previewData.academicYear} — {TRAINING_TARGETS.find(t => t.code === targetType)?.name || targetType}
                  </span>
                </div>
              </div>

              {/* Sections Breakdown Accordion */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-yellow-400" />
                  Danh sách {previewData.sections.length} Lớp học bóc tách được:
                </h4>

                <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                  {previewData.sections.map((sec, idx) => {
                    const isExpanded = expandedSection === idx;
                    return (
                      <div key={idx} className="transition">
                        <div 
                          onClick={() => setExpandedSection(isExpanded ? null : idx)}
                          className="p-3.5 hover:bg-slate-900/80 cursor-pointer flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-yellow-300 font-mono text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-white flex items-center gap-2">
                                {sec.className}
                                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono">
                                  {sec.classCode}
                                </span>
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Chuyên ngành: <b className="text-yellow-300">{sec.majorName} ({sec.majorCode})</b> — {sec.studentCount} học viên
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                              <span className="text-[10px] text-slate-400 block">Dải Mã Học viên tự sinh:</span>
                              <span className="font-mono text-xs font-bold text-yellow-400">{sec.codeRange}</span>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Student Details Accordion Content */}
                        {isExpanded && (
                          <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2">
                            <p className="text-[11px] text-slate-400 font-bold uppercase">
                              Danh sách học viên lớp {sec.classCode} ({sec.students.length} đồng chí):
                            </p>
                            <div className="max-h-48 overflow-y-auto rounded border border-slate-800">
                              <table className="w-full text-left text-[11px]">
                                <thead className="bg-slate-950 text-slate-400 sticky top-0">
                                  <tr>
                                    <th className="p-2 w-10 text-center">STT</th>
                                    <th className="p-2 text-yellow-300 font-mono">Mã HV</th>
                                    <th className="p-2 font-bold text-white">Họ và tên</th>
                                    <th className="p-2">Ngày sinh</th>
                                    <th className="p-2">Quê quán</th>
                                    <th className="p-2">Đơn vị</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                  {sec.students.map((st) => (
                                    <tr key={st.stt} className="hover:bg-slate-800/30">
                                      <td className="p-2 text-center text-slate-500 font-mono">{st.stt}</td>
                                      <td className="p-2 font-mono font-bold text-yellow-400">{st.studentCode}</td>
                                      <td className="p-2 font-semibold text-white">{st.fullName}</td>
                                      <td className="p-2 text-slate-300">{st.dob}</td>
                                      <td className="p-2 text-slate-400">{st.pob}</td>
                                      <td className="p-2 text-slate-400">{st.unit}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-2 text-xs"
            disabled={importing}
          >
            Đóng
          </button>

          {previewData && (
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={importing}
              className="btn-primary px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {importing ? 'Đang nạp học viên vào hệ thống...' : `Xác nhận Lưu ${previewData.totalStudents} Học viên vào CSDL`}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}