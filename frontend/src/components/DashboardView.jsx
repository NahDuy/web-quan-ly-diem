import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CheckCircle2, XCircle, TrendingUp, Medal, BarChart3, PieChart, ShieldCheck, Award, Target, Flame, ChevronRight } from 'lucide-react';

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

const CLASSIFICATIONS = [
  { key: 'XUAT_SAC', label: 'Xuất sắc',   desc: 'Điểm TN ≥ 9.0', bg: '#fef3c7', color: '#b45309', barColor: '#d97706', border: '#fde047' },
  { key: 'GIOL',     label: 'Giỏi',       desc: '8.0 ≤ TN < 9.0', bg: '#dcfce7', color: '#15803d', barColor: '#16a34a', border: '#86efac' },
  { key: 'KHA',      label: 'Khá',        desc: '6.5 ≤ TN < 8.0', bg: '#f0fdf4', color: '#166534', barColor: '#22c55e', border: '#bbf7d0' },
  { key: 'TRUNG_BINH', label: 'Trung bình', desc: '5.0 ≤ TN < 6.5', bg: '#f1f5f9', color: '#475569', barColor: '#64748b', border: '#cbd5e1' },
  { key: 'KHONG_DAT', label: 'Không đạt', desc: 'TN < 5.0',       bg: '#fee2e2', color: '#dc2626', barColor: '#ef4444', border: '#fca5a5' },
];

const MAJOR_BREAKDOWN = [
  { code: 'TSBB', name: 'Trinh sát Bộ binh', total: 42, passRate: 88.1, avgScore: 7.85 },
  { code: 'COI',  name: 'Súng Cối 82mm',      total: 35, passRate: 85.7, avgScore: 7.62 },
  { code: 'DKZ',  name: 'Súng ĐKZ (82-K65)',  total: 30, passRate: 80.0, avgScore: 7.40 },
  { code: 'PK127',name: 'Phòng không 12,7mm', total: 28, passRate: 78.5, avgScore: 7.35 },
  { code: 'BB',   name: 'Binh chủng Hợp thành', total: 15, passRate: 86.6, avgScore: 7.70 },
];

function KpiCard({ icon: Icon, iconColor, label, value, unit, sub, barValue, badge }) {
  return (
    <div className="glass-panel p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </p>
        {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
      </div>
      {sub && <p className="text-[11px] text-slate-500 mt-1.5">{sub}</p>}
      {barValue != null && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden border border-slate-200">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(0, barValue))}%` }}
          />
        </div>
      )}
    </div>
  );
}

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

  const totalEvaluated = Object.values(data.classificationCounts || {}).reduce((a, b) => a + b, 0) || 150;
  const eligible = data.eligibleStudentsCount || 125;
  const ineligible = data.ineligibleStudentsCount || 25;
  const eligiblePercent = Math.round((eligible / (eligible + ineligible || 1)) * 100);

  // SVG Circular Gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (eligiblePercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-emerald-50 via-white to-amber-50 border border-emerald-200 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Logo Trường Quân Sự"
              className="w-14 h-14 rounded-full object-contain p-0.5 bg-white border border-amber-300 shadow-md shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>QUÂN KHU 3 — TRƯỜNG QUÂN SỰ</span>
              </div>
              <h2 className="font-military text-xl font-black text-slate-900 tracking-wide">
                DASHBOARD CHỈ HUY — TỔNG QUAN ĐÀO TẠO & HUẤN LUYỆN
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Hệ thống chỉ số sẵn sàng tốt nghiệp, phổ điểm phân loại học lực và tiến độ hoàn thành chỉ tiêu khóa học
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Cập nhật hệ thống</span>
              <span className="text-xs font-mono font-bold text-slate-800">Khóa huấn luyện 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          iconColor="#b45309"
          label="Quân số Toàn Khóa"
          value={data.totalStudents}
          unit="đồng chí"
          sub="Đang tham gia huấn luyện tại các đại đội"
        />
        <KpiCard
          icon={TrendingUp}
          iconColor="#15803d"
          label="Tỷ lệ Đủ Điều Kiện TN"
          value={`${data.passRatePercentage}%`}
          barValue={data.passRatePercentage}
          sub="Đạt ngưỡng đánh giá hoàn thành nhiệm vụ"
        />
        <KpiCard
          icon={CheckCircle2}
          iconColor="#0284c7"
          label="Đủ Điều Kiện Dự Thi TN"
          value={data.eligibleStudentsCount}
          unit="đồng chí"
          sub="Điểm TB ≥ 5.0 và không vi phạm kỷ luật"
        />
        <KpiCard
          icon={XCircle}
          iconColor="#dc2626"
          label="Chưa Đủ Điều Kiện"
          value={data.ineligibleStudentsCount}
          unit="đồng chí"
          sub="Cần bồi dưỡng bổ sung quân sự / chính trị"
        />
      </div>

      {/* VISUAL CHARTS ROW: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Circular Gauge & Donut Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-emerald-800">
              <PieChart className="w-5 h-5 text-emerald-700" />
              <h3 className="font-military text-sm font-bold text-slate-900 uppercase">
                Tỷ Lệ Tốt Nghiệp Sẵn Sàng Chiến Đấu
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {eligiblePercent}% ĐẠT
            </span>
          </div>

          {/* Circular Donut Gauge SVG */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className="text-slate-100"
                  strokeWidth="13"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="#15803d"
                  strokeWidth="13"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 leading-tight">
                  {eligiblePercent}%
                </span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Đủ Điều Kiện
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-3 border-t border-slate-100">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] font-semibold text-emerald-800 block">Đủ Điều Kiện</span>
                <span className="text-base font-extrabold text-emerald-900">{eligible} đ/c</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-center">
                <span className="text-[10px] font-semibold text-red-700 block">Chưa Đủ Điều Kiện</span>
                <span className="text-base font-extrabold text-red-800">{ineligible} đ/c</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Phổ Điểm Xếp Loại Học Lực Bar Visual (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-amber-800">
              <BarChart3 className="w-5 h-5 text-amber-700" />
              <h3 className="font-military text-sm font-bold text-slate-900 uppercase">
                Phổ Phân Phối Xếp Loại Học Lực Toàn Khóa
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              Tổng số {totalEvaluated} học viên
            </span>
          </div>

          <div className="space-y-3.5 my-auto py-3">
            {CLASSIFICATIONS.map(({ key, label, desc, barColor, color }) => {
              const count = data.classificationCounts?.[key] ?? 0;
              const percent = totalEvaluated > 0 ? Math.round((count / totalEvaluated) * 100) : 0;

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: barColor }} />
                      <span className="text-slate-800 font-bold">{label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({desc})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-900 font-bold">{count} đ/c</span>
                      <span className="text-slate-400 text-[11px] w-9 text-right">({percent}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(4, percent)}%`,
                        backgroundColor: barColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Tiêu chí đánh giá theo Quy chế Quân khu 3</span>
            <span className="font-bold text-emerald-800">Tỷ lệ Khá & Giỏi & Xuất sắc: {Math.round((((data.classificationCounts?.XUAT_SAC || 0) + (data.classificationCounts?.GIOL || 0) + (data.classificationCounts?.KHA || 0)) / totalEvaluated) * 100)}%</span>
          </div>
        </div>

      </div>

      {/* SUMMARY BY SPECIALIZED MAJORS (CHUYÊN NGÀNH HUẤN LUYỆN) */}
      <div className="glass-panel p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900">
            <Target className="w-5 h-5 text-amber-700" />
            <h3 className="font-military text-sm font-bold uppercase">
              Báo Cáo Tỷ Lệ Đạt Theo Chuyên Ngành Đào Tạo
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            5 Chuyên ngành trọng điểm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {MAJOR_BREAKDOWN.map((m) => (
            <div key={m.code} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  {m.code}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {m.passRate}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate" title={m.name}>
                {m.name}
              </h4>
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Quân số: <b>{m.total}</b></span>
                <span>ĐTB: <b className="text-slate-800">{m.avgScore}</b></span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${m.passRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Military Honors Breakdown Cards */}
      <div className="glass-panel p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <h3 className="font-military text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
          <Medal size={18} className="text-amber-700" />
          <span>CHI TIẾT PHÂN BỔ BẰNG KHEN & XẾP HẠNG TỐT NGHIỆP</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CLASSIFICATIONS.map(({ key, label, desc, bg, color, border }) => (
            <div
              key={key}
              style={{ background: bg, borderColor: border }}
              className="rounded-xl border p-4 text-center transition hover:shadow-xs"
            >
              <p style={{ color }} className="text-xs font-bold mb-1">{label}</p>
              <p style={{ color }} className="text-2xl font-black leading-tight">
                {data.classificationCounts?.[key] ?? 0}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
