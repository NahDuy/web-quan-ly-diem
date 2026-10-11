import React from 'react';
import { AlertTriangle, Trash2, X, Lock, Unlock, HelpCircle } from 'lucide-react';

/**
 * ConfirmModal - Hộp thoại xác nhận hành động chuyên nghiệp thay thế window.confirm / alert
 * 
 * Props:
 * - isOpen: boolean
 * - title: string (Tiêu đề modal, vd: 'Xác nhận xóa học viên')
 * - message: string (Nội dung chi tiết, vd: 'Bạn có chắc chắn muốn xóa học viên Nguyễn Văn An?')
 * - itemName?: string (Tên/Mã đối tượng cần thao tác làm nổi bật)
 * - warningNote?: string (Cảnh báo phụ, vd: 'Dữ liệu điểm số và thông tin cá nhân sẽ bị xóa hoàn toàn')
 * - confirmLabel?: string (Nhãn nút xác nhận, mặc định: 'Xác nhận xóa')
 * - cancelLabel?: string (Nhãn nút hủy, mặc định: 'Hủy bỏ')
 * - type?: 'danger' | 'warning' | 'info' (Loại cảnh báo, mặc định 'danger')
 * - onConfirm: () => void (Callback khi người dùng bấm xác nhận)
 * - onClose: () => void (Callback khi người dùng bấm hủy hoặc đóng)
 * - loading?: boolean (Trạng thái đang thực hiện)
 */
export default function ConfirmModal({
  isOpen,
  title = 'Xác nhận thao tác',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  itemName,
  warningNote,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  type = 'danger',
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const isWarning = type === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header với dải màu tương ứng */}
        <div className={`p-4 sm:p-5 flex items-start gap-3.5 border-b ${
          isDanger ? 'bg-rose-50/70 border-rose-100' : isWarning ? 'bg-amber-50/70 border-amber-100' : 'bg-blue-50/70 border-blue-100'
        }`}>
          <div className={`p-2.5 rounded-xl shrink-0 ${
            isDanger ? 'bg-rose-100 text-rose-600' : isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {isDanger ? (
              <Trash2 className="w-5 h-5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold font-military leading-snug ${
              isDanger ? 'text-rose-950' : isWarning ? 'text-amber-950' : 'text-slate-900'
            }`}>
              {title}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thân Modal: Chi tiết đối tượng cần thao tác */}
        <div className="p-4 sm:p-5 space-y-3">
          {itemName && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">
                Đối tượng được chọn:
              </span>
              <span className="text-sm font-bold text-slate-900 font-mono break-words">
                {itemName}
              </span>
            </div>
          )}

          {warningNote ? (
            <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{warningNote}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              * Lưu ý: Thao tác này sẽ cập nhật trực tiếp vào cơ sở dữ liệu và ghi nhận nhật ký hệ thống.
            </p>
          )}
        </div>

        {/* Footer: Cặp nút hành động */}
        <div className="p-4 sm:p-5 pt-0 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center gap-1.5 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                : isWarning
                ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {isDanger && <Trash2 className="w-3.5 h-3.5" />}
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
