# 🖼️ Script de Migration d'Images vers Supabase

Ce script optimise et upload automatiquement vos images vers Supabase Storage.

## 📋 Fonctionnalités

- ✅ **Optimisation automatique** : Redimensionne à 1000px max, convertit en WebP (qualité 80)
- ✅ **Sécurisé** : Ne touche JAMAIS aux fichiers originaux
- ✅ **Slugification** : "BPC 157.png" → "bpc-157.webp"
- ✅ **Rapport complet** : URLs publiques + requêtes SQL prêtes à l'emploi

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install sharp @supabase/supabase-js
```

### 2. Configurer les variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> ⚠️ **Important** : Utilisez la `service_role` key (pas la `anon` key) pour avoir les droits d'upload.
> Trouvez-la dans : Supabase Dashboard → Settings → API → `service_role`

### 3. Créer le bucket Supabase

Dans le dashboard Supabase :
1. Aller dans **Storage**
2. Cliquer sur **New bucket**
3. Nom : `products`
4. Cocher **Public bucket** (pour les URLs publiques)

### 4. Préparer vos images

```bash
# Créer le dossier source
mkdir source_images

# Y placer vos images
cp /chemin/vers/vos/images/*.png source_images/
```

## 📁 Structure attendue

```
mon-projet/
├── source_images/          # 👈 Vos images ici
│   ├── BPC 157.png
│   ├── TB-500.jpg
│   └── Semaglutide.PNG
├── scripts/
│   └── upload-images.js    # Le script
├── .env                    # Vos credentials
└── ...
```

## ▶️ Lancer le script

```bash
node scripts/upload-images.js
```

### Avec les variables d'environnement inline (alternative)

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... \
node scripts/upload-images.js
```

## 📊 Sortie du script

Le script génère :

### 1. `sql_update.txt`
```sql
BEGIN;

-- Fichier source : BPC 157.png
UPDATE products SET image_url = 'https://xxx.supabase.co/.../bpc-157.webp' WHERE slug = 'bpc-157';

-- Fichier source : TB-500.jpg
UPDATE products SET image_url = 'https://xxx.supabase.co/.../tb-500.webp' WHERE slug = 'tb-500';

COMMIT;
```

### 2. `upload_report.json`
```json
{
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "stats": {
    "total": 10,
    "success": 10,
    "failed": 0,
    "totalOriginalSize": 52428800,
    "totalOptimizedSize": 1048576
  },
  "results": [...]
}
```

### 3. Console
```
╔═══════════════════════════════════════════════════════════╗
║     🖼️  Migration d'images vers Supabase Storage          ║
╚═══════════════════════════════════════════════════════════╝

📁 Dossier source : ./source_images
📦 Bucket cible   : products
🖼️  Images trouvées : 10

🚀 Début du traitement...

[██████████████████████████████] 10/10

╔═══════════════════════════════════════════════════════════╗
║                    📊 RAPPORT FINAL                       ║
╚═══════════════════════════════════════════════════════════╝

✅ Succès     : 10/10
📦 Taille originale  : 50.00 MB
📦 Taille optimisée  : 1.00 MB
🎯 Compression       : 98.0%

📝 URLs publiques générées :

──────────────────────────────────────────────────────────────────
  BPC 157.png
  → https://xxx.supabase.co/storage/v1/object/public/products/bpc-157.webp
    (5.2 MB → 102 KB)
...
```

## ⚙️ Configuration avancée

Modifiez les constantes dans le script :

```javascript
const CONFIG = {
  sourceDir: './source_images',      // Dossier source
  bucketName: 'products',            // Nom du bucket
  bucketFolder: '',                  // Sous-dossier (optionnel)
  image: {
    maxWidth: 1000,                  // Largeur max
    format: 'webp',                  // Format de sortie
    quality: 80,                     // Qualité (1-100)
  },
}
```

## 🔧 Dépannage

### Erreur "Bucket not found"
→ Créez le bucket `products` dans Supabase Dashboard > Storage

### Erreur "Invalid API key"
→ Vérifiez que vous utilisez la `service_role` key, pas la `anon` key

### Erreur "Permission denied"
→ Vérifiez les policies du bucket :
```sql
-- Dans Supabase SQL Editor
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');
```

### Les images ne s'affichent pas
→ Vérifiez que le bucket est configuré comme "Public"

## 📝 Appliquer les requêtes SQL

Après vérification du fichier `sql_update.txt` :

```bash
# Via psql
psql -h db.xxx.supabase.co -U postgres -d postgres -f sql_update.txt

# Ou copiez-collez dans Supabase Dashboard > SQL Editor
```

## 🔒 Sécurité

- ✅ Les fichiers sources ne sont **jamais** modifiés
- ✅ Les fichiers sources ne sont **jamais** supprimés
- ✅ Le traitement se fait en mémoire uniquement
- ✅ Utilisez `upsert: true` pour éviter les doublons
