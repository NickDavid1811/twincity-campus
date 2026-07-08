export type IncidentCategory =
  | 'Tecnología'
  | 'Mantenimiento'
  | 'Seguridad'
  | 'Limpieza'
  | 'Infraestructura'
  | 'Otro';

export type IncidentPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type IncidentStatus = 'Abierta' | 'En proceso' | 'Resuelta';

export interface Incident {
  id: string;
  title: string;
  description: string;
  building: string;
  room: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  assignedTo: string;
  recommendedAction: string;
  createdAt: string;
}

export type IncidentSuggestion = Pick<
  Incident,
  'category' | 'priority' | 'assignedTo' | 'recommendedAction'
>;

export type IncidentLocationDraft = {
  building: string;
  room?: string;
} | null;
