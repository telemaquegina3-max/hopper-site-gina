
// Formulaire de contact : pour l'instant, il n'enregistre rien.
// (Lundi, on le reliera à une base de données Supabase.)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault()
  alert("Ce formulaire n'enregistre rien pour l'instant.")
})
