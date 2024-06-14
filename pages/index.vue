<template>
  <div>
    <h1>Willkommen zur Startseite</h1>
    <p>Dies ist die Hauptseite Ihrer Nuxt.js-Anwendung.</p>
    <nuxt-link to="/login">Login</nuxt-link>
    <nuxt-link to="/register">Registrieren</nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>
