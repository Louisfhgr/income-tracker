<template>
  <div>
    <h1>Registrieren</h1>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Registrieren</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

const email = ref('')
const password = ref('')

const router = useRouter()

const register = async () => {
  const { $supabase } = useNuxtApp()
  const { user, error } = await $supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) {
    alert(error.message)
  } else {
    alert('Registrierung erfolgreich. Bitte loggen Sie sich ein.')
    router.push('/login')
  }
}
</script>
