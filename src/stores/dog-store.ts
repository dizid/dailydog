import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Dog, FavoriteDog, EnrichedBreedInfo } from '@/types'
import { fetchRandomDog, fetchMultipleDogs } from '@/utils/api-client'

const STORAGE_KEY_FAVORITES = 'dailydog_favorites'
const STORAGE_KEY_HISTORY = 'dailydog_history'
const STORAGE_KEY_BREED_CACHE = 'dailydog_breed_cache'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export const useDogStore = defineStore('dog', () => {
  // State
  const currentDog = ref<Dog | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const favorites = ref<FavoriteDog[]>([])
  const history = ref<Dog[]>([])
  const isDarkMode = ref(false)
  const enrichedBreedCache = ref<Record<string, EnrichedBreedInfo>>({})

  // Load persisted data from localStorage
  const loadPersistedData = () => {
    try {
      const savedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES)
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY)
      if (savedHistory) {
        history.value = JSON.parse(savedHistory)
      }

      const savedTheme = localStorage.getItem('theme')
      isDarkMode.value = savedTheme === 'dark'
      applyTheme()

      const savedBreedCache = localStorage.getItem(STORAGE_KEY_BREED_CACHE)
      if (savedBreedCache) {
        enrichedBreedCache.value = JSON.parse(savedBreedCache)
      }
    } catch (err) {
      console.error('Error loading persisted data:', err)
    }
  }

  // Save favorites to localStorage
  const persistFavorites = () => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites.value))
  }

  // Save history to localStorage
  const persistHistory = () => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.value))
  }

  // Apply theme to document
  const applyTheme = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Actions
  const fetchNewDog = async () => {
    isLoading.value = true
    error.value = null

    try {
      const dog = await fetchRandomDog()
      currentDog.value = dog

      // Add to history
      if (!history.value.some(d => d.id === dog.id)) {
        history.value.unshift(dog)
        // Keep only last 20 dogs in history
        if (history.value.length > 20) {
          history.value.pop()
        }
        persistHistory()
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      currentDog.value = null
    } finally {
      isLoading.value = false
    }
  }

  const toggleFavorite = (dog: Dog) => {
    if (!dog || !dog.id) {
      return
    }

    const favoriteIndex = favorites.value.findIndex(
      f => f.dogId === dog.id
    )

    if (favoriteIndex > -1) {
      // Remove from favorites
      favorites.value.splice(favoriteIndex, 1)
    } else {
      // Add to favorites
      const breedName = dog.breeds && dog.breeds.length > 0
        ? dog.breeds[0].name
        : 'Unknown Breed'

      favorites.value.push({
        id: `fav_${Date.now()}`,
        dogId: dog.id,
        imageUrl: dog.url,
        breed: breedName,
        addedAt: Date.now(),
      })
    }

    persistFavorites()
  }

  const clearHistory = () => {
    history.value = []
    persistHistory()
  }

  const clearFavorites = () => {
    favorites.value = []
    persistFavorites()
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme()
  }

  // Get a dog by ID from current dog or history
  const getDogById = (dogId: string): Dog | null => {
    if (currentDog.value?.id === dogId) {
      return currentDog.value
    }
    return history.value.find(d => d.id === dogId) || null
  }

  // Get a favorite by dog ID
  const getFavoriteByDogId = (dogId: string): FavoriteDog | null => {
    return favorites.value.find(f => f.dogId === dogId) || null
  }

  // Get cached enriched breed info (checks expiry)
  const getEnrichedBreedInfo = (breedName: string): EnrichedBreedInfo | null => {
    const key = breedName.toLowerCase()
    const cached = enrichedBreedCache.value[key]
    if (!cached) return null

    // Check if cache is expired
    if (Date.now() - cached.fetchedAt > CACHE_DURATION) {
      return null
    }
    return cached
  }

  // Cache enriched breed info
  const cacheEnrichedBreedInfo = (info: EnrichedBreedInfo) => {
    if (!info?.breedName) return // Guard against undefined
    const key = info.breedName.toLowerCase()
    enrichedBreedCache.value[key] = {
      ...info,
      fetchedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY_BREED_CACHE, JSON.stringify(enrichedBreedCache.value))
  }

  // Computed
  const isFavorited = computed(
    () => (dog: Dog) => favorites.value.some(f => f.dogId === dog.id)
  )

  const favoriteCount = computed(() => favorites.value.length)
  const historyCount = computed(() => history.value.length)

  // Initialize
  loadPersistedData()

  return {
    currentDog,
    isLoading,
    error,
    favorites,
    history,
    isDarkMode,
    enrichedBreedCache,
    fetchNewDog,
    toggleFavorite,
    isFavorited,
    favoriteCount,
    historyCount,
    clearHistory,
    clearFavorites,
    toggleDarkMode,
    getDogById,
    getFavoriteByDogId,
    getEnrichedBreedInfo,
    cacheEnrichedBreedInfo,
  }
})
