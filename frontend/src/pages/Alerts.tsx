import { useState, useEffect } from 'react';
import { alertsDB, roomsDB, sensorsDB } from '@/services/database';
import { alertsAPI } from '@/services/api';
import { Alert } from '@/types';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Flame,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'acknowledged' | 'resolved'>('all');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const response = await alertsAPI.getAll();
    setAlerts(response.data);
  };

  const filteredAlerts = alerts.filter(alert =>
    filter === 'all' ? true : alert.status === filter
  );

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return Flame;
      case 'high': return AlertTriangle;
      case 'medium': return AlertCircle;
      case 'low': return Info;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityLabel = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'Critique';
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return severity;
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'overconsumption': return 'Surconsommation';
      case 'anomaly': return 'Anomalie';
      case 'maintenance': return 'Maintenance';
      case 'critical': return 'Critique';
      default: return type;
    }
  };

  const getStatusLabel = (status: Alert['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'acknowledged': return 'Prise en compte';
      case 'resolved': return 'Résolue';
      default: return status;
    }
  };

  const getRoomNumber = (roomId?: string) => {
    if (!roomId) return 'N/A';
    const room = roomsDB.getById(roomId);
    return room ? room.number : roomId;
  };

  const getSensorName = (sensorId?: string) => {
    if (!sensorId) return null;
    const sensor = sensorsDB.getById(sensorId);
    return sensor ? sensor.name : sensorId;
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

  const handleAcknowledge = async (alertId: string) => {
    try {
      await alertsAPI.acknowledge(alertId);
      await loadAlerts();
      toast.success('Alerte prise en compte');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await alertsAPI.resolve(alertId);
      await loadAlerts();
      toast.success('Alerte résolue');
    } catch (error) {
      toast.error('Erreur lors de la résolution');
    }
  };

  const stats = {
    total: alerts.length,
    pending: alerts.filter(a => a.status === 'pending').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Alertes</h1>
          <p className="text-muted-foreground mt-1">Surveillance et traitement des alertes système</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
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
                  <p className="text-sm text-muted-foreground">Prises en compte</p>
                  <p className="text-2xl font-bold">{stats.acknowledged}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Résolues</p>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critiques</p>
                  <p className="text-2xl font-bold">{stats.critical}</p>
                </div>
                <Flame className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="acknowledged">Prises en compte</TabsTrigger>
            <TabsTrigger value="resolved">Résolues</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map(alert => {
            const Icon = getSeverityIcon(alert.severity);
            const sensorName = getSensorName(alert.sensorId);
            
            return (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        alert.severity === 'critical' ? 'bg-red-500/10' :
                        alert.severity === 'high' ? 'bg-orange-500/10' :
                        alert.severity === 'medium' ? 'bg-yellow-500/10' :
                        'bg-blue-500/10'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getSeverityColor(alert.severity)}>
                                {getSeverityLabel(alert.severity)}
                              </Badge>
                              <Badge variant="outline">
                                {getTypeLabel(alert.type)}
                              </Badge>
                              <Badge variant="secondary">
                                Chambre {getRoomNumber(alert.roomId)}
                              </Badge>
                            </div>
                            <p className="font-medium text-lg">{alert.message}</p>
                            {sensorName && (
                              <p className="text-sm text-muted-foreground">
                                Capteur: {sensorName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getTimeSince(alert.createdAt)}
                          </div>
                          <div>
                            Statut: {getStatusLabel(alert.status)}
                          </div>
                          {alert.resolvedAt && (
                            <div>
                              Résolue: {getTimeSince(alert.resolvedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {alert.status !== 'resolved' && (
                      <div className="flex gap-2">
                        {alert.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Prendre en compte
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleResolve(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Résoudre
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune alerte {filter !== 'all' && getStatusLabel(filter as any).toLowerCase()}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
