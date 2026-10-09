import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, CheckCircle2, XCircle, TrendingUp, Medal } from 'lucide-react';

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
  { key: 'XUAT_SAC', label: 'Xuất sắc',   desc: 'Điểm TN ≥ 9.0', bg: '#fef3c7', color: '#b45309', border: '#fde047' },
  { key: 'GIOL',     label: 'Giỏi',       desc: '8.0 ≤ TN < 9.0', bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  { key: 'KHA',      label: 'Khá',        desc: '6.5 ≤ TN < 8.0', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  { key: 'TRUNG_BINH', label: 'Trung bình', desc: '5.0 ≤ TN < 6.5', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  { key: 'KHONG_DAT', label: 'Không đạt', desc: 'TN < 5.0',       bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
];

function KpiCard({ icon: Icon, iconColor, label, value, unit, sub, barValue }) {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
        {value}{' '}
        {unit && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>{unit}</span>}
      </p>
      {sub && <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>{sub}</p>}
      {barValue != null && (
        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
          <div style={{ height: '100%', background: '#15803d', borderRadius: '3px', width: `${barValue}%`, transition: 'width 0.8s ease' }} />
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)', border: '1px solid #86efac' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src="/logo.png"
            alt="Logo Học Viện Quân Sự"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              objectFit: 'contain',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              flexShrink: 0,
            }}
          />
          <div>
            <h2 className="font-military" style={{ fontSize: '1.15rem', color: '#0f172a' }}>
              DASHBOARD BÁO CÁO CHỈ HUY — TỔNG QUAN KẾT QUẢ ĐÀO TẠO & HUẤN LUYỆN
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
              Báo cáo quân số học viên, tỷ lệ đủ điều kiện thi tốt nghiệp quân sự và phân loại rèn luyện kỷ luật
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <KpiCard
          icon={Users}
          iconColor="#b45309"
          label="Quân số Học viên"
          value={data.totalStudents}
          unit="đồng chí"
          sub="Đang tham gia huấn luyện toàn khóa"
        />
        <KpiCard
          icon={TrendingUp}
          iconColor="#15803d"
          label="Tỷ lệ Đạt Điều kiện TN"
          value={`${data.passRatePercentage}%`}
          barValue={data.passRatePercentage}
          sub="Chỉ số hoàn thành chỉ tiêu khóa học"
        />
        <KpiCard
          icon={CheckCircle2}
          iconColor="#0284c7"
          label="Đủ Điều Kiện Dự Thi TN"
          value={data.eligibleStudentsCount}
          unit="đồng chí"
          sub="Rèn luyện Quân sự ≥ Khá & Điểm TB ≥ 6.5"
        />
        <KpiCard
          icon={XCircle}
          iconColor="#dc2626"
          label="Chưa Đủ Điều Kiện"
          value={data.ineligibleStudentsCount}
          unit="đồng chí"
          sub="Cần ôn luyện bổ sung kỷ luật / quân sự"
        />
      </div>

      {/* Military Honors Breakdown */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 className="font-military" style={{ fontSize: '0.98rem', color: '#b45309', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Medal size={20} style={{ color: '#b45309' }} />
          PHÂN PHỐI XẾP LOẠI TỐT NGHIỆP QUÂN SỰ
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {CLASSIFICATIONS.map(({ key, label, desc, bg, color, border }) => (
            <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.78rem', color, fontWeight: 700, marginBottom: '6px' }}>{label}</p>
              <p style={{ fontSize: '1.85rem', fontWeight: 900, color, lineHeight: 1 }}>
                {data.classificationCounts?.[key] ?? 0}
              </p>
              <p style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '6px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
