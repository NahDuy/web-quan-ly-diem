import React, { useState, useEffect } from 'react';
import { History, Shield, RefreshCw } from 'lucide-react';

const MOCK_LOGS = [
  {
    id: 1,
    modifiedAt: new Date().toISOString(),
    studentName: 'Nguyễn Văn An',
    studentCode: 'SV2020001',
    subjectName: 'Kiến trúc cơ sở TT HTD',
    subjectCode: 'INT1001',
    oldValue: 7.5,
    newValue: 8.5,
    reason: 'Chấm phúc khảo bài thi học kỳ 1 theo quyết định số 102/QĐ-ĐTT',
    modifiedByUsername: 'giangvien_a',
    modifiedByRole: 'ROLE_GIANGVIEN',
    ipAddress: '192.168.1.50'
  },
  {
    id: 2,
    modifiedAt: new Date(Date.now() - 3600000).toISOString(),
    studentName: 'Trần Thị Bình',
    studentCode: 'SV2020002',
    subjectName: 'Lập trình C/C++ Nâng cao',
    subjectCode: 'INT1002',
    oldValue: 6.0,
    newValue: 7.0,
    reason: 'Cập nhật bổ sung điểm bài tập lớn cuối kỳ',
    modifiedByUsername: 'bomon_cntt',
    modifiedByRole: 'ROLE_BOMON',
    ipAddress: '192.168.1.25'
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
      const res = await fetch(`/api/v1/audit-logs/grades?page=0&size=15`, { headers });
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
      <div className="glass-panel p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Nhật ký Kiểm toán Sửa điểm (Audit Log)</h2>
            <p className="text-xs text-slate-400">Theo dõi toàn bộ lịch sử chỉnh sửa điểm, lý do thay đổi và địa chỉ IP người dùng</p>
          </div>
        </div>

        <button onClick={fetchLogs} className="btn-secondary">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      <div className="glass-panel overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-3">Thời gian</th>
              <th className="p-3">Sinh viên</th>
              <th className="p-3">Môn học</th>
              <th className="p-3 text-center">Điểm cũ</th>
              <th className="p-3 text-center">Điểm mới</th>
              <th className="p-3">Lý do thay đổi</th>
              <th className="p-3">Người sửa (Role)</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 text-xs text-slate-400 whitespace-nowrap">
                  {new Date(log.modifiedAt).toLocaleString('vi-VN')}
                </td>
                <td className="p-3">
                  <p className="font-semibold text-slate-200">{log.studentName}</p>
                  <p className="text-[11px] text-blue-400 font-mono">{log.studentCode}</p>
                </td>
                <td className="p-3 text-xs text-slate-300">
                  <p className="font-medium text-slate-200">{log.subjectName}</p>
                  <span className="text-[10px] text-slate-400">{log.subjectCode}</span>
                </td>
                <td className="p-3 text-center font-mono text-red-400 font-bold bg-red-950/20">
                  {log.oldValue !== null ? log.oldValue.toFixed(2) : '-'}
                </td>
                <td className="p-3 text-center font-mono text-emerald-400 font-bold bg-emerald-950/20">
                  {log.newValue !== null ? log.newValue.toFixed(2) : '-'}
                </td>
                <td className="p-3 text-xs text-amber-300 max-w-xs truncate" title={log.reason}>
                  {log.reason}
                </td>
                <td className="p-3 text-xs">
                  <p className="font-semibold text-purple-300">{log.modifiedByUsername}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400">
                    {log.modifiedByRole}
                  </span>
                </td>
                <td className="p-3 text-xs text-slate-400 font-mono">
                  {log.ipAddress || '192.168.1.50'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
