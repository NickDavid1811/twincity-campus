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

export function analyzeIncidentLocally(description: string): IncidentSuggestion {
  const normalizedDescription = description.toLowerCase().trim();
  const matchedCategory = categoryRules.find((rule) => includesAny(normalizedDescription, rule.keywords));
  const matchedPriority = priorityRules.find((rule) => includesAny(normalizedDescription, rule.keywords));

  // Fallback local basado en reglas. Mantiene la demo funcionando si Gemini no está
  // configurado, no responde o se alcanza el límite gratuito de Google AI Studio.
  return {
    category: matchedCategory?.category ?? 'Otro',
    priority: matchedPriority?.priority ?? 'Media',
    assignedTo: matchedCategory?.assignedTo ?? 'Mesa de ayuda',
    recommendedAction:
      matchedCategory?.recommendedAction ??
      'Registrar evidencia, revisar el caso y derivar al área responsable según disponibilidad.',
  };
}

export async function analyzeIncident(description: string): Promise<{
  suggestion: IncidentSuggestion;
  source: 'gemini' | 'local';
}> {
  try {
    const response = await fetch('/api/analyze-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error('Gemini no disponible');
    }

    return {
      suggestion: await response.json() as IncidentSuggestion,
      source: 'gemini',
    };
  } catch {
    return {
      suggestion: analyzeIncidentLocally(description),
      source: 'local',
    };
  }
}
