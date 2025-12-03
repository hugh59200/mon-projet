# Mission : Refactoring des emails transactionnels (Resend)

export CLAUDE_CODE_GIT_BASH_PATH='C:\Users\hugo.bogrand-ext\AppData\Local\Programs\Git\bin\bash.exe'
npx claude

## Contexte

Je vends des peptides de recherche sur mon e-commerce Fast Peptides (Vue.js + Supabase). J'utilise **Resend** pour les emails transactionnels.

**Problème :** Les providers d'email (Resend, SendGrid, etc.) scannent automatiquement le contenu des emails. Si leurs algorithmes détectent des mots-clés "High Risk" (peptide, BPC-157, injection, hormone, sérum, etc.), ils bannissent le compte sans préavis.

**Solution :** Rendre tous les emails "agnostiques" — l'email ne doit servir qu'à notifier, jamais à détailler les produits. Le client consulte les détails sur le site.

---

## Règles à appliquer sur TOUS les templates d'email

### 1. Ne JAMAIS lister les noms de produits
```
❌ INTERDIT : "Merci pour votre achat de : 2x BPC-157 5mg, 1x Eau Bactériostatique"
✅ CORRECT  : "Merci pour votre commande #FP-12345. Vous avez commandé 3 article(s)."
```

### 2. Utiliser des liens vers le site pour les détails
```
✅ "Pour consulter le détail de votre commande et télécharger votre facture, connectez-vous à votre espace client."
   [Bouton: Voir ma commande] → https://fast-peptides.com/account/orders/{order_id}
   
   Pour les guests (non connectés), utiliser le tracking_token :
   → https://fast-peptides.com/tracking?token={tracking_token}
```

### 3. Objets d'email neutres et corporate
```
❌ INTERDIT : "Expédition de vos Peptides !"
❌ INTERDIT : "Votre commande de BPC-157 est confirmée"
✅ CORRECT  : "Confirmation de commande #FP-12345"
✅ CORRECT  : "Votre colis est en route"
✅ CORRECT  : "Mise à jour concernant votre commande"
```

### 4. Données AUTORISÉES dans l'email

- Numéro de commande (order_id ou order_number)
- Nombre total d'articles (ex: "3 article(s)")
- Montant total (ex: "45,90 €")
- Adresse de livraison (rue, ville, CP)
- Nom du point relais (si applicable)
- Numéro de suivi (tracking_number)
- Lien vers le site pour voir les détails
- Date de commande
- Nom du client

### 5. Données INTERDITES dans l'email

- Noms des produits
- Descriptions des produits
- Dosages (5mg, 10mg, etc.)
- Catégories de produits
- Tableau récapitulatif des items
- Images des produits
- Tout mot-clé sensible : peptide, hormone, injection, sérum, recherche, laboratoire, fiole, lyophilisé, etc.

---

## Ta mission

### Étape 1 : Audit

Lister toutes les Edge Functions Supabase qui envoient des emails. Chercher dans :
- `supabase/functions/`
- Tout fichier qui importe ou utilise Resend
- 

Fichiers probables :
- `send-order-email/index.ts` (email de confirmation)
- `send-shipping-email/index.ts` (email d'expédition avec tracking)
- Autres...

### Étape 2 : Plan de refactoring

Pour chaque fichier trouvé, me montrer :
1. Ce qu'il fait actuellement
2. Les données sensibles qu'il envoie
3. Ce qui doit changer

### Étape 3 : Refactoring

Pour chaque fichier :
1. Supprimer la liste des produits / items du template
2. Remplacer par : nombre d'articles + montant total
3. Ajouter un CTA clair vers le site
4. Neutraliser l'objet (subject) de l'email
5. S'assurer qu'aucun mot-clé sensible n'apparaît

### Étape 4 : Validation

Me montrer un avant/après pour chaque fichier modifié.

---

## Exemples de templates

### AVANT (non conforme - à ne plus faire)
```html
<h1>Merci pour votre commande !</h1>
<p>Récapitulatif de votre commande #{{order_id}} :</p>
<table>
  <tr>
    <th>Produit</th>
    <th>Quantité</th>
    <th>Prix</th>
  </tr>
  {{#each items}}
  <tr>
    <td>{{product_name}} - {{dosage}}</td>
    <td>{{quantity}}</td>
    <td>{{price}}€</td>
  </tr>
  {{/each}}
</table>
<p><strong>Total : {{total}}€</strong></p>
<p>Vos peptides seront expédiés sous 24h.</p>
```

### APRÈS (conforme - modèle à suivre)
```html
<h1>Merci pour votre commande !</h1>

<p>Bonjour {{customer_name}},</p>

<p>Votre commande <strong>#{{order_number}}</strong> a bien été enregistrée.</p>

<p>
  <strong>{{item_count}} article(s)</strong> pour un total de <strong>{{total}}€</strong>
</p>

<p>Pour consulter le détail complet de votre commande :</p>

<a href="{{order_url}}" style="display:inline-block;padding:12px 24px;background:#10b981;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
  Voir ma commande
</a>

<p style="margin-top:24px;">
  <strong>Livraison prévue :</strong> 48-72h<br>
  <strong>Adresse :</strong> {{shipping_address}}
</p>

<p>Une question ? Répondez simplement à cet email.</p>

<p>L'équipe Fast Peptides</p>
```

### Email d'expédition (conforme)
```html
<h1>Votre colis est en route !</h1>

<p>Bonjour {{customer_name}},</p>

<p>Bonne nouvelle ! Votre commande <strong>#{{order_number}}</strong> a été expédiée.</p>

<p><strong>Numéro de suivi :</strong> {{tracking_number}}</p>

<a href="{{tracking_url}}" style="display:inline-block;padding:12px 24px;background:#10b981;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
  Suivre mon colis
</a>

<p style="margin-top:24px;">
  Pour voir le détail de votre commande :
  <a href="{{order_url}}">Accéder à ma commande</a>
</p>

<p>L'équipe Fast Peptides</p>
```

---

## Variables à utiliser dans les templates
```typescript
interface SafeEmailData {
  // ✅ Autorisé
  customer_name: string;
  customer_email: string;
  order_id: string;
  order_number: string;        // Format lisible : "FP-12345"
  item_count: number;          // Nombre d'articles (pas les noms !)
  total: string;               // "45,90 €"
  shipping_address: string;    // Adresse complète
  relay_name?: string;         // Nom du point relais si applicable
  tracking_number?: string;    // Numéro de suivi
  tracking_url?: string;       // URL de suivi transporteur
  order_url: string;           // Lien vers le site pour voir les détails
  
  // ❌ INTERDIT - Ne jamais inclure
  // items: Array<{product_name, description, dosage, price}>
  // product_names: string[]
  // Tout champ contenant des noms de produits
}
```

---

## Checklist finale

Après refactoring, vérifier que :

- [ ] Aucun nom de produit n'apparaît dans les emails
- [ ] Aucun dosage n'apparaît (5mg, 10mg, etc.)
- [ ] Aucun mot-clé sensible (peptide, hormone, injection, sérum, etc.)
- [ ] Les objets sont neutres ("Confirmation commande #XXX")
- [ ] Un lien vers le site est présent pour voir les détails
- [ ] Le nombre d'articles et le total sont affichés
- [ ] Les templates sont testés et fonctionnels

---

## Commencer

1. Liste-moi tous les fichiers qui envoient des emails
2. Montre-moi le contenu actuel de chaque template
3. Propose le plan de modification
4. Attends ma validation avant de modifier