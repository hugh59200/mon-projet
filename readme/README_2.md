# 🛡️ Project Atlas - Master Documentation & Strategy

**Nom Commercial :** `fast-peptides` (Domaine via Njalla)
**Entité Juridique :** `Atlas Lab Solutions LLC` (New Mexico, USA)
**Logistique :** France (Stock déporté / Drop-shipping local)
**Statut :** 🟡 En cours de finalisation (Attente EIN)

---

## 🚨 MANIFESTE OPSEC (SÉCURITÉ & ANONYMAT)

Ce projet repose sur une stratégie de "cloisonnement total" pour protéger l'identité du gérant et la pérennité de l'activité "High Risk" (Research Chemicals).

### 1. La Barrière Juridique (Le "Coquillage")
* **Structure :** LLC au **Nouveau-Mexique (USA)**.
    * *Raison :* Anonymat du registre public (Pas de noms de membres listés).
* **Adresse Officielle :** Toujours utiliser l'adresse de l'agent (**Northwest Registered Agent**) à Albuquerque.
* **Règle d'Or :** L'adresse personnelle du gérant en France ne doit **JAMAIS** apparaître sur une facture, un colis, un whois ou le site web.

### 2. La Barrière Logistique (Le "Fantôme")
* **Flux Physique :** Stock en France (pour livrer en 48h sans douane).
* **Expédition :** Exclusivement via **Mondial Relay / Shop2Shop**.
    * *Mécanisme :* Le système "Point Relais vers Point Relais" masque l'adresse d'expédition réelle.
* **Étiquetage :** Expéditeur générique ("Service Logistique" ou "Atlas Lab"). Adresse de retour = Le Point Relais de dépôt.

### 3. La Barrière Financière (Le "Firewall")
* **Banque :** Compte pro Fintech (Wise/Mercury) au nom de la LLC US.
* **Encaissement :**
    * **Interdit :** Stripe et PayPal (Bannissement immédiat pour Peptides).
    * **Stratégie Actuelle :** Paiement **Asynchrone** (Commande validée -> Instructions virement/crypto affichées -> Paiement manuel).

### 4. La Barrière Numérique (Le "Masque")
* **Infrastructure :** Cloudflare (Masquage IP serveur) + Njalla (Anonymat Domaine).
* **Administration :**
    * 🔴 **VPN OBLIGATOIRE** pour toute connexion aux dashboards (Supabase, Cloudflare, Banque, Email).
    * L'IP résidentielle ne doit jamais être loguée.

---

## 🏗️ Architecture Technique (JAMstack)

### Frontend (Vue 3 + TypeScript)
* **Framework :** Vue 3 (Composition API).
* **Build :** Vite.
* **Hébergement :** Cloudflare Pages.
* **State Management (Pinia) - Règle de Sécurité :**
    * *Panier/Préférences :* `localStorage` (Confort).
    * *Données Sensibles (Nom, Adresse) :* `sessionStorage` (Autodestruction à la fermeture de l'onglet).

### Backend (Supabase)
* **Auth :** Supabase Auth.
* **Database :** PostgreSQL avec RLS (Row Level Security) strictes.
* **Edge Functions :** Pour les opérations sensibles (Envoi email, appel IA).
* **Backup :** Export SQL quotidien externe à prévoir (Souveraineté des données).

### Communication (Resend)
* **Stratégie "Agnostique" :**
    * Nom d'expéditeur : "FP Store" (Pas de "Peptides").
    * Contenu : Neutre (Pas de liste de produits, juste un lien vers le compte client).
    * Logo : Nom de fichier et attribut ALT neutres.

### Intelligence Artificielle (Claude 3 Haiku)
* **Usage :** "Copilote" pour le support client dans l'Admin.
* **Sécurité :** L'IA ne parle **jamais** au client en direct. Elle génère des brouillons pour l'admin.
* **System Prompt :** Interdiction formelle de donner des conseils médicaux/dosages.

---

## 📦 Parcours Client & Compliance

### 1. Le "Bouclier Légal" (Frontend)
* **Age Gate :** Modale +18 ans à l'entrée (Cookie/LocalStorage).
* **Disclaimer Checkout :** Checkbox obligatoire avant paiement : *"Je certifie être un chercheur qualifié... Usage laboratoire uniquement..."*.
* **Geo-blocking :** Formulaire d'adresse restreint (Pas d'Allemagne, Suisse, USA).

### 2. Le Checkout Asynchrone
1.  **Panier :** Validation classique.
2.  **Paiement :** Choix "Virement" ou "Crypto".
3.  **Validation :** Création commande (Statut: `Pending Payment`).
4.  **Confirmation :** Affichage dynamique des instructions (IBAN ou Wallet Crypto) sur la page de succès + Email de confirmation avec rappel des instructions.

---

## 📝 Roadmap & Statut Actuel

| Brique | Statut | Notes |
| :--- | :---: | :--- |
| **Structure LLC** | 🟡 En cours | Créée, attente EIN (3-4 semaines) |
| **Site Web (Vue 3)** | 🟢 Fait | Déployé, Design "Labo" OK |
| **Base de Données** | 🟢 Fait | Supabase Configuré |
| **Emails (Resend)** | 🟢 Fait | Templates neutres & i18n OK |
| **Mondial Relay** | 🟢 Fait | Widget intégré |
| **Paiement Manuel** | 🟢 Fait | Flux asynchrone codé |
| **IA Support** | 🟢 Fait | Intégration Claude API OK |
| **Textes Légaux** | 🔴 À FAIRE | CGV/Privacy à rédiger (Spécial Peptides) |
| **Compte Banque** | 🔴 À FAIRE | Bloqué par l'attente EIN |

---

## ⚠️ Rappels Quotidiens pour l'Admin

1.  **Active ton VPN** avant de travailler.
2.  **Ne donne jamais** de conseils de dosage par chat/email (Réponse type : "Produit pour recherche uniquement").
3.  **Vérifie les paiements** manuellement (Rapprochement bancaire/crypto) avant d'expédier.
4.  **Ne livre jamais** en Allemagne ou en Suisse (Risque saisie douane).