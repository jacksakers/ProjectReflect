import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Caching strategies
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
      },
      // The manifest is key for the "Add to Home Screen" prompt
      manifest: {
        name: 'Project Reflect',
        short_name: 'Project Reflect',
        description: 'A mindfulness and reflection app for your personal growth journey.',
        theme_color: '#9333ea',
        background_color: '#fef3e2',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/square_logo_large.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
      },
    }),
  ],
})
