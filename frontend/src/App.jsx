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
import { UserCheck } from 'lucide-react';

const TAB_NAMES = {
  dashboard: 'Dashboard Chỉ Huy',
  students:  'Quản lý Học viên',
  matrix:    'Bảng Quản lý Điểm',
  roadmap:   'Lộ trình Đào tạo',
  majors:    'Chuyên ngành & Quy ước',
  audit:     'Nhật ký Audit Log',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [currentUser, setCurrentUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [importModalConfig, setImportModalConfig] = useState({
    isOpen: false,
    classId: 1,
    semester: 1,
    classCode: ''
  });

  useEffect(() => {
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
            return;
          }
        } catch (e) {
          console.error('Error fetching auth/me:', e);
        }
      }
      // Default fallback officer
      setCurrentUser({
        username: 'giangvien_a',
        fullName: 'Thượng úy Nguyễn Văn Giảng',
        role: 'ROLE_GIANGVIEN',
        departmentId: 2
      });
    };
    checkAuth();
  }, []);

  const pageTitle = TAB_NAMES[activeTab] || 'Bảng Quản lý Điểm';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary, #f8fafc)' }}>
      {/* Left Collapsible Sidebar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Right Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar with Breadcrumb and Logo */}
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
              src="/logo.jpg"
              alt="Học Viện Quân Sự"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                background: '#ffffff',
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

          {/* User profile & Switch role quick button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }} className="hidden sm:block">
              <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
                {currentUser?.fullName || 'Thượng úy Nguyễn Văn Giảng'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>
                {currentUser?.role === 'ROLE_BGH' ? 'Ban Giám Đốc / PĐT Quân sự' :
                 currentUser?.role === 'ROLE_BOMON' ? 'Chủ nhiệm Bộ môn' :
                 currentUser?.role === 'ROLE_GIANGVIEN' ? 'Giáo viên Huấn luyện' :
                 currentUser?.role === 'ROLE_SINHVIEN' ? 'Học viên Quân sự' : 'Cán bộ Quân sự'}
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
                color: '#b45309',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title="Đổi vai trò Cán bộ / Chỉ huy"
            >
              <UserCheck size={16} />
              <span>Đổi vai trò</span>
            </button>
          </div>
        </header>

        {/* Main View Area */}
        <main style={{ flex: 1, padding: '24px 28px 48px', overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <DashboardView />
          )}

          {activeTab === 'students' && (
            <StudentManagementView />
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

      {/* Modals */}
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
