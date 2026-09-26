import apiClient from './apiClient';

/**
 * Dashboard API — Thống kê, báo cáo tổng quan chỉ huy
 */
const dashboardApi = {
  /**
   * Lấy dữ liệu tổng quan dashboard
   * @returns {Promise<{totalStudents, eligibleStudentsCount, ineligibleStudentsCount, passRatePercentage, classificationCounts}>}
   */
  getSummary: () => apiClient.get('/dashboard/summary').then((r) => r.data),
};

export default dashboardApi;
