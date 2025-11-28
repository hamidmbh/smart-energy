import axios, { AxiosResponse } from 'axios';
import { Room, Sensor, Alert, EnergyConsumption, Intervention, User } from '@/types';

// Configure base URL for Laravel API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const unwrap = <T>(response: AxiosResponse<any, any>): T =>
  response.data?.data ?? response.data;

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/user'),
};

export const roomsAPI = {
  getAll: () =>
    api.get('/rooms').then((res) => ({ data: unwrap<Room[]>(res) })),
  getOne: (id: string) =>
    api.get(`/rooms/${id}`).then((res) => ({ data: unwrap<Room>(res) })),
  create: (data: Omit<Room, 'id'>) =>
    api.post('/rooms', data).then((res) => ({ data: unwrap<Room>(res) })),
  update: (id: string, data: Partial<Room>) =>
    api.put(`/rooms/${id}`, data).then((res) => ({ data: unwrap<Room>(res) })),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  updateMode: (id: string, mode: string) =>
    api.patch(`/rooms/${id}/mode`, { mode }).then((res) => ({ data: unwrap<Room>(res) })),
  controlEquipment: (id: string, equipment: 'light' | 'climatization', state: boolean) =>
    api.patch(`/rooms/${id}/equipment`, { equipment, state }).then((res) => ({ data: unwrap<Room>(res) })),
};

export const sensorsAPI = {
  getAll: () =>
    api.get('/sensors').then((res) => ({ data: unwrap<Sensor[]>(res) })),
  getByRoom: (roomId: string) =>
    api.get(`/sensors/room/${roomId}`).then((res) => ({ data: unwrap<Sensor[]>(res) })),
  getReadings: (sensorId: string, limit = 50) =>
    api.get(`/sensors/${sensorId}/readings`, { params: { limit } }).then((res) => ({ data: unwrap<any[]>(res) })),
  create: (data: Omit<Sensor, 'id'>) =>
    api.post('/sensors', data).then((res) => ({ data: unwrap<Sensor>(res) })),
  update: (id: string, data: Partial<Sensor>) =>
    api.put(`/sensors/${id}`, data).then((res) => ({ data: unwrap<Sensor>(res) })),
  delete: (id: string) => api.delete(`/sensors/${id}`),
};

export const alertsAPI = {
  getAll: () =>
    api.get('/alerts').then((res) => ({ data: unwrap<Alert[]>(res) })),
  acknowledge: (id: string) =>
    api.patch(`/alerts/${id}/acknowledge`).then((res) => ({ data: unwrap<Alert>(res) })),
  resolve: (id: string, notes?: string) =>
    api.patch(`/alerts/${id}/resolve`, { notes }).then((res) => ({ data: unwrap<Alert>(res) })),
};

export const energyAPI = {
  getConsumption: (period: string, roomId?: string) =>
    api
      .get('/energy/consumption', { params: { period, roomId } })
      .then((res) => ({ data: unwrap<EnergyConsumption[]>(res) })),
  getStatistics: (startDate: string, endDate: string, roomId?: string) =>
    api
      .get('/energy/statistics', { params: { start_date: startDate, end_date: endDate, roomId } })
      .then((res) => ({ data: res.data })),
};

export const interventionsAPI = {
  getAll: () =>
    api.get('/interventions').then((res) => ({ data: unwrap<Intervention[]>(res) })),
  getByTechnician: (technicianId: string) =>
    api.get(`/interventions/technician/${technicianId}`).then((res) => ({ data: unwrap<Intervention[]>(res) })),
  create: (data: Omit<Intervention, 'id'>) =>
    api.post('/interventions', data).then((res) => ({ data: unwrap<Intervention>(res) })),
  update: (id: string, data: Partial<Intervention>) =>
    api.put(`/interventions/${id}`, data).then((res) => ({ data: unwrap<Intervention>(res) })),
  complete: (id: string, notes: string) =>
    api.patch(`/interventions/${id}/complete`, { notes }).then((res) => ({ data: unwrap<Intervention>(res) })),
  delete: (id: string) => api.delete(`/interventions/${id}`),
};

export const usersAPI = {
  getAll: () =>
    api.get('/users').then((res) => ({ data: unwrap<User[]>(res) })),
  create: (data: Partial<User> & { password: string }) =>
    api.post('/users', data).then((res) => ({ data: unwrap<User>(res) })),
  update: (id: string, data: Partial<User> & { password?: string }) =>
    api.put(`/users/${id}`, data).then((res) => ({ data: unwrap<User>(res) })),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const reportsAPI = {
  generate: (type: string, params: any) =>
    api.post('/reports/generate', { type, ...params }, { responseType: 'blob' }),
};

export default api;
