import { User, Room, Sensor, Alert, EnergyConsumption, Intervention, UserRole } from '@/types';

// Database keys
const DB_KEYS = {
  USERS: 'db_users',
  ROOMS: 'db_rooms',
  SENSORS: 'db_sensors',
  ALERTS: 'db_alerts',
  ENERGY: 'db_energy_consumption',
  INTERVENTIONS: 'db_interventions',
  INITIALIZED: 'db_initialized',
};

// Generic database operations
class Database<T extends { id: string }> {
  constructor(private key: string) {}

  getAll(): T[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  getById(id: string): T | undefined {
    return this.getAll().find(item => item.id === id);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    localStorage.setItem(this.key, JSON.stringify(items));
    return item;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(this.key, JSON.stringify(items));
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    localStorage.setItem(this.key, JSON.stringify(filtered));
    return true;
  }

  query(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}

// Database instances
export const usersDB = new Database<User>(DB_KEYS.USERS);
export const roomsDB = new Database<Room>(DB_KEYS.ROOMS);
export const sensorsDB = new Database<Sensor>(DB_KEYS.SENSORS);
export const alertsDB = new Database<Alert>(DB_KEYS.ALERTS);
export const energyDB = new Database<EnergyConsumption>(DB_KEYS.ENERGY);
export const interventionsDB = new Database<Intervention>(DB_KEYS.INTERVENTIONS);

// Seed data generation
const generateSeedData = () => {
  // Users
  const users: User[] = [
    { id: '1', email: 'admin@hotel.com', name: 'Admin Principal', role: 'admin' },
    { id: '2', email: 'tech@hotel.com', name: 'Jean Technicien', role: 'technician' },
    { id: '3', email: 'client@hotel.com', name: 'Marie Client', role: 'client', roomId: '101' },
    { id: '4', email: 'client2@hotel.com', name: 'Pierre Dupont', role: 'client', roomId: '102' },
  ];

  // Rooms
  const rooms: Room[] = [
    {
      id: '101',
      number: '101',
      floor: 1,
      type: 'Standard',
      status: 'occupied',
      currentTemperature: 22,
      targetTemperature: 21,
      lightStatus: true,
      climatizationStatus: true,
      mode: 'comfort',
      clientId: '3',
    },
    {
      id: '102',
      number: '102',
      floor: 1,
      type: 'Standard',
      status: 'occupied',
      currentTemperature: 23,
      targetTemperature: 22,
      lightStatus: false,
      climatizationStatus: true,
      mode: 'eco',
      clientId: '4',
    },
    {
      id: '201',
      number: '201',
      floor: 2,
      type: 'Suite',
      status: 'vacant',
      currentTemperature: 20,
      targetTemperature: 20,
      lightStatus: false,
      climatizationStatus: false,
      mode: 'eco',
    },
    {
      id: '202',
      number: '202',
      floor: 2,
      type: 'Suite',
      status: 'maintenance',
      currentTemperature: 18,
      targetTemperature: 18,
      lightStatus: true,
      climatizationStatus: false,
      mode: 'maintenance',
    },
    {
      id: '301',
      number: '301',
      floor: 3,
      type: 'Deluxe',
      status: 'occupied',
      currentTemperature: 21,
      targetTemperature: 21,
      lightStatus: true,
      climatizationStatus: true,
      mode: 'comfort',
    },
  ];

  // Sensors
  const sensors: Sensor[] = [
    {
      id: 's1',
      name: 'Température 101',
      type: 'temperature',
      roomId: '101',
      value: 22,
      unit: '°C',
      status: 'active',
      lastReading: new Date().toISOString(),
    },
    {
      id: 's2',
      name: 'Humidité 101',
      type: 'humidity',
      roomId: '101',
      value: 45,
      unit: '%',
      status: 'active',
      lastReading: new Date().toISOString(),
    },
    {
      id: 's3',
      name: 'Énergie 101',
      type: 'energy',
      roomId: '101',
      value: 1.5,
      unit: 'kWh',
      status: 'active',
      lastReading: new Date().toISOString(),
    },
    {
      id: 's4',
      name: 'Température 102',
      type: 'temperature',
      roomId: '102',
      value: 23,
      unit: '°C',
      status: 'active',
      lastReading: new Date().toISOString(),
    },
    {
      id: 's5',
      name: 'Mouvement 201',
      type: 'motion',
      roomId: '201',
      value: 0,
      unit: '',
      status: 'active',
      lastReading: new Date().toISOString(),
    },
    {
      id: 's6',
      name: 'Température 202',
      type: 'temperature',
      roomId: '202',
      value: 18,
      unit: '°C',
      status: 'error',
      lastReading: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  // Alerts
  const alerts: Alert[] = [
    {
      id: 'a1',
      type: 'overconsumption',
      severity: 'high',
      message: 'Consommation excessive détectée en chambre 101',
      roomId: '101',
      sensorId: 's3',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'a2',
      type: 'anomaly',
      severity: 'medium',
      message: 'Écart de température anormal en chambre 102',
      roomId: '102',
      sensorId: 's4',
      status: 'acknowledged',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'a3',
      type: 'maintenance',
      severity: 'critical',
      message: 'Capteur de température défaillant en chambre 202',
      roomId: '202',
      sensorId: 's6',
      status: 'pending',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  // Energy Consumption
  const energyConsumption: EnergyConsumption[] = [];
  const now = new Date();
  
  // Generate daily data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    rooms.forEach(room => {
      energyConsumption.push({
        id: `e_${room.id}_${i}`,
        roomId: room.id,
        date: date.toISOString().split('T')[0],
        consumption: Math.random() * 5 + 2,
        cost: Math.random() * 2 + 0.5,
        period: 'daily',
      });
    });
  }

  // Interventions
  const interventions: Intervention[] = [
    {
      id: 'i1',
      type: 'Maintenance préventive',
      description: 'Vérification système climatisation',
      roomId: '202',
      technicianId: '2',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'i2',
      type: 'Réparation',
      description: 'Remplacement capteur température',
      roomId: '202',
      technicianId: '2',
      status: 'pending',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'i3',
      type: 'Installation',
      description: 'Installation nouveau capteur énergie',
      roomId: '301',
      technicianId: '2',
      status: 'completed',
      priority: 'medium',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 43200000).toISOString(),
      notes: 'Installation réussie, capteur opérationnel',
    },
  ];

  return { users, rooms, sensors, alerts, energyConsumption, interventions };
};

// Initialize database with seed data
export const initializeDatabase = () => {
  const isInitialized = localStorage.getItem(DB_KEYS.INITIALIZED);
  
  if (isInitialized === 'true') {
    console.log('Database already initialized');
    return;
  }

  console.log('Initializing database with seed data...');
  
  const data = generateSeedData();
  
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(data.users));
  localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(data.rooms));
  localStorage.setItem(DB_KEYS.SENSORS, JSON.stringify(data.sensors));
  localStorage.setItem(DB_KEYS.ALERTS, JSON.stringify(data.alerts));
  localStorage.setItem(DB_KEYS.ENERGY, JSON.stringify(data.energyConsumption));
  localStorage.setItem(DB_KEYS.INTERVENTIONS, JSON.stringify(data.interventions));
  localStorage.setItem(DB_KEYS.INITIALIZED, 'true');
  
  console.log('Database initialized successfully');
};

// Reset database
export const resetDatabase = () => {
  Object.values(DB_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  initializeDatabase();
};

// Get database statistics
export const getDatabaseStats = () => {
  return {
    users: usersDB.getAll().length,
    rooms: roomsDB.getAll().length,
    sensors: sensorsDB.getAll().length,
    alerts: alertsDB.getAll().length,
    energyRecords: energyDB.getAll().length,
    interventions: interventionsDB.getAll().length,
  };
};
