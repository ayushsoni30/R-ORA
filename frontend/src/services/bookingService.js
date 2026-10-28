import api from './api';

export const bookingService = {
  async createBooking(roomId) {
    const response = await api.post('/api/bookings/', { room_id: roomId });
    return response.data;
  },

  async getMyBookings(skip = 0, limit = 50) {
    const response = await api.get('/api/bookings/my', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getOwnerBookings(skip = 0, limit = 50) {
    const response = await api.get('/api/bookings/owner', {
      params: { skip, limit },
    });
    return response.data;
  },

  async updateBookingStatus(bookingId, status) {
    const response = await api.patch(`/api/bookings/${bookingId}`, { status });
    return response.data;
  },

  async cancelBooking(bookingId) {
    const response = await api.patch(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },

  async getOwnerContact(bookingId) {
    const response = await api.get(`/api/bookings/${bookingId}/contact`);
    return response.data;
  },

  async getStudentContact(bookingId) {
    const response = await api.get(`/api/bookings/${bookingId}/student-contact`);
    return response.data;
  },
};
