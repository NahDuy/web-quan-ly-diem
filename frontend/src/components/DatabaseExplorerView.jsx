import React, { useState, useEffect } from 'react';
import {
  Database,
  ExternalLink,
  RefreshCw,
  Search,
  Table as TableIcon,
  Server,
  Layers,
  FileText,
  Info,
  CheckCircle,
} from 'lucide-react';

export default function DatabaseExplorerView() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('STUDENTS');
  const [tableData, setTableData] = useState({ columns: [], rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable, page);
    }
  }, [selectedTable, page]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/system/database-tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
        if (data.length > 0 && !selectedTable) {
          setSelectedTable(data[0].tableName);
        }
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName, pageIndex) => {
    setTableLoading(true);
    try {
      const res = await fetch(`/api/v1/system/database-tables/${tableName}?page=${pageIndex}&size=${pageSize}`);
      if (res.ok) {
        const data = await res.json();
        setTableData(data);
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
    } finally {
      setTableLoading(false);
    }
  };

  const filteredRows = (tableData.rows || []).filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some(
      (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header & System Overview */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#f0fdf4',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Database size={22} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Quản Trị & Trực Quan Hóa Cơ Sở Dữ Liệu
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Xem trực quan cấu trúc các bảng và dữ liệu lưu trữ nhị phân của CSDL hệ thống (H2 Database Engine)
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => {
                fetchTables();
                if (selectedTable) fetchTableData(selectedTable, page);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={15} className={loading || tableLoading ? 'animate-spin' : ''} />
              Làm mới
            </button>

            <a
              href="/h2-console"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
              }}
            >
              <ExternalLink size={16} />
              Mở H2 Web Console (SQL Query)
            </a>
          </div>
        </div>

        {/* Database specs bar */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={18} color="#64748b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Động cơ CSDL</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>H2 Database Engine (MVStore)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="#64748b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Vị trí lưu trữ dữ liệu</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>.\data\grade_db.mv.db</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={18} color="#64748b" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Chế độ tương thích</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>PostgreSQL Compatible</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} color="#16a34a" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Trạng thái kết nối</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#16a34a' }}>ĐÃ KẾT NỐI (ONLINE)</div>
            </div>
          </div>
        </div>

        {/* Info notice about H2 Web Console login */}
        <div
          style={{
            marginTop: '16px',
            padding: '10px 14px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Mẹo khi mở H2 Web Console:</strong> JDBC URL: <code>jdbc:h2:file:./data/grade_db;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;AUTO_SERVER=TRUE</code> | User Name: <code>sa</code> | Password: <i>(để trống)</i>.
          </span>
        </div>
      </div>

      {/* Main Grid: Left Table List + Right Table Data Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Left Side: Table List Cards */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            maxHeight: 'calc(100vh - 280px)',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Danh Sách Các Bảng ({tables.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tables.map((t) => {
              const isActive = selectedTable === t.tableName;
              return (
                <div
                  key={t.tableName}
                  onClick={() => {
                    setSelectedTable(t.tableName);
                    setPage(0);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: isActive ? '1px solid #16a34a' : '1px solid #f1f5f9',
                    background: isActive ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <TableIcon size={16} color={isActive ? '#16a34a' : '#64748b'} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 600, color: isActive ? '#15803d' : '#1e293b' }}>
                        {t.displayName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                        {t.tableName}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: isActive ? '#dcfce7' : '#f1f5f9',
                      color: isActive ? '#166534' : '#475569',
                    }}
                  >
                    {t.rowCount.toLocaleString()} dòng
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Data Grid Viewer */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Table Data Header & Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                Bảng: {selectedTable}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Tổng cộng: <strong>{tableData.total.toLocaleString()}</strong> bản ghi trong CSDL (Đang hiển thị {filteredRows.length} bản ghi)
              </div>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Tìm kiếm trong dữ liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Table Data Render */}
          <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 380px)', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            {tableLoading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                Đang nạp dữ liệu từ CSDL...
              </div>
            ) : tableData.columns.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                Bảng hiện tại chưa có dữ liệu bản ghi nào.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', width: '40px', color: '#64748b' }}>#</th>
                    {tableData.columns.map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: '10px 14px',
                          color: '#334155',
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          borderRight: '1px solid #f1f5f9',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        background: idx % 2 === 0 ? '#ffffff' : '#fcfcfd',
                      }}
                    >
                      <td style={{ padding: '8px 14px', color: '#94a3b8', fontSize: '0.75rem' }}>
                        {page * pageSize + idx + 1}
                      </td>
                      {tableData.columns.map((col) => {
                        const val = row[col];
                        let displayVal = val;
                        if (val === null || val === undefined) {
                          displayVal = <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>null</span>;
                        } else if (typeof val === 'boolean') {
                          displayVal = val ? 'TRUE' : 'FALSE';
                        } else if (typeof val === 'object') {
                          displayVal = JSON.stringify(val);
                        }
                        return (
                          <td
                            key={col}
                            style={{
                              padding: '8px 14px',
                              color: '#1e293b',
                              whiteSpace: 'nowrap',
                              maxWidth: '280px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              borderRight: '1px solid #f1f5f9',
                            }}
                            title={String(val)}
                          >
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {tableData.total > pageSize && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Hiển thị trang {page + 1} / {Math.ceil(tableData.total / pageSize)}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: page === 0 ? '#f1f5f9' : '#ffffff',
                    color: page === 0 ? '#94a3b8' : '#334155',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '0.8125rem',
                  }}
                >
                  Trang trước
                </button>
                <button
                  disabled={(page + 1) * pageSize >= tableData.total}
                  onClick={() => setPage(page + 1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: (page + 1) * pageSize >= tableData.total ? '#f1f5f9' : '#ffffff',
                    color: (page + 1) * pageSize >= tableData.total ? '#94a3b8' : '#334155',
                    cursor: (page + 1) * pageSize >= tableData.total ? 'not-allowed' : 'pointer',
                    fontSize: '0.8125rem',
                  }}
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
