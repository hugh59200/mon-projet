import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, type BuildEnvironmentOptions } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import sitemap from 'vite-plugin-sitemap'
import { assetFileNameOptimizer, manualChunksOptimizer } from './vite/chunkOptimizer.ts'
import {
  generateGlobalComponents,
  generateIconsList,
  generateRouteNamesUnion,
} from './vite/generator.ts'

const outDir = 'dist' // Output directory for the build
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
    vue(),
    VueDevTools(),
    svgLoader(),
    sitemap({
      hostname: 'https://fast-peptides.com',
      dynamicRoutes: [
        '/',
        '/catalogue',
        '/about',
        '/contact',
        '/faq',
        '/actualites',
        '/reconstitution',
        '/legal/cgv',
        '/legal/privacy',
        '/legal/mentions',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@designSystem': path.resolve(__dirname, 'designSystem/src'),
      '@designSystem/components': path.resolve(__dirname, 'designSystem/src/components/index.ts'),
    },
  },
  css: {
    transformer: 'postcss',
    preprocessorOptions: {
      less: {
        additionalData: `@import "@designSystem/index.less";`,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2500,
    ...config.APP,
    cssMinify: false,
  },
  server: {
    port: 5278,
    host: 'localhost',
    https: {
      key: fs.readFileSync('./localhost+2-key.pem'),
      cert: fs.readFileSync('./localhost+2.pem'),
    },
  },
})
