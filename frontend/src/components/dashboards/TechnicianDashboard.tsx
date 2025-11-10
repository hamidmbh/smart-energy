import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Wrench } from 'lucide-react';

const mockInterventions = [
  { id: 1, room: '305', type: 'Surconsommation', priority: 'urgent', status: 'pending' },
  { id: 2, room: '412', type: 'Capteur défectueux', priority: 'high', status: 'in_progress' },
  { id: 3, room: '201', type: 'Maintenance préventive', priority: 'medium', status: 'pending' },
  { id: 4, room: '108', type: 'Climatisation', priority: 'low', status: 'pending' },
];

const mockAlerts = [
  { id: 1, room: '305', message: 'Température anormale', severity: 'high', time: '10:23' },
  { id: 2, room: '412', message: 'Capteur humidité hors ligne', severity: 'medium', time: '09:45' },
  { id: 3, room: '201', message: 'Consommation élevée', severity: 'low', time: '08:12' },
];

const TechnicianDashboard = () => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      default: return <Wrench className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Technicien</h1>
        <p className="text-muted-foreground mt-1">Gestion des interventions et alertes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terminées (aujourd'hui)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Interventions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Interventions assignées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInterventions.map((intervention) => (
              <div key={intervention.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    {getStatusIcon(intervention.status)}
                  </div>
                  <div>
                    <p className="font-medium">Chambre {intervention.room}</p>
                    <p className="text-sm text-muted-foreground">{intervention.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getPriorityColor(intervention.priority) as any}>
                    {intervention.priority}
                  </Badge>
                  <Button size="sm">
                    {intervention.status === 'pending' ? 'Commencer' : 'Continuer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium">Chambre {alert.room}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{alert.time}</span>
                  <Button size="sm" variant="outline">Traiter</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianDashboard;
