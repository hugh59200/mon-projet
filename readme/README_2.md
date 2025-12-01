# 🧪 Project Atlas - Documentation & Roadmap (Master v3)

**Nom Commercial (Domaine) :** `fast-peptides` (Njalla)
**Entité Juridique :** `Atlas Lab Solutions LLC` (New Mexico, USA)
**Logistique :** France (Stock déporté)
**Statut :** 🟡 En développement actif (Waiting for EIN)

---

## 🎯 Objectifs du Projet

1.  **Commerce :** Vente de produits de type "Research Chemicals" (Peptides) à une clientèle B2C majoritairement française (90%).
2.  **Logistique :** Assurer une livraison rapide (48h) sans frais de douane pour le client final (Stock physique en France).
3.  **Sécurité & Anonymat (OpSec) :**
    * Protéger l'identité personnelle du dirigeant (Anonymat civil).
    * Dissocier l'activité commerciale de l'adresse personnelle.
    * Sécuriser les flux financiers (Crypto & High Risk) pour éviter les blocages (Stripe/PayPal bannis).

---

## 🏗️ Infrastructure Juridique (Mise en place : ✅ FAIT)

Nous avons opté pour une structure **Hybride** : *Entité US + Logistique FR*.

### 1. Structure de l'entreprise
* **Forme Juridique :** LLC (Limited Liability Company).
* **État :** New Mexico (USA).
    * *Pourquoi ?* Confidentialité par défaut (Pas de noms de membres sur le registre public), pas de rapport annuel à déposer.
* **Nom Enregistré :** `Atlas Lab Solutions LLC`.
* **Objet Social (Purpose) :** "Online Retail".

### 2. Prestataire & Configuration
* **Registrar :** Northwest Registered Agent.
* **Services Achetés :**
    * Business Formation (LLC).
    * EIN Service for Non-US Residents (Numéro fiscal fédéral).
    * BOI Filing (Déclaration anti-blanchiment).
* **Configuration OpSec (Critique) :**
    * Adresse Principale & Postale : **1209 Mountain Road PL NE, Albuquerque, NM**. (Adresse du prestataire).
    * Management : **Member-Managed**.
    * Registre Public : Membres **NON** listés.

### 3. Statut Administratif Actuel
* **Paiement :** Effectué le [Date].
* **Formulaire SS-4 (IRS) :** Signé électroniquement.
* **En attente :**
    * 📄 *Articles of Organization* (Délai : 1-3 jours).
    * 🆔 *EIN Number* (Délai : 3-4 semaines, traitement manuel IRS pour étrangers).

---

## 📦 Stratégie Logistique & Marketing

### Logistique (Physical Layer)
* **Expédition :** Depuis la France.
* **Transporteur :** Mondial Relay (et Shop2Shop).
* **Méthode :** Point Relais vers Point Relais.
    * *Avantage :* Masquage de l'adresse d'expédition réelle (domicile).
    * *Étiquette :* Expéditeur = "Service Logistique / Atlas Lab" + Adresse du Point Relais de dépôt.

### Marketing (Brand Layer)
* **Positionnement :** "Qualité Scientifique Américaine, Logistique Locale".
* **Message Client :**
    > 🇺🇸 Société US (Crédibilité, R&D).
    > 🇫🇷 Stock en France (Livraison 48h, Pas de douane).

---

## 💻 Stack Technique & Dev (Architecture JAMstack)

### 1. Frontend & Application
* **Framework :** **Vue 3** (Composition API).
* **Langage :** **TypeScript** (Strict).
* **Build & Deploy :** Vite + **Cloudflare Pages**.
* **Domaine :** Géré chez **Njalla** (Anonymat).

### 2. Backend & Data (Supabase)
* **BaaS :** Supabase (PostgreSQL).
* **Auth :** Supabase Auth.
* **Notifications :** API **Resend** (via Edge Functions).
* **Sécurité Data :** RLS (Row Level Security) strictes.
* **Backup :** Export SQL quotidien externe (à mettre en place post-MEP).

### 3. Paiements (Payment Gateway)
* **Priorité 1 (Crypto) :** Intégration Crypto (BTCPay Server ou module API).
* **Priorité 2 (High Risk) :** Intégration future d'un processeur spécialisé.
* **Interdit :** Stripe, PayPal standard.

### 4. Conformité Code (Compliance)
* **Age Gate :** Modal de vérification +18 ans à l'entrée du site.
* **Disclaimer "Research Only" :** Checkbox obligatoire avant ajout au panier.

---

## 📝 Roadmap Immédiate & Statut

| Tâche | Priorité | Statut |
| :--- | :---: | :--- |
| **Setup Projet Vue 3 + TS** | 🟢 Fait | Déployé sur Cloudflare |
| **Base de données & Auth** | 🟢 Fait | Supabase Configuré |
| **Emails Transactionnels** | 🟢 Fait | Resend Connecté |
| **Intégration Mondial Relay** | 🔥 Haute | 👉 **À faire aujourd'hui** |
| **Système de Paiement** | 🔥 Haute | 👉 **À faire aujourd'hui** |
| **Mentions Légales** | 🟡 Moyenne | À intégrer |
| **Réception Papiers LLC** | 🟡 Moyenne | En attente |

---

## ⚠️ Notes de Sécurité (Rappel OpSec)

1.  **VPN OBLIGATOIRE :** Cloudflare masque le site, mais **pas l'admin**. L'accès aux dashboards (Cloudflare, Supabase, Git) doit se faire sous VPN pour éviter de loguer votre IP personnelle.
2.  **Adresse :** Ne jamais utiliser l'adresse personnelle française sur les factures ou le site web. Toujours utiliser l'adresse NM.
3.  **Sanitisation :** Pas de clés privées dans le code client Vue.js.