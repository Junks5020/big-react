import { getPackageJSON, resolvePkgPath, getBasePlugins } from './utils.js';
import generatePackageJson from 'rollup-plugin-generate-package-json';
const { name, module } = getPackageJSON('react');
//react包的路径
const pkgPath = resolvePkgPath(name);
//react产物路径
const distPath = resolvePkgPath(name, true);
export default [
  //react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${distPath}/index.js`,
      format: 'esm',
    },
    plugins: [
      ...getBasePlugins(),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: distPath,
        baseContents: ({ name, description, version }) => {
          return {
            name,
            description,
            version,
            main: 'index.js',
          };
        },
      }),
    ],
  },
  //jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${distPath}/jsx-runtime.js`,
        format: 'esm',
      },
      {
        file: `${distPath}/jsx-dev-runtime.js`,
        format: 'esm',
      },
    ],
    plugins: getBasePlugins(),
  },
];
