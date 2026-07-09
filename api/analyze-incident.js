const categoryMap = new Map([
  ['tecnologia', 'Tecnología'],
  ['mantenimiento', 'Mantenimiento'],
  ['seguridad', 'Seguridad'],
  ['limpieza', 'Limpieza'],
  ['infraestructura', 'Infraestructura'],
  ['otro', 'Otro'],
])

const priorityMap = new Map([
  ['baja', 'Baja'],
  ['media', 'Media'],
  ['alta', 'Alta'],
  ['critica', 'Crítica'],
])

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function normalizeSuggestion(rawSuggestion) {
  const category = categoryMap.get(normalizeText(rawSuggestion.category)) || 'Otro'
  const priority = priorityMap.get(normalizeText(rawSuggestion.priority)) || 'Media'

  return {
    category,
    priority,
    assignedTo: String(rawSuggestion.assignedTo || 'Mesa de ayuda'),
    recommendedAction: String(rawSuggestion.recommendedAction || 'Registrar evidencia y derivar al área responsable.'),
  }
}

function extractJson(text) {
  const cleanedText = String(text || '').replace(/```json|```/g, '').trim()
  const start = cleanedText.indexOf('{')
  const end = cleanedText.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('Gemini did not return valid JSON')
  }

  return JSON.parse(cleanedText.slice(start, end + 1))
}

function getDescription(req) {
  if (typeof req.body === 'string') {
    return JSON.parse(req.body).description
  }

  return req.body?.description
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  if (!apiKey) {
    return res.status(503).json({ error: 'GEMINI_API_KEY no configurada' })
  }

  try {
    const description = getDescription(req)

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'La descripción es obligatoria' })
    }

    const prompt = `Eres un asistente para gestionar incidencias en un campus universitario. Analiza la descripción y responde SOLO con JSON válido, sin markdown, con esta forma exacta: {"category":"Tecnología|Mantenimiento|Seguridad|Limpieza|Infraestructura|Otro","priority":"Baja|Media|Alta|Crítica","assignedTo":"responsable sugerido","recommendedAction":"acción recomendada breve"}. Reglas: tecnología incluye proyector, computadora, internet, wifi, software, pantalla; mantenimiento incluye puerta, silla, mesa, aire acondicionado, luz; seguridad incluye emergencia, riesgo, robo, salida bloqueada, accidente; limpieza incluye basura, sucio, limpieza, baño; infraestructura incluye techo, pared, filtración, inundación. Prioridad crítica para emergencia, accidente, fuego, corto circuito, salida bloqueada o riesgo; alta para no funciona, clase empieza, urgente o falla total; media para problema, averiado o revisar; baja para consulta, observación o mejora. Descripción: ${description}`

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text()
      throw new Error(`Gemini API responded ${geminiResponse.status}: ${errorBody}`)
    }

    const geminiData = await geminiResponse.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('Gemini did not return analyzable content')
    }

    return res.status(200).json(normalizeSuggestion(extractJson(text)))
  } catch (error) {
    console.error('[Vercel Gemini incident analyzer]', error)
    return res.status(502).json({ error: 'No se pudo analizar con Gemini' })
  }
}