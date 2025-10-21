<template>
  <div class="card-puppy overflow-hidden group animate-fade-in">
    <!-- Image Container -->
    <div class="relative overflow-hidden bg-gray-200 dark:bg-slate-700 h-96">
      <img
        v-if="dog?.url"
        :src="dog.url"
        :alt="breed?.name || 'Dog'"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div
        v-else
        class="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center"
      >
        <span class="text-6xl animate-bounce-gentle">🐕</span>
      </div>

      <!-- Favorite Button -->
      <button
        @click="toggleFavorite"
        class="absolute top-4 right-4 w-12 h-12 rounded-full glass-effect flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
      >
        {{ isFavorited ? '❤️' : '🤍' }}
      </button>

      <!-- Badge -->
      <div class="absolute top-4 left-4 px-3 py-1 rounded-full glass-effect text-sm font-semibold">
        🎲 {{ breed?.name || 'Unknown Breed' }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="mb-4">
        <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {{ breed?.name }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 italic">
          {{ breed?.temperament || 'Charming companion' }}
        </p>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <InfoItem icon="⚖️" label="Weight" :value="`${breed?.weight?.metric || 'N/A'} kg`" />
        <InfoItem icon="📏" label="Height" :value="`${breed?.height?.metric || 'N/A'} cm`" />
        <InfoItem icon="🕐" label="Life Span" :value="breed?.life_span || 'N/A'" />
        <InfoItem icon="🎯" label="Bred For" :value="breed?.bred_for || 'N/A'" />
      </div>

      <div v-if="breed?.origin" class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
        <span>🌍</span>
        <span>{{ breed.origin }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Dog } from '@/types'
import InfoItem from './InfoItem.vue'

interface Props {
  dog: Dog | null
  isFavorited?: boolean
}

interface Emits {
  toggle: []
}

const props = withDefaults(defineProps<Props>(), {
  isFavorited: false,
})

defineEmits<Emits>()

const breed = computed(() => {
  if (!props.dog?.breeds || props.dog.breeds.length === 0) {
    return null
  }
  return props.dog.breeds[0]
})

const toggleFavorite = () => {
  emit('toggle')
}

const emit = defineEmits<Emits>()
</script>
