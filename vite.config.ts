import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import htmlPurge from 'vite-plugin-html-purgecss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    htmlPurge() as PluginOption
  ],
})
