import { useState, useEffect } from 'react';
import { floorsAPI } from '@/services/api';
import { Floor } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building2, Plus, Edit, Trash2, Hotel } from 'lucide-react';
import { toast } from 'sonner';

const Floors = () => {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    loadFloors();
  }, []);

  const loadFloors = async () => {
    try {
      const response = await floorsAPI.getAll();
      setFloors(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des étages');
    }
  };

  const handleAddFloor = async () => {
    try {
      await floorsAPI.create({
        number: parseInt(formData.number),
        name: formData.name || undefined,
        description: formData.description || undefined,
      });
      await loadFloors();
      setIsAddDialogOpen(false);
      setFormData({ number: '', name: '', description: '' });
      toast.success('Étage créé avec succès');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    }
  };

  const handleEditFloor = async () => {
    if (!selectedFloor) return;
    try {
      await floorsAPI.update(selectedFloor.id, {
        number: parseInt(formData.number),
        name: formData.name || undefined,
        description: formData.description || undefined,
      });
      await loadFloors();
      setIsEditDialogOpen(false);
      setSelectedFloor(null);
      setFormData({ number: '', name: '', description: '' });
      toast.success('Étage modifié avec succès');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    }
  };

  const handleDeleteFloor = async (floorId: string) => {
    try {
      await floorsAPI.delete(floorId);
      await loadFloors();
      toast.success('Étage supprimé avec succès');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    }
  };

  const openEditDialog = (floor: Floor) => {
    setSelectedFloor(floor);
    setFormData({
      number: floor.number.toString(),
      name: floor.name || '',
      description: floor.description || '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Étages</h1>
            <p className="text-muted-foreground mt-1">Gérer les étages du bâtiment</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un étage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un étage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Numéro d'étage *</Label>
                  <Input
                    id="number"
                    type="number"
                    min="0"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="Ex: 1, 2, 3..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom (optionnel)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Rez-de-chaussée, Premier étage..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de l'étage..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddFloor}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Floors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {floors.map((floor) => (
            <Card key={floor.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {floor.name || `Étage ${floor.number}`}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Numéro: {floor.number}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {floor.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {floor.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {floor.roomsCount || 0} chambre(s)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(floor)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'étage</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer l'étage {floor.name || floor.number} ?
                          {floor.roomsCount && floor.roomsCount > 0 && (
                            <span className="block mt-2 text-destructive">
                              Attention: Cet étage contient {floor.roomsCount} chambre(s). 
                              Vous devez d'abord supprimer ou déplacer ces chambres.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFloor(floor.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {floors.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun étage créé</p>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'étage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-number">Numéro d'étage *</Label>
                <Input
                  id="edit-number"
                  type="number"
                  min="0"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="Ex: 1, 2, 3..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom (optionnel)</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rez-de-chaussée, Premier étage..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (optionnel)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de l'étage..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleEditFloor}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Floors;

