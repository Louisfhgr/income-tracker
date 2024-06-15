<template>
  <div class="home-container">
    <h1>Willkommen zur Startseite</h1>
    <p></p>
    <div class="link-container">
      <nuxt-link to="/login" class="btn-link">Login</nuxt-link>
      <nuxt-link to="/register" class="btn-link">Registrieren</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>
