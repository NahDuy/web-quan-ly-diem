import apiClient from './apiClient';

/**
 * Students API — Quản lý quân số học viên
 */
const studentsApi = {
  /**
   * Lấy danh sách học viên (có thể lọc theo lớp)
   * @param {number|string} [classId] - ID lớp, bỏ trống để lấy tất cả
   */
  getStudents: (classId) => {
    const params = classId ? { classId } : {};
    return apiClient.get('/students', { params }).then((r) => r.data);
  },

  /**
   * Thêm mới học viên
   * @param {{studentCode, fullName, dob, pob, gender, rank, classId}} payload
   */
  createStudent: (payload) =>
    apiClient.post('/students', payload).then((r) => r.data),

  /**
   * Xóa học viên theo ID
   * @param {number} id
   */
  deleteStudent: (id) =>
    apiClient.delete(`/students/${id}`).then((r) => r.data),
};

export default studentsApi;
