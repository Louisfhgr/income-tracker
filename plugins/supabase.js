import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cohjwqndltomjwltqqjw.supabase.co'  // Ersetzen Sie dies durch Ihre Supabase-URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvaGp3cW5kbHRvbWp3bHRxcWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzODQwOTIsImV4cCI6MjAzMzk2MDA5Mn0.z3Q_Vr27Vm_NVxgBvLeGNGSjO8_3U5ZZ_mua0OeWld0'  // Ersetzen Sie dies durch Ihren Supabase-Schlüssel
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('supabase', supabase)
})
