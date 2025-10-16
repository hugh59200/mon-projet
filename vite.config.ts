import BasicSSL from '@vitejs/plugin-basic-ssl'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

import { assetFileNameOptimizer, manualChunksOptimizer } from './vite/chunkOptimizer'

import { defineConfig } from 'vite'
import {
  generateGlobalComponents,
  generateIconsList,
  generateRouteNamesUnion,
} from './vite/generator'

// === Config globale ===
const outDir = 'dist'

// 🧩 Pré-build automatiques
generateIconsList(__dirname)
generateRouteNamesUnion(__dirname)
generateGlobalComponents(__dirname)

export default defineConfig({
  // === Plugins ===
  plugins: [
    vue(),
    svgLoader(),
    VueDevTools(),
    BasicSSL(), // SSL local
  ],

  // === Résolution des alias ===
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@designSystem': path.resolve(__dirname, 'designSystem/src'),
      '@designSystem/components': path.resolve(__dirname, 'designSystem/src/components/index.ts'),
    },
  },

  // === Configuration CSS (LESS global) ===
  css: {
    transformer: 'postcss',
    preprocessorOptions: {
      less: {
        additionalData: `@import "@designSystem/index.less";`,
      },
    },
  },

  // === Build optimisé (Cloudflare-ready) ===
  build: {
    outDir,
    sourcemap: true,
    cssMinify: false,
    chunkSizeWarningLimit: 2500,

    rollupOptions: {
      output: {
        manualChunks: manualChunksOptimizer,
        assetFileNames: assetFileNameOptimizer,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // ✅ cible moderne (Cloudflare Pages supporte ESNext)
    target: 'esnext',
  },

  // === Serveur local ===
  server: {
    port: 5278,
    strictPort: true,
    host: 'localhost',
  },

  // === Optimisation dépendances ===
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
})
