# 🧩 Mon Projet – Vue 3 + TypeScript + Vite

## 🎯 Objectif

Créer une application front-end moderne construite avec **Vue 3**, **TypeScript**, et **Vite**, intégrant un **design system** et un **backend Supabase** pour la gestion des données.

---

## ⚙️ Fonctionnalités prévues

- Interface réactive et modulaire via Vue 3 + Composition API
- Composants UI centralisés dans un **design system** réutilisable
- Authentification, base de données et stockage gérés via **Supabase**
- Scripts d'automatisation dans le dossier `script/`
- Intégration continue simplifiée avec Vite

---

## 🏗️ Architecture du projet

```
.mon-projet/
│
├── designSystem/      # Composants UI partagés
├── src/               # Logique principale de l'application
├── supabase/          # Configuration et migrations Supabase
├── supabase-cli/      # Outils de ligne de commande Supabase
├── vite/              # Configuration du bundler
└── public/            # Fichiers statiques
```

---

## 🗄️ Configuration Supabase

1. Crée un projet sur [Supabase.io](https://supabase.io).
2. Copie les clés du projet (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) dans ton fichier `.env` :
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Pour initialiser la base de données :
   ```bash
   supabase init
   supabase db push
   ```
4. Les tables principales peuvent inclure :
   - **users** : gestion des comptes
   - **profiles** : informations utilisateur
   - **posts** ou **content** : données métier de ton app

---

## 🔗 Interaction entre les modules

| Dossier        | Rôle                                     | Interaction                                     |
| -------------- | ---------------------------------------- | ----------------------------------------------- |
| `designSystem` | Bibliothèque de composants réutilisables | Alimente l'UI principale                        |
| `supabase`     | Backend et données                       | Fournit/authentifie les données côté front      |
| `src`          | Application Vue principale               | Consomme les composants et les données Supabase |

---

## 🚀 Lancement du projet

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

---

## 📘 À venir

- Gestion d'état avec Pinia
- Tests unitaires avec Vitest
- Déploiement automatisé (Netlify / Vercel)
- Documentation technique approfondie

---

## 📄 Licence

_(À définir selon ton choix – MIT, Apache 2.0, etc.)_
