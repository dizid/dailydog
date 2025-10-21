<template>
  <main class="container mx-auto px-4 py-12 min-h-[calc(100vh-80px)]">
    <!-- Welcome Section -->
    <div class="text-center mb-12 animate-fade-in">
      <div class="text-6xl md:text-7xl mb-4 animate-bounce-gentle">🐕</div>
      <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-puppy-blue via-puppy-purple to-puppy-pink bg-clip-text text-transparent">
        Welcome to Daily Dog!
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Every day brings a new furry friend! Discover adorable dogs, learn fascinating breed facts, and collect your favorites. 🎉
      </p>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto mb-12">
      <div v-if="isLoading" class="animate-fade-in">
        <LoadingSkeleton />
      </div>

      <div v-else-if="currentDog" class="animate-fade-in">
        <DogCard
          :dog="currentDog"
          :isFavorited="isFavorited"
          @toggle="toggleFavorite"
        />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Let's find you a dog! 🐶
        </p>
        <button
          @click="fetchNewDog"
          class="puppy-btn-primary"
        >
          🎲 Get Daily Dog
        </button>
      </div>

      <!-- Action Buttons -->
      <div v-if="!isLoading && currentDog" class="flex gap-4 justify-center mt-8 flex-wrap">
        <button
          @click="fetchNewDog"
          class="puppy-btn-primary flex items-center gap-2"
          :disabled="isLoading"
        >
          <span>🔄</span>
          <span>Next Dog</span>
        </button>

        <button
          @click="toggleFavorite"
          :class="[
            'puppy-btn',
            isFavorited
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white hover:border-gray-400'
          ]"
        >
          <span>{{ isFavorited ? '❤️ Favorited' : '🤍 Favorite' }}</span>
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <ErrorAlert
      :message="error"
      @close="() => {}"
    />

    <!-- Quick Stats -->
    <div class="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
      <StatCard icon="❤️" label="Favorites" :value="store.favoriteCount" />
      <StatCard icon="📜" label="Viewed" :value="store.historyCount" />
      <StatCard icon="🐕" label="Breeds" value="Countless" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useDog } from '@/composables/use-dog'
import { useDogStore } from '@/stores/dog-store'
import DogCard from '@/components/DogCard.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import StatCard from '@/components/StatCard.vue'

const store = useDogStore()
const {
  currentDog,
  isLoading,
  error,
  isFavorited,
  toggleFavorite,
  fetchNewDog,
} = useDog()

// Fetch initial dog on mount
if (!currentDog.value) {
  fetchNewDog()
}
</script>
