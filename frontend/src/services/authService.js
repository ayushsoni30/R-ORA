import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },
};
