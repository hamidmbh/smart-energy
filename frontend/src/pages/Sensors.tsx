import { useState, useEffect } from 'react';
import { sensorsAPI, roomsAPI } from '@/services/api';
import { Sensor, Room } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { 
  Gauge, 
  Thermometer, 
  Droplets, 
  Lightbulb, 
  Activity, 
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Sensors = () => {
  const { user } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsMap, setRoomsMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'error'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'temperature' as Sensor['type'],
    roomId: '',
    value: '',
    unit: '°C',
    status: 'active' as Sensor['status'],
  });

  useEffect(() => {
    loadSensors();
  }, []);

  const loadSensors = async () => {
    try {
      const [sensorsResponse, roomsResponse] = await Promise.all([
        sensorsAPI.getAll(),
        roomsAPI.getAll(),
      ]);
      setSensors(sensorsResponse.data);
      setRooms(roomsResponse.data);
      const map = roomsResponse.data.reduce((acc, room) => {
        acc[room.id] = room.number;
        return acc;
      }, {} as Record<string, string>);
      setRoomsMap(map);
    } catch (error) {
      console.error('Error loading sensors:', error);
      toast.error('Erreur lors du chargement des capteurs');
    }
  };

  const handleAddSensor = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Le nom du capteur est requis');
      return;
    }
    if (!formData.roomId) {
      toast.error('Veuillez sélectionner une chambre');
      return;
    }
    
    try {
      await sensorsAPI.create({
        name: formData.name,
        type: formData.type,
        roomId: formData.roomId,
        value: 0,
        unit: formData.unit,
        status: formData.status,
      });
      await loadSensors();
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        type: 'temperature',
        roomId: '',
        value: '',
        unit: '°C',
        status: 'active',
      });
      toast.success('Capteur créé avec succès');
    } catch (error: any) {
      console.error('Error creating sensor:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errors?.room_id?.[0] || 'Erreur lors de la création';
      toast.error(errorMessage);
    }
  };

  const openEditDialog = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setFormData({
      name: sensor.name,
      type: sensor.type,
      roomId: sensor.roomId || '',
      value: sensor.value?.toString() || '',
      unit: sensor.unit || '°C',
      status: sensor.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSensor = async () => {
    if (!selectedSensor) return;
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Le nom du capteur est requis');
      return;
    }
    if (!formData.roomId) {
      toast.error('Veuillez sélectionner une chambre');
      return;
    }
    
    try {
      await sensorsAPI.update(selectedSensor.id, {
        name: formData.name,
        type: formData.type,
        roomId: formData.roomId,
        unit: formData.unit,
        status: formData.status,
      });
      await loadSensors();
      setIsEditDialogOpen(false);
      setSelectedSensor(null);
      setFormData({
        name: '',
        type: 'temperature',
        roomId: '',
        value: '',
        unit: '°C',
        status: 'active',
      });
      toast.success('Capteur modifié avec succès');
    } catch (error: any) {
      console.error('Error updating sensor:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.errors?.room_id?.[0] || 'Erreur lors de la modification';
      toast.error(errorMessage);
    }
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

  const getRoomNumber = (roomId: string) => roomsMap[roomId] ?? roomId;

  const getTimeSince = (dateString: string | null | undefined) => {
    if (!dateString) return 'Jamais';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `Il y a ${diffDays}j`;
    } catch (error) {
      return 'Date invalide';
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Capteurs</h1>
            <p className="text-muted-foreground mt-1">Surveillance et contrôle de tous les capteurs</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'technician') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau capteur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un capteur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sensor-name">Nom du capteur</Label>
                    <Input
                      id="sensor-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Capteur température salon"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensor-type">Type</Label>
                    <Select value={formData.type} onValueChange={(v: Sensor['type']) => {
                      setFormData({ ...formData, type: v });
                      // Set default unit based on type
                      const unitMap: Record<Sensor['type'], string> = {
                        temperature: '°C',
                        humidity: '%',
                        light: 'lux',
                        motion: '',
                        energy: 'kWh',
                      };
                      setFormData(prev => ({ ...prev, unit: unitMap[v] }));
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Température</SelectItem>
                        <SelectItem value="humidity">Humidité</SelectItem>
                        <SelectItem value="light">Luminosité</SelectItem>
                        <SelectItem value="motion">Mouvement</SelectItem>
                        <SelectItem value="energy">Énergie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensor-room">Chambre</Label>
                    <Select value={formData.roomId} onValueChange={(v) => setFormData({ ...formData, roomId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une chambre" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            Chambre {room.number} {room.floor && typeof room.floor === 'object' ? `- Étage ${room.floor.number}` : room.floorId ? `- Étage ${room.floorId}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensor-unit">Unité</Label>
                    <Input
                      id="sensor-unit"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="°C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sensor-status">Statut</Label>
                    <Select value={formData.status} onValueChange={(v: Sensor['status']) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="error">Erreur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddSensor}>
                    Créer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le capteur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sensor-name">Nom du capteur</Label>
                <Input
                  id="edit-sensor-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Capteur température salon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sensor-type">Type</Label>
                <Select value={formData.type} onValueChange={(v: Sensor['type']) => {
                  setFormData({ ...formData, type: v });
                  // Set default unit based on type
                  const unitMap: Record<Sensor['type'], string> = {
                    temperature: '°C',
                    humidity: '%',
                    light: 'lux',
                    motion: '',
                    energy: 'kWh',
                  };
                  setFormData(prev => ({ ...prev, unit: unitMap[v] }));
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Température</SelectItem>
                    <SelectItem value="humidity">Humidité</SelectItem>
                    <SelectItem value="light">Luminosité</SelectItem>
                    <SelectItem value="motion">Mouvement</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sensor-room">Chambre</Label>
                <Select value={formData.roomId} onValueChange={(v) => setFormData({ ...formData, roomId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une chambre" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        Chambre {room.number} {room.floor && typeof room.floor === 'object' ? `- Étage ${room.floor.number}` : room.floorId ? `- Étage ${room.floorId}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sensor-unit">Unité</Label>
                <Input
                  id="edit-sensor-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="°C"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sensor-status">Statut</Label>
                <Select value={formData.status} onValueChange={(v: Sensor['status']) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditSensor}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                        {(user?.role === 'admin' || user?.role === 'technician') && (
                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => openEditDialog(sensor)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                          </div>
                        )}
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
