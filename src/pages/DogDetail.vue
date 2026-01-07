<template>
  <main class="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
    <!-- Back Button -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-puppy-blue dark:hover:text-puppy-blue transition-colors"
      >
        <span class="text-xl">&larr;</span>
        <span>Back</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingDog" class="animate-fade-in">
      <div class="max-w-4xl mx-auto">
        <div class="card-puppy overflow-hidden">
          <div class="h-96 bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
          <div class="p-6 space-y-4">
            <div class="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-6xl mb-4">😢</div>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
      <RouterLink to="/" class="puppy-btn-primary">
        Go Home
      </RouterLink>
    </div>

    <!-- Dog Content -->
    <div v-else-if="dog" class="max-w-4xl mx-auto animate-fade-in">
      <!-- Main Card -->
      <div class="card-puppy overflow-hidden mb-8">
        <!-- Image -->
        <div class="relative overflow-hidden bg-gray-200 dark:bg-slate-700 h-96 md:h-[500px]">
          <img
            :src="dog.url"
            :alt="dogInfo?.name || 'Dog'"
            class="w-full h-full object-cover"
          />

          <!-- Favorite Button -->
          <button
            @click="toggleFavorite"
            class="absolute top-4 right-4 w-14 h-14 rounded-full glass-effect flex items-center justify-center text-3xl transition-all duration-200 hover:scale-110 active:scale-95"
            :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
          >
            {{ isFavorited ? '❤️' : '🤍' }}
          </button>

          <!-- Breed Badge -->
          <div class="absolute bottom-4 left-4 px-4 py-2 rounded-full glass-effect text-lg font-semibold">
            🐕 {{ dogInfo?.name || 'Unknown Breed' }}
          </div>
        </div>

        <!-- Dog Info -->
        <div class="p-6 md:p-8">
          <!-- Title & Temperament -->
          <div class="mb-6">
            <h1 class="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              {{ dogInfo?.name || 'Unknown Breed' }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 italic">
              {{ dogInfo?.temperament || 'A wonderful companion' }}
            </p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <InfoItem icon="⚖️" label="Weight" :value="`${dogInfo?.weight || 'N/A'} kg`" />
            <InfoItem icon="📏" label="Height" :value="`${dogInfo?.height || 'N/A'} cm`" />
            <InfoItem icon="🕐" label="Life Span" :value="dogInfo?.lifeSpan || 'N/A'" />
            <InfoItem icon="🌍" label="Origin" :value="dogInfo?.origin || 'N/A'" />
          </div>

          <!-- Bred For -->
          <div v-if="dogInfo?.bredFor && dogInfo.bredFor !== 'Unknown'" class="mb-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">Bred For:</span>
            <p class="text-gray-700 dark:text-gray-300">{{ dogInfo.bredFor }}</p>
          </div>
        </div>
      </div>

      <!-- Enriched Breed Info Section -->
      <div class="card-puppy p-6 md:p-8">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <span>📚</span>
          <span>About This Breed</span>
        </h2>

        <!-- Loading Skeleton -->
        <div v-if="isLoadingEnrichment" class="space-y-6">
          <div v-for="i in 6" :key="i" class="space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>

        <!-- Enriched Content -->
        <div v-else-if="enrichedInfo" class="space-y-6">
          <BreedInfoSection icon="📖" title="History" :content="enrichedInfo.history" />
          <BreedInfoSection icon="💡" title="Care Tips" :content="enrichedInfo.careTips" />
          <BreedInfoSection icon="🏥" title="Health Concerns" :content="enrichedInfo.healthConcerns" />
          <BreedInfoSection icon="🏃" title="Exercise Needs" :content="enrichedInfo.exerciseNeeds" />
          <BreedInfoSection icon="✨" title="Grooming" :content="enrichedInfo.grooming" />
          <BreedInfoSection icon="🎓" title="Trainability" :content="enrichedInfo.trainability" />
        </div>

        <!-- Fallback when no enrichment -->
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Breed information is being loaded...</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useDogDetail } from '@/composables/use-dog-detail'
import InfoItem from '@/components/InfoItem.vue'
import BreedInfoSection from '@/components/BreedInfoSection.vue'

const route = useRoute()
const router = useRouter()

const dogId = route.params.id as string

const {
  dog,
  dogInfo,
  enrichedInfo,
  isLoadingDog,
  isLoadingEnrichment,
  error,
  isFavorited,
  toggleFavorite,
} = useDogDetail(dogId)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
