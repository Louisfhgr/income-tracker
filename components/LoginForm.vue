<template>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNuxtApp } from '#app'
  
  const email = ref('')
  const password = ref('')
  
  const router = useRouter()
  
  const login = async () => {
    console.log('Login attempt:', email.value, password.value)
    const { $supabase } = useNuxtApp()
    const { data, error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) {
      console.error('Login error:', error.message)
      alert(error.message)
    } else {
      console.log('Login successful, redirecting...')
      router.push('/income')
    }
  }
  </script>
  