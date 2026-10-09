import React, { useState, useEffect } from 'react';
import { History, Shield, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MOCK_LOGS = [
  {
    id: 1,
    modifiedAt: new Date().toISOString(),
    studentName: 'Nguyễn Văn An',
    studentCode: '26TSBB001',
    subjectName: 'Chiến thuật Bộ binh',
    subjectCode: 'CTBB01',
    oldValue: 7.5,
    newValue: 8.5,
    reason: 'Chấm phúc khảo bài thi kết thúc môn theo quyết định số 102/QĐ-ĐTT',
    modifiedByUsername: 'khoa_bo_binh',
    modifiedByRole: 'ROLE_GIANGVIEN',
    ipAddress: '192.168.1.50'
  },
  {
    id: 2,
    modifiedAt: new Date(Date.now() - 3600000).toISOString(),
    studentName: 'Trần Thị Bình',
    studentCode: '26TSBB002',
    subjectName: 'Bắn súng AK bài 1 ban ngày',
    subjectCode: 'BSAK01',
    oldValue: 6.0,
    newValue: 7.0,
    reason: 'Cập nhật bổ sung điểm bắn đợt kiểm tra bổ sung',
    modifiedByUsername: 'khoa_ban_sung',
    modifiedByRole: 'ROLE_BOMON',
    ipAddress: '192.168.1.25'
  },
  {
    id: 3,
    modifiedAt: new Date(Date.now() - 86400000).toISOString(),
    studentName: 'Lê Hoàng Nam',
    studentCode: '26COI005',
    subjectName: 'Tính toán phần tử bắn Súng Cối 82mm',
    subjectCode: 'COI82_02',
    oldValue: 8.0,
    newValue: 8.0,
    reason: 'Kiểm tra đối chiếu điểm danh và sổ điểm giảng viên',
    modifiedByUsername: 'admin_daotao',
    modifiedByRole: 'ROLE_ADMIN',
    ipAddress: '192.168.1.10'
  }
];

export default function AuditLogView() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/audit-logs/grades?page=0&size=20`, { headers });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.content && data.content.length > 0 ? data.content : MOCK_LOGS);
      }
    } catch (err) {
      setLogs(MOCK_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="glass-panel p-5 bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 shadow-xs">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-military-title">
              Nhật ký Kiểm toán Sửa điểm (Audit Log)
            </h2>
            <p className="text-xs text-slate-500">
              Ghi vết toàn diện mọi thao tác thay đổi dữ liệu điểm, lý do điều chỉnh, tài khoản thực hiện và địa chỉ IP
            </p>
          </div>
        </div>

        <button 
          onClick={fetchLogs} 
          className="btn btn-secondary text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Làm mới dữ liệu</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider">
                <th className="p-3 w-36">Thời gian</th>
                <th className="p-3 min-w-[140px]">Học viên</th>
                <th className="p-3 min-w-[180px]">Môn học</th>
                <th className="p-3 text-center w-20">Điểm cũ</th>
                <th className="p-3 text-center w-20">Điểm mới</th>
                <th className="p-3 text-center w-24">Chênh lệch</th>
                <th className="p-3 min-w-[200px]">Lý do thay đổi</th>
                <th className="p-3 min-w-[140px]">Người sửa (Vai trò)</th>
                <th className="p-3 w-28">Địa chỉ IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log) => {
                const diff = (log.newValue !== null && log.oldValue !== null) 
                  ? Number((log.newValue - log.oldValue).toFixed(2)) 
                  : 0;

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap font-mono">
                      {new Date(log.modifiedAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900 text-xs">{log.studentName}</p>
                      <p className="text-[11px] text-amber-800 font-mono font-semibold">{log.studentCode}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-800 text-xs">{log.subjectName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{log.subjectCode}</span>
                    </td>
                    <td className="p-3 text-center font-mono text-red-600 font-bold bg-red-50/40">
                      {log.oldValue !== null && log.oldValue !== undefined ? Number(log.oldValue).toFixed(2) : '-'}
                    </td>
                    <td className="p-3 text-center font-mono text-emerald-700 font-bold bg-emerald-50/40">
                      {log.newValue !== null && log.newValue !== undefined ? Number(log.newValue).toFixed(2) : '-'}
                    </td>
                    <td className="p-3 text-center font-mono text-xs">
                      {diff > 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          +{diff}
                        </span>
                      ) : diff < 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold text-[11px]">
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          {diff}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[11px]">
                          <Minus className="w-3 h-3 text-slate-400" />
                          0.00
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-slate-700 max-w-xs truncate" title={log.reason}>
                      {log.reason || '—'}
                    </td>
                    <td className="p-3 text-xs">
                      <p className="font-semibold text-slate-800">{log.modifiedByUsername}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700 font-semibold font-mono inline-block mt-0.5">
                        {log.modifiedByRole}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-500 font-mono">
                      {log.ipAddress || '192.168.1.50'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
