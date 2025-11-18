import React, { createContext, useContext, useState } from 'react';
import { DEMO_USERS } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Email atau password salah' };
  };

  const quickLogin = (role) => {
    const user = DEMO_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Role tidak ditemukan' };
  };

  const switchRole = (userId) => {
    const user = DEMO_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'User tidak ditemukan' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;

    const permissions = {
      admin: ['view_all', 'edit_all', 'manage_users', 'add_audit', 'view_analytics', 'manage_monthly_reports'],
      kosek_staff: ['view_all', 'view_analytics', 'manage_monthly_reports', 'add_monthly_report'],
      assistant: ['view_all', 'submit_assistant_report'],
      satrad_head: ['view_all', 'submit_satrad_report', 'view_analytics'],
      auditor: ['view_all', 'add_audit', 'view_analytics'],
      analyst: ['view_all', 'view_analytics'],
      manager: ['view_own', 'edit_own'],
    };

    return permissions[currentUser.role]?.includes(permission) || false;
  };

  const value = {
    currentUser,
    login,
    quickLogin,
    switchRole,
    logout,
    hasPermission,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
