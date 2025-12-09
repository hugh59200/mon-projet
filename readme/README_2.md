# 🛡️ Project Atlas - Master Documentation & Strategy

**Nom Commercial :** `fast-peptides` (Domaine via Njalla)
**Entité Juridique :** `Atlas Lab Solutions LLC` (New Mexico, USA)
**Logistique :** France (Stock déporté / Drop-shipping local)
**Statut :** 🟡 **PRÉ-LANCEMENT** (Technique 100% OK / Attente EIN)

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
  - 🔴 **VPN OBLIGATOIRE (Mullvad)** pour toute connexion aux dashboards (Supabase, Cloudflare, Banque, Email).
  - **Cloisonnement :** L'email Admin (Proton) ne doit jamais interagir avec l'email Perso (Gmail). Pas de transfert automatique.

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
- **Edge Functions :** `send-order-confirmation` (Envoi email transactionnel sécurisé via Resend).
- **Secrets :** Clés API (Resend, etc.) stockées exclusivement dans Supabase Vault, jamais dans le code client.

### Communication (Architecture Hybride)

- **Canal Transactionnel (Site) :**
  - **Service :** Resend API.
  - **Usage :** Confirmations de commande automatiques.
  - **Sécurité :** DKIM/SPF validés sur Cloudflare.
- **Canal Administratif (Humain) :**
  - **Service :** Proton Mail (Suisse).
  - **Adresse :** `contact@fast-peptides.com` (Identité "Atlas Lab").
  - **Sécurité :** Cryptage de bout en bout, cloisonné du personnel.

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
3.  **Validation :** Appel Edge Function -> Email confirmation.
4.  **Succès :** Page de confirmation avec instructions Wallet.

---

## 📝 Roadmap & Statut Actuel

_Mise à jour : 09/12/2025_

| Brique                |  Statut   | Notes                                                      |
| :-------------------- | :-------: | :--------------------------------------------------------- |
| **Structure LLC**     |  🟢 Fait  | Créée, OA signé & Archivé.                                 |
| **Site Web (Vue 3)**  |  🟢 Fait  | Déployé, Design "Labo" OK, Footer Clean.                   |
| **Base de Données**   |  🟢 Fait  | Supabase Configuré.                                        |
| **Textes Légaux**     |  🟢 Fait  | CGV/Privacy intégrées (Spécial NM Law + RUO).              |
| **Logistique**        |  🟢 Fait  | Widget Mondial Relay intégré.                              |
| **Paiement Crypto**   |  🟢 Fait  | Wallet Exodus configuré, Adresses injectées.               |
| **Qualité (QA)**      |  🟢 Fait  | Tests E2E Cypress validés.                                 |
| **Email Pro (OpSec)** |  🟢 Fait  | Proton (Admin) + Resend (Auto) + DNS Cloudflare Sécurisés. |
| **Newsletter**        |  🟢 Fait  | Double opt-in + Code promo -10% automatique.               |
| **Lab Notes**         |  🟢 Fait  | 5 guides techniques + Calculateur dilution intégré.        |
| **Compte Banque**     | 🔴 Bloqué | Attente EIN (Délai IRS important).                         |

---

## 📧 Système Newsletter (Double Opt-in)

### Flux d'inscription

```
1. Utilisateur s'inscrit (homepage ou footer)
   ↓
2. Email de confirmation envoyé automatiquement
   (via Edge Function newsletter-confirmation)
   ↓
3. Email contient : Code WELCOME10 + Lien de confirmation
   ↓
4. Clic sur le lien → /newsletter/confirm?token=xxx
   ↓
5. Status passe de 'pending' à 'active'
   ↓
6. Affichage du code promo avec bouton copier
```

### Composants Frontend

| Route | Fichier | Description |
|-------|---------|-------------|
| Homepage/Footer | `NewsletterSignup.vue` | Formulaire d'inscription (3 variantes) |
| `/newsletter/confirm` | `NewsletterConfirmView.vue` | Page de confirmation avec code promo |
| `/newsletter/unsubscribe` | `NewsletterUnsubscribeView.vue` | Page de désinscription |

### Edge Functions

| Fonction | Description |
|----------|-------------|
| `newsletter-confirmation` | Envoie l'email de confirmation avec code -10% |
| `send-newsletter` | Envoi de campagnes en masse (admin) |

### Tables Supabase

- `newsletter_subscribers` : Liste des abonnés avec préférences
- `newsletter_campaigns` : Campagnes d'envoi
- `newsletter_sends` : Tracking des envois individuels
- `newsletter_stats` (vue) : Statistiques en temps réel

### Code Promo

Le code `WELCOME10` est automatiquement affiché dans l'email de confirmation et sur la page de confirmation. Il offre -10% sur la première commande (usage unique par utilisateur).

---

## 📚 Lab Notes (Ressources Techniques)

Section documentation scientifique avec style "manuel de laboratoire" pour renforcer la crédibilité et le SEO.

### Architecture

| Route | Composant | Description |
|-------|-----------|-------------|
| `/ressources` | `ResourcesListView.vue` | Liste des guides avec carte outil en vedette |
| `/ressources/:slug` | `ResourceDetailView.vue` | Article avec TOC sidebar sticky |
| `/guide-reconstitution` | `ReconstitutionView.vue` | Calculateur de dilution interactif |

### Fonctionnalités

- **TOC Sidebar** : Table des matières auto-générée depuis les h2/h3, sticky au scroll
- **Callouts stylisés** : `.callout-success`, `.callout-warning`, `.callout-danger`
- **Featured Tool** : Carte en vedette vers le calculateur de dilution
- **Badges** : Difficulté (Débutant/Intermédiaire/Avancé) + Catégorie sur chaque article
- **Équipements** : Liste du matériel requis dans la sidebar

### Guides Techniques (5 articles)

| Titre | Catégorie | Difficulté |
|-------|-----------|------------|
| Reconstitution des Peptides Lyophilisés | Protocoles Lab | Débutant |
| Comprendre les Rapports HPLC | Analyse HPLC | Intermédiaire |
| Stockage Optimal des Peptides | Stockage & Conservation | Débutant |
| Structure Moléculaire des Peptides | Science Moléculaire | Avancé |
| Standards de Qualité (COA) | Standards Qualité | Intermédiaire |

### Calculateur de Dilution

Outil interactif accessible via Lab Notes (retiré de la navigation principale) :
- Calcul automatique des volumes de solvant
- Visualisation seringue avec graduations
- Lien depuis les articles pertinents via callout

### Tables Supabase

- `resources` : Articles avec contenu, images, métadonnées SEO
- `resource_categories` : Catégories avec icône et couleur

### Scripts

```bash
# Seed des articles Lab Notes
DATABASE_PASSWORD="..." node scripts/exec-sql.cjs supabase/script/seed-lab-notes-resources.sql

# Upload des images vers bucket news-images
node scripts/upload-lab-notes-images.cjs
```

---

## ⚠️ Rappels Quotidiens pour l'Admin

1.  **Active ton VPN (Mullvad)** avant de travailler.
2.  **Ne donne jamais** de conseils de dosage (Réponse type : "Produit pour recherche uniquement").
3.  **Vérifie l'expéditeur** avant de répondre : Toujours utiliser `contact@fast-peptides.com`, jamais l'adresse technique/perso.
4.  **Ne livre jamais** en Allemagne ou en Suisse (Risque saisie douane).
5.  **Hygiène Numérique :** Ne jamais transférer les emails Proton vers Gmail.
