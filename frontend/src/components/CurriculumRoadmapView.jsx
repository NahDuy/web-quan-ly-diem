import React, { useState } from 'react';
import { Compass, Upload, FileText, Download, Trash2, CheckCircle2, FileSpreadsheet, FileCode, Plus } from 'lucide-react';

const INITIAL_MOCK_FILES = [
  {
    id: 1,
    name: 'Khung_Chuong_Trinh_Dao_Tao_CNTT1_K65.pdf',
    uploadedAt: '2026-03-01 09:30',
    uploadedBy: 'Đại tá Trần Văn Thủ',
    size: '2.4 MB',
    type: 'pdf'
  },
  {
    id: 2,
    name: 'Danh_Muc_Mon_Hoc_Huan_Luyen_Quan_Su_2026.xlsx',
    uploadedAt: '2026-03-02 14:15',
    uploadedBy: 'Thượng tá Lê Văn Bộ',
    size: '1.1 MB',
    type: 'excel'
  }
];

export default function CurriculumRoadmapView() {
  const [selectedClass, setSelectedClass] = useState(1);
  const [files, setFiles] = useState(INITIAL_MOCK_FILES);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadCurriculum = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Vui lòng chọn file khung chương trình đào tạo để tải lên');
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const newFileObj = {
        id: Date.now(),
        name: selectedFile.name,
        uploadedAt: new Date().toLocaleString('vi-VN'),
        uploadedBy: 'Thượng úy Nguyễn Văn Giảng',
        size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: selectedFile.name.endsWith('.pdf') ? 'pdf' : (selectedFile.name.endsWith('.xlsx') ? 'excel' : 'word')
      };

      setFiles([newFileObj, ...files]);
      setSelectedFile(null);
      setUploading(false);
      setMsg('Đã tải lên file khung chương trình đào tạo thành công cho lớp!');
    }, 600);
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Xác nhận xóa file khung chương trình đào tạo này?')) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="glass-panel p-6 bg-slate-900 border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quản lý Khung Chương trình Đào tạo Từng Lớp</h2>
              <p className="text-xs text-slate-400">Tải lên và lưu trữ các file tài liệu khung chương trình đào tạo (PDF, Word, Excel) cho từng lớp học</p>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-yellow-400 uppercase mb-1">Chọn Lớp / Đại đội</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value={1}>SQDB2026-HT1 (Lớp SQDB 2026 - Binh chủng Hợp thành 1)</option>
              <option value={2}>SQDB2026-PB1 (Lớp SQDB 2026 - Pháo binh 1)</option>
              <option value={3}>SQDB2026-TT1 (Lớp SQDB 2026 - Thông tin Kỹ thuật 1)</option>
              <option value={4}>SQDB2025-HT1 (Lớp SQDB 2025 - Binh chủng Hợp thành 1)</option>
              <option value={5}>SQDB2024-HT1 (Lớp SQDB 2024 - Binh chủng Hợp thành 1)</option>
            </select>
          </div>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950 border border-emerald-600 text-emerald-300 text-sm rounded-lg flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {msg}
        </div>
      )}

      {/* Upload File Form Area */}
      <div className="glass-panel p-6 bg-slate-900 border border-slate-700 rounded-xl">
        <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-400" />
          Tải lên File Khung Chương trình Đào tạo Lớp
        </h3>

        <form onSubmit={handleUploadCurriculum} className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px]">
            <input
              type="file"
              accept=".pdf, .docx, .doc, .xlsx, .xls"
              onChange={handleFileChange}
              id="curriculum-file-input"
              className="hidden"
            />
            <label
              htmlFor="curriculum-file-input"
              className="w-full bg-slate-950 border border-dashed border-slate-600 hover:border-emerald-500 rounded-lg p-3 text-xs text-slate-300 flex items-center justify-between cursor-pointer transition"
            >
              <span className="font-semibold text-slate-200">
                {selectedFile ? selectedFile.name : 'Nhấp để chọn file khung chương trình (PDF, Word, Excel)...'}
              </span>
              <span className="btn-secondary py-1 text-[11px]">Duyệt file</span>
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={uploading}>
            <Upload className="w-4 h-4" />
            {uploading ? 'Đang tải lên...' : 'Tải lên Khung Chương trình'}
          </button>
        </form>
      </div>

      {/* List of Uploaded Curriculum Documents for Class */}
      <div className="glass-panel overflow-hidden rounded-xl border border-slate-700 shadow-xl">
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-yellow-400" />
            Danh sách File Chương trình Đào tạo Đã Tải lên (Đại đội 1 - K65)
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{files.length} tài liệu</span>
        </div>

        <div className="divide-y divide-slate-800">
          {files.map((file) => (
            <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition">
              <div className="flex items-center space-x-3.5">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                  {file.type === 'pdf' ? (
                    <FileText className="w-6 h-6 text-red-400" />
                  ) : (
                    <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kích thước: <span className="text-slate-300">{file.size}</span> | Ngày tải: <span className="text-slate-300">{file.uploadedAt}</span> | Người tải: <span className="text-emerald-400 font-semibold">{file.uploadedBy}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('Đã tải xuống file: ' + file.name)}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  Tải về
                </button>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="p-2 text-slate-400 hover:text-red-400 transition"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
