import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useIncidents } from '../context/IncidentContext';
import { useReservations } from '../context/ReservationContext';
import { analyzeIncident } from '../services/aiIncidentService';
import { buildingRooms } from '../constants/buildings';
import type { Incident, IncidentCategory, IncidentPriority, IncidentStatus } from '../types/incident';

const categories: IncidentCategory[] = ['Tecnología', 'Mantenimiento', 'Seguridad', 'Limpieza', 'Infraestructura', 'Otro'];
const priorities: IncidentPriority[] = ['Baja', 'Media', 'Alta', 'Crítica'];
const statuses: IncidentStatus[] = ['Abierta', 'En proceso', 'Resuelta'];

const emptyForm = {
  title: '',
  building: '',
  room: '',
  description: '',
  category: 'Otro' as IncidentCategory,
  priority: 'Media' as IncidentPriority,
  assignedTo: '',
  recommendedAction: '',
};

const formatDate = (value: string) => new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value));

export function Incidents() {
  const { incidents, addIncident, updateIncidentStatus, deleteIncident, draftLocation, clearDraftLocation } = useIncidents();
  const { reservations } = useReservations();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (draftLocation) {
      setForm((currentForm) => ({
        ...currentForm,
        building: draftLocation.building,
        room: draftLocation.room ?? currentForm.room,
      }));
      setShowNewIncidentModal(true);
      clearDraftLocation();
    }
  }, [clearDraftLocation, draftLocation]);

  const metrics = useMemo(() => ({
    total: incidents.length,
    open: incidents.filter((incident) => incident.status === 'Abierta').length,
    inProgress: incidents.filter((incident) => incident.status === 'En proceso').length,
    resolved: incidents.filter((incident) => incident.status === 'Resuelta').length,
  }), [incidents]);

  const getPriorityColor = (priority: IncidentPriority) => {
    switch (priority) {
      case 'Crítica': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'Alta': return 'text-warning bg-warning/10 border-warning/20';
      case 'Media': return 'text-primary bg-primary/10 border-primary/20';
      case 'Baja': return 'text-success bg-success/10 border-success/20';
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'Abierta': return 'text-warning bg-warning/10';
      case 'En proceso': return 'text-primary bg-primary/10';
      case 'Resuelta': return 'text-success bg-success/10';
    }
  };

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'Abierta': return Clock;
      case 'En proceso': return AlertTriangle;
      case 'Resuelta': return CheckCircle2;
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setAnalysisMessage('');
    setFormError('');
  };

  const handleOpenNewIncident = () => {
    resetForm();
    setShowNewIncidentModal(true);
  };

  const handleAnalyze = async () => {
    if (!form.description.trim()) {
      setAnalysisMessage('');
      setFormError('Escribe una descripción para poder analizar la incidencia.');
      return;
    }

    setIsAnalyzing(true);
    setFormError('');
    setAnalysisMessage('Analizando con IA...');

    const { suggestion, source } = await analyzeIncident(form.description);
    setForm((currentForm) => ({
      ...currentForm,
      ...suggestion,
    }));
    setIsAnalyzing(false);
    setAnalysisMessage(
      source === 'gemini'
        ? 'Análisis generado con Google AI Studio.'
        : 'Análisis generado con fallback local. Revisa GEMINI_API_KEY si querías usar Gemini.',
    );
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.building.trim() || !form.room.trim() || !form.description.trim()) {
      setFormError('Completa título, edificio, ambiente y descripción antes de guardar.');
      return;
    }

    addIncident({
      ...form,
      assignedTo: form.assignedTo || 'Mesa de ayuda',
      recommendedAction: form.recommendedAction || 'Registrar evidencia y derivar al área responsable.',
    });
    resetForm();
    setShowNewIncidentModal(false);
    setViewMode('list');
  };

  const kanbanColumns = [
    { id: 'open', title: 'Abiertas', status: 'Abierta' as IncidentStatus },
    { id: 'in-progress', title: 'En Proceso', status: 'En proceso' as IncidentStatus },
    { id: 'resolved', title: 'Resueltas', status: 'Resuelta' as IncidentStatus },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Gestión de Incidencias</h1>
          <p className="text-sm text-muted-foreground">Registro inteligente de tickets con Google AI Studio y fallback local</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded text-sm transition-colors ${viewMode === 'kanban' ? 'bg-card shadow-sm' : ''}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded text-sm transition-colors ${viewMode === 'list' ? 'bg-card shadow-sm' : ''}`}
            >
              Lista
            </button>
          </div>
          <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4 inline mr-2" />
            Filtros
          </button>
          <button
            onClick={handleOpenNewIncident}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Nueva Incidencia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl text-foreground mt-1">{metrics.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Abiertas</p>
              <p className="text-2xl text-foreground mt-1">{metrics.open}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Proceso</p>
              <p className="text-2xl text-foreground mt-1">{metrics.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resueltas</p>
              <p className="text-2xl text-foreground mt-1">{metrics.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">{column.title}</h3>
                <span className="px-2.5 py-1 bg-secondary rounded-full text-sm">
                  {incidents.filter((incident) => incident.status === column.status).length}
                </span>
              </div>

              <div className="space-y-3">
                {incidents
                  .filter((incident) => incident.status === column.status)
                  .map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-secondary border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h4 className="text-sm text-foreground flex-1">{incident.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityColor(incident.priority)}`}>
                          {incident.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{incident.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{incident.building}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{incident.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Prioridad</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Responsable</th>
                <th className="px-6 py-3 text-left text-xs text-muted-foreground uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => setSelectedIncident(incident)}>
                  <td className="px-6 py-4 text-sm">{incident.id}</td>
                  <td className="px-6 py-4 text-sm">{incident.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(incident.priority)}`}>{incident.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(incident.status)}`}>{incident.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{incident.building} - {incident.room}</td>
                  <td className="px-6 py-4 text-sm">{incident.assignedTo}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(incident.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNewIncidentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewIncidentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl text-foreground">Nueva incidencia</h2>
                <p className="text-sm text-muted-foreground">Describe el problema y usa Gemini para sugerir clasificación.</p>
              </div>
              <button onClick={() => setShowNewIncidentModal(false)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-muted-foreground">Título</span>
                <input className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Proyector no enciende" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Edificio</span>
                <select 
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  value={form.building} 
                  onChange={(event) => {
                    setForm({ ...form, building: event.target.value, room: '' });
                  }}
                >
                  <option value="">Selecciona un edificio</option>
                  {Object.keys(buildingRooms).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Aula / ambiente (Solo espacios ocupados)</span>
                <select 
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                  value={form.room} 
                  onChange={(event) => setForm({ ...form, room: event.target.value })}
                >
                  <option value="">Selecciona un ambiente</option>
                  {form.building && buildingRooms[form.building]
                    .filter(roomName => reservations.some(res => res.building === form.building && res.room === roomName && res.status === 'Activa'))
                    .map((roomName) => (
                      <option key={roomName} value={roomName}>{roomName}</option>
                    ))
                  }
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-muted-foreground">Descripción</span>
                <textarea className="w-full min-h-28 px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe qué ocurre, dónde y qué tan urgente es." />
              </label>
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button onClick={handleAnalyze} disabled={isAnalyzing} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
                </button>
                {analysisMessage && <span className="text-sm text-success">{analysisMessage}</span>}
                {formError && <span className="text-sm text-destructive">{formError}</span>}
              </div>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Categoría</span>
                <select className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as IncidentCategory })}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Prioridad</span>
                <select className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as IncidentPriority })}>
                  {priorities.map((priority) => <option key={priority}>{priority}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Responsable sugerido</span>
                <input className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} placeholder="Soporte TI" />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-muted-foreground">Acción recomendada</span>
                <input className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.recommendedAction} onChange={(event) => setForm({ ...form, recommendedAction: event.target.value })} placeholder="Revisar y derivar" />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowNewIncidentModal(false)} className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Guardar incidencia</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedIncident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIncident(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-2xl w-full p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl text-foreground">{selectedIncident.title}</h2>
                  <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(selectedIncident.priority)}`}>{selectedIncident.priority}</span>
                </div>
                <p className="text-sm text-muted-foreground">Ticket {selectedIncident.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  title="Eliminar incidencia"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedIncident(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Descripción</p>
                <p className="text-foreground">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Estado</p>
                  <select className={`px-3 py-2 rounded text-sm border border-border ${getStatusColor(selectedIncident.status)}`} value={selectedIncident.status} onChange={(event) => {
                    const nextStatus = event.target.value as IncidentStatus;
                    updateIncidentStatus(selectedIncident.id, nextStatus);
                    setSelectedIncident({ ...selectedIncident, status: nextStatus });
                  }}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Categoría</p>
                  <p className="text-foreground">{selectedIncident.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ubicación</p>
                  <p className="text-foreground">{selectedIncident.building} - {selectedIncident.room}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Responsable sugerido</p>
                  <p className="text-foreground">{selectedIncident.assignedTo}</p>
                </div>
              </div>

              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Acción recomendada por IA</p>
                <p className="text-sm text-foreground">{selectedIncident.recommendedAction}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Creada el {formatDate(selectedIncident.createdAt)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showDeleteConfirm && selectedIncident && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-sm w-full p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Eliminar incidencia</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  ¿Estás seguro de que deseas eliminar esta incidencia? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteIncident(selectedIncident.id);
                  setSelectedIncident(null);
                  setShowDeleteConfirm(false);
                  toast.success('Incidencia eliminada exitosamente');
                }}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

