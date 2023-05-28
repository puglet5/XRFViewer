import { rmSync } from 'node:fs'
import path from 'node:path'
import { PluginOption, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      react(),
      visualizer({
        template: "treemap",
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: "analyse.html",
      }) as PluginOption,
    ],
    clearScreen: false,
    server: {
      strictPort: true,
    },
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
      target: "es2020",
      minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  }
})
