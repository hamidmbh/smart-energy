import { useState, useEffect } from 'react';
import { usersAPI, roomsAPI, floorsAPI } from '@/services/api';
import { User, Room, Floor } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Users as UsersIcon, 
  UserCog, 
  Wrench, 
  Hotel,
  Shield,
  Mail
} from 'lucide-react';
import { Checkbox as CheckboxComponent } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [filter, setFilter] = useState<'all' | 'admin' | 'technician'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as User['role'],
    roomId: '',
    assignedFloorNumbers: [] as number[],
  });

  useEffect(() => {
    loadUsers();
    loadRooms();
    loadFloors();
  }, []);

  const loadUsers = async () => {
    const response = await usersAPI.getAll();
    setUsers(response.data);
  };

  const loadRooms = async () => {
    const response = await roomsAPI.getAll();
    setRooms(response.data);
  };

  const loadFloors = async () => {
    try {
      const response = await floorsAPI.getAll();
      setFloors(response.data);
    } catch (error) {
      console.error('Error loading floors:', error);
    }
  };

  // Obtenir les numéros d'étages depuis l'API floors
  const getAvailableFloors = (): number[] => {
    return floors.map(floor => floor.number).sort((a, b) => a - b);
  };

  const handleAddUser = async () => {
    try {
      await usersAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        roomId: formData.roomId || undefined,
        assignedFloorNumbers: formData.role === 'technician' ? formData.assignedFloorNumbers : undefined,
      });
      await loadUsers();
      setIsAddDialogOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'admin', roomId: '', assignedFloorNumbers: [] });
      toast.success('Utilisateur créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        assignedFloorNumbers: formData.role === 'technician' ? formData.assignedFloorNumbers : undefined,
      };
      // Only include password if it's been changed
      if (formData.password) {
        updateData.password = formData.password;
      }
      await usersAPI.update(selectedUser.id, updateData);
      await loadUsers();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', password: '', role: 'admin', roomId: '', assignedFloorNumbers: [] });
      toast.success('Utilisateur modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersAPI.delete(userId);
      await loadUsers();
      toast.success('Utilisateur supprimé avec succès');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    }
  };

  const openEditDialog = (user: User) => {
    try {
      setSelectedUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'admin',
        roomId: user.roomId || '',
        assignedFloorNumbers: Array.isArray(user.assignedFloors) ? user.assignedFloors : [],
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Error opening edit dialog:', error);
      toast.error('Erreur lors de l\'ouverture du formulaire d\'édition');
    }
  };

  const filteredUsers = users.filter(user =>
    filter === 'all' ? true : user.role === filter
  );

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin': return Shield;
      case 'technician': return Wrench;
      default: return UsersIcon;
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'technician': return 'default';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'technician': return 'Technicien';
      default: return role;
    }
  };

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    technician: users.filter(u => u.role === 'technician').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">Administration des comptes et permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UsersIcon className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un utilisateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 8 caractères"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={formData.role} onValueChange={(v: User['role']) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="technician">Technicien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === 'technician' && (
                  <div className="space-y-2">
                    <Label>Étages assignés</Label>
                    <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                      {getAvailableFloors().length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun étage disponible</p>
                      ) : (
                        getAvailableFloors().map((floor) => (
                          <div key={floor} className="flex items-center space-x-2">
                            <CheckboxComponent
                              id={`floor-${floor}`}
                              checked={formData.assignedFloorNumbers.includes(floor)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    assignedFloorNumbers: [...formData.assignedFloorNumbers, floor],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    assignedFloorNumbers: formData.assignedFloorNumbers.filter(f => f !== floor),
                                  });
                                }
                              }}
                            />
                            <Label
                              htmlFor={`floor-${floor}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              Étage {floor}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddUser}>
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
                <UsersIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Administrateurs</p>
                  <p className="text-2xl font-bold">{stats.admin}</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Techniciens</p>
                  <p className="text-2xl font-bold">{stats.technician}</p>
                </div>
                <Wrench className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="admin">Administrateurs</TabsTrigger>
            <TabsTrigger value="technician">Techniciens</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => {
            const RoleIcon = getRoleIcon(user.role);
            
            return (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${
                        user.role === 'admin' ? 'bg-red-500/10' :
                        user.role === 'technician' ? 'bg-blue-500/10' :
                        'bg-green-500/10'
                      }`}>
                        <RoleIcon className={`h-6 w-6 ${
                          user.role === 'admin' ? 'text-red-500' :
                          user.role === 'technician' ? 'text-blue-500' :
                          'text-green-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <Badge variant={getRoleColor(user.role)} className="mt-1">
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.role === 'technician' && Array.isArray(user.assignedFloors) && user.assignedFloors.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hotel className="h-4 w-4" />
                        <span>{user.assignedFloors.length} étage(s) assigné(s): {user.assignedFloors.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openEditDialog(user)}
                    >
                      Modifier
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. L'utilisateur {user.name} sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom complet</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Mot de passe (laisser vide pour ne pas modifier)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 caractères"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select value={formData.role} onValueChange={(v: User['role']) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="technician">Technicien</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === 'technician' && (
              <div className="space-y-2">
                <Label>Étages assignés</Label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                  {getAvailableFloors().length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun étage disponible</p>
                  ) : (
                    getAvailableFloors().map((floor) => (
                      <div key={floor} className="flex items-center space-x-2">
                        <CheckboxComponent
                          id={`edit-floor-${floor}`}
                          checked={formData.assignedFloorNumbers.includes(floor)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                assignedFloorNumbers: [...formData.assignedFloorNumbers, floor],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                assignedFloorNumbers: formData.assignedFloorNumbers.filter(f => f !== floor),
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor={`edit-floor-${floor}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Étage {floor}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditUser}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Users;
