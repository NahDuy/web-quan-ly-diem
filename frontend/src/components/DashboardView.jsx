import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Award, CheckCircle2, XCircle, TrendingUp, ShieldCheck, Shield, Star, Medal } from 'lucide-react';

const MOCK_MILITARY_DASHBOARD = {
  totalStudents: 150,
  eligibleStudentsCount: 125,
  ineligibleStudentsCount: 25,
  passRatePercentage: 83.3,
  classificationCounts: {
    XUAT_SAC: 20,
    GIOL: 55,
    KHA: 50,
    TRUNG_BINH: 15,
    KHONG_DAT: 10
  }
};

export default function DashboardView() {
  const [data, setData] = useState(MOCK_MILITARY_DASHBOARD);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/v1/dashboard/summary', { headers });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (e) {
        setData(MOCK_MILITARY_DASHBOARD);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-950 via-emerald-950/60 to-slate-950 border border-amber-500/30">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-amber-600 to-yellow-600 text-yellow-950 rounded-2xl border border-yellow-300/40 shadow-lg">
            <LayoutDashboard className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <h2 className="font-military-title text-xl font-bold text-yellow-300 tracking-wide">
              DASHBOARD BÁO CÁO CHỈ HUY — TỔNG QUAN KẾT QUẢ ĐÀO TẠO & HUẤN LUYỆN
            </h2>
            <p className="text-xs text-emerald-400 font-medium">
              Báo cáo quân số học viên, tỷ lệ đủ điều kiện thi tốt nghiệp quân sự và phân loại rèn luyện kỷ luật
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Cadets */}
        <div className="glass-panel p-5 border border-amber-500/30 bg-slate-950/90 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Quân số Học viên</span>
            <Users className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-black text-white">{data.totalStudents} <span className="text-xs font-normal text-slate-400">đồng chí</span></p>
          <p className="text-[11px] text-emerald-400 mt-1">Đang tham gia huấn luyện toàn khóa</p>
        </div>

        {/* Card 2: Pass Rate */}
        <div className="glass-panel p-5 border border-amber-500/30 bg-slate-950/90 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Tỷ lệ Đạt Điều kiện TN</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{data.passRatePercentage}%</p>
          <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden border border-emerald-900">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.passRatePercentage}%` }}></div>
          </div>
        </div>

        {/* Card 3: Eligible Cadets */}
        <div className="glass-panel p-5 border border-amber-500/30 bg-slate-950/90 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Đủ Điều Kiện Dự Thi TN</span>
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-400">{data.eligibleStudentsCount} <span className="text-xs font-normal text-slate-400">đồng chí</span></p>
          <p className="text-[11px] text-slate-400 mt-1">Rèn luyện Quân sự $\ge$ Khá & TB $\ge$ 6.5</p>
        </div>

        {/* Card 4: Ineligible Cadets */}
        <div className="glass-panel p-5 border border-amber-500/30 bg-slate-950/90 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Chưa Đủ Điều Kiện</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400">{data.ineligibleStudentsCount} <span className="text-xs font-normal text-slate-400">đồng chí</span></p>
          <p className="text-[11px] text-slate-400 mt-1">Cần ôn luyện bổ sung kỷ luật / quân sự</p>
        </div>

      </div>

      {/* Military Honors Breakdown */}
      <div className="glass-panel p-6 border border-amber-500/30 rounded-2xl">
        <h3 className="font-military-title text-md font-bold text-yellow-300 mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-400" />
          PHÂN PHỐI XẾP LOẠI TỐT NGHIỆP QUÂN SỰ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-amber-950/40 border border-yellow-500/40 p-4 rounded-xl text-center shadow-md">
            <p className="text-xs text-yellow-300 font-bold mb-1">Xuất sắc</p>
            <p className="text-2xl font-black text-yellow-400">{data.classificationCounts.XUAT_SAC}</p>
            <p className="text-[10px] text-slate-400 mt-1">Điểm TN $\ge$ 9.0</p>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl text-center shadow-md">
            <p className="text-xs text-emerald-300 font-bold mb-1">Giỏi</p>
            <p className="text-2xl font-black text-emerald-400">{data.classificationCounts.GIOL}</p>
            <p className="text-[10px] text-slate-400 mt-1">8.0 $\le$ TN &lt; 9.0</p>
          </div>

          <div className="bg-lime-950/40 border border-lime-500/40 p-4 rounded-xl text-center shadow-md">
            <p className="text-xs text-lime-300 font-bold mb-1">Khá</p>
            <p className="text-2xl font-black text-lime-400">{data.classificationCounts.KHA}</p>
            <p className="text-[10px] text-slate-400 mt-1">6.5 $\le$ TN &lt; 8.0</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center shadow-md">
            <p className="text-xs text-slate-300 font-bold mb-1">Trung bình</p>
            <p className="text-2xl font-black text-slate-300">{data.classificationCounts.TRUNG_BINH}</p>
            <p className="text-[10px] text-slate-400 mt-1">5.0 $\le$ TN &lt; 6.5</p>
          </div>

          <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-xl text-center shadow-md">
            <p className="text-xs text-red-300 font-bold mb-1">Không đạt</p>
            <p className="text-2xl font-black text-red-400">{data.classificationCounts.KHONG_DAT}</p>
            <p className="text-[10px] text-slate-400 mt-1">TN &lt; 5.0 / Chưa đủ ĐK</p>
          </div>
        </div>
      </div>

    </div>
  );
}
