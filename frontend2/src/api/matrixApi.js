import apiClient from './apiClient';

/**
 * Matrix API — Bảng điểm ma trận lớp (quản lý điểm, khóa/mở khóa, import/export Excel)
 */
const matrixApi = {
  /**
   * Lấy dữ liệu ma trận điểm của lớp theo học kỳ
   * @param {number} classId
   * @param {number} semester
   */
  getMatrix: (classId, semester) =>
    apiClient
      .get(`/classes/${classId}/matrix`, { params: { semester } })
      .then((r) => r.data),

  /**
   * Lưu điểm hàng loạt kèm lý do audit
   * @param {number} classId
   * @param {{semester, reason, gradeUpdates: Array<{studentId, subjectId, score}>}} payload
   */
  bulkUpdateGrades: (classId, payload) =>
    apiClient
      .post(`/classes/${classId}/matrix/bulk-update`, payload)
      .then((r) => r.data),

  /**
   * Khóa bảng điểm lớp
   * @param {number} classId
   * @param {number} semester
   */
  lockMatrix: (classId, semester) =>
    apiClient
      .post(`/classes/${classId}/lock`, null, { params: { semester } })
      .then((r) => r.data),

  /**
   * Mở khóa bảng điểm lớp (quyền BGH/PDT)
   * @param {number} classId
   * @param {number} semester
   */
  unlockMatrix: (classId, semester) =>
    apiClient
      .post(`/classes/${classId}/unlock`, null, { params: { semester } })
      .then((r) => r.data),

  /**
   * Import file Excel ma trận điểm lớp
   * @param {number} classId
   * @param {File} file
   */
  importExcel: (classId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post(`/classes/${classId}/import-excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  /**
   * Xuất file Excel ma trận điểm
   * @param {number} classId
   * @param {number} semester
   * @returns URL để tải file
   */
  getExportExcelUrl: (classId, semester) =>
    `/api/v1/classes/${classId}/export-excel?semester=${semester}`,
};

export default matrixApi;
