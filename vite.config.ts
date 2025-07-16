import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

import packageJSON from './package.json';

const hfRawVersion = packageJSON.devDependencies['@huggingface/transformers'];
const hfVersionMatch = hfRawVersion.match(/\d+\.\d+\.\d+/);

if (!hfVersionMatch) {
  throw new Error(`Could not extract version from ${hfRawVersion}`);
}

const hfVersion = hfVersionMatch[0];

const hfCdnUrl = `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${hfVersion}/dist/transformers.min.js`;

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@huggingface/transformers': hfCdnUrl,
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BackgroundRemover',
      fileName: (format) => `background-remover.${format}.js`,
    },
    rollupOptions: {
      output: {
        globals: {
          hfCdnUrl: 'transformers',
        },
      },
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
});
