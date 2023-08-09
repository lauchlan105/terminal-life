import { build } from 'esbuild'
import npmPackage from './package.json'

// this was needed - couldn't find away around the `pkg.peerDependencies`
const pkg = npmPackage as Record<string, any>
const dependencies: Record<string, string> = pkg['dependencies'] ?? [];
const peerDependencies: Record<string, string> = pkg['peerDependencies'] ?? [];

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  external: [
    ...Object.keys(dependencies),
    ...Object.keys(peerDependencies),
  ],
};

build({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: "dist/index.js",
});

build({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  platform: 'neutral', // for ESM
  format: "esm",
});
