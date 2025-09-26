//
import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export function resolvePkgPath(pakName, isDist) {
  //包路径
  if (isDist) {
    return `${distPath}/${pakName}`;
  }
  return `${pkgPath}/${pakName}`;
}

export function getPackageJSON(pakName) {
  //包路径
  const path = `${resolvePkgPath(pakName)}/package.json`;
  const str = fs.readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(str);
}

//获取所有基础的plugins
export function getBasePlugins({
  alias = { __DEV__: true },
  typescript = {},
} = {}) {
  return [replace(alias), cjs(), ts(typescript)];
}
