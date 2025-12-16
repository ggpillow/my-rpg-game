import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
  baseDirectory: dirname
});

export default [
  { ignores: ['dist/**'] },

  js.configs.recommended,

  ...compat.extends('airbnb-base/legacy'),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },

  {
    files: ['webpack.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script'
    }
  }
];
