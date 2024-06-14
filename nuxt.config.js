export default {
  buildModules: [],
  plugins: [
    '~/plugins/supabase.js'
  ],
  router: {
    middleware: ['auth']
  }
}
