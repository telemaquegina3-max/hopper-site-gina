import { defineConfig, loadEnv } from 'vite'
import worker from './worker.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['MAKE_', 'SUPABASE_'])
  const routeRequests = server => {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next()
      try {
        const request = new Request(new URL(req.url, 'http://localhost'), {
          method: req.method,
          headers: req.headers,
          ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body: req, duplex: 'half' })
        })
        const response = await worker.fetch(request, env)
        res.writeHead(response.status, Object.fromEntries(response.headers))
        res.end(Buffer.from(await response.arrayBuffer()))
      } catch {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Le serveur local est momentanément indisponible.' }))
      }
    })
  }
  return { plugins: [{ name: 'hopper-api', configureServer: routeRequests, configurePreviewServer: routeRequests }] }
})
