import { defineConfig } from 'vite';
import { resolve } from 'path';

const alias = [
  {
    find: '~',
    replacement: resolve(__dirname, 'src'),
  },
];

export default defineConfig({
  resolve: { alias },
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'BackgroundRemover',
      fileName: (format) => `background-remover.${format}.js`,
    },
    rollupOptions: {
      external: ['@huggingface/transformers'],
      output: {
        globals: {
          '@huggingface/transformers': 'Transformers',
        },
      },
    },
  },
});
