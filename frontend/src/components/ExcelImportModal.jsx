import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function ExcelImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  classId = 1,
  semester = 1,
  classCode = ''
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMsg({ type: 'error', text: 'Vui lòng chọn file Excel (.xlsx) trước khi tải lên' });
      return;
    }

    setUploading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(`/api/v1/classes/${classId || 1}/import-excel?semester=${semester || 1}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMsg({ type: 'success', text: 'Import file Excel điểm thành công!' });
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 1200);
      } else {
        setMsg({ type: 'error', text: data.message || 'Lỗi khi import file Excel' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Không thể tải file lên server' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg p-6 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-3 text-emerald-400">
          <FileSpreadsheet className="w-6 h-6" />
          <h3 className="text-lg font-bold text-white">
            Import File Excel Điểm {classCode ? `- Lớp ${classCode}` : ''}
          </h3>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 mb-4 space-y-1.5">
          <p>
            ℹ️ <strong className="text-emerald-300">Quy trình chuẩn:</strong> Danh sách môn học được tự động thiết lập từ <strong>Lộ trình Đào tạo</strong> của Chuyên ngành.
          </p>
          <p>
            Tải lên file Excel để cập nhật điểm học phần cho học viên của lớp theo đúng các cột môn học đã được tạo.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-700/60 mt-2">
            <span className="text-slate-400">Chưa có file mẫu chuẩn của lớp này?</span>
            <a
              href={`/api/v1/classes/${classId || 1}/export-excel?semester=${semester || 1}`}
              download
              className="text-yellow-400 hover:text-yellow-300 font-bold inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Tải file mẫu Excel lớp
            </a>
          </div>
        </div>

        {msg.text && (
          <div className={`p-3 rounded-lg text-xs mb-4 flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}>
            {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            {msg.text}
          </div>
        )}

        <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500/50 transition cursor-pointer bg-slate-950/50 mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="excel-file-input"
          />
          <label htmlFor="excel-file-input" className="cursor-pointer block">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-200">
              {file ? file.name : 'Nhấp để chọn file Excel (.xlsx)'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Định dạng hỗ trợ: Microsoft Excel .xlsx</p>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="btn-secondary" disabled={uploading}>
            Hủy
          </button>
          <button onClick={handleUpload} className="btn-primary bg-emerald-600 hover:bg-emerald-700" disabled={uploading}>
            {uploading ? 'Đang import...' : 'Bắt đầu Import'}
          </button>
        </div>

      </div>
    </div>
  );
}
