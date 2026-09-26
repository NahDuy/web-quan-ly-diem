import apiClient from './apiClient';

/**
 * Audit Log API — Nhật ký kiểm toán sửa điểm
 */
const auditApi = {
  /**
   * Lấy danh sách audit log điểm (có phân trang)
   * @param {number} [page=0]
   * @param {number} [size=15]
   */
  getGradeAuditLogs: (page = 0, size = 15) =>
    apiClient
      .get('/audit-logs/grades', { params: { page, size } })
      .then((r) => r.data),
};

export default auditApi;
