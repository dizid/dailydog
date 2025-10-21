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
        has_breeds: true,
        order: 'RANDOM',
        limit: 1,
      },
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('No dog data received from API')
    }

    return response.data[0]
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
