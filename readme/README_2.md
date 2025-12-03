# 🛡️ Project Atlas - Master Documentation & Strategy

**Nom Commercial :** `fast-peptides` (Domaine via Njalla)
**Entité Juridique :** `Atlas Lab Solutions LLC` (New Mexico, USA)
**Logistique :** France (Stock déporté / Drop-shipping local)
**Statut :** 🟢 **PRÊT POUR LANCEMENT** (Phase 1 : Crypto Only)

---

## 🚨 MANIFESTE OPSEC (SÉCURITÉ & ANONYMAT)

Ce projet repose sur une stratégie de "cloisonnement total" pour protéger l'identité du gérant et la pérennité de l'activité "High Risk" (Research Chemicals).

### 1. La Barrière Juridique (Le "Coquillage")

- **Structure :** LLC au **Nouveau-Mexique (USA)**.
  - _Raison :_ Anonymat du registre public (Pas de noms de membres listés).
- **Adresse Officielle :** Toujours utiliser l'adresse de l'agent (**Northwest Registered Agent**) à Albuquerque.
- **Règle d'Or :** L'adresse personnelle du gérant en France ne doit **JAMAIS** apparaître sur une facture, un colis, un whois ou le site web.

### 2. La Barrière Logistique (Le "Fantôme")

- **Flux Physique :** Stock en France (pour livrer en 48h sans douane).
- **Expédition :** Exclusivement via **Mondial Relay / Shop2Shop**.
  - _Mécanisme :_ Le système "Point Relais vers Point Relais" masque l'adresse d'expédition réelle.
- **Étiquetage :** Expéditeur générique ("Service Logistique" ou "Atlas Lab"). Adresse de retour = Le Point Relais de dépôt.

### 3. La Barrière Financière (Le "Firewall")

- **Banque :** Compte pro Fintech (Wise/Mercury) au nom de la LLC US (en attente EIN).
- **Encaissement :**
  - **Interdit :** Stripe et PayPal (Bannissement immédiat pour Peptides).
  - **Stratégie Actuelle :** Paiement **Crypto** (Wallet Non-Custodial). Virement bancaire désactivé temporairement.

### 4. La Barrière Numérique (Le "Masque")

- **Infrastructure :** Cloudflare (Masquage IP serveur) + Njalla (Anonymat Domaine).
- **Administration :**
  - 🔴 **VPN OBLIGATOIRE** pour toute connexion aux dashboards (Supabase, Cloudflare, Banque, Email).
  - L'IP résidentielle ne doit jamais être loguée.

---

## 🏗️ Architecture Technique (JAMstack)

### Frontend (Vue 3 + TypeScript)

- **Framework :** Vue 3 (Composition API).
- **Build :** Vite.
- **Hébergement :** Cloudflare Pages.
- **State Management (Pinia) - Règle de Sécurité :**
  - _Panier/Préférences :_ `localStorage` (Confort).
  - _Données Sensibles (Nom, Adresse) :_ `sessionStorage` (Autodestruction à la fermeture de l'onglet).

### Backend (Supabase)

- **Auth :** Supabase Auth.
- **Database :** PostgreSQL avec RLS (Row Level Security) strictes.
- **Edge Functions :** Pour les opérations sensibles (Envoi email, appel IA).
- **Backup :** Export SQL quotidien externe à prévoir (Souveraineté des données).

### Communication (Resend)

- **Stratégie "Agnostique" :**
  - Nom d'expéditeur : "FP Store" (Pas de "Peptides").
  - Contenu : Neutre (Pas de liste de produits, juste un lien vers le compte client).
  - Footer : Nettoyé (Pas de réseaux sociaux).

---

## 💳 Stratégie de Paiement (Launch & Upgrade)

Nous adoptons une approche évolutive pour contourner les délais administratifs (IRS) et sécuriser le lancement.

### PHASE 1 : Le Lancement Crypto (ACTUEL)

- **Objectif :** Premières ventes immédiates & Sécurité maximale.
- **Mécanisme :**
  1.  **Checkout :** Paiement Crypto uniquement (Virement affiché "Bientôt").
  2.  **Confirmation :** Affichage adresses Wallet (BTC / USDT-TRC20).
  3.  **Validation :** Admin vérifie la réception sur Exodus et valide la commande.
- **Avantage :** Incensurable, aucun risque de gel des fonds.

### PHASE 2 : L'Upgrade "High-Risk" (FUTUR - Post EIN)

- **Condition :** EIN obtenu + 3 mois d'historique bancaire.
- **Cible :** Gateway NMI ou Authorize.net avec Merchant Account "High Risk" dédié.
- **Technique :** Intégration via `Hosted Fields` (iFrame) pour la sécurité PCI.

---

## 📦 Parcours Client & Compliance

### 1. Le "Bouclier Légal" (Frontend)

- **Age Gate :** Modale +18 ans à l'entrée (Cookie/LocalStorage).
- **Disclaimer Checkout :** Checkbox obligatoire avant paiement : _"Je certifie être un chercheur qualifié... Usage laboratoire uniquement..."_.
- **Geo-blocking :** Formulaire d'adresse restreint (Pas d'Allemagne, Suisse, USA).
- **SEO/GEO :** Données structurées Schema.org "Research Chemical" injectées pour les IA.

### 2. Le Checkout Asynchrone

1.  **Panier :** Validation classique.
2.  **Paiement :** Crypto par défaut.
3.  **Validation :** Création commande (Statut: `Pending Payment`).
4.  **Succès :** Page de confirmation avec instructions Wallet + Email "En attente".

---

## 📝 Roadmap & Statut Actuel

_Mise à jour : 03/12/2025_

| Brique               |  Statut   | Notes                                                |
| :------------------- | :-------: | :--------------------------------------------------- |
| **Structure LLC**    |  🟢 Fait  | Créée (30/11), OA signé (03/12) & Archivé.           |
| **Site Web (Vue 3)** |  🟢 Fait  | Déployé, Design "Labo" OK, Footer Clean.             |
| **Base de Données**  |  🟢 Fait  | Supabase Configuré.                                  |
| **Textes Légaux**    |  🟢 Fait  | CGV/Privacy intégrées (Spécial NM Law + RUO).        |
| **Emails (Resend)**  |  🟢 Fait  | Templates transactionnels (Pending/Paid) OK.         |
| **Mondial Relay**    |  🟢 Fait  | Widget intégré (Checkout).                           |
| **Paiement Manuel**  |  🟢 Fait  | Flux Checkout -> Page Confirmation instructions OK.  |
| **Config Crypto**    |  🟢 Fait  | Wallet Exodus configuré, Adresses réelles injectées. |
| **Qualité (QA)**     |  🟢 Fait  | Tests E2E Cypress (Guest Checkout + Links) validés.  |
| **SEO / GEO**        |  🟢 Fait  | Schema.org JSON-LD (CAS Number, Purity) intégré.     |
| **Compte Banque**    | 🔴 Bloqué | Attente EIN (Délai IRS important).                   |

---

## ⚠️ Rappels Quotidiens pour l'Admin

1.  **Active ton VPN** avant de travailler.
2.  **Ne donne jamais** de conseils de dosage par chat/email (Réponse type : "Produit pour recherche uniquement").
3.  **Vérifie les paiements** sur l'app Exodus avant d'expédier une commande (compare les 4 derniers caractères de l'adresse).
4.  **Ne livre jamais** en Allemagne ou en Suisse (Risque saisie douane).
5.  **Archivage :** Conserve l'Operating Agreement signé et ta Phrase de Récupération Exodus (Seed) **hors ligne** ou dans un volume chiffré.
