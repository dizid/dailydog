import { computed, ref, watch } from 'vue'
import { useDogStore } from '@/stores/dog-store'
import { fetchEnrichedBreedInfo } from '@/utils/api-client'
import type { EnrichedBreedInfo } from '@/types'

export function useDog() {
  const store = useDogStore()
  const enrichedInfo = ref<EnrichedBreedInfo | null>(null)
  const isLoadingEnrichment = ref(false)

  const currentBreed = computed(() => {
    if (!store.currentDog?.breeds || store.currentDog.breeds.length === 0) {
      return null
    }
    return store.currentDog.breeds[0]
  })

  const dogInfo = computed(() => {
    if (!currentBreed.value) return null

    return {
      name: currentBreed.value.name,
      temperament: currentBreed.value.temperament,
      weight: currentBreed.value.weight?.metric || 'Unknown',
      height: currentBreed.value.height?.metric || 'Unknown',
      lifeSpan: currentBreed.value.life_span || 'Unknown',
      bredFor: currentBreed.value.bred_for || 'Unknown',
      origin: currentBreed.value.origin || 'Unknown',
    }
  })

  const isFavorited = computed(() => {
    if (!store.currentDog) return false
    return store.isFavorited(store.currentDog)
  })

  const toggleFavorite = () => {
    if (store.currentDog) {
      store.toggleFavorite(store.currentDog)
    }
  }

  const fetchEnrichment = async (breedName: string) => {
    if (!breedName || breedName === 'Unknown Breed') return

    // Check cache first
    const cached = store.getEnrichedBreedInfo(breedName)
    if (cached) {
      enrichedInfo.value = cached
      return
    }

    // Fetch from API
    isLoadingEnrichment.value = true
    try {
      const info = await fetchEnrichedBreedInfo(breedName)
      if (info && info.breedName) {
        const enrichedWithTimestamp = {
          ...info,
          fetchedAt: Date.now(),
        }
        store.cacheEnrichedBreedInfo(enrichedWithTimestamp)
        enrichedInfo.value = enrichedWithTimestamp
      }
    } catch (err) {
      console.error('Failed to fetch enriched breed info:', err)
    } finally {
      isLoadingEnrichment.value = false
    }
  }

  // Watch for breed changes to fetch enrichment
  watch(currentBreed, (newBreed) => {
    if (newBreed?.name) {
      fetchEnrichment(newBreed.name)
    } else {
      enrichedInfo.value = null
    }
  }, { immediate: true })

  return {
    currentDog: computed(() => store.currentDog),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    currentBreed,
    dogInfo,
    enrichedInfo,
    isLoadingEnrichment,
    isFavorited,
    toggleFavorite,
    fetchNewDog: () => store.fetchNewDog(),
  }
}
