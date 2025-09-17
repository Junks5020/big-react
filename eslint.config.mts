import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 基础 JavaScript 配置
  js.configs.recommended,

  // TypeScript 配置
  ...tseslint.configs.recommended,

  // Prettier 配置（禁用与 Prettier 冲突的规则）
  prettier,

  // 全局配置
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // 代码质量规则
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // 由 TypeScript 处理

      // TypeScript 特定规则 - 使用正确的规则名称
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // 移除不存在的规则
      // '@typescript-eslint/prefer-const': 'error', // 这个规则不存在

      // 代码风格（与 Prettier 兼容）
      semi: 'off',
      quotes: 'off',
      indent: 'off',
    },
  },

  // 忽略文件
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
    ],
  },
]);
