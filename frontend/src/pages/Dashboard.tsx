import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import TechnicianDashboard from '@/components/dashboards/TechnicianDashboard';
import ClientDashboard from '@/components/dashboards/ClientDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'technician':
        return <TechnicianDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
