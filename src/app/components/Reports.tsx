import { motion } from 'motion/react';
import { Download, Calendar, Filter, TrendingUp, FileText, PieChart, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

const monthlyData = [
  { month: 'Ene', incidencias: 45, resueltas: 42, ocupacion: 78 },
  { month: 'Feb', incidencias: 52, resueltas: 48, ocupacion: 82 },
  { month: 'Mar', incidencias: 48, resueltas: 45, ocupacion: 85 },
  { month: 'Abr', incidencias: 61, resueltas: 55, ocupacion: 88 },
  { month: 'May', incidencias: 55, resueltas: 52, ocupacion: 87 },
];

const categoryData = [
  { name: 'Mantenimiento', value: 145, color: '#0066ff' },
  { name: 'Tecnología', value: 98, color: '#10b981' },
  { name: 'Limpieza', value: 76, color: '#f59e0b' },
  { name: 'Seguridad', value: 54, color: '#ef4444' },
  { name: 'Otros', value: 32, color: '#8b5cf6' },
];

const buildingPerformance = [
  { building: 'Edificio A', eficiencia: 94, incidencias: 28, ocupacion: 87 },
  { building: 'Edificio B', eficiencia: 89, incidencias: 42, ocupacion: 82 },
  { building: 'Edificio C', eficiencia: 92, incidencias: 31, ocupacion: 79 },
  { building: 'Edificio D', eficiencia: 88, incidencias: 45, ocupacion: 85 },
];

const timeToResolution = [
  { priority: 'Crítica', avg: 2.5 },
  { priority: 'Alta', avg: 8.2 },
  { priority: 'Media', avg: 24.5 },
  { priority: 'Baja', avg: 48.3 },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Reportes y Analytics</h1>
          <p className="text-sm text-muted-foreground">Análisis de datos y métricas del campus</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            <Calendar className="w-4 h-4 inline mr-2" />
            Último mes
          </button>
          <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4 inline mr-2" />
            Filtros
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-2xl text-foreground mb-1">405</h3>
          <p className="text-sm text-muted-foreground">Incidencias este mes</p>
          <p className="text-xs text-success mt-2">+12% vs mes anterior</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </div>
          <h3 className="text-2xl text-foreground mb-1">91%</h3>
          <p className="text-sm text-muted-foreground">Tasa de resolución</p>
          <p className="text-xs text-success mt-2">+3% vs mes anterior</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-warning/10">
              <BarChart3 className="w-5 h-5 text-warning" />
            </div>
          </div>
          <h3 className="text-2xl text-foreground mb-1">18.5h</h3>
          <p className="text-sm text-muted-foreground">Tiempo promedio resolución</p>
          <p className="text-xs text-destructive mt-2">+2.3h vs mes anterior</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <PieChart className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl text-foreground mb-1">84%</h3>
          <p className="text-sm text-muted-foreground">Ocupación promedio</p>
          <p className="text-xs text-success mt-2">+1% vs mes anterior</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Tendencias Mensuales</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorIncidencias" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResueltas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="incidencias" stroke="#ef4444" strokeWidth={2} fill="url(#colorIncidencias)" />
              <Area type="monotone" dataKey="resueltas" stroke="#10b981" strokeWidth={2} fill="url(#colorResueltas)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Incidencias por Categoría</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RechartsPie>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
            </RechartsPie>
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
          <h3 className="text-lg text-foreground mb-4">Rendimiento por Edificio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildingPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="building" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="eficiencia" fill="#0066ff" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ocupacion" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-lg text-foreground mb-4">Tiempo Promedio de Resolución (horas)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeToResolution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="priority" type="category" stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
              <Bar dataKey="avg" fill="#f59e0b" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-lg text-foreground mb-4">Métricas Detalladas</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Edificio</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Eficiencia</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Incidencias</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Ocupación</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Tendencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {buildingPerformance.map((building, index) => (
                <tr key={index} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 text-sm">{building.building}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${building.eficiencia}%` }}
                        />
                      </div>
                      <span className="text-sm">{building.eficiencia}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{building.incidencias}</td>
                  <td className="px-6 py-4 text-sm">{building.ocupacion}%</td>
                  <td className="px-6 py-4">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
