import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, ssrBuild }) => ({
  plugins: [
    vuePlugin(),
  ],
  base: '/',
  root: path.resolve(__dirname, 'src'),
  publicDir: false, // path.resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@img': path.resolve(__dirname, 'src/img'),
      '~': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    host: '0.0.0.0',
    port: 9999,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist', ssrBuild ? 'server' : 'browser'),
    emptyOutDir: true,
    copyPublicDir: !ssrBuild,
    assetsInlineLimit: 0,
    ssrManifest: !ssrBuild,
    ssrExternal: true,
  },
}))
