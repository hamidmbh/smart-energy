export type UserRole = 'admin' | 'technician' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roomId?: string;
  assignedRooms?: Room[];
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  currentTemperature?: number;
  targetTemperature?: number;
  lightStatus?: boolean;
  climatizationStatus?: boolean;
  mode?: RoomMode;
  clientId?: string;
  technicians?: User[];
}

export type RoomMode = 'eco' | 'comfort' | 'night' | 'maintenance';

export interface Sensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'light' | 'motion' | 'energy';
  roomId: string;
  value: number;
  unit: string;
  status: 'active' | 'inactive' | 'error';
  lastReading: string;
}

export interface Alert {
  id: string;
  type: 'overconsumption' | 'anomaly' | 'maintenance' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  roomId?: string;
  sensorId?: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface EnergyConsumption {
  id: string;
  roomId?: string;
  date: string;
  consumption: number;
  cost: number;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface Intervention {
  id: string;
  type: string;
  description: string;
  roomId: string;
  technicianId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}
