import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@vaga-turbo-bot': path.resolve(__dirname, '../vaga-turbo-bot/src'),
      '@josanjohnata/optimize-cv': path.resolve(__dirname, '../vaga-turbo-bot'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa Firebase em seu próprio chunk
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Separa React e suas dependências
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separa styled-components
          'styled': ['styled-components'],
          // Separa Supabase se estiver sendo usado
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Aumenta o limite de aviso para 600kb (ainda vai alertar se passar disso)
    chunkSizeWarningLimit: 600,
  },
})
