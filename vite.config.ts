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
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'BackgroundRemover',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: (format) => `background-remover.${format}.js`,
    },
    rollupOptions: {
      // Asegúrate de externalizar las dependencias que no deben ser empaquetadas
      // en tu librería
      external: ['lit', '@huggingface/transformers'],
      output: {
        // Proporciona nombres de variables globales para las dependencias externalizadas
        globals: {
          lit: 'Lit',
          '@huggingface/transformers': 'Transformers',
        },
      },
    },
  },
});
