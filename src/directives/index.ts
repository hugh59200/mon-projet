// 📁 src/directives/index.ts
import type { App, Directive } from 'vue'

/**
 * 🧠 Charge automatiquement toutes les directives du dossier courant
 * (exclut ce fichier lui-même)
 *
 * Convention : chaque fichier exporte sa directive par défaut ou un objet nommé.
 *
 * Exemple :
 * export const vResponsiveAnimate = { mounted() { ... } }
 * export default vResponsiveAnimate
 */
export default {
  install(app: App) {
    // 🔍 Import dynamique de toutes les directives .ts du dossier
    const modules = import.meta.glob('./!(index).ts', { eager: true }) as Record<
      string,
      Record<string, Directive | { [key: string]: Directive }>
    >

    for (const [path, mod] of Object.entries(modules)) {
      // 🔹 On récupère la directive exportée (default ou nommée)
      const directive = mod.default || Object.values(mod)[0]
      if (!directive) continue

      // 🔹 Nom automatique : v-nomDuFichier (ex: v-responsive-animate)
      const nameMatch = path.match(/\.\/([\w-]+)\.ts$/)
      if (!nameMatch) continue
      const directiveName = nameMatch[1]?.replace(/^v/, '') // retire le "v" initial pour usage naturel

      app.directive(directiveName!, directive)
    }
  },
}
