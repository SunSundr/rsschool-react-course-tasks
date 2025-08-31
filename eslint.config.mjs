import css from '@eslint/css';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'public', '.build', 'coverage', '.next'] },
  {
    files: ['**/*.css'],
    plugins: { css },
    extends: [css.configs.recommended, prettierRecommended],
    language: 'css/css',
    rules: {
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
      'css/no-important': 'off',
      'css/no-invalid-at-rules': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      importPlugin.flatConfigs.recommended,
      prettierRecommended,
    ],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: 'react*',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '~/**',
              group: 'internal',
            },
            {
              pattern: '*.css',
              group: 'unknown',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', '**/*.css'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
);
