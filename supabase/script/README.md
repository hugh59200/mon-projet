# Scripts SQL Supabase

## Fichiers principaux (V6)

| Fichier | Description |
|---------|-------------|
| `back-up-tables-v6.sql` | Structure complete de la base (tables, RLS, fonctions, vues) |
| `seed-v6.sql` | Donnees de seed + migrations additionnelles |

## Utilisation

### Reset complet de la base
```sql
-- 1. Executer back-up-tables-v6.sql (structure)
-- 2. Executer seed-v6.sql (donnees)
```

## Fonctionnalites V6

- **Reviews** : Systeme d'avis produits (standard, premium, pro, verified)
  - Vue `product_reviews_summary` pour SEO aggregateRating
  - RLS policies et moderation admin
- **Newsletter** : Systeme complet (subscribers, campaigns, sends)
  - Fonctions subscribe/unsubscribe
  - Vue `newsletter_stats` pour analytics
- **Codes Promo** : Systeme complet (manuels + automatiques)
  - Codes bienvenue, fidelite, abandon panier
  - Triggers automatiques
- Support multilingue (i18n) via colonnes JSONB
- Guest checkout securise avec token de tracking
- Integration Mondial Relay (points relais)
- RLS policies completes
- Vues optimisees pour admin et utilisateurs
