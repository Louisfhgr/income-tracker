export default {
  buildModules: [],
  plugins: [
    '~/plugins/supabase.js'
  ],
  css: [
    '@/assets/main.css'
  ],
  router: {
    middleware: ['auth']
  }
}
