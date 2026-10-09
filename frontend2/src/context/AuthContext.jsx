import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const user = await authApi.getMe();
          setCurrentUser(user);
        } catch {
          localStorage.removeItem('jwt_token');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authApi.login(username, password);
      if (data.token) {
        localStorage.setItem('jwt_token', data.token);
      }
      // Fetch user profile from /auth/me or login response
      const user = await authApi.getMe().catch(() => data);
      setCurrentUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Đăng nhập thất bại' };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
