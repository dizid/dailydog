<template>
  <div class="min-h-screen transition-colors duration-300">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useDogStore } from '@/stores/dog-store'

const store = useDogStore()

// Initialize app on mount
onMounted(() => {
  // Apply saved theme preference
  if (store.isDarkMode) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}
</style>
