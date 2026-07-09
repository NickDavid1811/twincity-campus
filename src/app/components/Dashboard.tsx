import { motion } from 'motion/react';
import {
  Users,
  Building2,
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useIncidents } from '../context/IncidentContext';
import type { IncidentCategory } from '../types/incident';

const occupancyData = [
  { time: '08:00', ocupacion: 45 },
  { time: '10:00', ocupacion: 78 },
  { time: '12:00', ocupacion: 92 },
  { time: '14:00', ocupacion: 87 },
  { time: '16:00', ocupacion: 65 },
  { time: '18:00', ocupacion: 42 },
  { time: '20:00', ocupacion: 28 },
];

const buildingData = [
  { name: 'Edificio A', value: 340 },
  { name: 'Edificio B', value: 280 },
  { name: 'Edificio C', value: 220 },
  { name: 'Edificio D', value: 160 },
];

const categoryColors: Record<IncidentCategory, string> = {
  Tecnología: '#f59e0b',
  Mantenimiento: '#0066ff',
  Seguridad: '#ef4444',
  Limpieza: '#10b981',
  Infraestructura: '#8b5cf6',
  Otro: '#94a3b8',
};

const formatTime = (value: string) => new Intl.DateTimeFormat('es-PE', {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value));

export function Dashboard() {
  const { incidents } = useIncidents();
  const openIncidents = incidents.filter((incident) => incident.status === 'Abierta').length;
  const inProgressIncidents = incidents.filter((incident) => incident.status === 'En proceso').length;
  const resolvedIncidents = incidents.filter((incident) => incident.status === 'Resuelta').length;
  const criticalIncidents = incidents.filter((incident) => incident.priority === 'Crítica').length;

  const kpiData = [
    { label: 'Total Incidencias', value: incidents.length, change: `${openIncidents} abiertas`, icon: AlertTriangle, color: 'primary', iconBg: 'bg-primary/10 text-primary' },
    { label: 'En Proceso', value: inProgressIncidents, change: 'seguimiento', icon: Clock, color: 'warning', iconBg: 'bg-warning/10 text-warning' },
    { label: 'Resueltas', value: resolvedIncidents, change: 'cerradas', icon: CheckCircle2, color: 'success', iconBg: 'bg-success/10 text-success' },
    { label: 'Críticas', value: criticalIncidents, change: 'prioridad', icon: TrendingUp, color: 'danger', iconBg: 'bg-destructive/10 text-destructive' },
  ];

  const incidentsByType = Object.entries(categoryColors).map(([name, color]) => ({
    name,
    value: incidents.filter((incident) => incident.category === name).length,
    color,
  })).filter((entry) => entry.value > 0);

  const recentIncidents = incidents.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Panel de Control</h1>
          <p className="text-sm text-muted-foreground">Vista general del campus e incidencias registradas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;

          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${kpi.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-2xl text-foreground mb-1">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Ocupación del Campus (Hoy)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={occupancyData}>
              <defs>
                <linearGradient id="colorOcupacion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0066ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }} labelStyle={{ color: '#f8fafc' }} />
              <Area type="monotone" dataKey="ocupacion" stroke="#0066ff" strokeWidth={2} fill="url(#colorOcupacion)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Incidencias por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={incidentsByType} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {incidentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Ocupación por Edificio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={buildingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#0066ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Incidencias Recientes</h3>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  incident.priority === 'Crítica' ? 'bg-destructive' :
                  incident.priority === 'Alta' ? 'bg-warning' :
                  incident.priority === 'Media' ? 'bg-primary' : 'bg-success'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{incident.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {incident.building}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(incident.createdAt)}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded whitespace-nowrap bg-secondary text-muted-foreground border border-border">
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
