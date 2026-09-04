/// <reference types="vitest" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { hyperProductivityPlugin } from '@hyper-productivity/vite-plugin';

export default defineConfig({
  plugins: [
    solidPlugin(),
    hyperProductivityPlugin({
      copyTo: '../../../src/assets/bundled-plugins/automations',
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
