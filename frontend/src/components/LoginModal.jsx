import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Lock, User, Mail, Award, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
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

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError('Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
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
        onClose();
        window.location.reload();
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
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc (*).');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự.');
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
        setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng...');
        setTimeout(() => {
          onLoginSuccess(data);
          onClose();
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth: '440px', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Circular Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.png"
              alt="Học Viện Quân Sự"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'contain',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                flexShrink: 0,
              }}
            />
            <div>
              <h3 className="font-military" style={{ fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.2 }}>
                HỌC VIỆN QUÂN SỰ
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, letterSpacing: '0.04em', marginTop: '2px' }}>
                HỆ THỐNG QUẢN LÝ ĐÀO TẠO & ĐIỂM
              </p>
            </div>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={onClose}
            className="btn btn-icon btn-secondary btn-sm"
            style={{ borderRadius: '8px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher: Đăng nhập | Đăng ký */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.825rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'login' ? '#ffffff' : 'transparent',
              color: activeTab === 'login' ? '#15803d' : '#64748b',
              boxShadow: activeTab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <LogIn size={15} />
            Đăng nhập
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '0.825rem',
              fontWeight: 700,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'register' ? '#ffffff' : 'transparent',
              color: activeTab === 'register' ? '#b45309' : '#64748b',
              boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <UserPlus size={15} />
            Đăng ký tài khoản
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={16} />
            {success}
          </div>
        )}

        {/* TAB 1: FORM ĐĂNG NHẬP */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label" htmlFor="login-username">
                Tên đăng nhập / Số hiệu
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="form-input"
                  placeholder="Nhập tên đăng nhập (vd: giangvien_a)"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">
                Mật khẩu
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.88rem',
                justifyContent: 'center',
                marginTop: '4px',
              }}
            >
              <LogIn size={16} />
              {submitting ? 'Đang xác thực...' : 'Đăng nhập Hệ thống'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Chưa có tài khoản? </span>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: FORM ĐĂNG KÝ */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label className="form-label" htmlFor="reg-fullname">
                Họ và tên Cán bộ / Học viên *
              </label>
              <input
                id="reg-fullname"
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                className="form-input"
                placeholder="vd: ThS. Nguyễn Văn Giảng"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" htmlFor="reg-username">
                  Tên đăng nhập *
                </label>
                <input
                  id="reg-username"
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="form-input"
                  placeholder="vd: giangvien_b"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="reg-role">
                  Cấp bậc / Vai trò *
                </label>
                <select
                  id="reg-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="ROLE_GIANGVIEN">Giáo viên Huấn luyện</option>
                  <option value="ROLE_BOMON">Chủ nhiệm Bộ môn</option>
                  <option value="ROLE_BGH">Ban Giám Đốc / PĐT</option>
                  <option value="ROLE_SINHVIEN">Học viên Quân sự</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="reg-email">
                Địa chỉ Email (tùy chọn)
              </label>
              <input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="form-input"
                placeholder="canbo@hocvienquansu.edu.vn"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="form-label" htmlFor="reg-password">
                  Mật khẩu *
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="reg-confirm-password">
                  Xác nhận Mật khẩu *
                </label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>

            <button
              id="btn-submit-register"
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.88rem',
                justifyContent: 'center',
                marginTop: '6px',
                background: 'linear-gradient(135deg, #b45309, #d97706)',
                borderColor: '#b45309',
              }}
            >
              <UserPlus size={16} />
              {submitting ? 'Đang tạo tài khoản...' : 'Tạo Tài khoản Mới'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đã có tài khoản? </span>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b45309',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Đăng nhập ngay
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
