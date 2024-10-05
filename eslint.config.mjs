import tailwindcss from 'eslint-plugin-tailwindcss';
import html from 'eslint-plugin-html';
import typescript from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx,html}'], // Inclure les fichiers JavaScript, TypeScript et HTML
    plugins: {
      tailwindcss,
      html,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: typescript,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      ...tailwindcss.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      // Ajoutez vos règles personnalisées ici
    },
    settings: {
      'html/html-extensions': ['.html'], // Inclure les fichiers HTML
    },
  },
];