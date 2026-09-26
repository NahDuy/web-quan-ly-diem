import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Table, Compass,
  Star, ChevronLeft, ChevronRight, UserCheck, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGES = {
  ROLE_BGH:       { label: 'Ban Giám Đốc / PĐT', bg: '#2d1b00', color: '#fde047', border: '#a16207' },
  ROLE_BOMON:     { label: 'Chủ nhiệm Bộ môn',   bg: '#052e16', color: '#6ee7b7', border: '#166534' },
  ROLE_GIANGVIEN: { label: 'Giáo viên Huấn luyện',bg: '#1a2e05', color: '#bef264', border: '#4d7c0f' },
  ROLE_SINHVIEN:  { label: 'Học viên Quân sự',   bg: '#1e293b', color: '#94a3b8', border: '#475569' },
};

const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard Chỉ Huy',  icon: LayoutDashboard },
  { id: 'students',  label: 'Quản lý Học viên',   icon: Users },
  { id: 'matrix',    label: 'Bảng Quản lý Điểm',  icon: Table },
  { id: 'roadmap',   label: 'Lộ trình Đào tạo',   icon: Compass },
];

export default function Navbar({ activeTab, setActiveTab, onOpenLogin, collapsed, setCollapsed }) {
  const { currentUser } = useAuth();
  const badge = currentUser ? (ROLE_BADGES[currentUser.role] ?? ROLE_BADGES.ROLE_SINHVIEN) : ROLE_BADGES.ROLE_SINHVIEN;

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '260px',
        minWidth: collapsed ? '72px' : '260px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Brand Header */}
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
          <div
            style={{
              padding: '8px',
              background: 'linear-gradient(135deg, #b91c1c, #d97706, #ca8a04)',
              borderRadius: '10px',
              border: '1px solid rgba(253, 224, 71, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(185, 28, 28, 0.25)',
            }}
          >
            <Star size={20} style={{ color: '#fef08a', fill: '#fef08a' }} className="animate-pulse" />
          </div>
          {!collapsed && (
            <div style={{ whitespace: 'nowrap', overflow: 'hidden' }}>
              <h1 className="font-military" style={{ fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.2 }}>
                QUẢN LÝ ĐÀO TẠO
              </h1>
              <p style={{ fontSize: '0.62rem', color: '#15803d', fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }}>
                HỌC VIỆN QUÂN SỰ
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
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
      {collapsed && (
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
          padding: collapsed ? '12px 6px' : '16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
        }}
      >
        {!collapsed && (
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              paddingLeft: '8px',
              marginBottom: '4px',
            }}
          >
            Danh mục điều hành
          </p>
        )}

        {NAV_TABS.map(({ id, label, icon: Icon }) => {
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
                padding: collapsed ? '12px 0' : '10px 12px',
                background: isActive
                  ? 'linear-gradient(135deg, #15803d, #166534)'
                  : '#f8fafc',
                color: isActive ? '#ffffff' : '#334155',
                border: isActive
                  ? '1px solid #15803d'
                  : '1px solid #e2e8f0',
                borderRadius: '10px',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.85rem',
                boxShadow: isActive ? '0 4px 12px rgba(21, 128, 61, 0.25)' : 'none',
                transition: 'all 0.15s ease',
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
      </nav>

      {/* Footer / User Profile */}
      <div
        style={{
          padding: collapsed ? '12px 6px' : '14px 10px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
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
                    background: badge.bg === '#2d1b00' ? '#fef3c7' : badge.bg === '#052e16' ? '#dcfce7' : '#f1f5f9',
                    color: badge.color === '#fde047' ? '#b45309' : badge.color === '#6ee7b7' ? '#15803d' : '#334155',
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

            <button
              id="btn-switch-role"
              onClick={onOpenLogin}
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justifyContent: 'center',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#b45309',
                fontSize: '0.78rem',
              }}
            >
              <UserCheck size={15} />
              Đổi vai trò / Đăng nhập
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              id="btn-switch-role-collapsed"
              onClick={onOpenLogin}
              className="btn btn-icon btn-secondary btn-sm"
              title={`Tài khoản: ${currentUser?.fullName ?? 'Khách'} - Đổi vai trò`}
              style={{ border: '1px solid #cbd5e1', color: '#b45309', background: '#ffffff' }}
            >
              <UserCheck size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

