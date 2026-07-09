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
import { ReservationProvider } from './context/ReservationContext';
import { Reservations } from './components/Reservations';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './context/AuthContext';

type View = 'dashboard' | 'map' | 'incidents' | 'occupancy' | 'users' | 'reports' | 'reservations';

function AppContent() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');

  // Enforce Role-Based Access Control
  if (user?.role === 'user') {
    const allowedViewsForUser = ['map', 'incidents', 'reservations'];
    if (!allowedViewsForUser.includes(currentView)) {
      // Force user to a safe view if they try to access restricted ones
      setCurrentView('map');
    }
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
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
      case 'reservations':
        return <Reservations onReportIncident={() => setCurrentView('incidents')} />;
      case 'occupancy':
        return <OccupancyDashboard />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      default:
        return user?.role === 'user' ? <CampusMap onReportIncident={() => setCurrentView('incidents')} /> : <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange} onLogout={logout}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <IncidentProvider>
          <ReservationProvider>
            <AppContent />
          </ReservationProvider>
        </IncidentProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

