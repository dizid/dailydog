import { computed } from 'vue'
import { useDogStore } from '@/stores/dog-store'

export function useDog() {
  const store = useDogStore()

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

  return {
    currentDog: computed(() => store.currentDog),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    currentBreed,
    dogInfo,
    isFavorited,
    toggleFavorite,
    fetchNewDog: () => store.fetchNewDog(),
  }
}
