
// Formulaire de contact : pour l'instant, il n'enregistre rien.
// (Lundi, on le reliera à une base de données Supabase.)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault()
  alert("Ce formulaire n'enregistre rien pour l'instant.")
})

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

chatForm.addEventListener('submit', event => {
  event.preventDefault()
  const question = questionInput.value.trim()
  if (!question) return
  addMessage('Vous', question)
  chatForm.reset()
  addMessage('Hopper', 'Merci, on vous répond bientôt !')
})
