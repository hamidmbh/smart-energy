import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel, Zap, AlertTriangle, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockEnergyData = [
  { time: '00:00', consommation: 45, cout: 12 },
  { time: '04:00', consommation: 32, cout: 9 },
  { time: '08:00', consommation: 68, cout: 18 },
  { time: '12:00', consommation: 85, cout: 23 },
  { time: '16:00', consommation: 92, cout: 25 },
  { time: '20:00', consommation: 78, cout: 21 },
];

const mockRoomData = [
  { chambre: 'Ch.101', consommation: 45 },
  { chambre: 'Ch.102', consommation: 38 },
  { chambre: 'Ch.103', consommation: 52 },
  { chambre: 'Ch.104', consommation: 41 },
  { chambre: 'Ch.105', consommation: 47 },
];

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Administrateur</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de la gestion énergétique</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chambres occupées</CardTitle>
            <Hotel className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 / 50</div>
            <p className="text-xs text-muted-foreground mt-1">84% d'occupation</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consommation actuelle</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247 kWh</div>
            <p className="text-xs text-success mt-1">-12% vs hier</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes actives</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-warning mt-1">3 critiques</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Économies du mois</CardTitle>
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847 €</div>
            <p className="text-xs text-success mt-1">+18% vs mois dernier</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Consommation énergétique (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockEnergyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consommation" stroke="hsl(var(--primary))" strokeWidth={2} name="kWh" />
                <Line type="monotone" dataKey="cout" stroke="hsl(var(--secondary))" strokeWidth={2} name="€" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top 5 chambres consommatrices</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRoomData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="chambre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consommation" fill="hsl(var(--primary))" name="kWh" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Alertes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, type: 'critical', message: 'Surconsommation détectée - Chambre 305', time: 'Il y a 5 min' },
              { id: 2, type: 'warning', message: 'Capteur de température hors ligne - Chambre 412', time: 'Il y a 15 min' },
              { id: 3, type: 'info', message: 'Maintenance programmée - Étage 2', time: 'Il y a 1h' },
            ].map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'critical' ? 'text-destructive' : 
                  alert.type === 'warning' ? 'text-warning' : 'text-info'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
