<template>
  <main class="container mx-auto px-4 py-12 min-h-[calc(100vh-80px)]">
    <!-- Header -->
    <div class="mb-12 animate-fade-in">
      <h1 class="text-4xl md:text-5xl font-bold mb-2">📜 Your Dog History</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Dogs you've viewed recently. {{ store.history.length }} in history.
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="store.history.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">📭</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No History Yet!</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Every dog you view will appear here. Start discovering!
      </p>
      <RouterLink to="/" class="puppy-btn-primary inline-flex items-center gap-2">
        <span>🐕</span>
        <span>View Dogs</span>
      </RouterLink>
    </div>

    <!-- History Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <RouterLink
          v-for="(dog, index) in store.history"
          :key="dog.id"
          :to="{ name: 'DogDetail', params: { id: dog.id } }"
          class="card-puppy overflow-hidden group animate-fade-in hover:shadow-puppy-lg transition-all block cursor-pointer"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Image -->
          <div class="relative overflow-hidden bg-gray-200 dark:bg-slate-700 h-64">
            <img
              :src="dog.url"
              :alt="dog.breeds?.[0]?.name || 'Dog'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div class="absolute bottom-4 left-4 px-3 py-1 rounded-full glass-effect text-sm font-semibold">
              {{ dog.breeds?.[0]?.name || 'Unknown' }}
            </div>

            <!-- Favorite Button -->
            <button
              @click.stop.prevent="toggleFavoriteDirect(dog)"
              class="absolute top-4 right-4 w-10 h-10 rounded-full glass-effect flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 active:scale-95"
              :title="isFavoritedDog(dog) ? 'Remove from favorites' : 'Add to favorites'"
            >
              {{ isFavoritedDog(dog) ? '❤️' : '🤍' }}
            </button>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              {{ dog.breeds?.[0]?.name || 'Unknown Breed' }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ dog.breeds?.[0]?.temperament || 'Wonderful companion' }}
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🔍" label="Viewed" :value="store.history.length" />
        <StatCard icon="❤️" label="Favorites" :value="store.favorites.length" />
        <StatCard icon="🎨" label="Breeds Seen" :value="uniqueBreeds" />
        <StatCard icon="🏆" label="Total Explored" :value="`${store.history.length + store.favorites.length}`" />
      </div>

      <!-- Clear Button -->
      <div class="flex justify-center">
        <button
          @click="confirmClear"
          class="puppy-btn-secondary px-8"
        >
          🗑️ Clear History
        </button>
      </div>

      <!-- Confirmation Modal -->
      <div
        v-if="showConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      >
        <div class="card-puppy p-6 max-w-sm">
          <h2 class="text-2xl font-bold mb-4">Clear History?</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            This will remove all {{ store.history.length }} dog(s) from your history. This action cannot be undone!
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="showConfirm = false"
              class="puppy-btn-secondary"
            >
              Cancel
            </button>
            <button
              @click="clearHistory"
              class="puppy-btn bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDogStore } from '@/stores/dog-store'
import type { Dog } from '@/types'
import StatCard from '@/components/StatCard.vue'

const store = useDogStore()
const showConfirm = ref(false)

const uniqueBreeds = computed(() => {
  // Count unique dogs viewed (since breed info may not be available)
  const uniqueDogs = new Set<string>()
  store.history.forEach(dog => {
    if (dog.id) {
      uniqueDogs.add(dog.id)
    }
  })
  return uniqueDogs.size
})

const confirmClear = () => {
  showConfirm.value = true
}

const clearHistory = () => {
  store.clearHistory()
  showConfirm.value = false
}

const isFavoritedDog = (dog: Dog) => {
  return store.isFavorited(dog)
}

const toggleFavoriteDirect = (dog: Dog) => {
  store.toggleFavorite(dog)
}
</script>
