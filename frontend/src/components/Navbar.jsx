import React from 'react';
import { Shield, LayoutDashboard, Users, Table, History, Compass, UserCheck, Star, Award } from 'lucide-react';

export default function Navbar({ currentUser, activeTab, setActiveTab, onOpenLogin }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_BGH': return { label: 'Ban Giám Đốc / PĐT Quân sự', color: 'bg-amber-950/80 text-yellow-300 border-yellow-500' };
      case 'ROLE_BOMON': return { label: 'Chủ nhiệm Bộ môn Quân sự', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500' };
      case 'ROLE_GIANGVIEN': return { label: 'Giáo viên / Cán bộ Huấn luyện', color: 'bg-lime-950/80 text-lime-300 border-lime-500' };
      case 'ROLE_SINHVIEN': return { label: 'Học viên Quân sự', color: 'bg-slate-900 text-slate-300 border-slate-600' };
      default: return { label: 'Khách', color: 'bg-slate-900 text-slate-400 border-slate-700' };
    }
  };

  const badge = currentUser ? getRoleBadge(currentUser.role) : getRoleBadge(null);

  return (
    <header className="glass-panel-military sticky top-0 z-40 mb-6 border-b border-amber-500/30 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Military Emblem & Header Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative p-2.5 bg-gradient-to-br from-red-700 via-amber-600 to-yellow-600 rounded-xl shadow-lg border border-yellow-300/40 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-200 fill-yellow-300 animate-pulse" />
          </div>
          <div>
            <h1 className="font-military-title font-extrabold text-lg text-yellow-300 leading-tight tracking-wide flex items-center gap-2">
              HỆ THỐNG QUẢN LÝ ĐÀO TẠO & ĐIỂM QUÂN SỰ
            </h1>
            <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
              BỘ QUỐC PHÒNG — TRƯỜNG QUÂN SỰ / HỌC VIỆN
            </p>
          </div>
        </div>

        {/* Tactical Navigation Tabs */}
        <nav className="flex space-x-1 bg-slate-950/90 p-1.5 rounded-xl border border-amber-500/30 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-lime-700 to-emerald-700 text-yellow-200 border border-yellow-400 shadow-lg'
                : 'text-slate-300 hover:text-yellow-300 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-yellow-400" />
            Dashboard Chỉ Huy
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'students'
                ? 'bg-gradient-to-r from-lime-700 to-emerald-700 text-yellow-200 border border-yellow-400 shadow-lg'
                : 'text-slate-300 hover:text-yellow-300 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-yellow-400" />
            Quản lý Học viên
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-lime-700 to-emerald-700 text-yellow-200 border border-yellow-400 shadow-lg'
                : 'text-slate-300 hover:text-yellow-300 hover:bg-slate-900'
            }`}
          >
            <Table className="w-4 h-4 text-yellow-400" />
            Bảng Quản lý Điểm
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-lime-700 to-emerald-700 text-yellow-200 border border-yellow-400 shadow-lg'
                : 'text-slate-300 hover:text-yellow-300 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-yellow-400" />
            Lộ trình Đào tạo
          </button>

          {(currentUser?.role === 'ROLE_BGH' || currentUser?.role === 'ROLE_PDT' || currentUser?.role === 'ROLE_BOMON') && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-lime-700 to-emerald-700 text-yellow-200 border border-yellow-400 shadow-lg'
                  : 'text-slate-300 hover:text-yellow-300 hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4 text-yellow-400" />
              Nhật ký Audit Log
            </button>
          )}

        </nav>

        {/* User Info & Military Role Switcher */}
        <div className="flex items-center space-x-3">
          <span className={`text-xs px-3 py-1 rounded-full border ${badge.color} font-bold shadow-md`}>
            {badge.label}
          </span>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-yellow-200">{currentUser?.fullName || 'Thượng úy Nguyễn Văn Giảng'}</p>
            <p className="text-[11px] text-emerald-400 font-mono">{currentUser?.username || 'giangvien_a'}</p>
          </div>
          <button
            onClick={onOpenLogin}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-yellow-400 border border-amber-500/40 transition shadow-md"
            title="Đổi vai trò Cán bộ / Chỉ huy"
          >
            <UserCheck className="w-5 h-5 text-yellow-400" />
          </button>
        </div>

      </div>
    </header>
  );
}
