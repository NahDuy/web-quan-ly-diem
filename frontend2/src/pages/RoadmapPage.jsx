import React, { useState } from 'react';
import { Compass, Upload, FileText, Download, Trash2, CheckCircle2, FileSpreadsheet } from 'lucide-react';

const CLASS_OPTIONS = [
  { value: 1, label: 'SQDB2026-HT1 (Lớp SQDB 2026 - Binh chủng Hợp thành 1)' },
  { value: 2, label: 'SQDB2026-PB1 (Lớp SQDB 2026 - Pháo binh 1)' },
  { value: 3, label: 'SQDB2026-TT1 (Lớp SQDB 2026 - Thông tin Kỹ thuật 1)' },
  { value: 4, label: 'SQDB2025-HT1 (Lớp SQDB 2025 - Binh chủng Hợp thành 1)' },
  { value: 5, label: 'SQDB2024-HT1 (Lớp SQDB 2024 - Binh chủng Hợp thành 1)' },
];

export default function RoadmapPage() {
  const [selectedClass, setSelectedClass] = useState(1);
  const [files, setFiles]                 = useState([]);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [msg, setMsg]                     = useState('');

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) { alert('Vui lòng chọn file khung chương trình đào tạo'); return; }
    setUploading(true);
    setTimeout(() => {
      const newFile = {
        id: Date.now(),
        name: selectedFile.name,
        uploadedAt: new Date().toLocaleString('vi-VN'),
        uploadedBy: 'Thượng úy Nguyễn Văn Giảng',
        size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: selectedFile.name.endsWith('.pdf') ? 'pdf' : 'excel',
      };
      setFiles([newFile, ...files]);
      setSelectedFile(null);
      setUploading(false);
      setMsg('Đã tải lên file khung chương trình đào tạo thành công!');
      setTimeout(() => setMsg(''), 3500);
    }, 600);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa file khung chương trình đào tạo này?')) {
      setFiles(files.filter((f) => f.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(2,132,199,0.1)', borderRadius: '14px', border: '1px solid rgba(2,132,199,0.3)' }}>
            <Compass size={28} style={{ color: '#0284c7' }} />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem' }}>Quản lý Khung Chương trình Đào tạo Từng Lớp</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Tải lên và lưu trữ các file tài liệu khung chương trình (PDF, Word, Excel) cho từng lớp học
            </p>
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="select-class-roadmap">Chọn Lớp / Đại đội</label>
          <select
            id="select-class-roadmap"
            value={selectedClass}
            onChange={(e) => setSelectedClass(parseInt(e.target.value))}
            className="form-input"
            style={{ minWidth: '280px', fontSize: '0.8rem' }}
          >
            {CLASS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {msg && (
        <div className="alert alert-success">
          <CheckCircle2 size={16} style={{ color: '#15803d' }} /> {msg}
        </div>
      )}

      {/* Upload form */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '0.95rem' }}>
          <Upload size={18} style={{ color: '#15803d' }} /> Tải lên File Khung Chương trình Đào tạo Lớp
        </h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <input type="file" accept=".pdf,.docx,.doc,.xlsx,.xls" onChange={handleFileChange} id="roadmap-file-input" className="sr-only" />
            <label
              htmlFor="roadmap-file-input"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', background: '#f8fafc', border: '1px dashed #cbd5e1',
                borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#15803d')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            >
              <span style={{ fontSize: '0.82rem', color: selectedFile ? '#0f172a' : '#64748b', fontWeight: 600 }}>
                {selectedFile ? selectedFile.name : 'Nhấp để chọn file khung chương trình (PDF, Word, Excel)...'}
              </span>
              <span className="btn btn-secondary btn-xs">Duyệt file</span>
            </label>
          </div>
          <button
            id="btn-upload-roadmap"
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
          >
            <Upload size={15} /> {uploading ? 'Đang tải lên...' : 'Tải lên Khung Chương trình'}
          </button>
        </form>
      </div>

      {/* File list */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
            <FileText size={16} style={{ color: '#b45309' }} />
            Danh sách File Chương trình Đào tạo Đã Tải lên
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{files.length} tài liệu</span>
        </div>

        <div>
          {files.map((file) => (
            <div
              key={file.id}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', transition: 'background 0.1s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  {file.type === 'pdf'
                    ? <FileText size={22} style={{ color: '#dc2626' }} />
                    : <FileSpreadsheet size={22} style={{ color: '#15803d' }} />}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{file.name}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                    Kích thước: <span style={{ color: '#334155' }}>{file.size}</span> |
                    Ngày tải: <span style={{ color: '#334155' }}>{file.uploadedAt}</span> |
                    Người tải: <span style={{ color: '#15803d', fontWeight: 600 }}>{file.uploadedBy}</span>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  id={`btn-download-file-${file.id}`}
                  onClick={() => alert('Đã tải xuống: ' + file.name)}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={13} style={{ color: '#0284c7' }} /> Tải về
                </button>
                <button
                  id={`btn-delete-file-${file.id}`}
                  onClick={() => handleDelete(file.id)}
                  className="btn btn-icon btn-sm"
                  title="Xóa tài liệu"
                  style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
