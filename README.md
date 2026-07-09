# TwinCity Campus SaaS Platform

This is a code bundle for TwinCity Campus SaaS Platform. The original project is available at https://www.figma.com/design/gP492bdfIn4acYjQgKiZUn/TwinCity-Campus-SaaS-Platform.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Google AI Studio

Create a local `.env` file with:

```env
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.1-flash-lite
```

The key must not be committed. The React app calls `/api/analyze-incident`; in local development Vite handles that endpoint, and in Vercel the serverless function in `api/analyze-incident.js` handles it.

## Vercel deployment

Use these settings in Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: `GEMINI_API_KEY` and `GEMINI_MODEL`

After deployment, test the flow: login demo, create an incident, write a description, analyze with AI, save, and verify dashboard metrics.