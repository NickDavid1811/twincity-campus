import type { IncidentCategory, IncidentPriority, IncidentSuggestion } from '../types/incident';

const categoryRules: Array<{
  category: IncidentCategory;
  assignedTo: string;
  recommendedAction: string;
  keywords: string[];
}> = [
  {
    category: 'Tecnología',
    assignedTo: 'Soporte TI',
    recommendedAction: 'Revisar conectividad, equipos audiovisuales y registrar diagnóstico técnico.',
    keywords: ['proyector', 'computadora', 'internet', 'wifi', 'software', 'pantalla', 'hdmi'],
  },
  {
    category: 'Mantenimiento',
    assignedTo: 'Mantenimiento',
    recommendedAction: 'Programar inspección física del ambiente y coordinar reparación preventiva.',
    keywords: ['puerta', 'silla', 'mesa', 'aire acondicionado', 'luz', 'climatización'],
  },
  {
    category: 'Seguridad',
    assignedTo: 'Seguridad',
    recommendedAction: 'Atender de inmediato, asegurar el área y escalar al responsable de seguridad del campus.',
    keywords: ['emergencia', 'riesgo', 'robo', 'salida bloqueada', 'accidente', 'fuego'],
  },
  {
    category: 'Limpieza',
    assignedTo: 'Personal de limpieza',
    recommendedAction: 'Enviar equipo de limpieza y verificar que el espacio quede habilitado para uso académico.',
    keywords: ['basura', 'sucio', 'limpieza', 'baño', 'baños'],
  },
  {
    category: 'Infraestructura',
    assignedTo: 'Infraestructura',
    recommendedAction: 'Evaluar daño estructural o filtración y priorizar intervención técnica.',
    keywords: ['techo', 'pared', 'filtración', 'inundación', 'grieta'],
  },
];

const priorityRules: Array<{ priority: IncidentPriority; keywords: string[] }> = [
  { priority: 'Crítica', keywords: ['emergencia', 'accidente', 'fuego', 'corto circuito', 'salida bloqueada', 'riesgo'] },
  { priority: 'Alta', keywords: ['no funciona', 'clase empieza', 'urgente', 'falla total'] },
  { priority: 'Media', keywords: ['problema', 'averiado', 'revisar'] },
  { priority: 'Baja', keywords: ['consulta', 'observación', 'mejora'] },
];

const includesAny = (text: string, keywords: string[]) => keywords.some((keyword) => text.includes(keyword));

export function analyzeIncident(description: string): IncidentSuggestion {
  const normalizedDescription = description.toLowerCase().trim();
  const matchedCategory = categoryRules.find((rule) => includesAny(normalizedDescription, rule.keywords));
  const matchedPriority = priorityRules.find((rule) => includesAny(normalizedDescription, rule.keywords));

  // Simulación local de IA basada en reglas y palabras clave. En una versión futura,
  // esta función puede conectarse a una API real de IA para clasificar incidencias.
  return {
    category: matchedCategory?.category ?? 'Otro',
    priority: matchedPriority?.priority ?? 'Media',
    assignedTo: matchedCategory?.assignedTo ?? 'Mesa de ayuda',
    recommendedAction:
      matchedCategory?.recommendedAction ??
      'Registrar evidencia, revisar el caso y derivar al área responsable según disponibilidad.',
  };
}
