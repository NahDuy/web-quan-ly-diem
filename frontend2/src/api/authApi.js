import apiClient from './apiClient';

/**
 * Auth API — Đăng nhập, xác thực người dùng
 */
const authApi = {
  /**
   * Đăng nhập hệ thống
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{token: string, username: string, fullName: string, role: string}>}
   */
  login: (username, password) =>
    apiClient.post('/auth/login', { username, password }).then((r) => r.data),

  /**
   * Lấy thông tin người dùng hiện tại từ token
   * @returns {Promise<{username: string, fullName: string, role: string, departmentId: number}>}
   */
  getMe: () => apiClient.get('/auth/me').then((r) => r.data),
};

export default authApi;
