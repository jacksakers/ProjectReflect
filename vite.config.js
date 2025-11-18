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
        short_name: 'Reflect',
        description: 'A mindfulness and reflection app for your personal growth journey.',
        theme_color: '#7c3aed',
        background_color: '#fedaba',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ],
      },
    }),
  ],
})
