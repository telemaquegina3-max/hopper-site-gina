const toggle = document.querySelector('#chat-toggle')
const panel = document.querySelector('#chat-panel')
const chatForm = document.querySelector('#chat-form')
const questionInput = document.querySelector('#chat-question')
const history = document.querySelector('#chat-history')

toggle.addEventListener('click', () => {
  panel.hidden = !panel.hidden
  toggle.setAttribute('aria-expanded', String(!panel.hidden))
  if (!panel.hidden) questionInput.focus()
})

function addMessage(author, message) {
  const line = document.createElement('p')
  const name = document.createElement('strong')
  name.textContent = author
  line.append(name, ' ' + message)
  history.append(line)
  history.scrollTop = history.scrollHeight
}

async function send(path, data) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Le service est momentanément indisponible.')
  return result
}

chatForm.addEventListener('submit', async event => {
  event.preventDefault()
  const question = questionInput.value.trim()
  const button = chatForm.querySelector('button')
  if (!question || button.disabled) return
  button.disabled = true
  addMessage('Vous', question)
  try {
    const result = await send('/api/chat', { question })
    addMessage(result.demo ? 'Hopper (démo)' : 'Hopper', result.answer)
    chatForm.reset()
  } catch (error) {
    addMessage('Hopper', error instanceof SyntaxError ? 'La connexion au chatbot est indisponible.' : error.message)
  } finally {
    button.disabled = false
  }
})

const contactForm = document.querySelector('#contact-form')
const status = document.querySelector('#contact-status')
contactForm.addEventListener('submit', async event => {
  event.preventDefault()
  const button = contactForm.querySelector('button')
  if (button.disabled) return
  button.disabled = true
  status.textContent = 'Envoi en cours…'
  try {
    const result = await send('/api/contact', Object.fromEntries(new FormData(contactForm)))
    if (!result.sent) throw new Error('Le message n’a pas été enregistré.')
    status.textContent = 'Votre message a bien été envoyé.'
    contactForm.reset()
  } catch (error) {
    status.textContent = error instanceof SyntaxError ? 'La connexion au formulaire est indisponible.' : error.message
  } finally {
    button.disabled = false
  }
})
