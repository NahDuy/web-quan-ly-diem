import React, { useState } from 'react';
import { Shield, Lock, User, LogIn, UserPlus, CheckCircle2, AlertCircle, Award, Sparkles, Building2, Users } from 'lucide-react';

export default function AuthPortalView({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('ROLE_GIANGVIEN');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Đồng chí vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.token) {
        localStorage.setItem('jwt_token', data.token);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      } else {
        setError(data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ xác thực.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (username, password) => {
    setLoginUsername(username);
    setLoginPassword(password);
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.token) {
        localStorage.setItem('jwt_token', data.token);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      } else {
        setError(data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ xác thực.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regFullName.trim() || !regUsername.trim() || !regPassword) {
      setError('Đồng chí vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Mật khẩu quân sự phải có tối thiểu 6 ký tự.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          username: regUsername.trim().toLowerCase(),
          email: regEmail.trim() || null,
          password: regPassword,
          role: regRole,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('jwt_token', data.token);
        }
        setSuccess('Đăng ký tài khoản thành công! Đang đăng nhập vào hệ thống...');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data);
          }
        }, 1200);
      } else {
        setError(data.message || 'Đăng ký tài khoản không thành công.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ khi thực hiện đăng ký.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between" style={{
      background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 60%, #020617 100%)'
    }}>
      {/* Top National Header */}
      <div className="py-4 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md text-center">
        <p className="text-[11px] font-bold tracking-widest text-slate-300 uppercase">
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        </p>
        <p className="text-[10px] font-semibold text-amber-500/90 tracking-wider">
          Độc lập - Tự do - Hạnh phúc
        </p>
      </div>

      {/* Main Center Auth Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          
          {/* Card Military Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 p-6 text-white text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <img
                src="/logo.png"
                alt="Logo Học Viện Quân Sự"
                className="w-16 h-16 rounded-full object-contain bg-white p-1 shadow-lg border-2 border-amber-400 mb-2.5"
              />
              <h1 className="font-military text-base sm:text-lg font-bold tracking-wide uppercase text-amber-300">
                HỌC VIỆN QUÂN SỰ - QUÂN KHU 3
              </h1>
              <p className="text-xs font-semibold text-emerald-100 tracking-wider mt-0.5 uppercase">
                HỆ THỐNG QUẢN LÝ ĐÀO TẠO & ĐIỂM SỐ NỘI BỘ
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-600/50 text-[10px] text-emerald-300 font-mono">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Yêu Cầu Xác Thực Danh Tính Truy Cập</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Tabs: Đăng Nhập / Đăng Ký */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5 gap-1">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-amber-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng Ký Mới</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="alert alert-error mb-4 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success mb-4 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* TAB 1: FORM ĐĂNG NHẬP */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Tên đăng nhập / Số hiệu quân sự
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="VD: bgh, pdt, giangvien..."
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="form-input text-xs pl-9 font-medium"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Mật khẩu xác thực
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="form-input text-xs pl-9"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full py-2.5 text-xs font-bold shadow-md cursor-pointer justify-center"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  <span>{submitting ? 'Đang xác thực bảo mật...' : 'Đăng Nhập Vào Hệ Thống'}</span>
                </button>

                {/* Quick Login Test Accounts */}
                <div className="pt-4 border-t border-slate-200 mt-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
                    ⚡ Đăng nhập nhanh vai trò (Click để test):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('bgh', 'bgh')}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Ban Giám Hiệu</span>
                      <span className="text-[10px] text-amber-700 font-mono">bgh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('pdt', 'pdt')}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Phòng Đào Tạo</span>
                      <span className="text-[10px] text-purple-700 font-mono">pdt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('truongkhoa', 'truongkhoa')}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Trưởng Khoa</span>
                      <span className="text-[10px] text-sky-700 font-mono">truongkhoa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('bomon', 'bomon')}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Bộ Môn</span>
                      <span className="text-[10px] text-emerald-700 font-mono">bomon</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('giangvien', 'giangvien')}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-bold text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Giáo Viên</span>
                      <span className="text-[10px] text-slate-700 font-mono">giangvien</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('donvi', 'donvi')}
                      disabled={submitting}
                      className="px-2.5 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-900 text-xs font-bold text-left transition flex items-center justify-between cursor-pointer"
                    >
                      <span>Đơn Vị (TĐ)</span>
                      <span className="text-[10px] text-yellow-700 font-mono">donvi</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: FORM ĐĂNG KÝ TÀI KHOẢN MỚI */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Họ và tên Cán bộ / Học viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đại úy Nguyễn Văn A"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="nguyenvana"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="form-input text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Email quân sự (tùy chọn)
                    </label>
                    <input
                      type="email"
                      placeholder="canbo@hocvien.edu.vn"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu (≥ 6 ký tự) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs font-bold text-slate-700 mb-1">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label text-xs font-bold text-slate-700 mb-1">
                    Vai trò nhiệm vụ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="form-input text-xs font-semibold cursor-pointer"
                  >
                    <option value="ROLE_GIANGVIEN">Giáo viên Huấn luyện</option>
                    <option value="ROLE_BOMON">Chủ nhiệm Bộ môn</option>
                    <option value="ROLE_TRUONGKHOA">Chỉ huy Trưởng Khoa</option>
                    <option value="ROLE_DONVI">Cán bộ Quản lý Đơn vị (Tiểu đoàn)</option>
                    <option value="ROLE_SINHVIEN">Học viên Quân sự</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn w-full py-2.5 text-xs font-bold text-white shadow-md cursor-pointer justify-center"
                  style={{ backgroundColor: '#b45309', border: '1px solid #78350f' }}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  <span>{submitting ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản Mới'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      </div>

      {/* Bottom Footer Security Disclaimer */}
      <div className="py-3 px-4 border-t border-slate-800/80 bg-slate-950/80 text-center text-[11px] text-slate-500">
        <p>
          Hệ thống Mạng Nội bộ Intranet - Học viện Quân sự. Mọi hoạt động truy cập và điều chỉnh dữ liệu đều được ghi lại trong Nhật ký Giám sát (Audit Log).
        </p>
      </div>
    </div>
  );
}
