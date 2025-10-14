import prettier from '@vue/eslint-config-prettier'
import ts from '@vue/eslint-config-typescript'
import eslintPluginImport from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import vue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['**/*.d.ts', '**/types/**/*.ts', '**/shared/tools/**/*.ts', '**/vite/**/*.ts'],
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      vue,
      'simple-import-sort': simpleImportSort,
      import: eslintPluginImport,
    },
    rules: {
      // --- Vue ---
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, { baseIndent: 1 }],
      'vue/attribute-hyphenation': ['error', 'never'],

      // --- Imports automatiques ---
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^vue', '^@?\\w'],
            ['^@/', '^@designSystem'],
            ['^\\.', '^\\.\\./'],
            ['^.+\\.d\\.ts$', '^.*\\btypes\\b.*'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // --- Général ---
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },
  ...ts(),
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
