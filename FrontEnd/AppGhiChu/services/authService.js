import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Đăng ký
  register: async (userData) => {
    try {
      console.log('Register payload:', userData); // Log dữ liệu gửi lên
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };    } catch (error) {
      console.log('Register error full:', error);
      console.log('Register error response:', error.response);
      console.log('Register error data:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Đăng ký thất bại',
      };
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Lưu token và thông tin user vào AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
      return {
        success: true,
        data: response.data,
        token,
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      };
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post('/auth/logout');
      
      // Xóa token và thông tin user khỏi AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      
      return {
        success: true,
      };
    } catch (error) {
      // Vẫn xóa local storage dù API có lỗi
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      
      return {
        success: true, // Coi như thành công vì đã xóa local
      };
    }
  },

  // Lấy thông tin profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin profile',
      };
    }
  },

  // Kiểm tra trạng thái đăng nhập
  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Lấy thông tin user từ AsyncStorage
  getUserInfo: async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  },
};
