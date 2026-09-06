import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import DashboardView from './components/DashboardView';
import StudentManagementView from './components/StudentManagementView';
import MatrixDataGrid from './components/MatrixDataGrid';
import ExcelImportModal from './components/ExcelImportModal';
import AuditLogView from './components/AuditLogView';
import CurriculumRoadmapView from './components/CurriculumRoadmapView';

export default function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser({
          username: 'giangvien_a',
          fullName: 'ThS. Nguyễn Văn Giảng',
          role: 'ROLE_GIANGVIEN',
          departmentId: 2
        });
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView />
        )}

        {activeTab === 'students' && (
          <StudentManagementView
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

        {activeTab === 'matrix' && (
          <MatrixDataGrid
            currentUser={currentUser}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        )}

        {activeTab === 'roadmap' && (
          <CurriculumRoadmapView />
        )}

        {activeTab === 'audit' && (
          <AuditLogView />
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          setActiveTab('matrix');
        }}
      />

    </div>
  );
}
