import { useState, useEffect } from 'react';
import { interventionsAPI, roomsAPI, usersAPI } from '@/services/api';
import { Intervention } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Hotel,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Interventions = () => {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [roomsMap, setRoomsMap] = useState<Record<string, string>>({});
  const [techniciansMap, setTechniciansMap] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  useEffect(() => {
    loadInterventions();
  }, [user]);

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadInterventions = async () => {
    if (!user) return;
    try {
      let response;
      if (user.role === 'technician') {
        response = await interventionsAPI.getByTechnician(user.id);
      } else {
        response = await interventionsAPI.getAll();
      }
      setInterventions(response.data);
    } catch (error) {
      console.error('Failed to load interventions', error);
    }
  };

  const loadReferenceData = async () => {
    try {
      const [roomsResponse, usersResponse] = await Promise.all([
        roomsAPI.getAll(),
        usersAPI.getAll(),
      ]);

      setRoomsMap(
        roomsResponse.data.reduce((acc, room) => {
          acc[room.id] = room.number;
          return acc;
        }, {} as Record<string, string>)
      );

      setTechniciansMap(
        usersResponse.data.reduce((acc, currentUser) => {
          acc[currentUser.id] = currentUser.name;
          return acc;
        }, {} as Record<string, string>)
      );
    } catch (error) {
      console.error('Failed to load reference data', error);
    }
  };

  const filteredInterventions = interventions.filter(intervention =>
    filter === 'all' ? true : intervention.status === filter
  );

  const getPriorityColor = (priority: Intervention['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority: Intervention['priority']) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return priority;
    }
  };

  const getStatusColor = (status: Intervention['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Intervention['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getRoomNumber = (roomId: string) => roomsMap[roomId] ?? roomId;

  const getTechnicianName = (technicianId: string) =>
    techniciansMap[technicianId] ?? 'N/A';

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

  const handleStartIntervention = async (interventionId: string) => {
    try {
      await interventionsAPI.update(interventionId, { status: 'in_progress' });
      await loadInterventions();
      toast.success('Intervention démarrée');
    } catch (error) {
      toast.error('Erreur lors du démarrage');
    }
  };

  const handleCompleteIntervention = async () => {
    if (!selectedIntervention) return;
    
    try {
      await interventionsAPI.complete(selectedIntervention.id, completionNotes);
      await loadInterventions();
      setSelectedIntervention(null);
      setCompletionNotes('');
      toast.success('Intervention terminée');
    } catch (error) {
      toast.error('Erreur lors de la complétion');
    }
  };

  const stats = {
    total: interventions.length,
    pending: interventions.filter(i => i.status === 'pending').length,
    inProgress: interventions.filter(i => i.status === 'in_progress').length,
    completed: interventions.filter(i => i.status === 'completed').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Interventions</h1>
          <p className="text-muted-foreground mt-1">Suivi des interventions techniques et maintenance</p>
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
                <Wrench className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Interventions List */}
        <div className="space-y-3">
          {filteredInterventions.map(intervention => (
            <Card key={intervention.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      intervention.priority === 'urgent' ? 'bg-red-500/10' :
                      intervention.priority === 'high' ? 'bg-orange-500/10' :
                      intervention.priority === 'medium' ? 'bg-yellow-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      <Wrench className={`h-6 w-6 ${
                        intervention.priority === 'urgent' ? 'text-red-500' :
                        intervention.priority === 'high' ? 'text-orange-500' :
                        intervention.priority === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getPriorityColor(intervention.priority)}>
                              {getPriorityLabel(intervention.priority)}
                            </Badge>
                            <Badge variant={getStatusColor(intervention.status)}>
                              {getStatusLabel(intervention.status)}
                            </Badge>
                          </div>
                          <p className="font-medium text-lg">{intervention.type}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {intervention.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Hotel className="h-4 w-4" />
                          Chambre {getRoomNumber(intervention.roomId)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {getTechnicianName(intervention.technicianId)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {getTimeSince(intervention.createdAt)}
                        </div>
                      </div>

                      {intervention.notes && (
                        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg mt-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                            <p className="text-sm">{intervention.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {intervention.status !== 'completed' && intervention.status !== 'cancelled' && (
                    <div className="flex flex-col gap-2">
                      {intervention.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartIntervention(intervention.id)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Démarrer
                        </Button>
                      )}
                      {intervention.status === 'in_progress' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedIntervention(intervention)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Terminer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Terminer l'intervention</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Notes de complétion</p>
                                <Textarea
                                  placeholder="Décrivez le travail effectué..."
                                  value={completionNotes}
                                  onChange={(e) => setCompletionNotes(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setSelectedIntervention(null)}>
                                  Annuler
                                </Button>
                                <Button onClick={handleCompleteIntervention}>
                                  Confirmer
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredInterventions.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune intervention {filter !== 'all' && getStatusLabel(filter as any).toLowerCase()}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interventions;
