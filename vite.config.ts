import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Repo is github.com/udppkhtpn-hue/htpn_leadership -> GitHub Pages serves it
// from /htpn_leadership/. Hash routing keeps #/present, #/presenter, #/join
// working without server-side rewrites.
export default defineConfig({
  base: '/htpn_leadership/',
  plugins: [
    react(),
    tailwindcss(),
    // Everything static must keep working if the hospital wifi goes down
    // mid-talk, videos and fonts included.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/*', 'media/*'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff,woff2,svg,png,jpg,jpeg,mp4}'],
        // The two talk videos are the reason this is not the 2 MB default.
        maximumFileSizeToCacheInBytes: 24 * 1024 * 1024,
        // The Apps Script calls must never be served from a cache.
        navigateFallbackDenylist: [/^\/macros\//],
        runtimeCaching: [],
      },
      manifest: {
        name: 'HTPN Lead Live',
        short_name: 'HTPN Lead',
        start_url: '/htpn_leadership/#/join',
        display: 'standalone',
        background_color: '#EFE6D2',
        theme_color: '#EFE6D2',
      },
    }),
  ],
  server: { port: 5173, host: true },
  build: {
    target: 'es2022',
    // Never inline textures, photos or video as data URIs.
    assetsInlineLimit: 0,
  },
})
