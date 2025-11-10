import { useState, useEffect } from 'react';
import { sensorsDB, roomsDB } from '@/services/database';
import { sensorsAPI } from '@/services/api';
import { Sensor } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gauge, 
  Thermometer, 
  Droplets, 
  Lightbulb, 
  Activity, 
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Sensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'error'>('all');

  useEffect(() => {
    loadSensors();
  }, []);

  const loadSensors = async () => {
    const response = await sensorsAPI.getAll();
    setSensors(response.data);
  };

  const filteredSensors = sensors.filter(sensor =>
    filter === 'all' ? true : sensor.status === filter
  );

  const getTypeIcon = (type: Sensor['type']) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'humidity': return Droplets;
      case 'light': return Lightbulb;
      case 'motion': return Activity;
      case 'energy': return Zap;
      default: return Gauge;
    }
  };

  const getTypeLabel = (type: Sensor['type']) => {
    switch (type) {
      case 'temperature': return 'Température';
      case 'humidity': return 'Humidité';
      case 'light': return 'Luminosité';
      case 'motion': return 'Mouvement';
      case 'energy': return 'Énergie';
      default: return type;
    }
  };

  const getStatusIcon = (status: Sensor['status']) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return AlertCircle;
      case 'error': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: Sensor['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Sensor['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'error': return 'Erreur';
      default: return status;
    }
  };

  const getRoomNumber = (roomId: string) => {
    const room = roomsDB.getById(roomId);
    return room ? room.number : roomId;
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  };

  const stats = {
    total: sensors.length,
    active: sensors.filter(s => s.status === 'active').length,
    inactive: sensors.filter(s => s.status === 'inactive').length,
    error: sensors.filter(s => s.status === 'error').length,
  };

  // Group sensors by room
  const sensorsByRoom = filteredSensors.reduce((acc, sensor) => {
    const roomNum = getRoomNumber(sensor.roomId);
    if (!acc[roomNum]) acc[roomNum] = [];
    acc[roomNum].push(sensor);
    return acc;
  }, {} as Record<string, Sensor[]>);

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Capteurs</h1>
          <p className="text-muted-foreground mt-1">Surveillance et contrôle de tous les capteurs</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Gauge className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actifs</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactifs</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Erreurs</p>
                  <p className="text-2xl font-bold">{stats.error}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">Actifs</TabsTrigger>
            <TabsTrigger value="inactive">Inactifs</TabsTrigger>
            <TabsTrigger value="error">Erreurs</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sensors by Room */}
        <div className="space-y-6">
          {Object.entries(sensorsByRoom).map(([roomNum, roomSensors]) => (
            <Card key={roomNum}>
              <CardHeader>
                <CardTitle>Chambre {roomNum}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomSensors.map(sensor => {
                    const Icon = getTypeIcon(sensor.type);
                    const StatusIcon = getStatusIcon(sensor.status);
                    
                    return (
                      <div
                        key={sensor.id}
                        className="p-4 border border-border rounded-lg space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{sensor.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {getTypeLabel(sensor.type)}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(sensor.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {getStatusLabel(sensor.status)}
                          </Badge>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-bold">
                              {sensor.value}
                              <span className="text-lg text-muted-foreground ml-1">
                                {sensor.unit}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getTimeSince(sensor.lastReading)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sensors;
