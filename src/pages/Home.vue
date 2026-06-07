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
          @share="handleShare"
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

      <!-- Breed Info Section -->
      <div v-if="!isLoading && currentDog" class="mt-8">
        <div class="card-puppy p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span>📚</span>
            <span>About This Breed</span>
          </h2>

          <!-- Loading Skeleton -->
          <div v-if="isLoadingEnrichment" class="space-y-4">
            <div v-for="i in 4" :key="i" class="space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 animate-pulse"></div>
              <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
            </div>
          </div>

          <!-- Enriched Content -->
          <div v-else-if="enrichedInfo" class="space-y-4">
            <BreedInfoSection icon="📖" title="History" :content="enrichedInfo.history" />
            <BreedInfoSection icon="💡" title="Care Tips" :content="enrichedInfo.careTips" />
            <BreedInfoSection icon="🏥" title="Health" :content="enrichedInfo.healthConcerns" />
            <BreedInfoSection icon="🏃" title="Exercise" :content="enrichedInfo.exerciseNeeds" />
            <BreedInfoSection icon="✨" title="Grooming" :content="enrichedInfo.grooming" />
            <BreedInfoSection icon="🎓" title="Training" :content="enrichedInfo.trainability" />
          </div>

          <!-- Fallback -->
          <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>Loading breed information...</p>
          </div>
        </div>
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
      <StatCard icon="🐕" label="Explored" :value="store.historyCount + store.favoriteCount" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useDog } from '@/composables/use-dog'
import { useDogStore } from '@/stores/dog-store'
import { useShareCard } from '@/composables/use-share-card'
import { useStreak } from '@/composables/use-streak'
import DogCard from '@/components/DogCard.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import StatCard from '@/components/StatCard.vue'
import BreedInfoSection from '@/components/BreedInfoSection.vue'

const store = useDogStore()
const {
  currentDog,
  isLoading,
  error,
  isFavorited,
  toggleFavorite,
  fetchNewDog,
  enrichedInfo,
  isLoadingEnrichment,
} = useDog()

const { generateShareCard, shareCard } = useShareCard()
// streakDisplay is read-only here; Header.vue owns initializeStreak()
const { streakDisplay } = useStreak()

async function handleShare() {
  if (!currentDog.value) return
  const dataUrl = await generateShareCard(currentDog.value, streakDisplay.value)
  if (dataUrl) {
    const breedName = currentDog.value.breeds?.[0]?.name ?? 'dog'
    await shareCard(dataUrl, breedName)
  }
}

// Fetch initial dog on mount
if (!currentDog.value) {
  fetchNewDog()
}
</script>
