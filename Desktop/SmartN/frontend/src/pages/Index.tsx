import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Hotel, Gauge, TrendingDown, Shield } from 'lucide-react';

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-energy-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Smart Energy Hotel Manager
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Solution intelligente de gestion et d'optimisation énergétique pour hôtels.
            Réduisez vos coûts, améliorez le confort, protégez l'environnement.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.assign('/login')}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto"
          >
            Accéder à la plateforme
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités principales</h2>
          <p className="text-muted-foreground text-lg">
            Une plateforme complète pour optimiser la gestion énergétique de votre hôtel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-2xl border border-border hover:shadow-card-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Hotel className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Gestion des chambres</h3>
            <p className="text-muted-foreground text-sm">
              Supervision complète et contrôle en temps réel de toutes les chambres
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-border hover:shadow-card-lg transition-shadow">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gauge className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Capteurs intelligents</h3>
            <p className="text-muted-foreground text-sm">
              Surveillance énergétique précise avec détection d'anomalies
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-border hover:shadow-card-lg transition-shadow">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Économies garanties</h3>
            <p className="text-muted-foreground text-sm">
              Réduction jusqu'à 30% de la consommation énergétique
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl border border-border hover:shadow-card-lg transition-shadow">
            <div className="w-16 h-16 bg-info/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-info" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Alertes intelligentes</h3>
            <p className="text-muted-foreground text-sm">
              Notifications automatiques et intervention rapide
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à optimiser votre gestion énergétique ?</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Rejoignez les hôtels qui ont déjà fait le choix de l'intelligence énergétique
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.assign('/login')}
            className="text-lg px-8 py-6 h-auto"
          >
            Commencer maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
