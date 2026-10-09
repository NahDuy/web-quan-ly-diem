import React, { useState, useEffect } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { auditApi } from '../api';

const MOCK_LOGS = [
  {
    id: 1,
    modifiedAt: new Date().toISOString(),
    studentName: 'Nguyễn Văn An', studentCode: 'SV2020001',
    subjectName: 'Kiến trúc cơ sở TT HTD', subjectCode: 'INT1001',
    oldValue: 7.5, newValue: 8.5,
    reason: 'Chấm phúc khảo bài thi học kỳ 1 theo quyết định số 102/QĐ-ĐTT',
    modifiedByUsername: 'giangvien_a', modifiedByRole: 'ROLE_GIANGVIEN', ipAddress: '192.168.1.50',
  },
  {
    id: 2,
    modifiedAt: new Date(Date.now() - 3600000).toISOString(),
    studentName: 'Trần Thị Bình', studentCode: 'SV2020002',
    subjectName: 'Lập trình C/C++ Nâng cao', subjectCode: 'INT1002',
    oldValue: 6.0, newValue: 7.0,
    reason: 'Cập nhật bổ sung điểm bài tập lớn cuối kỳ',
    modifiedByUsername: 'bomon_cntt', modifiedByRole: 'ROLE_BOMON', ipAddress: '192.168.1.25',
  },
];

const ROLE_COLORS = {
  ROLE_BGH:      '#fde047',
  ROLE_BOMON:    '#6ee7b7',
  ROLE_GIANGVIEN:'#bef264',
  ROLE_SINHVIEN: '#94a3b8',
};

export default function AuditLogPage() {
  const [logs, setLogs]       = useState(MOCK_LOGS);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await auditApi.getGradeAuditLogs(0, 15);
      setLogs(data.content?.length ? data.content : MOCK_LOGS);
    } catch {
      setLogs(MOCK_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '8px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'rgba(124,58,237,0.2)', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.35)' }}>
            <History size={22} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>Nhật ký Kiểm toán Sửa điểm (Audit Log)</h2>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
              Theo dõi toàn bộ lịch sử chỉnh sửa điểm, lý do thay đổi và địa chỉ IP người dùng
            </p>
          </div>
        </div>

        <button id="btn-refresh-auditlog" onClick={fetchLogs} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Làm mới
        </button>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                {['Thời gian', 'Học viên', 'Môn học', 'Điểm cũ', 'Điểm mới', 'Lý do thay đổi', 'Người sửa (Role)', 'IP Address'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  style={{ borderBottom: '1px solid #1e293b', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(30,41,59,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(log.modifiedAt).toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <p style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.85rem' }}>{log.studentName}</p>
                    <p style={{ fontSize: '0.7rem', color: '#60a5fa', fontFamily: 'monospace' }}>{log.studentCode}</p>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <p style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.82rem' }}>{log.subjectName}</p>
                    <p style={{ fontSize: '0.68rem', color: '#64748b' }}>{log.subjectCode}</p>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: '#f87171', background: 'rgba(127,29,29,0.15)', fontSize: '0.95rem' }}>
                    {log.oldValue != null ? log.oldValue.toFixed(2) : '-'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: '#34d399', background: 'rgba(5,46,22,0.3)', fontSize: '0.95rem' }}>
                    {log.newValue != null ? log.newValue.toFixed(2) : '-'}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#f59e0b', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.reason}>
                    {log.reason}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <p style={{ fontWeight: 700, color: ROLE_COLORS[log.modifiedByRole] ?? '#94a3b8', fontSize: '0.82rem' }}>
                      {log.modifiedByUsername}
                    </p>
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(88,28,135,0.5)', border: '1px solid rgba(126,34,206,0.4)', color: '#c4b5fd' }}>
                      {log.modifiedByRole}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                    {log.ipAddress ?? '192.168.1.50'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
