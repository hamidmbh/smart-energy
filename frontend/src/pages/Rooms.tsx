import { useState, useEffect } from 'react';
import { roomsDB } from '@/services/database';
import { roomsAPI } from '@/services/api';
import { Room } from '@/types';
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
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant' | 'maintenance'>('all');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const response = await roomsAPI.getAll();
    setRooms(response.data);
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

  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    vacant: rooms.filter(r => r.status === 'vacant').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Chambres</h1>
          <p className="text-muted-foreground mt-1">Contrôle et supervision de toutes les chambres</p>
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
                      Étage {room.floor} • {room.type}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
