<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import supabase from '~/plugins/supabase' // Importieren des zentralen Supabase-Clients

const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  const { data, error } = await supabase.auth.signUp({ email: email.value, password: password.value })
  if (error) {
    console.error('Fehler bei der Registrierung:', error)
    alert('Fehler bei der Registrierung: ' + error.message)
  } else {
    console.log('Erfolgreich registriert:', data)
    router.push('/')
  }
}
</script>
