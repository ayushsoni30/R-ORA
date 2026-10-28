import api from './api';

export const roomService = {
  async getRooms(skip = 0, limit = 20) {
    const response = await api.get('/api/rooms/', {
      params: { skip, limit },
    });
    return response.data;
  },

  async searchRooms(location, skip = 0, limit = 20) {
    const response = await api.get('/api/rooms/search', {
      params: { location, skip, limit },
    });
    return response.data;
  },

  async getRoomById(id) {
    const response = await api.get(`/api/rooms/${id}`);
    return response.data;
  },

  async createRoom(data) {
    const response = await api.post('/api/rooms/', data);
    return response.data;
  },

  async updateRoom(id, data) {
    const response = await api.put(`/api/rooms/${id}`, data);
    return response.data;
  },

  async deleteRoom(id) {
    const response = await api.delete(`/api/rooms/${id}`);
    return response.data;
  },

  async updateRoomStatus(id, status) {
    const response = await api.patch(`/api/rooms/${id}/status`, { status });
    return response.data;
  },

  async getOwnerRooms(skip = 0, limit = 50) {
    const response = await api.get('/api/rooms/owner', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getOwnerDashboard() {
    const response = await api.get('/api/rooms/owner/dashboard');
    return response.data;
  },
};
