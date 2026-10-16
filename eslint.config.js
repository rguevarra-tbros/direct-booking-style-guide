/**
 * ESLint config: recommended rules for the browser modules and Node tests.
 */
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', '_site/'] },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['tests/**/*.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
];
