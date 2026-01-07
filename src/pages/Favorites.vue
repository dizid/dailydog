<template>
  <main class="container mx-auto px-4 py-12 min-h-[calc(100vh-80px)]">
    <!-- Header -->
    <div class="mb-12 animate-fade-in">
      <h1 class="text-4xl md:text-5xl font-bold mb-2">❤️ Your Favorite Dogs</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Dogs you love most! {{ store.favorites.length }} favorite{{ store.favorites.length !== 1 ? 's' : '' }}.
      </p>
    </div>

    <!-- Empty State -->
    <div v-if="store.favorites.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">😢</div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Favorites Yet!</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Go back and start adding dogs to your favorites collection.
      </p>
      <RouterLink to="/" class="puppy-btn-primary inline-flex items-center gap-2">
        <span>🐕</span>
        <span>Find Your First Favorite</span>
      </RouterLink>
    </div>

    <!-- Favorites Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RouterLink
          v-for="favorite in store.favorites"
          :key="favorite.id"
          :to="{ name: 'DogDetail', params: { id: favorite.dogId } }"
          class="card-puppy overflow-hidden group animate-fade-in block cursor-pointer"
        >
          <!-- Image -->
          <div class="relative overflow-hidden bg-gray-200 dark:bg-slate-700 h-64">
            <img
              :src="favorite.imageUrl"
              :alt="favorite.breed"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <!-- Remove Button -->
            <button
              @click.stop.prevent="store.toggleFavorite({ id: favorite.dogId, url: favorite.imageUrl, breeds: [{ name: favorite.breed }] } as any)"
              class="absolute top-4 right-4 w-10 h-10 rounded-full glass-effect flex items-center justify-center text-lg transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-red-500/20"
              title="Remove from favorites"
            >
              ✕
            </button>

            <div class="absolute bottom-4 left-4 px-3 py-1 rounded-full glass-effect text-sm font-semibold">
              {{ favorite.breed }}
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ favorite.breed }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Added {{ formatDate(favorite.addedAt) }}
            </p>
          </div>
        </RouterLink>
      </div>

      <!-- Clear Button -->
      <div class="flex justify-center">
        <button
          @click="confirmClear"
          class="puppy-btn-secondary px-8"
        >
          🗑️ Clear All Favorites
        </button>
      </div>

      <!-- Confirmation Modal -->
      <div
        v-if="showConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      >
        <div class="card-puppy p-6 max-w-sm">
          <h2 class="text-2xl font-bold mb-4">Are you sure?</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            This will remove all {{ store.favorites.length }} favorite dog(s). This action cannot be undone!
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="showConfirm = false"
              class="puppy-btn-secondary"
            >
              Cancel
            </button>
            <button
              @click="clearFavorites"
              class="puppy-btn bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDogStore } from '@/stores/dog-store'

const store = useDogStore()
const showConfirm = ref(false)

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const confirmClear = () => {
  showConfirm.value = true
}

const clearFavorites = () => {
  store.clearFavorites()
  showConfirm.value = false
}
</script>
