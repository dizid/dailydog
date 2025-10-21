<template>
  <header class="glass-effect sticky top-0 z-50 border-b">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div class="text-3xl group-hover:animate-bounce-gentle transition-all">🐕</div>
          <div class="font-bold text-lg bg-gradient-to-r from-puppy-blue to-puppy-purple bg-clip-text text-transparent">
            Daily Dog
          </div>
        </RouterLink>

        <!-- Navigation -->
        <div class="flex items-center gap-4">
          <div class="hidden md:flex gap-2">
            <NavLink to="/" label="Today's Dog" icon="🎲" />
            <NavLink to="/favorites" label="Favorites" icon="❤️" :badge="favoriteCount" />
            <NavLink to="/history" label="History" icon="📜" :badge="historyCount" />
          </div>

          <!-- Theme Toggle -->
          <button
            @click="store.toggleDarkMode"
            class="puppy-btn-secondary p-2 rounded-full"
            :title="store.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <span v-if="!store.isDarkMode" class="text-xl">🌙</span>
            <span v-else class="text-xl">☀️</span>
          </button>

          <!-- Mobile Menu Toggle -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden puppy-btn-secondary p-2 rounded-full"
          >
            <span class="text-xl">≡</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu"
        class="md:hidden mt-4 pt-4 border-t space-y-2 animate-slide-up"
      >
        <MobileNavLink to="/" label="Today's Dog" icon="🎲" @click="closeMobileMenu" />
        <MobileNavLink to="/favorites" label="Favorites" icon="❤️" :badge="favoriteCount" @click="closeMobileMenu" />
        <MobileNavLink to="/history" label="History" icon="📜" :badge="historyCount" @click="closeMobileMenu" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useDogStore } from '@/stores/dog-store'
import NavLink from './NavLink.vue'
import MobileNavLink from './MobileNavLink.vue'

const store = useDogStore()
const route = useRoute()
const showMobileMenu = ref(false)

const favoriteCount = computed(() => store.favoriteCount)
const historyCount = computed(() => store.historyCount)

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>
