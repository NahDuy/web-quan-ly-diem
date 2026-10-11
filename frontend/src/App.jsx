import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import DashboardView from './components/DashboardView';
import StudentManagementView from './components/StudentManagementView';
import MatrixDataGrid from './components/MatrixDataGrid';
import ExcelImportModal from './components/ExcelImportModal';
import AuditLogView from './components/AuditLogView';
import CurriculumRoadmapView from './components/CurriculumRoadmapView';
import MajorManagementView from './components/MajorManagementView';
import DepartmentUnitManagementView from './components/DepartmentUnitManagementView';
import AuthPortalView from './components/AuthPortalView';
import { User, LogIn, LogOut } from 'lucide-react';

const TAB_NAMES = {
  dashboard:      'Dashboard Chỉ Huy',
  departments:    'Quản lý Khoa & Đơn vị',
  students:       'Quản lý Học viên',
  matrix:         'Bảng Quản lý Điểm',
  roadmap:        'Lộ trình Đào tạo',
  majors:         'Chuyên ngành & Quy ước',
  audit:          'Nhật ký Audit Log',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [importModalConfig, setImportModalConfig] = useState({
    isOpen: false,
    classId: 1,
    semester: 1,
    classCode: ''
  });

  const checkAuth = async () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const res = await fetch('/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
          setAuthLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error fetching auth/me:', e);
      }
    }
    setCurrentUser(null);
    setAuthLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setCurrentUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-300 tracking-wider uppercase font-military">
          Đang xác thực bảo mật hệ thống...
        </p>
      </div>
    );
  }

  // Yêu cầu đăng nhập bắt buộc: Nếu chưa đăng nhập, hiển thị màn hình Auth Portal quân sự
  if (!currentUser) {
    return (
      <AuthPortalView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  const pageTitle = TAB_NAMES[activeTab] || 'Bảng Quản lý Điểm';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary, #f8fafc)' }}>
      {/* Left Collapsible Sidebar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Right Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar with Breadcrumb and Circular Logo */}
        <header
          style={{
            padding: '14px 28px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/logo.png"
              alt="Học Viện Quân Sự"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Hệ thống chỉ huy</span>
                <span>/</span>
                <span style={{ color: '#b45309', fontWeight: 600 }}>{pageTitle}</span>
              </div>
              <h2 className="font-military" style={{ fontSize: '1.1rem', color: '#0f172a', marginTop: '1px' }}>
                {pageTitle}
              </h2>
            </div>
          </div>

          {/* User profile & Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentUser ? (
              <>
                <div style={{ textAlign: 'right' }} className="hidden sm:block">
                  <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
                    {currentUser.fullName}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>
                    {currentUser.role === 'ROLE_BGH' ? 'Ban Giám Hiệu' :
                     currentUser.role === 'ROLE_PDT' ? 'Phòng Đào Tạo' :
                     currentUser.role === 'ROLE_TRUONGKHOA' ? 'Trưởng Khoa' :
                     currentUser.role === 'ROLE_BOMON' ? 'Chủ nhiệm Bộ môn' :
                     currentUser.role === 'ROLE_GIANGVIEN' ? 'Giáo viên bộ môn' :
                     currentUser.role === 'ROLE_DONVI' ? 'Cán bộ Đơn vị (Tiểu đoàn)' :
                     currentUser.role === 'ROLE_SINHVIEN' ? 'Học viên Quân sự' : 'Cán bộ Quân sự'}
                  </p>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  title="Đổi tài khoản đăng nhập"
                >
                  <User size={15} />
                  <span>Đổi tài khoản</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '6px 10px',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    background: '#ffffff',
                    borderRadius: '8px',
                  }}
                  title="Đăng xuất khỏi hệ thống"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LogIn size={16} />
                <span>Đăng nhập / Đăng ký</span>
              </button>
            )}
          </div>
        </header>

        {/* Main View Area */}
        <main style={{ flex: 1, padding: '24px 28px 48px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardView />
          )}

          {activeTab === 'departments' && (
            <DepartmentUnitManagementView currentUser={currentUser} />
          )}

          {activeTab === 'students' && (
            <StudentManagementView currentUser={currentUser} />
          )}

          {activeTab === 'matrix' && (
            <MatrixDataGrid
              currentUser={currentUser}
              onOpenImportModal={(classId, semester, classCode) =>
                setImportModalConfig({
                  isOpen: true,
                  classId: classId || 1,
                  semester: semester || 1,
                  classCode: classCode || ''
                })
              }
            />
          )}

          {activeTab === 'roadmap' && (
            <CurriculumRoadmapView />
          )}

          {activeTab === 'majors' && (
            <MajorManagementView />
          )}

          {activeTab === 'audit' && (
            <AuditLogView />
          )}
        </main>
      </div>

      {/* Auth Modal (Login / Register) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      <ExcelImportModal
        isOpen={importModalConfig.isOpen}
        classId={importModalConfig.classId}
        semester={importModalConfig.semester}
        classCode={importModalConfig.classCode}
        onClose={() => setImportModalConfig(prev => ({ ...prev, isOpen: false }))}
        onImportSuccess={() => {
          setActiveTab('matrix');
        }}
      />
    </div>
  );
}
