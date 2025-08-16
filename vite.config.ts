import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< HEAD
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/it-service-manager/',
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'IT Service Manager',
        short_name: 'ServiceMgr',
        description: 'An application to manage IT service reports.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            "type": "image/png"
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
=======

// https://vitejs.dev/config/
export default defineConfig({
  // Add this base property
  base: '/it-service-manager/', 
  plugins: [react()],
>>>>>>> edcdf805ad0de5fee9fadf9b15d02abcfc08bed8
})
