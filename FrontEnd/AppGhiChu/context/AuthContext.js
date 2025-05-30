import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const isLoggedIn = await authService.isLoggedIn();
      
      if (isLoggedIn) {
        const userInfo = await authService.getUserInfo();
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: 'Đăng nhập thất bại' };
    }
  };
  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        
        return { 
          success: true, 
          message: 'Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.' 
        };
      } else {
        return { 
          success: false, 
          message: result.message || 'Đăng ký thất bại'
        };
      }
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      return {
        success: false,
        message: error.message || 'Có lỗi xảy ra khi đăng ký'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      // Vẫn clear state local dù API có lỗi
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
