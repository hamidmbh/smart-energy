import { useState, useEffect } from 'react';
import { roomsAPI, sensorsAPI, floorsAPI } from '@/services/api';
import { Room, Sensor, Floor } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hotel, 
  Thermometer, 
  Lightbulb, 
  Wind, 
  Settings,
  Filter,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant' | 'maintenance'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    floorId: '',
    type: 'standard',
    status: 'vacant' as Room['status'],
    mode: 'eco' as Room['mode'],
    sensorIds: [] as string[],
  });

  useEffect(() => {
    loadRooms();
    loadSensors();
    loadFloors();
  }, []);

  const loadRooms = async () => {
    const response = await roomsAPI.getAll();
    setRooms(response.data);
  };

  const loadSensors = async () => {
    const response = await sensorsAPI.getAll();
    setSensors(response.data);
  };

  const loadFloors = async () => {
    const response = await floorsAPI.getAll();
    setFloors(response.data);
  };

  const filteredRooms = rooms.filter(room => 
    filter === 'all' ? true : room.status === filter
  );

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'occupied': return 'default';
      case 'vacant': return 'secondary';
      case 'maintenance': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Room['status']) => {
    switch (status) {
      case 'occupied': return 'Occupée';
      case 'vacant': return 'Libre';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const getModeLabel = (mode?: Room['mode']) => {
    switch (mode) {
      case 'eco': return 'Éco';
      case 'comfort': return 'Confort';
      case 'night': return 'Nuit';
      case 'maintenance': return 'Maintenance';
      default: return 'Normal';
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

  // Grouper les capteurs par type
  const sensorsByType = sensors.reduce((acc, sensor) => {
    if (!acc[sensor.type]) {
      acc[sensor.type] = [];
    }
    acc[sensor.type].push(sensor);
    return acc;
  }, {} as Record<Sensor['type'], Sensor[]>);

  const sensorTypes: Sensor['type'][] = ['temperature', 'humidity', 'light', 'motion', 'energy'];

  const handleSensorToggle = (sensorId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        sensorIds: [...formData.sensorIds, sensorId],
      });
    } else {
      setFormData({
        ...formData,
        sensorIds: formData.sensorIds.filter((id) => id !== sensorId),
      });
    }
  };

  const getSelectedSensorsForType = (type: Sensor['type']) => {
    return sensorsByType[type]?.filter(s => formData.sensorIds.includes(s.id)) || [];
  };

  const handleToggleLight = async (roomId: string, currentState: boolean) => {
    try {
      await roomsAPI.controlEquipment(roomId, 'light', !currentState);
      await loadRooms();
      toast.success('Lumières mises à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleAC = async (roomId: string, currentState: boolean) => {
    try {
      await roomsAPI.controlEquipment(roomId, 'climatization', !currentState);
      await loadRooms();
      toast.success('Climatisation mise à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleChangeMode = async (roomId: string, mode: Room['mode']) => {
    try {
      await roomsAPI.updateMode(roomId, mode || 'eco');
      await loadRooms();
      toast.success(`Mode changé: ${getModeLabel(mode)}`);
    } catch (error) {
      toast.error('Erreur lors du changement de mode');
    }
  };

  const handleAddRoom = async () => {
    try {
      const { data: newRoom } = await roomsAPI.create({
        number: formData.number,
        floorId: formData.floorId,
        type: formData.type,
        status: formData.status,
        mode: formData.mode,
        lightStatus: false,
        climatizationStatus: false,
      });
      // Assigner les capteurs sélectionnés à la nouvelle chambre
      if (formData.sensorIds.length > 0) {
        await Promise.all(
          formData.sensorIds.map((sensorId) =>
            sensorsAPI.update(sensorId, { roomId: newRoom.id })
          )
        );
      }
      await loadRooms();
      await loadSensors();
      setIsAddDialogOpen(false);
      setFormData({
        number: '',
        floorId: '',
        type: 'standard',
        status: 'vacant',
        mode: 'eco',
        sensorIds: [],
      });
      toast.success('Chambre créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const openEditDialog = async (room: Room) => {
    setSelectedRoom(room);
    // Load sensors for this room
    const roomSensors = sensors.filter(s => s.roomId === room.id);
    setFormData({
      number: room.number,
      floorId: room.floorId || '',
      type: room.type,
      status: room.status,
      mode: room.mode || 'eco',
      sensorIds: roomSensors.map(s => s.id),
    });
    setIsEditDialogOpen(true);
  };

  const handleEditRoom = async () => {
    if (!selectedRoom) return;
    try {
      await roomsAPI.update(selectedRoom.id, {
        number: formData.number,
        floorId: formData.floorId,
        type: formData.type,
        status: formData.status,
        mode: formData.mode,
      });
      
      // Update all selected sensors to point to this room
      if (formData.sensorIds.length > 0) {
        await Promise.all(
          formData.sensorIds.map((sensorId) =>
            sensorsAPI.update(sensorId, { roomId: selectedRoom.id })
          )
        );
      }
      
      await loadRooms();
      await loadSensors();
      setIsEditDialogOpen(false);
      setSelectedRoom(null);
      toast.success('Chambre modifiée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette chambre ? Cette action est irréversible.')) {
      return;
    }
    try {
      await roomsAPI.delete(roomId);
      await loadRooms();
      await loadSensors();
      toast.success('Chambre supprimée avec succès');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    }
  };

  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    vacant: rooms.filter(r => r.status === 'vacant').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Chambres</h1>
            <p className="text-muted-foreground mt-1">Contrôle et supervision de toutes les chambres</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle chambre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Ajouter une chambre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <Label htmlFor="number">Numéro de chambre</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Étage</Label>
                  <Select value={formData.floorId} onValueChange={(v) => setFormData({ ...formData, floorId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un étage" />
                    </SelectTrigger>
                    <SelectContent>
                      {floors.map((floor) => (
                        <SelectItem key={floor.id} value={floor.id}>
                          {floor.name || `Étage ${floor.number}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="presidential">Présidentielle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={formData.status} onValueChange={(v: Room['status']) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Libre</SelectItem>
                      <SelectItem value="occupied">Occupée</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={formData.mode} onValueChange={(v: Room['mode']) => setFormData({ ...formData, mode: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eco">Éco</SelectItem>
                      <SelectItem value="comfort">Confort</SelectItem>
                      <SelectItem value="night">Nuit</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Capteurs à associer</Label>
                  {sensors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun capteur disponible</p>
                  ) : (
                    <div className="space-y-3">
                      {sensorTypes.map((type) => {
                        const typeSensors = sensorsByType[type] || [];
                        if (typeSensors.length === 0) return null;
                        
                        const selectedSensors = getSelectedSensorsForType(type);
                        const displayValue = selectedSensors.length > 0 
                          ? `${selectedSensors.length} sélectionné(s)` 
                          : `Sélectionner des capteurs ${getTypeLabel(type)}`;

                        return (
                          <div key={type} className="space-y-2">
                            <Label className="text-sm font-medium">
                              {getTypeLabel(type)} ({typeSensors.length} disponible(s))
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  <span className="truncate">{displayValue}</span>
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0" align="start">
                                <div className="max-h-64 overflow-y-auto p-2">
                                  {typeSensors.map((sensor) => (
                                    <div key={sensor.id} className="flex items-center space-x-2 py-1.5 px-2 rounded-sm hover:bg-accent">
                                      <Checkbox
                                        id={`sensor-${sensor.id}`}
                                        checked={formData.sensorIds.includes(sensor.id)}
                                        onCheckedChange={(checked) => handleSensorToggle(sensor.id, checked as boolean)}
                                      />
                                      <Label
                                        htmlFor={`sensor-${sensor.id}`}
                                        className="text-sm font-normal cursor-pointer flex-1"
                                      >
                                        {sensor.name}
                                        {sensor.roomId && (
                                          <span className="text-muted-foreground ml-1">
                                            • Chambre {sensor.roomId}
                                          </span>
                                        )}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddRoom}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <Hotel className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupées</p>
                  <p className="text-2xl font-bold">{stats.occupied}</p>
                </div>
                <Hotel className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Libres</p>
                  <p className="text-2xl font-bold">{stats.vacant}</p>
                </div>
                <Hotel className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold">{stats.maintenance}</p>
                </div>
                <Hotel className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="occupied">Occupées</TabsTrigger>
              <TabsTrigger value="vacant">Libres</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <Card key={room.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Chambre {room.number}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {typeof room.floor === 'object' && room.floor 
                        ? (room.floor.name || `Étage ${room.floor.number}`)
                        : typeof room.floor === 'number'
                        ? `Étage ${room.floor}`
                        : 'N/A'
                      } • {room.type}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(room.status)}>
                    {getStatusLabel(room.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Temperature */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Température</p>
                      <p className="text-xs text-muted-foreground">
                        Cible: {room.targetTemperature}°C
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{room.currentTemperature}°C</p>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-muted-foreground" />
                      <Label>Lumières</Label>
                    </div>
                    <Switch
                      checked={room.lightStatus}
                      onCheckedChange={() => handleToggleLight(room.id, room.lightStatus || false)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-muted-foreground" />
                      <Label>Climatisation</Label>
                    </div>
                    <Switch
                      checked={room.climatizationStatus}
                      onCheckedChange={() => handleToggleAC(room.id, room.climatizationStatus || false)}
                    />
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-xs">Mode</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={room.mode === 'eco' ? 'default' : 'outline'}
                      onClick={() => handleChangeMode(room.id, 'eco')}
                      className="flex-1"
                    >
                      Éco
                    </Button>
                    <Button
                      size="sm"
                      variant={room.mode === 'comfort' ? 'default' : 'outline'}
                      onClick={() => handleChangeMode(room.id, 'comfort')}
                      className="flex-1"
                    >
                      Confort
                    </Button>
                    <Button
                      size="sm"
                      variant={room.mode === 'night' ? 'default' : 'outline'}
                      onClick={() => handleChangeMode(room.id, 'night')}
                      className="flex-1"
                    >
                      Nuit
                    </Button>
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(room)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Modifier la chambre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="edit-number">Numéro de chambre</Label>
              <Input
                id="edit-number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-floor">Étage</Label>
              <Select value={formData.floorId} onValueChange={(v) => setFormData({ ...formData, floorId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étage" />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.id}>
                      {floor.name || `Étage ${floor.number}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="presidential">Présidentielle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Statut</Label>
              <Select value={formData.status} onValueChange={(v: Room['status']) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Libre</SelectItem>
                  <SelectItem value="occupied">Occupée</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-mode">Mode</Label>
              <Select value={formData.mode} onValueChange={(v: Room['mode']) => setFormData({ ...formData, mode: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eco">Éco</SelectItem>
                  <SelectItem value="comfort">Confort</SelectItem>
                  <SelectItem value="night">Nuit</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Capteurs à associer</Label>
              {sensors.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun capteur disponible</p>
              ) : (
                <div className="space-y-3">
                  {sensorTypes.map((type) => {
                    const typeSensors = sensorsByType[type] || [];
                    if (typeSensors.length === 0) return null;
                    
                    const selectedSensors = getSelectedSensorsForType(type);
                    const displayValue = selectedSensors.length > 0 
                      ? `${selectedSensors.length} sélectionné(s)` 
                      : `Sélectionner des capteurs ${getTypeLabel(type)}`;

                    return (
                      <div key={type} className="space-y-2">
                        <Label className="text-sm font-medium">
                          {getTypeLabel(type)} ({typeSensors.length} disponible(s))
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              <span className="truncate">{displayValue}</span>
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <div className="max-h-64 overflow-y-auto p-2">
                              {typeSensors.map((sensor) => (
                                <div key={sensor.id} className="flex items-center space-x-2 py-1.5 px-2 rounded-sm hover:bg-accent">
                                  <Checkbox
                                    id={`edit-sensor-${sensor.id}`}
                                    checked={formData.sensorIds.includes(sensor.id)}
                                    onCheckedChange={(checked) => handleSensorToggle(sensor.id, checked as boolean)}
                                  />
                                  <Label
                                    htmlFor={`edit-sensor-${sensor.id}`}
                                    className="text-sm font-normal cursor-pointer flex-1"
                                  >
                                    {sensor.name}
                                    {sensor.roomId && sensor.roomId !== selectedRoom?.id && (
                                      <span className="text-muted-foreground ml-1">
                                        • Chambre {sensor.roomId}
                                      </span>
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditRoom}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Rooms;
