# Guide SEO : Pré-rendu pour les Bots

## Contexte

L'application est un SPA Vue 3. Les bots (Google, Bing, réseaux sociaux) peuvent avoir du mal à indexer le contenu car il est généré côté client.

## Solutions Disponibles

### Option 1 : Prerender.io (Recommandé pour le lancement)

Service cloud qui pré-rend automatiquement les pages pour les bots.

**Avantages :**
- Aucune modification du code
- Fonctionne avec Cloudflare
- Cache intelligent
- 250 pages/mois gratuites

**Configuration Cloudflare :**
1. Créer un compte sur [prerender.io](https://prerender.io)
2. Ajouter un Worker Cloudflare :

```javascript
// workers/prerender.js
const BOT_AGENTS = [
  'googlebot', 'bingbot', 'yandex', 'baiduspider', 'facebookexternalhit',
  'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'showyoubot',
  'outbrain', 'pinterest', 'slackbot', 'vkShare', 'W3C_Validator'
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const userAgent = (request.headers.get('User-Agent') || '').toLowerCase();
  const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));

  if (isBot) {
    const prerenderUrl = `https://service.prerender.io/${request.url}`;
    const prerenderRequest = new Request(prerenderUrl, {
      headers: {
        'X-Prerender-Token': 'VOTRE_TOKEN_PRERENDER'
      }
    });
    return fetch(prerenderRequest);
  }

  return fetch(request);
}
```

---

### Option 2 : Rendertron Self-Hosted

Solution open-source de Google pour le prerendering.

**Déploiement sur Cloud Run (gratuit) :**
```bash
gcloud run deploy rendertron \
  --image us-docker.pkg.dev/nicfit-tool/nicfit-tool/nicfit-tool \
  --platform managed \
  --allow-unauthenticated
```

---

### Option 3 : vite-ssg (Plus complexe)

Génère les pages statiques au build. Nécessite une refonte de `main.ts`.

**Inconvénients :**
- Refonte du code nécessaire
- Les pages dynamiques (produits) doivent être listées au build
- Incompatible avec certains plugins (Google OAuth au mount)

---

## Recommandation

Pour le **lancement** : **Option 1 (Prerender.io)**
- Rapide à configurer
- Aucun risque de régression
- Gratuit pour commencer

Pour **après le lancement** : Migrer vers Option 2 ou 3 selon les besoins.

---

## Vérification du SEO

### Outils de test
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Commandes Google Search Console
```
site:fast-peptides.com
```

### Test du rendu Google
Dans Search Console : URL Inspection > "Test Live URL" > "View Tested Page"
