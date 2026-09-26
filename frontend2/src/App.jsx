import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import ExcelImportModal from './components/ExcelImportModal';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import MatrixPage from './pages/MatrixPage';
import RoadmapPage from './pages/RoadmapPage';
import AuditLogPage from './pages/AuditLogPage';

const TAB_NAMES = {
  '/dashboard': 'Dashboard Chỉ Huy',
  '/students':  'Quản lý Học viên',
  '/matrix':    'Bảng Quản lý Điểm',
  '/roadmap':   'Lộ trình Đào tạo',
  '/audit':     'Nhật ký Audit Log',
};

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;
  const pageTitle = TAB_NAMES[currentPath] ?? 'Dashboard Chỉ Huy';

  return (
    <AuthProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
        {/* Left Sidebar */}
        <Navbar
          activeTab={currentPath.replace('/', '')}
          setActiveTab={(tabId) => navigate(`/${tabId}`)}
          onOpenLogin={() => setLoginOpen(true)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Right Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top Bar / Header */}
          <header
            style={{
              padding: '16px 28px',
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                <span>Hệ thống chỉ huy</span>
                <span>/</span>
                <span style={{ color: '#b45309', fontWeight: 600 }}>{pageTitle}</span>
              </div>
              <h2 className="font-military" style={{ fontSize: '1.1rem', color: '#0f172a', marginTop: '2px' }}>
                {pageTitle}
              </h2>
            </div>
          </header>

          {/* Main Page View with Routes */}
          <main style={{ flex: 1, padding: '24px 28px 48px', overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/students" element={<StudentsPage onOpenImportModal={() => setImportOpen(true)} />} />
              <Route path="/matrix" element={<MatrixPage onOpenImportModal={() => setImportOpen(true)} />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>

        {/* Modals */}
        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={() => navigate('/dashboard')}
        />

        <ExcelImportModal
          isOpen={importOpen}
          onClose={() => setImportOpen(false)}
          onImportSuccess={() => navigate('/matrix')}
        />
      </div>
    </AuthProvider>
  );
}


