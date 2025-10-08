export function manualChunksOptimizer(id: string): string | void {
  if (id.includes('designSystem/src/components')) {
    return 'DS-components'
  }
  if (id.includes('designSystem/src/fondation')) {
    return 'DS-fondation'
  }
  if (id.includes('@azure/msal-browser')) {
    return 'auth'
  }
  if (
    ['immer', 'moment', 'vue-markdown-render'].some((lib) =>
      id.includes(`/node_modules/${lib}/`),
    )
  ) {
    return 'lib'
  }
  if (id.includes('vue-pdf-embed')) {
    return 'pdf'
  }
}

export function assetFileNameOptimizer(assetInfo: { name?: string }): string {
  if (/Mont_.*\.(otf|ttf|woff|woff2)$/.test(assetInfo.name || '')) {
    return 'assets/fonts/[name]-[hash][extname]'
  }
  if (/\.(png|jpe?g|gif|webp)$/.test(assetInfo.name || '')) {
    return 'assets/images/[name]-[hash][extname]'
  }
  if (/\.svg$/.test(assetInfo.name || '')) {
    return 'assets/svg/[name]-[hash][extname]'
  }
  if (/\.css$/.test(assetInfo.name || '')) {
    return 'assets/css/[name]-[hash][extname]'
  }
  return 'assets/[name]-[hash][extname]'
}
