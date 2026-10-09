import React, { useState } from 'react';
import { X, UserCheck, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const QUICK_ROLES = [
  {
    username: 'admin',
    password: 'password123',
    label: 'Ban Giám Đốc / PĐT',
    desc: 'Đại tá Trần Văn Thủ (Quyền khóa/mở khóa điểm)',
    color: '#fde047',
    borderColor: 'rgba(234,179,8,0.45)',
  },
  {
    username: 'bomon_cntt',
    password: 'password123',
    label: 'Chủ nhiệm Bộ môn',
    desc: 'Thượng tá Lê Văn Bộ (Quản lý môn quân sự)',
    color: '#6ee7b7',
    borderColor: 'rgba(52,211,153,0.45)',
  },
  {
    username: 'giangvien_a',
    password: 'password123',
    label: 'Giáo viên Huấn luyện',
    desc: 'Thượng úy Nguyễn Văn Giảng (Nhập điểm ma trận)',
    color: '#bef264',
    borderColor: 'rgba(190,242,100,0.45)',
  },
  {
    username: 'sv001',
    password: 'password123',
    label: 'Học viên Quân sự',
    desc: 'Thượng sĩ Nguyễn Văn An (Xem bảng điểm cá nhân)',
    color: '#fbbf24',
    borderColor: 'rgba(251,191,36,0.45)',
  },
];

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('giangvien_a');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (usr = username, pwd = password) => {
    setSubmitting(true);
    setError('');
    const result = await login(usr, pwd);
    setSubmitting(false);
    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setError('Thông tin đăng nhập không hợp lệ.');
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #d97706, #ca8a04)',
              borderRadius: '10px', border: '1px solid #fde047',
              boxShadow: '0 2px 8px rgba(217,119,6,0.25)',
            }}>
              <Star size={20} style={{ color: '#ffffff', fill: '#ffffff' }} />
            </div>
            <div>
              <h3 className="font-military" style={{ fontSize: '1rem', color: '#0f172a' }}>
                Chuyển đổi Cấp bậc / Vai trò
              </h3>
              <p style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600, marginTop: '2px' }}>
                Chọn vai trò cán bộ chỉ huy hoặc học viên
              </p>
            </div>
          </div>
          <button
            id="btn-close-login"
            onClick={onClose}
            className="btn btn-icon btn-secondary btn-sm"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Quick role buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {QUICK_ROLES.map((r) => (
            <button
              key={r.username}
              id={`btn-quick-login-${r.username}`}
              onClick={() => handleSubmit(r.username, r.password)}
              disabled={submitting}
              style={{
                padding: '10px 12px',
                background: '#f8fafc',
                border: `1px solid ${r.username === 'admin' ? '#fde047' : '#cbd5e1'}`,
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
            >
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: r.username === 'admin' ? '#b45309' : r.username === 'bomon_cntt' ? '#15803d' : r.username === 'giangvien_a' ? '#166534' : '#0284c7', marginBottom: '2px' }}>
                {r.label}
              </p>
              <p style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.4 }}>
                {r.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Manual login form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div>
            <label className="form-label" htmlFor="login-username">Tên đăng nhập</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="username"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <button
            id="btn-submit-login"
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ justifyContent: 'center', marginTop: '4px', padding: '10px' }}
          >
            <UserCheck size={16} />
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập Hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
}
