import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { matrixApi } from '../api';

export default function ExcelImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMsg({ type: 'error', text: 'Vui lòng chọn file Excel (.xlsx) trước khi tải lên' });
      return;
    }

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      await matrixApi.importExcel(1, file);
      setMsg({ type: 'success', text: 'Import file Excel và tạo ma trận lớp thành công!' });
      setTimeout(() => {
        onImportSuccess?.();
        onClose();
      }, 1200);
    } catch (err) {
      const errMsg = err?.response?.data?.message ?? 'Không thể tải file lên server';
      setMsg({ type: 'error', text: errMsg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth: '440px', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet size={22} style={{ color: '#15803d' }} />
            <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
              Import File Excel Ma trận Lớp
            </h3>
          </div>
          <button id="btn-close-import" onClick={onClose} className="btn btn-icon btn-secondary btn-sm">
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
          Tải lên file Excel mẫu chứa danh sách môn học và danh sách học viên lớp để tự động khởi tạo ma trận điểm.
        </p>

        {msg.text && (
          <div
            className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}
            style={{ marginBottom: '16px', fontSize: '0.8rem' }}
          >
            {msg.type === 'success'
              ? <CheckCircle size={16} style={{ color: '#15803d' }} />
              : <AlertCircle size={16} style={{ color: '#dc2626' }} />}
            {msg.text}
          </div>
        )}

        {/* Drop zone */}
        <div
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '32px 16px',
            textAlign: 'center',
            background: '#f8fafc',
            marginBottom: '16px',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#15803d'; e.currentTarget.style.background = '#f0fdf4'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
        >
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="sr-only"
            id="excel-file-input"
          />
          <label htmlFor="excel-file-input" style={{ cursor: 'pointer', display: 'block' }}>
            <Upload size={28} style={{ color: '#64748b', margin: '0 auto 8px' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
              {file ? file.name : 'Nhấp để chọn file Excel (.xlsx)'}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
              Định dạng hỗ trợ: Microsoft Excel .xlsx
            </p>
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            id="btn-cancel-import"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={uploading}
          >
            Hủy
          </button>
          <button
            id="btn-start-import"
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={uploading}
          >
            <Upload size={15} />
            {uploading ? 'Đang import...' : 'Bắt đầu Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
