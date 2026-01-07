import { ref, computed, watch, onMounted } from 'vue'
import { useDogStore } from '@/stores/dog-store'
import { fetchDogById, fetchEnrichedBreedInfo } from '@/utils/api-client'
import type { Dog, EnrichedBreedInfo, Breed } from '@/types'

export function useDogDetail(dogId: string) {
  const store = useDogStore()

  // State
  const dog = ref<Dog | null>(null)
  const enrichedInfo = ref<EnrichedBreedInfo | null>(null)
  const isLoadingDog = ref(true)
  const isLoadingEnrichment = ref(false)
  const error = ref<string | null>(null)

  // Get the primary breed from the dog
  const breed = computed<Breed | null>(() => {
    if (!dog.value?.breeds || dog.value.breeds.length === 0) {
      return null
    }
    return dog.value.breeds[0]
  })

  // Format dog info for display
  const dogInfo = computed(() => {
    if (!breed.value) return null

    return {
      name: breed.value.name || 'Unknown Breed',
      temperament: breed.value.temperament || 'Unknown',
      weight: breed.value.weight?.metric || 'Unknown',
      height: breed.value.height?.metric || 'Unknown',
      lifeSpan: breed.value.life_span || 'Unknown',
      bredFor: breed.value.bred_for || 'Unknown',
      origin: breed.value.origin || 'Unknown',
    }
  })

  // Check if the dog is favorited
  const isFavorited = computed(() => {
    if (!dog.value) return false
    return store.favorites.some(f => f.dogId === dog.value!.id)
  })

  // Toggle favorite status
  const toggleFavorite = () => {
    if (dog.value) {
      store.toggleFavorite(dog.value)
    }
  }

  // Resolve dog from various sources
  const resolveDog = async (): Promise<Dog | null> => {
    // 1. Check current dog
    if (store.currentDog?.id === dogId) {
      return store.currentDog
    }

    // 2. Check history (full Dog objects)
    const fromHistory = store.history.find(d => d.id === dogId)
    if (fromHistory) {
      return fromHistory
    }

    // 3. Check favorites and construct partial dog while fetching full data
    const favorite = store.favorites.find(f => f.dogId === dogId)
    if (favorite) {
      // Return a partial dog immediately
      const partialDog: Dog = {
        id: favorite.dogId,
        url: favorite.imageUrl,
        breeds: [{ name: favorite.breed } as Breed],
        width: 0,
        height: 0,
      }

      // Fetch full data from API in background
      fetchDogById(dogId).then(fullDog => {
        if (fullDog) {
          dog.value = fullDog
        }
      })

      return partialDog
    }

    // 4. Fetch from API
    return await fetchDogById(dogId)
  }

  // Fetch enriched breed info
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
      if (info) {
        // Add fetchedAt timestamp and cache it
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

  // Initialize - load dog data
  const init = async () => {
    isLoadingDog.value = true
    error.value = null

    try {
      const resolvedDog = await resolveDog()
      if (resolvedDog) {
        dog.value = resolvedDog

        // Auto-fetch enriched info if we have a breed
        if (resolvedDog.breeds && resolvedDog.breeds.length > 0) {
          fetchEnrichment(resolvedDog.breeds[0].name)
        }
      } else {
        error.value = 'Dog not found'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load dog'
    } finally {
      isLoadingDog.value = false
    }
  }

  // Watch for breed changes to fetch enrichment
  watch(breed, (newBreed) => {
    if (newBreed?.name && !enrichedInfo.value) {
      fetchEnrichment(newBreed.name)
    }
  })

  // Initialize on mount
  onMounted(init)

  return {
    dog,
    breed,
    dogInfo,
    enrichedInfo,
    isLoadingDog,
    isLoadingEnrichment,
    error,
    isFavorited,
    toggleFavorite,
    refetch: init,
  }
}
