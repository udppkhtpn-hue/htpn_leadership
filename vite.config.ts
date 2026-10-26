import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Repo is github.com/udppkhtpn-hue/htpn_leadership -> GitHub Pages serves it
// from /htpn_leadership/. Hash routing keeps #/present, #/presenter, #/join
// working without server-side rewrites.
export default defineConfig({
  base: '/htpn_leadership/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
  build: {
    target: 'es2022',
    // Never inline textures, photos or video as data URIs.
    assetsInlineLimit: 0,
  },
})
