import { fileURLToPath, URL } from 'node:url'
import BasicSSL from '@vitejs/plugin-basic-ssl'
import path from 'path'
import {  defineConfig, type BuildEnvironmentOptions } from 'vite'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { manualChunksOptimizer, assetFileNameOptimizer } from './vite/chunkOptimizer'
import { generateGlobalComponents, generateRouteNamesUnion,generateIconsList } from './vite/generator'

const outDir = (process.env.CIBLE ?? 'APP') === 'APP' ? 'dist' : 'dist-admin'
const config = {
  APP: {
    outDir,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: manualChunksOptimizer,
        assetFileNames: assetFileNameOptimizer,
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  } as BuildEnvironmentOptions,
}

generateIconsList(__dirname)
generateRouteNamesUnion(__dirname)
generateGlobalComponents(__dirname)

export default defineConfig({
  plugins: [
    VueDevTools(),
    svgLoader(),
    BasicSSL(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@designSystem': path.resolve(__dirname, 'designSystem/src'),
      '@designSystem/components': path.resolve(__dirname, 'designSystem/src/components/index.ts'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@designSystem/index.less";`,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2500,
    ...config.APP,
  },
  server: {
    port: 5278,
    strictPort: true,
    host: 'localhost',
  },
})
