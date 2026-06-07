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
          <!-- Streak Badge -->
          <div
            v-if="streakDisplay > 0"
            :class="[
              'ml-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border transition-all duration-500',
              streakJustIncreased
                ? 'bg-amber-400/30 text-amber-500 dark:text-amber-300 border-amber-400/50 scale-110'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            ]"
            :title="streakMessage"
          >
            🔥 {{ streakDisplay }}
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

  <!-- Streak Celebration Toast -->
  <Transition name="streak-toast">
    <div
      v-if="showStreakToast"
      class="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl glass-effect border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold text-sm shadow-lg"
    >
      {{ streakToastMessage }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useDogStore } from '@/stores/dog-store'
import { useStreak } from '@/composables/use-streak'
import NavLink from './NavLink.vue'
import MobileNavLink from './MobileNavLink.vue'

const store = useDogStore()
const showMobileMenu = ref(false)
const showStreakToast = ref(false)
const streakJustIncreased = ref(false)
const streakToastMessage = ref('')

const { initializeStreak, streakDisplay, getStreakMessage } = useStreak()

const streakMessage = computed(() => getStreakMessage())
const favoriteCount = computed(() => store.favoriteCount)
const historyCount = computed(() => store.historyCount)

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

onMounted(() => {
  const { streakIncreased, currentStreak } = initializeStreak()

  if (streakIncreased && currentStreak > 1) {
    streakJustIncreased.value = true
    streakToastMessage.value = getStreakMessage()
    showStreakToast.value = true

    setTimeout(() => {
      showStreakToast.value = false
      streakJustIncreased.value = false
    }, 3000)
  }
})
</script>

<style scoped>
.streak-toast-enter-active,
.streak-toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.streak-toast-enter-from,
.streak-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
