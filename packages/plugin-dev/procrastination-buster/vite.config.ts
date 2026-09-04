import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { hyperProductivityPlugin } from '@hyper-productivity/vite-plugin';

export default defineConfig({
  base: './',
  plugins: [solidPlugin(), hyperProductivityPlugin()],
});
