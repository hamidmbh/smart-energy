import { useState, useEffect } from 'react';
import { usersDB } from '@/services/database';
import { usersAPI } from '@/services/api';
import { User } from '@/types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'admin' | 'technician' | 'client'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'client' as User['role'],
    roomId: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await usersAPI.getAll();
    setUsers(response.data);
  };

  const handleAddUser = async () => {
    try {
      await usersAPI.create({
        ...formData,
        id: `user-${Date.now()}`,
        password: 'password123', // Default password
      });
      await loadUsers();
      setIsAddDialogOpen(false);
      setFormData({ name: '', email: '', role: 'client', roomId: '' });
      toast.success('Utilisateur créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      await usersAPI.update(selectedUser.id, formData);
      await loadUsers();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setFormData({ name: '', email: '', role: 'client', roomId: '' });
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
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      roomId: user.roomId || '',
    });
    setIsEditDialogOpen(true);
  };

  const filteredUsers = users.filter(user =>
    filter === 'all' ? true : user.role === filter
  );

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin': return Shield;
      case 'technician': return Wrench;
      case 'client': return Hotel;
      default: return UsersIcon;
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'technician': return 'default';
      case 'client': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'technician': return 'Technicien';
      case 'client': return 'Client';
      default: return role;
    }
  };

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    technician: users.filter(u => u.role === 'technician').length,
    client: users.filter(u => u.role === 'client').length,
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
                  <Label htmlFor="role">Rôle</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="roomId">Chambre (optionnel)</Label>
                  <Input
                    id="roomId"
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    placeholder="101"
                  />
                </div>
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clients</p>
                  <p className="text-2xl font-bold">{stats.client}</p>
                </div>
                <Hotel className="h-8 w-8 text-green-500" />
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
            <TabsTrigger value="client">Clients</TabsTrigger>
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
                    {user.roomId && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hotel className="h-4 w-4" />
                        <span>Chambre {user.roomId}</span>
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
            <div className="space-y-2">
              <Label htmlFor="edit-roomId">Chambre (optionnel)</Label>
              <Input
                id="edit-roomId"
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              />
            </div>
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
