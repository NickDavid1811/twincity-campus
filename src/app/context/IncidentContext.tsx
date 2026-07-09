import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Incident, IncidentLocationDraft, IncidentStatus } from '../types/incident';

const STORAGE_KEY = 'twincity-incidents';

const initialIncidents: Incident[] = [
  {
    id: 'INC-1001',
    title: 'Proyector no enciende en Aula 205',
    description: 'El proyector no enciende y la clase empieza pronto.',
    building: 'Edificio B',
    room: 'Aula 205',
    category: 'Tecnología',
    priority: 'Alta',
    status: 'Abierta',
    assignedTo: 'Soporte TI',
    recommendedAction: 'Revisar conectividad, equipos audiovisuales y registrar diagnóstico técnico.',
    createdAt: '2026-07-08T09:30:00.000Z',
  },
  {
    id: 'INC-1002',
    title: 'Silla rota en Laboratorio 3',
    description: 'Hay una silla averiada en el laboratorio y debe revisarse.',
    building: 'Edificio B',
    room: 'Laboratorio 3',
    category: 'Mantenimiento',
    priority: 'Media',
    status: 'En proceso',
    assignedTo: 'Mantenimiento',
    recommendedAction: 'Programar inspección física del ambiente y coordinar reparación preventiva.',
    createdAt: '2026-07-08T10:15:00.000Z',
    createdBy: 'usr-common',
  },
  {
    id: 'INC-1003',
    title: 'Salida de emergencia bloqueada',
    description: 'La salida bloqueada representa un riesgo para los estudiantes.',
    building: 'Edificio A',
    room: 'Ala Oeste',
    category: 'Seguridad',
    priority: 'Crítica',
    status: 'Abierta',
    assignedTo: 'Seguridad',
    recommendedAction: 'Atender de inmediato, asegurar el área y escalar al responsable de seguridad del campus.',
    createdAt: '2026-07-08T11:05:00.000Z',
  },
];

interface IncidentContextValue {
  incidents: Incident[];
  draftLocation: IncidentLocationDraft;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'status'> & { status?: IncidentStatus }) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  deleteIncident: (id: string) => void;
  setDraftLocation: (location: IncidentLocationDraft) => void;
  clearDraftLocation: () => void;
}

const IncidentContext = createContext<IncidentContextValue | undefined>(undefined);

const loadIncidents = () => {
  if (typeof window === 'undefined') {
    return initialIncidents;
  }

  const storedIncidents = window.localStorage.getItem(STORAGE_KEY);
  if (!storedIncidents) {
    return initialIncidents;
  }

  try {
    const parsedIncidents = JSON.parse(storedIncidents) as Incident[];
    return parsedIncidents.length > 0 ? parsedIncidents : initialIncidents;
  } catch {
    return initialIncidents;
  }
};

export function IncidentProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(loadIncidents);
  const [draftLocation, setDraftLocation] = useState<IncidentLocationDraft>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  }, [incidents]);

  const value = useMemo<IncidentContextValue>(() => ({
    incidents,
    draftLocation,
    addIncident: (incident) => {
      setIncidents((currentIncidents) => [
        {
          ...incident,
          id: `INC-${Date.now()}`,
          status: incident.status ?? 'Abierta',
          createdAt: new Date().toISOString(),
        },
        ...currentIncidents,
      ]);
    },
    updateIncidentStatus: (id, status) => {
      setIncidents((currentIncidents) =>
        currentIncidents.map((incident) => (incident.id === id ? { ...incident, status } : incident)),
      );
    },
    deleteIncident: (id) => {
      setIncidents((currentIncidents) => currentIncidents.filter((incident) => incident.id !== id));
    },
    setDraftLocation,
    clearDraftLocation: () => setDraftLocation(null),
  }), [draftLocation, incidents]);

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents debe usarse dentro de IncidentProvider');
  }

  return context;
}
