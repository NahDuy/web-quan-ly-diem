import React, { useState, useEffect, useMemo } from 'react';
import { History, Shield, RefreshCw, TrendingUp, TrendingDown, Minus, Search, Calendar, Filter, X, Clock, UserCheck } from 'lucide-react';

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
  },
  {
    id: 4,
    modifiedAt: new Date(Date.now() - 172800000).toISOString(),
    studentName: 'Phạm Minh Đức',
    studentCode: '26PK127_012',
    subjectName: 'Bắn mục tiêu bay thấp súng 12,7mm',
    subjectCode: 'PK127_03',
    oldValue: 5.5,
    newValue: 6.5,
    reason: 'Hội đồng khoa phê duyệt điểm kiểm tra lại',
    modifiedByUsername: 'khoa_phong_khong',
    modifiedByRole: 'ROLE_GIANGVIEN',
    ipAddress: '192.168.1.72'
  },
  {
    id: 5,
    modifiedAt: new Date(Date.now() - 259200000).toISOString(),
    studentName: 'Vũ Quốc Huy',
    studentCode: '26DKZ008',
    subjectName: 'Kỹ thuật bắn ĐKZ 82-K65',
    subjectCode: 'DKZ_01',
    oldValue: 7.0,
    newValue: 6.5,
    reason: 'Điều chỉnh điểm sau thanh tra hồ sơ đào tạo học kỳ I',
    modifiedByUsername: 'ban_khao_thi',
    modifiedByRole: 'ROLE_KHAOTHI',
    ipAddress: '192.168.1.15'
  }
];

export default function AuditLogView() {
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/v1/audit-logs/grades?page=0&size=50`, { headers });
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

  const handleResetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setRoleFilter('ALL');
  };

  // Filtered logs computation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search term match (student name, code, subject, modifier, reason, ip)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const studentName = (log.studentName || '').toLowerCase();
        const studentCode = (log.studentCode || '').toLowerCase();
        const subjectName = (log.subjectName || '').toLowerCase();
        const subjectCode = (log.subjectCode || '').toLowerCase();
        const modifiedBy = (log.modifiedByUsername || '').toLowerCase();
        const reason = (log.reason || '').toLowerCase();
        const ip = (log.ipAddress || '').toLowerCase();

        const match =
          studentName.includes(term) ||
          studentCode.includes(term) ||
          subjectName.includes(term) ||
          subjectCode.includes(term) ||
          modifiedBy.includes(term) ||
          reason.includes(term) ||
          ip.includes(term);

        if (!match) return false;
      }

      // 2. Date range match
      if (startDate) {
        const logDate = new Date(log.modifiedAt);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (logDate < start) return false;
      }

      if (endDate) {
        const logDate = new Date(log.modifiedAt);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (logDate > end) return false;
      }

      // 3. Role match
      if (roleFilter !== 'ALL') {
        if (log.modifiedByRole !== roleFilter) return false;
      }

      return true;
    });
  }, [logs, searchTerm, startDate, endDate, roleFilter]);

  const hasActiveFilters = searchTerm !== '' || startDate !== '' || endDate !== '' || roleFilter !== 'ALL';

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
          disabled={loading}
          className="btn btn-sm"
          style={{
            backgroundColor: '#f8fafc',
            color: '#15803d',
            border: '1px solid #86efac',
            fontWeight: 700,
            padding: '7px 14px'
          }}
          title="Tải lại dữ liệu nhật ký mới nhất từ máy chủ"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Đang tải lại...' : 'Làm mới dữ liệu'}</span>
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="glass-panel p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Search Box */}
          <div className="md:col-span-5">
            <label className="form-label text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>Tìm kiếm từ khóa</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tên học viên, mã HV, môn học, người sửa, lý do, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-xs pl-8 pr-7 py-2 w-full"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Date Range: From */}
          <div className="md:col-span-2">
            <label className="form-label text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Từ ngày</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input text-xs py-2 w-full"
            />
          </div>

          {/* Date Range: To */}
          <div className="md:col-span-2">
            <label className="form-label text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đến ngày</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input text-xs py-2 w-full"
            />
          </div>

          {/* Role Filter */}
          <div className="md:col-span-2">
            <label className="form-label text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Vai trò thực hiện</span>
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-input text-xs py-2 w-full font-medium"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ROLE_ADMIN">Quản trị viên (ADMIN)</option>
              <option value="ROLE_GIANGVIEN">Giảng viên bộ môn</option>
              <option value="ROLE_BOMON">Trưởng Bộ Môn</option>
              <option value="ROLE_KHAOTHI">Ban Khảo Thí</option>
            </select>
          </div>

          {/* Clear Filter Button */}
          <div className="md:col-span-1">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full btn btn-secondary text-xs py-2 flex items-center justify-center gap-1 text-slate-600 hover:text-red-600 hover:border-red-300"
                title="Xóa bộ lọc"
              >
                <X className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Result Summary */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Kết quả: <span className="text-amber-800 font-bold">{filteredLogs.length}</span> / {logs.length} bản ghi
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                Đang áp dụng bộ lọc
              </span>
            )}
          </div>
          <div className="text-slate-400">
            Hỗ trợ tìm kiếm theo tên học viên, mã học viên, môn học, ngày tháng và người sửa
          </div>
        </div>
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
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Không tìm thấy bản ghi nhật ký phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">Hãy thử thay đổi từ khóa tìm kiếm hoặc mở rộng khoảng thời gian lọc</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
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
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
