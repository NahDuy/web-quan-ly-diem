import React from 'react';
import {
  LayoutDashboard,
  Users,
  Table,
  Compass,
  BookmarkCheck,
  History,
  Building2,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogIn,
  LogOut,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Chỉ Huy & Điều Hành',
    items: [
      { id: 'dashboard',   label: 'Dashboard Chỉ Huy',            icon: LayoutDashboard },
    ],
  },
  {
    title: 'Đào Tạo & Huấn Luyện',
    items: [
      { id: 'students',    label: 'Quản lý Học viên',             icon: Users },
      { id: 'matrix',      label: 'Bảng Quản lý Điểm',            icon: Table },
      { id: 'roadmap',     label: 'Lộ trình Đào tạo',             icon: Compass },
      { id: 'majors',      label: 'Chuyên ngành & Quy ước',       icon: BookmarkCheck },
    ],
  },
  {
    title: 'Tổ Chức & Hệ Thống',
    items: [
      { id: 'departments', label: 'Quản lý Khoa & Đơn vị',        icon: Building2, roles: ['ROLE_BGH', 'ROLE_PDT', 'ROLE_TRUONGKHOA', 'ROLE_BOMON'] },
      { id: 'audit',       label: 'Nhật ký Audit Log',            icon: History,   roles: ['ROLE_BGH', 'ROLE_PDT', 'ROLE_TRUONGKHOA', 'ROLE_BOMON'] },
    ],
  },
];

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenLogin,
  onLogout,
  collapsed = false,
  setCollapsed,
}) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_BGH':
        return { label: 'Ban Giám Hiệu', bg: '#fef3c7', color: '#b45309', border: '#fde047' };
      case 'ROLE_PDT':
        return { label: 'Phòng Đào Tạo', bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' };
      case 'ROLE_TRUONGKHOA':
        return { label: 'Trưởng Khoa', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
      case 'ROLE_BOMON':
        return { label: 'Chủ nhiệm Bộ môn', bg: '#dcfce7', color: '#15803d', border: '#86efac' };
      case 'ROLE_GIANGVIEN':
        return { label: 'Giáo viên bộ môn', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' };
      case 'ROLE_DONVI':
        return { label: 'Cán bộ Đơn vị (Tiểu đoàn)', bg: '#fef9c3', color: '#854d0e', border: '#fef08a' };
      case 'ROLE_SINHVIEN':
        return { label: 'Học viên Quân sự', bg: '#e0f2fe', color: '#0284c7', border: '#7dd3fc' };
      default:
        return { label: 'Cán bộ Quân sự', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        minWidth: collapsed ? '72px' : '260px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
        height: '100vh',
        position: 'sticky',
        top: 0,
        boxShadow: '1px 0 4px rgba(0,0,0,0.03)',
      }}
    >
      {/* Brand Header with Circular Logo (Cut off white border & rounded) */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '16px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #e2e8f0',
          minHeight: '72px',
          background: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <img
            src="/logo.png"
            alt="Logo Học Viện Quân Sự"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'contain',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          />
          {!collapsed && (
            <div style={{ whitespace: 'nowrap', overflow: 'hidden' }}>
              <h1 className="font-military" style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.2 }}>
                QUẢN LÝ ĐÀO TẠO
              </h1>
              <p style={{ fontSize: '0.62rem', color: '#15803d', fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }}>
                HỌC VIỆN QUÂN SỰ
              </p>
            </div>
          )}
        </div>

        {!collapsed && setCollapsed && (
          <button
            id="btn-toggle-sidebar"
            onClick={() => setCollapsed(true)}
            className="btn btn-icon btn-secondary btn-xs"
            title="Thu gọn Sidebar"
            style={{
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && setCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            id="btn-expand-sidebar"
            onClick={() => setCollapsed(false)}
            className="btn btn-icon btn-secondary btn-xs"
            title="Mở rộng Sidebar"
            style={{
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#b45309',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? '12px 6px' : '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
        }}
      >
        {NAV_SECTIONS.map((section, sIdx) => {
          const visibleItems = section.items.filter(
            tab => !tab.roles || !currentUser?.role || tab.roles.includes(currentUser.role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title || sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: sIdx > 0 ? '10px' : '0' }}>
              {sIdx > 0 && (
                <div
                  style={{
                    height: '1px',
                    background: '#e2e8f0',
                    margin: collapsed ? '4px 6px 8px 6px' : '4px 4px 8px 4px',
                  }}
                />
              )}

              {!collapsed && (
                <p
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    paddingLeft: '8px',
                    marginBottom: '2px',
                  }}
                >
                  {section.title}
                </p>
              )}

              {visibleItems.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    id={`nav-tab-${id}`}
                    onClick={() => setActiveTab(id)}
                    title={collapsed ? label : undefined}
                    className="btn"
                    style={{
                      width: '100%',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      padding: collapsed ? '12px 0' : '9px 12px',
                      background: isActive
                        ? 'linear-gradient(135deg, #15803d, #166534)'
                        : '#f8fafc',
                      color: isActive ? '#ffffff' : '#334155',
                      border: isActive
                        ? '1px solid #15803d'
                        : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.825rem',
                      boxShadow: isActive ? '0 4px 12px rgba(21, 128, 61, 0.25)' : 'none',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon
                      size={18}
                      style={{
                        color: isActive ? '#fef08a' : '#64748b',
                        flexShrink: 0,
                      }}
                    />
                    {!collapsed && (
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout (No duplicate login button) */}
      <div
        style={{
          padding: collapsed ? '12px 6px' : '14px 10px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b45309',
                  flexShrink: 0,
                }}
              >
                <Shield size={18} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentUser?.fullName ?? 'Cán bộ chưa đăng nhập'}
                </p>
                <span
                  className="badge"
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    borderColor: badge.border,
                    fontSize: '0.62rem',
                    padding: '1px 6px',
                    marginTop: '2px',
                  }}
                >
                  {badge.label}
                </span>
              </div>
            </div>

            {currentUser ? (
              <button
                id="btn-sidebar-logout"
                onClick={onLogout}
                className="btn btn-secondary btn-xs"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  border: '1px solid #fecaca',
                  background: '#ffffff',
                  color: '#dc2626',
                  fontSize: '0.75rem',
                }}
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut size={13} />
                Đăng xuất
              </button>
            ) : (
              <button
                id="btn-sidebar-login"
                onClick={onOpenLogin}
                className="btn btn-primary btn-xs"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                <LogIn size={13} />
                Đăng nhập / Đăng ký
              </button>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {currentUser ? (
              <button
                id="btn-sidebar-logout-collapsed"
                onClick={onLogout}
                className="btn btn-icon btn-secondary btn-sm"
                title={`Đăng xuất: ${currentUser?.fullName ?? ''}`}
                style={{ border: '1px solid #fecaca', color: '#dc2626', background: '#ffffff' }}
              >
                <LogOut size={16} />
              </button>
            ) : (
              <button
                id="btn-sidebar-login-collapsed"
                onClick={onOpenLogin}
                className="btn btn-icon btn-primary btn-sm"
                title="Đăng nhập / Đăng ký"
              >
                <LogIn size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
