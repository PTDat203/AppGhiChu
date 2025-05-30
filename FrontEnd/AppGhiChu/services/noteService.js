import api from './api';

export const noteService = {  // Lấy tất cả ghi chú
  getAllNotes: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/notes?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy danh sách ghi chú',
      };
    }
  },

  // Lấy ghi chú hôm nay
  getTodayNotes: async () => {
    try {
      const response = await api.get('/notes/today');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy ghi chú hôm nay',
      };
    }
  },

  // Lấy chi tiết ghi chú
  getNoteById: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy chi tiết ghi chú',
      };
    }
  },  // Tạo ghi chú mới
  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes', {
        ...noteData,
        category: 'personal',
        priority: 'medium'
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo ghi chú mới',
      };
    }
  },

  // Cập nhật ghi chú
  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật ghi chú',
      };
    }
  },

  // Xóa ghi chú
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa ghi chú',
      };
    }
  },

};
