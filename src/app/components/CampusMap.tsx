import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, ZoomIn, ZoomOut, Layers, AlertTriangle, CheckCircle2, Send } from 'lucide-react';
import { useIncidents } from '../context/IncidentContext';
import { useReservations } from '../context/ReservationContext';
import { buildingRooms } from '../constants/buildings';

const buildings = [
  { id: 1, name: 'Edificio A', x: 20, y: 30, width: 25, height: 20, status: 'operational', incidents: 2 },
  { id: 2, name: 'Edificio B', x: 55, y: 25, width: 20, height: 25, status: 'warning', incidents: 5 },
  { id: 3, name: 'Edificio C', x: 25, y: 60, width: 22, height: 18, status: 'operational', incidents: 0 },
  { id: 4, name: 'Edificio D', x: 58, y: 58, width: 18, height: 22, status: 'critical', incidents: 8 },
  { id: 5, name: 'Biblioteca', x: 82, y: 35, width: 15, height: 15, status: 'operational', incidents: 1 },
];

const mapIncidents = [
  { id: 1, building: 2, type: 'Mantenimiento', severity: 'medium', x: 65, y: 38 },
  { id: 2, building: 4, type: 'Emergencia', severity: 'critical', x: 67, y: 70 },
  { id: 3, building: 1, type: 'Limpieza', severity: 'low', x: 33, y: 40 },
];

interface CampusMapProps {
  onReportIncident: () => void;
}

export function CampusMap({ onReportIncident }: CampusMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [showIncidents, setShowIncidents] = useState(true);
  const [zoom, setZoom] = useState(1);
  const { incidents, setDraftLocation } = useIncidents();
  const { reservations } = useReservations();

  const selectedBuildingData = buildings.find((building) => building.id === selectedBuilding);
  const selectedRoom = selectedBuildingData?.name ? buildingRooms[selectedBuildingData.name]?.[0] : undefined;
  const activeIncidents = incidents.filter((incident) => incident.status !== 'Resuelta').length;

  const handleReportIncident = () => {
    setDraftLocation({
      building: selectedBuildingData?.name ?? 'Campus',
      room: selectedRoom,
    });
    onReportIncident();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'maintenance': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Mapa del Campus</h1>
          <p className="text-sm text-muted-foreground">Vista interactiva del gemelo digital</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReportIncident} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
            <Send className="w-4 h-4 inline mr-2" />
            Reportar incidencia
          </button>
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${showIncidents ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Incidencias
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button onClick={() => setZoom(Math.min(zoom + 0.2, 2))} className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))} className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            <svg viewBox="0 0 100 100" className="w-full h-[600px] bg-gradient-to-br from-secondary to-muted rounded-lg" style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }}>
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>

              <rect width="100" height="100" fill="url(#grid)" />

              {buildings.map((building) => (
                <g key={building.id}>
                  <motion.rect
                    x={building.x}
                    y={building.y}
                    width={building.width}
                    height={building.height}
                    fill={getStatusColor(building.status)}
                    fillOpacity={selectedBuilding === building.id ? 0.8 : 0.6}
                    stroke={selectedBuilding === building.id ? '#0066ff' : getStatusColor(building.status)}
                    strokeWidth={selectedBuilding === building.id ? 0.5 : 0.3}
                    rx="1"
                    className="cursor-pointer"
                    onClick={() => setSelectedBuilding(building.id)}
                    whileHover={{ scale: 1.05 }}
                  />
                  <text x={building.x + building.width / 2} y={building.y + building.height / 2} textAnchor="middle" dominantBaseline="middle" className="text-[3px] fill-white pointer-events-none">
                    {building.name}
                  </text>
                  {building.incidents > 0 && <circle cx={building.x + building.width - 2} cy={building.y + 2} r="2" fill="#ef4444" className="animate-pulse" />}
                </g>
              ))}

              {showIncidents && mapIncidents.map((incident) => (
                <motion.g key={incident.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <circle cx={incident.x} cy={incident.y} r="2" fill={getSeverityColor(incident.severity)} className="animate-pulse" />
                  <circle cx={incident.x} cy={incident.y} r="3" fill="none" stroke={getSeverityColor(incident.severity)} strokeWidth="0.3" opacity="0.5" />
                </motion.g>
              ))}

              <g>
                <path d="M 5 5 Q 15 8 25 5" stroke="#10b981" strokeWidth="0.5" fill="none" strokeDasharray="1,1"/>
                <circle cx="5" cy="5" r="1" fill="#10b981"/>
                <circle cx="25" cy="5" r="1" fill="#10b981"/>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded bg-success" /><span className="text-sm text-foreground">Operativo</span></div>
              <p className="text-2xl text-foreground">3 edificios</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded bg-warning" /><span className="text-sm text-foreground">Advertencia</span></div>
              <p className="text-2xl text-foreground">1 edificio</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><div className="w-3 h-3 rounded bg-destructive" /><span className="text-sm text-foreground">Crítico</span></div>
              <p className="text-2xl text-foreground">1 edificio</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-warning" /><span className="text-sm text-foreground">Incidencias</span></div>
              <p className="text-2xl text-foreground">{activeIncidents} activas</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-foreground mb-4">{selectedBuildingData?.name ?? 'Selecciona un edificio'}</h3>

            {selectedBuilding ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Estado General</p>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /><span className="text-sm">Operativo</span></div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ocupación</p>
                  <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: '75%' }} /></div><span className="text-sm">75%</span></div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Espacios</p>
                  <div className="space-y-2">
                    {selectedBuildingData?.name && buildingRooms[selectedBuildingData.name]?.map((roomName, index) => {
                      const isOccupied = reservations.some(res => res.building === selectedBuildingData.name && res.room === roomName && res.status === 'Activa');
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded text-sm">
                          <span>{roomName}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${isOccupied ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                            {isOccupied ? 'Ocupado' : 'Disponible'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleReportIncident} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4 inline mr-2" />
                  Reportar incidencia aquí
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Haz clic en un edificio para ver detalles</p>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-foreground mb-3">Leyenda</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-success" /><span>Operativo</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-warning" /><span>Advertencia</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-destructive" /><span>Crítico</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-destructive animate-pulse" /><span>Incidencia</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
