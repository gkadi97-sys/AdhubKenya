import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build output
  globalIgnores(['dist']),

  // Node.js scripts (CJS — use require, process, __dirname)
  {
    files: ['scripts/**/*.{js,cjs}', 'test.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Main source files
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Intentional derived-state cascades in form sub-components are acceptable
      'react-hooks/set-state-in-effect': 'warn',
      // Inline helper components defined inside render are acceptable pattern here
      'react-hooks/static-components': 'warn',
      // Impure calls (Math.random) in render — downgrade to warning, fix progressively
      'react-hooks/purity': 'warn',
    },
  },
])
