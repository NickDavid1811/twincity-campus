import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const allowedCategories = ['Tecnología', 'Mantenimiento', 'Seguridad', 'Limpieza', 'Infraestructura', 'Otro']
const allowedPriorities = ['Baja', 'Media', 'Alta', 'Crítica']

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

function extractJson(text) {
  const cleanedText = text.replace(/```json|```/g, '').trim()
  const start = cleanedText.indexOf('{')
  const end = cleanedText.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('Gemini no devolvió un JSON válido')
  }

  return JSON.parse(cleanedText.slice(start, end + 1))
}

function normalizeSuggestion(rawSuggestion) {
  const category = allowedCategories.includes(rawSuggestion.category) ? rawSuggestion.category : 'Otro'
  const priority = allowedPriorities.includes(rawSuggestion.priority) ? rawSuggestion.priority : 'Media'

  return {
    category,
    priority,
    assignedTo: String(rawSuggestion.assignedTo || 'Mesa de ayuda'),
    recommendedAction: String(rawSuggestion.recommendedAction || 'Registrar evidencia y derivar al área responsable.'),
  }
}

function geminiIncidentAnalyzer(env) {
  return {
    name: 'gemini-incident-analyzer',
    configureServer(server) {
      server.middlewares.use('/api/analyze-incident', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Método no permitido' }))
          return
        }

        const apiKey = env.GEMINI_API_KEY
        const model = env.GEMINI_MODEL || 'gemini-2.0-flash'

        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }))
          return
        }

        try {
          const { description } = await readJsonBody(req)

          if (!description || typeof description !== 'string') {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'La descripción es obligatoria' }))
            return
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
            throw new Error(`Gemini API respondió ${geminiResponse.status}: ${errorBody}`)
          }

          const geminiData = await geminiResponse.json()
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

          if (!text) {
            throw new Error('Gemini no devolvió contenido analizable')
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(normalizeSuggestion(extractJson(text))))
        } catch (error) {
          console.error('[Gemini incident analyzer]', error)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'No se pudo analizar con Gemini' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      figmaAssetResolver(),
      geminiIncidentAnalyzer(env),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used - do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
