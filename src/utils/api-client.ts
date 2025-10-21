import axios from 'axios'
import type { Dog } from '@/types'

const API_BASE_URL = 'https://api.thedogapi.com/v1'
const API_KEY = import.meta.env.VITE_DOG_API_KEY || ''

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
  },
})

/**
 * Fetch a random dog image with breed information
 * @param retries - Number of retry attempts on failure
 * @returns Promise<Dog> - Dog object with image and breed data
 */
export async function fetchRandomDog(retries = 3): Promise<Dog> {
  try {
    const response = await apiClient.get<Dog[]>('/images/search', {
      params: {
        size: 'large',
        mime_types: 'jpg',
        format: 'json',
        has_breeds: 1,
        order: 'RANDOM',
        limit: 1,
        include_breeds: 1,
      },
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('No dog data received from API')
    }

    const dog = response.data[0]

    // If breeds weren't included, try to fetch them separately
    if (!dog.breeds || dog.breeds.length === 0) {
      try {
        // Extract breed IDs from image data if available
        // Otherwise, get a random breed as fallback
        const breedsResponse = await apiClient.get('/breeds')
        if (breedsResponse.data && breedsResponse.data.length > 0) {
          const randomBreed = breedsResponse.data[Math.floor(Math.random() * breedsResponse.data.length)]
          dog.breeds = [randomBreed]
        }
      } catch (breedError) {
        console.warn('Could not fetch breed information:', breedError)
        // Continue without breed info
      }
    }

    return dog
  } catch (error) {
    if (retries > 0) {
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000))
      return fetchRandomDog(retries - 1)
    }

    console.error('Failed to fetch dog:', error)
    throw new Error('Unable to fetch a dog. Please try again!')
  }
}

/**
 * Fetch multiple random dogs
 * @param count - Number of dogs to fetch
 * @returns Promise<Dog[]> - Array of Dog objects
 */
export async function fetchMultipleDogs(count: number = 5): Promise<Dog[]> {
  try {
    const response = await apiClient.get<Dog[]>('/images/search', {
      params: {
        size: 'large',
        mime_types: 'jpg',
        format: 'json',
        has_breeds: true,
        order: 'RANDOM',
        limit: Math.min(count, 20), // API limit is 20
      },
    })

    return response.data || []
  } catch (error) {
    console.error('Failed to fetch multiple dogs:', error)
    throw new Error('Unable to fetch dogs. Please try again!')
  }
}

export default apiClient
