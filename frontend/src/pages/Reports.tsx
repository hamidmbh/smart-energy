import { useState, useEffect } from 'react';
import { energyAPI, roomsAPI, alertsAPI, interventionsAPI, reportsAPI } from '@/services/api';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  TrendingDown, 
  TrendingUp,
  DollarSign,
  Zap,
  Calendar,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { Alert, EnergyConsumption, Intervention, Room } from '@/types';

const Reports = () => {
  const [energyChartData, setEnergyChartData] = useState<any[]>([]);
  const [energySamples, setEnergySamples] = useState<EnergyConsumption[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    setIsLoading(true);
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    try {
      const [energyResponse, roomsResponse, alertsResponse, interventionsResponse] = await Promise.all([
        energyAPI.getConsumption('daily'),
        roomsAPI.getAll(),
        alertsAPI.getAll(),
        interventionsAPI.getAll(),
      ]);

      const filteredEnergy = energyResponse.data
        .filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= since;
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      const groupedData = filteredEnergy.reduce((acc, item) => {
        const existing = acc.find((d) => d.date === item.date);
        if (existing) {
          existing.consumption += item.consumption;
          existing.cost += item.cost;
        } else {
          acc.push({
            date: item.date,
            consumption: item.consumption,
            cost: item.cost,
          });
        }

        return acc;
      }, [] as any[]);

      setEnergyChartData(groupedData);
      setEnergySamples(filteredEnergy);
      setRooms(roomsResponse.data);
      setAlerts(alertsResponse.data);
      setInterventions(interventionsResponse.data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des rapports');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const totalConsumption = energyChartData.reduce((sum, d) => sum + d.consumption, 0);
  const totalCost = energyChartData.reduce((sum, d) => sum + d.cost, 0);
  const avgConsumption = totalConsumption / (energyChartData.length || 1);
  const avgCost = totalCost / (energyChartData.length || 1);

  // Consumption by room
  const roomConsumption = rooms
    .map(room => {
      const consumption = energySamples
        .filter(e => e.roomId === room.id)
        .reduce((sum, e) => sum + e.consumption, 0);
      return {
        name: `Ch.${room.number}`,
        value: consumption,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Status distribution
  const roomsByStatus = [
    { name: 'Occupées', value: rooms.filter(r => r.status === 'occupied').length, color: '#3b82f6' },
    { name: 'Libres', value: rooms.filter(r => r.status === 'vacant').length, color: '#10b981' },
    { name: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: '#ef4444' },
  ];

  // Alerts statistics
  const alertStats = {
    total: alerts.length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    pending: alerts.filter(a => a.status === 'pending').length,
  };

  // Interventions statistics
  const interventionStats = {
    total: interventions.length,
    completed: interventions.filter(i => i.status === 'completed').length,
    inProgress: interventions.filter(i => i.status === 'in_progress').length,
  };

  const handleExportPDF = async () => {
    try {
      const response = await reportsAPI.generate('energy', { period: selectedPeriod });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-energie-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Rapport PDF généré');
    } catch (error) {
      console.error(error);
      toast.error('Impossible de générer le PDF');
    }
  };

  const handleExportExcel = () => {
    // Generate CSV format
    let csvContent = 'Date,Consommation (kWh),Coût (€)\n';
    energyChartData.forEach(row => {
      csvContent += `${row.date},${row.consumption.toFixed(2)},${row.cost.toFixed(2)}\n`;
    });
    
    csvContent += '\n\nConsommation par chambre\n';
    csvContent += 'Chambre,Consommation (kWh)\n';
    roomConsumption.forEach(room => {
      csvContent += `${room.name},${room.value.toFixed(2)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donnees-energie-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Données exportées avec succès');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">Chargement des données...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rapports & Statistiques</h1>
            <p className="text-muted-foreground mt-1">Analyse détaillée de la performance énergétique</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === '7d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('7d')}
          >
            7 jours
          </Button>
          <Button
            variant={selectedPeriod === '30d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('30d')}
          >
            30 jours
          </Button>
          <Button
            variant={selectedPeriod === '90d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('90d')}
          >
            90 jours
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consommation Totale</p>
                  <p className="text-2xl font-bold">{totalConsumption.toFixed(1)} kWh</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moy: {avgConsumption.toFixed(1)} kWh/jour
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Coût Total</p>
                  <p className="text-2xl font-bold">{totalCost.toFixed(2)} €</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moy: {avgCost.toFixed(2)} €/jour
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes</p>
                  <p className="text-2xl font-bold">{alertStats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alertStats.resolved} résolues
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interventions</p>
                  <p className="text-2xl font-bold">{interventionStats.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {interventionStats.completed} terminées
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consumption Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution de la Consommation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={energyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                    formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consommation']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="consumption" stroke="#3b82f6" name="Consommation (kWh)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Coûts</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={energyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                    formatter={(value: number) => [`${value.toFixed(2)} €`, 'Coût']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke="#10b981" name="Coût (€)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Consuming Rooms */}
          <Card>
            <CardHeader>
              <CardTitle>Top Consommateurs par Chambre</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomConsumption}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} kWh`} />
                  <Bar dataKey="value" fill="#3b82f6" name="Consommation (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Room Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Chambres</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Économies Potentielles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">
                {(totalCost * 0.15).toFixed(2)} €
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Estimation basée sur l'optimisation des modes éco
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Taux de Résolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">
                {((alertStats.resolved / (alertStats.total || 1)) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {alertStats.resolved} alertes résolues sur {alertStats.total}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-500">
                {((interventionStats.completed / (interventionStats.total || 1)) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {interventionStats.completed} interventions terminées
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
