<template>
  <div class="login-container">
    <h1>Login</h1>
    <LoginForm />
    <RegisterLink />
  </div>
</template>

<script setup>
import LoginForm from '~/components/LoginForm.vue'
import RegisterLink from '~/components/RegisterLink.vue'
</script>

<style scoped>
.login-container {
  /* Stile hier */
}
</style>
