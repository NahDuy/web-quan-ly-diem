import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', maxWidth: '850px', margin: '40px auto', background: '#ffffff', border: '2px solid #ef4444', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#dc2626', fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ PHÁT HIỆN LỖI KỸ THUẬT KHI KẾT XUẤT GIAO DIỆN
          </h2>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '16px' }}>
            Trình duyệt gặp lỗi ngoại lệ khi hiển thị thành phần giao diện. Chi tiết lỗi kỹ thuật:
          </p>
          <pre style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '14px', borderRadius: '8px', fontSize: '0.825rem', overflowX: 'auto', marginBottom: '18px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
            {this.state.error?.toString()}
            {'\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
            >
              🔄 Xóa Dữ Liệu Cache & Đăng Nhập Lại
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '10px 20px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

