import type { Plugin } from 'vite'
import { handleApiRequest } from './routes'
import { runMigrations, seedIfEmpty } from './migrations'

/**
 * Vite plugin that mounts /api/* routes directly into the dev server.
 * In production, these would be deployed as serverless functions or
 * a separate Express/Hono server.
 */
export function apiServerPlugin(): Plugin {
  let initialized = false

  return {
    name: 'eduintel-api-server',
    apply: 'serve', // Only active during `vite dev`

    configureServer(server) {
      // Use a middleware that intercepts /api/* requests
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''

        // Only handle /api/* routes
        if (!url.startsWith('/api')) {
          return next()
        }

        // Run migrations on first API request (lazy init)
        if (!initialized) {
          try {
            console.log('[API] Initializing database...')
            await runMigrations()
            await seedIfEmpty()
            initialized = true
            console.log('[API] ✅ Database ready')
          } catch (err) {
            console.error('[API] ❌ Database initialization failed:', err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Database initialization failed', details: String(err) }))
            return
          }
        }

        // Handle CORS for the dev server
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.writeHead(204)
          res.end()
          return
        }

        // Route the request
        const handled = await handleApiRequest(req, res)
        if (!handled) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Not found' }))
        }
      })
    },
  }
}

