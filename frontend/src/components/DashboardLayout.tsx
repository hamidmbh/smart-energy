import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Hotel, 
  Gauge, 
  AlertCircle, 
  Wrench, 
  Users, 
  FileText, 
  LogOut,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
          { icon: Hotel, label: 'Chambres', path: '/rooms' },
          { icon: Gauge, label: 'Capteurs', path: '/sensors' },
          { icon: AlertCircle, label: 'Alertes', path: '/alerts' },
          { icon: Users, label: 'Utilisateurs', path: '/users' },
          { icon: FileText, label: 'Rapports', path: '/reports' },
        ];
      case 'technician':
        return [
          { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
          { icon: Gauge, label: 'Capteurs', path: '/sensors' },
          { icon: AlertCircle, label: 'Alertes', path: '/alerts' },
          { icon: Wrench, label: 'Interventions', path: '/interventions' },
        ];
      case 'client':
        return [
          { icon: Hotel, label: 'Ma chambre', path: '/dashboard' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Smart Energy</h1>
              <p className="text-xs text-muted-foreground">Hotel Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {getNavItems().map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="px-4 py-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="flex-1"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
