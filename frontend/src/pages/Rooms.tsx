import { useState, useEffect } from 'react';
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
  Filter,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant' | 'maintenance'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    floor: '1',
    type: 'standard',
    status: 'vacant' as Room['status'],
    currentTemperature: '',
    targetTemperature: '',
    mode: 'eco' as Room['mode'],
  });

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

  const handleAddRoom = async () => {
    try {
      await roomsAPI.create({
        number: formData.number,
        floor: parseInt(formData.floor),
        type: formData.type,
        status: formData.status,
        currentTemperature: formData.currentTemperature ? parseFloat(formData.currentTemperature) : undefined,
        targetTemperature: formData.targetTemperature ? parseFloat(formData.targetTemperature) : undefined,
        mode: formData.mode,
        lightStatus: false,
        climatizationStatus: false,
      });
      await loadRooms();
      setIsAddDialogOpen(false);
      setFormData({
        number: '',
        floor: '1',
        type: 'standard',
        status: 'vacant',
        currentTemperature: '',
        targetTemperature: '',
        mode: 'eco',
      });
      toast.success('Chambre créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une chambre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    min="0"
                  />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentTemperature">Température actuelle (°C)</Label>
                    <Input
                      id="currentTemperature"
                      type="number"
                      step="0.1"
                      value={formData.currentTemperature}
                      onChange={(e) => setFormData({ ...formData, currentTemperature: e.target.value })}
                      placeholder="22.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetTemperature">Température cible (°C)</Label>
                    <Input
                      id="targetTemperature"
                      type="number"
                      step="0.1"
                      value={formData.targetTemperature}
                      onChange={(e) => setFormData({ ...formData, targetTemperature: e.target.value })}
                      placeholder="22"
                    />
                  </div>
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
