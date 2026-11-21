const json = (payload, status = 200) => Response.json(payload, { status })

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request)
    if (pathname !== '/api/chat' && pathname !== '/api/contact') return json({ error: 'Route inconnue.' }, 404)
    if (request.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, 405)

    try {
      const data = await request.json().catch(() => null)
      if (!data || typeof data !== 'object') return json({ error: 'Requête invalide.' }, 400)
      return pathname === '/api/chat' ? await chat(data, env) : await contact(data, env)
    } catch {
      return json({ error: 'Le service est momentanément indisponible.' }, 502)
    }
  }
}

function field(data, key, max) {
  const value = typeof data[key] === 'string' ? data[key].trim() : ''
  return value.length <= max ? value : ''
}

async function chat(data, env) {
  const question = field(data, 'question', 500)
  if (!question) return json({ error: 'Saisissez une question valide.' }, 400)
  if (!env.MAKE_WEBHOOK_URL) return json({ answer: 'Merci, on vous répond bientôt !', demo: true })
  const response = await fetch(env.MAKE_WEBHOOK_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }), signal: AbortSignal.timeout(25000)
  })
  if (!response.ok) return json({ error: 'Le chatbot ne répond pas pour le moment.' }, 502)
  const body = (await response.text()).trim()
  let answer = body
  if (response.headers.get('content-type')?.includes('application/json')) {
    const data = JSON.parse(body)
    answer = typeof data === 'string' ? data : data?.answer ?? data?.response ?? data?.reponse
  }
  if (typeof answer !== 'string' || !answer.trim() || answer.trim().toLowerCase() === 'accepted') {
    return json({ error: 'Make n’a pas renvoyé de réponse du chatbot.' }, 502)
  }
  return json({ answer: answer.trim() })
}

async function contact(data, env) {
  const nom = field(data, 'nom', 120)
  const email = field(data, 'email', 254)
  const message = field(data, 'message', 2000)
  if (!nom || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Vérifiez le nom, l’adresse e-mail et le message.' }, 400)
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return json({ error: 'Le formulaire de contact attend sa connexion à Supabase.' }, 503)
  }
  const response = await fetch(new URL('/rest/v1/messages', env.SUPABASE_URL), {
    method: 'POST',
    headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ nom, email, message }), signal: AbortSignal.timeout(10000)
  })
  return response.ok ? json({ sent: true }) : json({ error: 'Le message n’a pas pu être enregistré.' }, 502)
}
