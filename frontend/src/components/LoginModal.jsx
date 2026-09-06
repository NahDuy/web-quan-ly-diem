import React, { useState } from 'react';
import { X, UserCheck, Shield, KeyRound, Star } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('giangvien_a');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (roleUser, rolePass) => {
    setUsername(roleUser);
    setPassword(rolePass);
    submitLogin(roleUser, rolePass);
  };

  const submitLogin = async (usr = username, pwd = password) => {
    setError('');
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usr, password: pwd }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('jwt_token', data.token);
        }
        onLoginSuccess(data);
        onClose();
      } else {
        // Fallback for Demo Mode
        const demoUserMap = {
          'admin': { username: 'admin', fullName: 'Đại tá Trần Văn Thủ', role: 'ROLE_BGH' },
          'bomon_cntt': { username: 'bomon_cntt', fullName: 'Thượng tá Lê Văn Bộ', role: 'ROLE_BOMON' },
          'giangvien_a': { username: 'giangvien_a', fullName: 'Thượng úy Nguyễn Văn Giảng', role: 'ROLE_GIANGVIEN' },
          'sv001': { username: 'sv001', fullName: 'Thượng sĩ Nguyễn Văn An', role: 'ROLE_SINHVIEN' }
        };
        const demoUser = demoUserMap[usr] || demoUserMap['giangvien_a'];
        onLoginSuccess(demoUser);
        onClose();
      }
    } catch (err) {
      const demoUserMap = {
        'admin': { username: 'admin', fullName: 'Đại tá Trần Văn Thủ', role: 'ROLE_BGH' },
        'bomon_cntt': { username: 'bomon_cntt', fullName: 'Thượng tá Lê Văn Bộ', role: 'ROLE_BOMON' },
        'giangvien_a': { username: 'giangvien_a', fullName: 'Thượng úy Nguyễn Văn Giảng', role: 'ROLE_GIANGVIEN' },
        'sv001': { username: 'sv001', fullName: 'Thượng sĩ Nguyễn Văn An', role: 'ROLE_SINHVIEN' }
      };
      const demoUser = demoUserMap[usr] || demoUserMap['giangvien_a'];
      onLoginSuccess(demoUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md p-6 shadow-2xl relative border border-amber-500/40 bg-slate-950">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-amber-600 to-yellow-600 text-slate-950 rounded-xl border border-yellow-300">
            <Star className="w-6 h-6 fill-yellow-200 text-yellow-950" />
          </div>
          <div>
            <h3 className="font-military-title text-lg font-bold text-yellow-300">Chuyển đổi Cấp bậc / Vai trò</h3>
            <p className="text-xs text-emerald-400 font-medium">Chọn vai trò cán bộ chỉ huy hoặc học viên để thử nghiệm</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-300 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Role Switcher Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => handleQuickLogin('admin', 'password123')}
            className="p-3 bg-slate-900 hover:bg-slate-850 border border-yellow-500/40 rounded-xl text-left transition"
          >
            <p className="text-xs font-bold text-yellow-300">Ban Giám Đốc / PĐT</p>
            <p className="text-[11px] text-slate-400">Đại tá Trần Văn Thủ (Quyền khóa/mở khóa điểm)</p>
          </button>

          <button
            onClick={() => handleQuickLogin('bomon_cntt', 'password123')}
            className="p-3 bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 rounded-xl text-left transition"
          >
            <p className="text-xs font-bold text-emerald-300">Chủ nhiệm Bộ môn</p>
            <p className="text-[11px] text-slate-400">Thượng tá Lê Văn Bộ (Quản lý môn quân sự)</p>
          </button>

          <button
            onClick={() => handleQuickLogin('giangvien_a', 'password123')}
            className="p-3 bg-slate-900 hover:bg-slate-850 border border-lime-500/40 rounded-xl text-left transition"
          >
            <p className="text-xs font-bold text-lime-300">Giáo viên Huấn luyện</p>
            <p className="text-[11px] text-slate-400">Thượng úy Nguyễn Văn Giảng (Nhập điểm ma trận)</p>
          </button>

          <button
            onClick={() => handleQuickLogin('sv001', 'password123')}
            className="p-3 bg-slate-900 hover:bg-slate-850 border border-amber-500/40 rounded-xl text-left transition"
          >
            <p className="text-xs font-bold text-amber-300">Học viên Quân sự</p>
            <p className="text-[11px] text-slate-400">Thượng sĩ Nguyễn Văn An (Xem bảng điểm cá nhân)</p>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submitLogin(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary justify-center py-2.5 mt-2"
          >
            <UserCheck className="w-4 h-4" />
            Đăng nhập Hệ thống Quân sự
          </button>
        </form>

      </div>
    </div>
  );
}
