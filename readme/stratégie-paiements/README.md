# 🛡️ Stratégies de Paiement - Master Plan

Ce document définit l'architecture financière cible pour maximiser la conversion des produits "High-Risk" (Peptides) et la stratégie évolutive pour y parvenir.

## 📊 Comparatif des Architectures

| Méthode                 | Description Technique                                                            | Expérience Client             | Taux de Conversion |             Complexité Admin              |
| :---------------------- | :------------------------------------------------------------------------------- | :---------------------------- | :----------------: | :---------------------------------------: |
| **1. Oxford**           | **Open Banking**<br>Virement immédiat via app bancaire.                          | Lourde. Pas d'achat impulsif. |        ⭐️⭐️        |                  Faible                   |
| **2. Nupex (CIBLE 🎯)** | **High-Risk Gateway (NMI) + Wallets**<br>CB directe sur site + Apple/Google Pay. | **Parfaite (1-Click).**       |     ⭐️⭐️⭐️⭐️⭐️     | **Très Élevée** (EIN + Historique requis) |
| **3. PurePeptide**      | **Shopify + Gateway Externe**<br>Interface standard.                             | Rassurante.                   |      ⭐️⭐️⭐️⭐️      |           Risquée (ToS Shopify)           |
| **4. Actuel (MVP)**     | **Asynchrone (Crypto/Virement)**<br>Checkout > Instructions > Paiement manuel.   | Friction moyenne.             |       ⭐️⭐️⭐️       |           **Nulle** (Immédiat)            |

---

## 🚀 La Stratégie : "Launch & Upgrade"

Nous visons le modèle **Nupex (Méthode 2)** pour la scalabilité, mais nous démarrons avec le modèle **Asynchrone (Méthode 4)** pour contourner les délais administratifs (IRS/EIN).

### Pourquoi cette approche hybride ?

1.  **Time-to-Market :** Permet de vendre **immédiatement** sans attendre l'EIN (délai IRS).
2.  **Preuve de Concept :** Les ventes en virement/crypto créeront l'historique bancaire ("Processing History") exigé par les fournisseurs High-Risk pour ouvrir un compte CB plus tard.
3.  **Sécurité :** Si le compte Gateway CB saute, le système Asynchrone reste le backup insubmersible.

---

## 🛠️ Roadmap Technique & Financière

### PHASE 1 : Le Lancement (Statut : 🟢 PRÊT)

- **Infrastructure :** LLC (NM) + Compte Crypto (Wallet non-custodial) + Compte Sage/Wise (dès EIN).
- **Frontend (Vue.js) :** Checkout Asynchrone.
  - _Flux :_ Panier -> Validation -> Email de confirmation avec IBAN/Wallet USDT.
  - _Avantage :_ **Zéro risque de gel des fonds.**

### PHASE 2 : L'Upgrade "High-Risk" (Statut : 🟡 Q2 2026)

_Condition : Avoir l'EIN et 3 mois de relevés bancaires._

- **Fournisseur Cible :**
  - **Gateway :** NMI (Network Merchants Inc) ou Authorize.net.
  - **Merchant Account :** eMerchantBroker, Durango ou Banque Offshore.
- **Intégration Technique (Vue.js + Node) :**
  - Remplacement du bouton "Payer" par un formulaire **Hosted Fields** (iFrame sécurisée NMI) pour la conformité PCI-DSS SAQ-A.
  - Ajout des boutons **Apple Pay / Google Pay** via le SDK de la Gateway.
  - Le backend ne stocke jamais les PAN (numéros de carte), seulement les Tokens.

---

## ⚠️ Notes Critiques pour l'Admin

1.  **Ne jamais tenter Stripe/PayPal :** Même en "test". Leurs algorithmes de détection (MCC codes) bannissent le domaine et l'identité du gérant à vie (Match List / TMF).
2.  **Préparer le dossier "Compliance" :** Pour la Phase 2, garder précieusement :
    - Preuves de livraison (Tracking Mondial Relay).
    - Factures fournisseurs (Traçabilité des produits).
    - Relevés de compte montrant des flux entrants "propres".
