import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Lightbulb, 
  Wind, 
  Blinds, 
  Moon, 
  Leaf, 
  Sparkles 
} from 'lucide-react';

const ClientDashboard = () => {
  const [temperature, setTemperature] = useState([22]);
  const [lights, setLights] = useState(true);
  const [ac, setAc] = useState(true);
  const [curtains, setCurtains] = useState(false);
  const [mode, setMode] = useState<'comfort' | 'eco' | 'night'>('comfort');

  const handleModeChange = (newMode: 'comfort' | 'eco' | 'night') => {
    setMode(newMode);
    // Auto-adjust settings based on mode
    switch (newMode) {
      case 'eco':
        setTemperature([24]);
        setLights(false);
        break;
      case 'night':
        setTemperature([20]);
        setLights(false);
        setCurtains(true);
        break;
      case 'comfort':
        setTemperature([22]);
        setLights(true);
        setCurtains(false);
        break;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Ma Chambre - 305</h1>
        <p className="text-muted-foreground mt-1">Contrôle et surveillance en temps réel</p>
      </div>

      {/* Room Status */}
      <Card className="shadow-card-lg bg-energy-gradient text-primary-foreground">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Thermometer className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">{temperature}°C</div>
              <div className="text-sm opacity-80">Température</div>
            </div>
            <div className="text-center">
              <Leaf className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">3.2</div>
              <div className="text-sm opacity-80">kWh consommés</div>
            </div>
            <div className="text-center">
              <Wind className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">{ac ? 'ON' : 'OFF'}</div>
              <div className="text-sm opacity-80">Climatisation</div>
            </div>
            <div className="text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">{lights ? 'ON' : 'OFF'}</div>
              <div className="text-sm opacity-80">Éclairage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Modes prédéfinis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={mode === 'comfort' ? 'default' : 'outline'}
              className="h-24 flex flex-col gap-2"
              onClick={() => handleModeChange('comfort')}
            >
              <Sparkles className="w-6 h-6" />
              <div>
                <div className="font-semibold">Confort</div>
                <div className="text-xs opacity-80">Paramètres optimaux</div>
              </div>
            </Button>

            <Button
              variant={mode === 'eco' ? 'default' : 'outline'}
              className="h-24 flex flex-col gap-2"
              onClick={() => handleModeChange('eco')}
            >
              <Leaf className="w-6 h-6" />
              <div>
                <div className="font-semibold">Éco</div>
                <div className="text-xs opacity-80">Économie d'énergie</div>
              </div>
            </Button>

            <Button
              variant={mode === 'night' ? 'default' : 'outline'}
              className="h-24 flex flex-col gap-2"
              onClick={() => handleModeChange('night')}
            >
              <Moon className="w-6 h-6" />
              <div>
                <div className="font-semibold">Nuit</div>
                <div className="text-xs opacity-80">Ambiance nocturne</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Température
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{temperature}°C</div>
              <p className="text-sm text-muted-foreground mt-1">Température cible</p>
            </div>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              min={16}
              max={28}
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>16°C</span>
              <span>28°C</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Contrôles rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5" />
                <div>
                  <div className="font-medium">Éclairage</div>
                  <div className="text-sm text-muted-foreground">Principal</div>
                </div>
              </div>
              <Switch checked={lights} onCheckedChange={setLights} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5" />
                <div>
                  <div className="font-medium">Climatisation</div>
                  <div className="text-sm text-muted-foreground">Auto</div>
                </div>
              </div>
              <Switch checked={ac} onCheckedChange={setAc} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Blinds className="w-5 h-5" />
                <div>
                  <div className="font-medium">Rideaux</div>
                  <div className="text-sm text-muted-foreground">Électriques</div>
                </div>
              </div>
              <Switch checked={curtains} onCheckedChange={setCurtains} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Info */}
      <Card className="shadow-card border-secondary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <div className="font-semibold">Mode Éco activé automatiquement</div>
                <div className="text-sm text-muted-foreground">
                  Économie de 2,3 kWh aujourd'hui • -18% vs moyenne
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Économie active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
