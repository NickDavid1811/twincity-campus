import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, Clock, Maximize2, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const weeklyOccupancy = [
  { day: 'Lun', edificioA: 85, edificioB: 72, edificioC: 68, edificioD: 79 },
  { day: 'Mar', edificioA: 88, edificioB: 75, edificioC: 71, edificioD: 82 },
  { day: 'Mié', edificioA: 92, edificioB: 78, edificioC: 74, edificioD: 85 },
  { day: 'Jue', edificioA: 89, edificioB: 76, edificioC: 72, edificioD: 83 },
  { day: 'Vie', edificioA: 87, edificioB: 73, edificioC: 69, edificioD: 80 },
  { day: 'Sáb', edificioA: 45, edificioB: 38, edificioC: 32, edificioD: 40 },
  { day: 'Dom', edificioA: 25, edificioB: 20, edificioC: 18, edificioD: 22 },
];

const hourlyOccupancy = [
  { hour: '07:00', ocupacion: 12 },
  { hour: '08:00', ocupacion: 35 },
  { hour: '09:00', ocupacion: 68 },
  { hour: '10:00', ocupacion: 82 },
  { hour: '11:00', ocupacion: 88 },
  { hour: '12:00', ocupacion: 92 },
  { hour: '13:00', ocupacion: 78 },
  { hour: '14:00', ocupacion: 85 },
  { hour: '15:00', ocupacion: 89 },
  { hour: '16:00', ocupacion: 76 },
  { hour: '17:00', ocupacion: 62 },
  { hour: '18:00', ocupacion: 45 },
  { hour: '19:00', ocupacion: 32 },
  { hour: '20:00', ocupacion: 18 },
];

const roomData = [
  { id: 1, name: 'Aula 101', building: 'Edificio A', capacity: 40, current: 38, status: 'occupied', trend: 'up' },
  { id: 2, name: 'Aula 102', building: 'Edificio A', capacity: 40, current: 0, status: 'available', trend: 'neutral' },
  { id: 3, name: 'Aula 201', building: 'Edificio A', capacity: 50, current: 48, status: 'full', trend: 'up' },
  { id: 4, name: 'Lab A', building: 'Edificio B', capacity: 30, current: 22, status: 'occupied', trend: 'down' },
  { id: 5, name: 'Lab B', building: 'Edificio B', capacity: 30, current: 0, status: 'maintenance', trend: 'neutral' },
  { id: 6, name: 'Auditorio', building: 'Edificio C', capacity: 200, current: 145, status: 'occupied', trend: 'up' },
  { id: 7, name: 'Sala 1', building: 'Edificio C', capacity: 25, current: 12, status: 'occupied', trend: 'neutral' },
  { id: 8, name: 'Lab C', building: 'Edificio D', capacity: 35, current: 35, status: 'full', trend: 'stable' },
];

export function OccupancyDashboard() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'heatmap'>('grid');

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    if (percentage >= 40) return 'bg-success';
    return 'bg-primary';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'full':
        return <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">Lleno</span>;
      case 'occupied':
        return <span className="px-2 py-1 bg-success/10 text-success text-xs rounded">Ocupado</span>;
      case 'available':
        return <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Disponible</span>;
      case 'maintenance':
        return <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded">Mantenimiento</span>;
      default:
        return null;
    }
  };

  const filteredRooms = selectedBuilding === 'all'
    ? roomData
    : roomData.filter(room => room.building === selectedBuilding);

  const avgOccupancy = Math.round(
    filteredRooms.reduce((sum, room) => sum + (room.current / room.capacity * 100), 0) / filteredRooms.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Ocupación de Espacios</h1>
          <p className="text-sm text-muted-foreground">Monitoreo en tiempo real de capacidad</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-4 py-2 bg-secondary border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los edificios</option>
            <option value="Edificio A">Edificio A</option>
            <option value="Edificio B">Edificio B</option>
            <option value="Edificio C">Edificio C</option>
            <option value="Edificio D">Edificio D</option>
          </select>
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                viewMode === 'grid' ? 'bg-card shadow-sm' : ''
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                viewMode === 'heatmap' ? 'bg-card shadow-sm' : ''
              }`}
            >
              Heatmap
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Maximize2 className="w-5 h-5 text-primary" />
            </div>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <h3 className="text-2xl text-foreground mb-1">{avgOccupancy}%</h3>
          <p className="text-sm text-muted-foreground">Ocupación Promedio</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-success/10">
              <Users className="w-5 h-5 text-success" />
            </div>
          </div>
          <h3 className="text-2xl text-foreground mb-1">2,847</h3>
          <p className="text-sm text-muted-foreground">Personas en Campus</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
          <h3 className="text-2xl text-foreground mb-1">14:30</h3>
          <p className="text-sm text-muted-foreground">Hora Pico Hoy</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl text-foreground mb-1">{filteredRooms.length}</h3>
          <p className="text-sm text-muted-foreground">Espacios Totales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg text-foreground mb-4">Ocupación por Hora (Hoy)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyOccupancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="ocupacion" stroke="#0066ff" strokeWidth={2} dot={{ fill: '#0066ff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg text-foreground mb-4">Ocupación Semanal por Edificio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyOccupancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d29', border: '1px solid #1e293b', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="edificioA" fill="#0066ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="edificioB" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="edificioC" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="edificioD" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room, index) => {
            const occupancyPercentage = Math.round((room.current / room.capacity) * 100);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-foreground mb-1">{room.name}</h4>
                    <p className="text-xs text-muted-foreground">{room.building}</p>
                  </div>
                  {getStatusBadge(room.status)}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Ocupación</span>
                      <span className="text-foreground">{room.current}/{room.capacity}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${occupancyPercentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className={`h-full rounded-full ${getOccupancyColor(occupancyPercentage)}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{occupancyPercentage}% ocupado</span>
                    {room.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                    {room.trend === 'down' && <TrendingUp className="w-4 h-4 text-destructive rotate-180" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg text-foreground mb-4">Mapa de Calor de Ocupación</h3>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 84 }).map((_, index) => {
              const value = Math.floor(Math.random() * 100);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`aspect-square rounded ${getOccupancyColor(value)} opacity-${Math.floor(value / 25) * 25}`}
                  title={`${value}%`}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span className="text-muted-foreground">Bajo (0-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded" />
              <span className="text-muted-foreground">Medio (40-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded" />
              <span className="text-muted-foreground">Alto (70-90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded" />
              <span className="text-muted-foreground">Completo (90-100%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
