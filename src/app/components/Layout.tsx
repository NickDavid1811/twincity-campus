import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  LayoutDashboard,
  Map,
  AlertCircle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  Maximize2,
  Calendar
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'map', label: 'Mapa Campus', icon: Map },
  { id: 'incidents', label: 'Incidencias', icon: AlertCircle },
  { id: 'reservations', label: 'Reservas', icon: Calendar },
  { id: 'occupancy', label: 'Ocupación', icon: Maximize2 },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
];

export function Layout({ children, currentView, onViewChange, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const allowedMenuItems = menuItems.filter((item) => {
    if (user?.role === 'admin') return true;
    return ['map', 'incidents', 'reservations'].includes(item.id);
  });

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      <motion.aside
        initial={{ width: sidebarOpen ? 256 : 72 }}
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3 }}
        className="bg-sidebar border-r border-sidebar-border flex flex-col"
      >
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="bg-sidebar-primary p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <h2 className="text-sidebar-foreground">TwinCity</h2>
                <p className="text-xs text-sidebar-foreground/60">Campus Manager</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {allowedMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </motion.button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <motion.button
            whileHover={{ x: 4 }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Configuración</span>}
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
          </motion.button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="relative w-96 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar en el campus..."
                className="w-full pl-10 pr-4 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </div>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
                </p>
              </div>
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground">{user?.initials}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
