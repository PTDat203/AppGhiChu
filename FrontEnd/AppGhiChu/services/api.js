import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Cấu hình base URL cho development và production
const DEV_IP = '192.168.1.8'; // IP máy tính trong mạng local

const BASE_URL = __DEV__
  ? `http://${DEV_IP}:3001/api`  // Development
  : 'http://your-production-url.com/api'; // Production// Production

// Tạo instance axios
const api = axios.create({
  baseURL: BASE_URL,  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }    } catch (error) {
      // Ignore token error
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    // Xử lý lỗi network
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        response: {
          data: {
            message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
          }
        }
      });
    }

    // Xử lý lỗi không có response
    if (!error.response) {
      return Promise.reject({
        response: {
          data: {
            message: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
          }
        }
      });
    }

    // Xử lý token hết hạn
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
    }

    return Promise.reject(error);
  }
);



export default api;
