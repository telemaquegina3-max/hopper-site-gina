# Hopper · Atelier vélo

Projet de cours The Bridge. Le site reprend le dépôt de départ de Taha.

## Lancer sur son ordinateur

Avec Node.js LTS, exécuter `npm ci` puis `npm run dev` dans ce dossier. Ouvrir l’adresse affichée par Vite, généralement `http://localhost:5173`. Sans configuration externe, la FAQ est interactive et le chatbot affiche une réponse de démonstration.

## Relier Make et Supabase

- Dans Make, utiliser un scénario Custom webhook → module IA → Webhook response. Mapper le champ JSON `question` dans le module IA et renvoyer la réponse sous forme de texte ou de JSON `{"answer":"…"}`. Activer le scénario.
- Dans un projet Supabase consacré à Hopper, exécuter `supabase.sql` dans l’éditeur SQL. La table `messages` autorise l’insertion publique avec la clé publiable. La lecture se fait dans le tableau de bord de Supabase.
- En local, copier `.env.example` vers `.env` et renseigner les trois variables. Redémarrer Vite. Le webhook et la clé sont lus par le serveur local.
- Envoyer un message de test avec une adresse fictive et vérifier la ligne dans Supabase. Demander au chatbot si l’atelier est ouvert le dimanche et vérifier la réponse de Make.

## Déployer sur Cloudflare Workers

Relier le dépôt du groupe à un Worker nommé `hopper-site`. Utiliser `npm run build` comme commande de build et `npx wrangler deploy` comme commande de déploiement. Le fichier `wrangler.jsonc` décrit le Worker et le dossier `dist`.

Ajouter `MAKE_WEBHOOK_URL`, `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` aux variables du Worker. Conserver le webhook en secret. Vérifier le site et les deux intégrations sur l’adresse publiée. Pour l’atelier 10, vérifier le titre mis à jour après le déploiement du commit correspondant.

## Captures du devoir

1. Hopper ouvert en local.
2. Chatbot avec une réponse provenant de Make et historique des commits GitHub.
3. Table Supabase `messages` avec des données de test.
4. Adresse publique du Worker et historique des commits GitHub.
