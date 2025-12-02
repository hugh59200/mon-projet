# Scripts SQL Supabase

## Fichiers principaux (V5)

| Fichier | Description |
|---------|-------------|
| `back-up-tables-v5.sql` | Structure complete de la base (tables, RLS, fonctions, vues) |
| `seed-v5.sql` | Donnees de seed avec traductions i18n |

## Utilisation

### Reset complet de la base
```sql
-- 1. Executer back-up-tables-v5.sql (structure)
-- 2. Executer seed-v5.sql (donnees)
```

### Mise a jour depuis v4
Si vous avez deja une base v4, executez uniquement la migration i18n depuis `archive/migration-i18n.sql`.

## Fonctionnalites V5

- Support multilingue (i18n) via colonnes JSONB
- Guest checkout securise avec token de tracking
- Integration Mondial Relay (points relais)
- RLS policies completes
- Vues optimisees pour admin et utilisateurs

## Archive

Le dossier `archive/` contient les anciennes versions pour reference.
