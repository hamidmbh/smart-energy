import axios from 'axios';
import { 
  usersDB, 
  roomsDB, 
  sensorsDB, 
  alertsDB, 
  energyDB, 
  interventionsDB 
} from './database';
import { Room, Sensor, Alert, EnergyConsumption, Intervention } from '@/types';

// Configure base URL for Laravel API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  getAll: () => Promise.resolve({ data: roomsDB.getAll() }),
  getOne: (id: string) => Promise.resolve({ data: roomsDB.getById(id) }),
  create: (data: Omit<Room, 'id'>) => {
    const room: Room = { ...data, id: `${Date.now()}` };
    return Promise.resolve({ data: roomsDB.create(room) });
  },
  update: (id: string, data: Partial<Room>) => Promise.resolve({ data: roomsDB.update(id, data) }),
  delete: (id: string) => Promise.resolve({ data: { success: roomsDB.delete(id) } }),
  updateMode: (id: string, mode: string) => Promise.resolve({ data: roomsDB.update(id, { mode: mode as any }) }),
  controlEquipment: (id: string, equipment: string, state: boolean) => {
    const updates: Partial<Room> = {};
    if (equipment === 'light') updates.lightStatus = state;
    if (equipment === 'climatization') updates.climatizationStatus = state;
    return Promise.resolve({ data: roomsDB.update(id, updates) });
  },
};

export const sensorsAPI = {
  getAll: () => Promise.resolve({ data: sensorsDB.getAll() }),
  getByRoom: (roomId: string) => Promise.resolve({ data: sensorsDB.query(s => s.roomId === roomId) }),
  getReadings: (sensorId: string, period?: string) => Promise.resolve({ data: [] }),
  create: (data: Omit<Sensor, 'id'>) => {
    const sensor: Sensor = { ...data, id: `s_${Date.now()}` };
    return Promise.resolve({ data: sensorsDB.create(sensor) });
  },
  update: (id: string, data: Partial<Sensor>) => Promise.resolve({ data: sensorsDB.update(id, data) }),
  delete: (id: string) => Promise.resolve({ data: { success: sensorsDB.delete(id) } }),
};

export const alertsAPI = {
  getAll: () => Promise.resolve({ data: alertsDB.getAll() }),
  acknowledge: (id: string) => Promise.resolve({ data: alertsDB.update(id, { status: 'acknowledged' }) }),
  resolve: (id: string, notes?: string) => 
    Promise.resolve({ data: alertsDB.update(id, { status: 'resolved', resolvedAt: new Date().toISOString() }) }),
};

export const energyAPI = {
  getConsumption: (period: string, roomId?: string) => {
    let energy = energyDB.query(e => e.period === period);
    if (roomId) energy = energy.filter(e => e.roomId === roomId);
    return Promise.resolve({ data: energy });
  },
  getStatistics: (startDate: string, endDate: string) => {
    const energy = energyDB.getAll().filter(e => e.date >= startDate && e.date <= endDate);
    const totalConsumption = energy.reduce((sum, e) => sum + e.consumption, 0);
    const totalCost = energy.reduce((sum, e) => sum + e.cost, 0);
    return Promise.resolve({ data: { totalConsumption, totalCost, records: energy.length } });
  },
};

export const interventionsAPI = {
  getAll: () => Promise.resolve({ data: interventionsDB.getAll() }),
  getByTechnician: (technicianId: string) => 
    Promise.resolve({ data: interventionsDB.query(i => i.technicianId === technicianId) }),
  create: (data: Omit<Intervention, 'id'>) => {
    const intervention: Intervention = { ...data, id: `i_${Date.now()}` };
    return Promise.resolve({ data: interventionsDB.create(intervention) });
  },
  update: (id: string, data: Partial<Intervention>) => 
    Promise.resolve({ data: interventionsDB.update(id, data) }),
  complete: (id: string, notes: string) => 
    Promise.resolve({ data: interventionsDB.update(id, { 
      status: 'completed', 
      completedAt: new Date().toISOString(),
      notes 
    }) }),
};

export const usersAPI = {
  getAll: () => Promise.resolve({ data: usersDB.getAll() }),
  create: (data: any) => Promise.resolve({ data: usersDB.create({ ...data, id: `u_${Date.now()}` }) }),
  update: (id: string, data: any) => Promise.resolve({ data: usersDB.update(id, data) }),
  delete: (id: string) => Promise.resolve({ data: { success: usersDB.delete(id) } }),
};

export const reportsAPI = {
  generate: (type: string, params: any) => 
    api.post('/reports/generate', { type, ...params }, { responseType: 'blob' }),
};

export default api;
