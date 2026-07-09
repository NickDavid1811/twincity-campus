import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { CampusMap } from './components/CampusMap';
import { Incidents } from './components/Incidents';
import { OccupancyDashboard } from './components/OccupancyDashboard';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { IncidentProvider } from './context/IncidentContext';
import { Toaster } from './components/ui/sonner';

type View = 'dashboard' | 'map' | 'incidents' | 'occupancy' | 'users' | 'reports';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Login onLogin={() => setIsAuthenticated(true)} />
      </ThemeProvider>
    );
  }

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <CampusMap onReportIncident={() => setCurrentView('incidents')} />;
      case 'incidents':
        return <Incidents />;
      case 'occupancy':
        return <OccupancyDashboard />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <IncidentProvider>
        <Layout currentView={currentView} onViewChange={handleViewChange} onLogout={() => setIsAuthenticated(false)}>
          {renderView()}
        </Layout>
      </IncidentProvider>
      <Toaster />
    </ThemeProvider>
  );
}
