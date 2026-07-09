import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  XCircle,
  AlertTriangle,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '../context/ReservationContext';
import { useIncidents } from '../context/IncidentContext';
import type { Reservation, ReservationStatus } from '../types/reservation';

import { buildingRooms } from '../constants/buildings';

interface ReservationsProps {
  onReportIncident: () => void;
}

const emptyForm = {
  title: '',
  building: 'Edificio A',
  room: 'Sala de Reuniones 1',
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '10:00',
};

export function Reservations({ onReportIncident }: ReservationsProps) {
  const { reservations, addReservation, updateReservationStatus, deleteReservation } = useReservations();
  const { setDraftLocation } = useIncidents();
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'Activa': return 'text-primary bg-primary/10 border-primary/20';
      case 'Completada': return 'text-success bg-success/10 border-success/20';
      case 'Cancelada': return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const handleBuildingChange = (building: string) => {
    setForm({
      ...form,
      building,
      room: buildingRooms[building][0],
    });
  };

  const handleSave = () => {
    if (!form.title || !form.building || !form.room || !form.date || !form.startTime || !form.endTime) {
      toast.error('Completa todos los campos');
      return;
    }
    
    addReservation({
      ...form,
      userName: 'Usuario Actual', // En un caso real vendría del auth
    });
    
    setShowNewModal(false);
    setForm(emptyForm);
    toast.success('Reserva creada exitosamente');
  };

  const handleReportIncident = (res: Reservation) => {
    setDraftLocation({ building: res.building, room: res.room });
    setSelectedRes(null);
    onReportIncident();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground mb-1">Reservas de Espacios</h1>
          <p className="text-sm text-muted-foreground">Gestiona las reservas de aulas, laboratorios y áreas comunes</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((res) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedRes(res)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-medium text-foreground">{res.title}</h3>
              <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(res.status)}`}>
                {res.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{res.building} - {res.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{res.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{res.startTime} - {res.endTime}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
              <span className="text-foreground">{res.userName}</span>
              <span className="text-muted-foreground text-xs">{res.id}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Nueva Reserva */}
      {showNewModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowNewModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl text-foreground">Nueva Reserva</h2>
                <p className="text-sm text-muted-foreground">Selecciona el espacio y horario deseado.</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Título / Motivo</span>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ej. Sesión de estudio"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-muted-foreground">Edificio</span>
                  <select
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.building}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                  >
                    {Object.keys(buildingRooms).map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-muted-foreground">Espacio / Aula</span>
                  <select
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                  >
                    {buildingRooms[form.building].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-muted-foreground">Fecha</span>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm text-muted-foreground">Hora de inicio</span>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-muted-foreground">Hora de fin</span>
                  <input
                    type="time"
                    className="w-full px-3 py-2 bg-input-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Confirmar Reserva
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Detalles de Reserva */}
      {selectedRes && !showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRes(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-card border border-border rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl text-foreground mb-1">{selectedRes.title}</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(selectedRes.status)}`}>
                    {selectedRes.status}
                  </span>
                  <span className="text-sm text-muted-foreground">{selectedRes.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  title="Eliminar reserva"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedRes(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{selectedRes.room}</p>
                  <p className="text-xs text-muted-foreground">{selectedRes.building}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">{selectedRes.date}</p>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">{selectedRes.startTime} - {selectedRes.endTime}</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Reservado por</p>
              <p className="text-sm font-medium text-foreground">{selectedRes.userName}</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateReservationStatus(selectedRes.id, 'Cancelada');
                    setSelectedRes({ ...selectedRes, status: 'Cancelada' });
                    toast.success('Reserva cancelada');
                  }}
                  disabled={selectedRes.status === 'Cancelada'}
                  className="flex-1 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Cancelar Reserva
                </button>
                <button
                  onClick={() => {
                    updateReservationStatus(selectedRes.id, 'Completada');
                    setSelectedRes({ ...selectedRes, status: 'Completada' });
                    toast.success('Reserva completada');
                  }}
                  disabled={selectedRes.status === 'Completada' || selectedRes.status === 'Cancelada'}
                  className="flex-1 px-4 py-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Completar
                </button>
              </div>
              
              <button
                onClick={() => handleReportIncident(selectedRes)}
                className="w-full px-4 py-2 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Reportar Incidencia en este espacio
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirmar Eliminación */}
      {showDeleteConfirm && selectedRes && (
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Eliminar reserva</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  ¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.
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
                  deleteReservation(selectedRes.id);
                  setSelectedRes(null);
                  setShowDeleteConfirm(false);
                  toast.success('Reserva eliminada exitosamente');
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
