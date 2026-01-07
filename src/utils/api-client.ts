import axios from 'axios'
import type { Dog, EnrichedBreedInfo } from '@/types'

const API_BASE_URL = 'https://api.thedogapi.com/v1'
const API_KEY = import.meta.env.VITE_DOG_API_KEY || ''
const WIKIPEDIA_ACCESS_TOKEN = import.meta.env.VITE_WIKIPEDIA_ACCESS_TOKEN || ''

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

/**
 * Fetch a specific dog by its image ID
 * @param dogId - The dog image ID
 * @returns Promise<Dog | null> - Dog object or null if not found
 */
export async function fetchDogById(dogId: string): Promise<Dog | null> {
  try {
    const response = await apiClient.get<Dog>(`/images/${dogId}`)
    return response.data || null
  } catch (error) {
    console.error('Failed to fetch dog by ID:', error)
    return null
  }
}

/**
 * Fetch enriched breed information directly from Wikipedia API
 * @param breedName - The name of the breed
 * @returns Promise<EnrichedBreedInfo | null> - Enriched info or null on failure
 */
export async function fetchEnrichedBreedInfo(breedName: string): Promise<EnrichedBreedInfo | null> {
  const formattedName = breedName.replace(/\s+/g, '_')

  // Try different Wikipedia article patterns
  const patterns = [
    `${formattedName}_(dog)`,
    `${formattedName}_dog`,
    formattedName,
  ]

  for (const pattern of patterns) {
    try {
      const headers: Record<string, string> = {}
      if (WIKIPEDIA_ACCESS_TOKEN) {
        headers['Authorization'] = `Bearer ${WIKIPEDIA_ACCESS_TOKEN}`
      }
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pattern)}`,
        { headers }
      )

      if (response.data?.extract) {
        const extract = response.data.extract.toLowerCase()
        // Make sure it's about a dog breed
        if (extract.includes('dog') || extract.includes('breed') || extract.includes('canine')) {
          return parseWikipediaToBreedInfo(breedName, response.data.extract)
        }
      }
    } catch {
      // Try next pattern
    }
  }

  // Return fallback info if Wikipedia doesn't have the breed
  return getFallbackBreedInfo(breedName)
}

function parseWikipediaToBreedInfo(breedName: string, extract: string): EnrichedBreedInfo {
  const sentences = extract.split(/(?<=[.!?])\s+/).filter((s: string) => s.length > 10)
  const lowerExtract = extract.toLowerCase()

  return {
    breedName,
    fetchedAt: Date.now(),
    history: sentences.slice(0, 2).join(' ') || `The ${breedName} is a distinguished dog breed with a rich history.`,
    careTips: getCareTips(breedName, lowerExtract),
    healthConcerns: getHealthConcerns(breedName, lowerExtract),
    exerciseNeeds: getExerciseNeeds(breedName, lowerExtract),
    grooming: getGrooming(breedName, lowerExtract),
    trainability: getTrainability(breedName, lowerExtract),
  }
}

function getCareTips(breedName: string, extract: string): string {
  if (extract.includes('active') || extract.includes('energetic')) {
    return `The ${breedName} is an active breed requiring regular exercise and mental stimulation. Provide a balanced diet appropriate for their activity level.`
  }
  if (extract.includes('companion') || extract.includes('lap dog')) {
    return `The ${breedName} thrives on human companionship. Regular grooming, dental care, and quality time with their family are essential.`
  }
  return `Provide fresh water daily, high-quality dog food appropriate for their age and size, and regular veterinary check-ups.`
}

function getHealthConcerns(breedName: string, extract: string): string {
  if (extract.includes('large') || extract.includes('giant')) {
    return `Like many larger breeds, the ${breedName} may be prone to hip dysplasia and joint issues. Regular vet check-ups are important.`
  }
  if (extract.includes('small') || extract.includes('toy')) {
    return `Small breeds like the ${breedName} may be prone to dental issues and patellar luxation. Regular dental care helps maintain health.`
  }
  return `Regular veterinary check-ups help catch any health concerns early. Preventive care including vaccinations and parasite prevention is key.`
}

function getExerciseNeeds(breedName: string, extract: string): string {
  if (extract.includes('hunting') || extract.includes('working') || extract.includes('herding')) {
    return `Originally bred for work, the ${breedName} has high energy levels and needs substantial daily exercise. Long walks or runs are ideal.`
  }
  if (extract.includes('companion') || extract.includes('toy') || extract.includes('lap')) {
    return `The ${breedName} has moderate exercise needs. Daily walks and indoor play sessions are usually sufficient.`
  }
  return `The ${breedName} benefits from 30-60 minutes of exercise daily including walks, playtime, and mental stimulation.`
}

function getGrooming(breedName: string, extract: string): string {
  if (extract.includes('long coat') || extract.includes('long-haired') || extract.includes('fluffy')) {
    return `The ${breedName}'s coat requires regular brushing several times a week to prevent matting. Professional grooming every 6-8 weeks is recommended.`
  }
  if (extract.includes('short coat') || extract.includes('smooth coat') || extract.includes('short-haired')) {
    return `The ${breedName} has a low-maintenance coat that requires weekly brushing. Regular nail trimming and ear cleaning complete their routine.`
  }
  return `Regular brushing, nail trimming, ear cleaning, and dental care are important. Grooming frequency depends on coat type.`
}

function getTrainability(breedName: string, extract: string): string {
  if (extract.includes('intelligent') || extract.includes('eager to please') || extract.includes('trainable')) {
    return `The ${breedName} is known for being highly intelligent and eager to please, making them relatively easy to train.`
  }
  if (extract.includes('independent') || extract.includes('stubborn')) {
    return `The ${breedName} has an independent nature and may require patient, consistent training with high-value rewards.`
  }
  return `The ${breedName} responds well to positive reinforcement training. Consistency and patience are key to success.`
}

function getFallbackBreedInfo(breedName: string): EnrichedBreedInfo {
  return {
    breedName,
    fetchedAt: Date.now(),
    history: `The ${breedName} is a beloved companion dog with a rich heritage and unique characteristics.`,
    careTips: 'Provide fresh water daily, high-quality dog food, and regular veterinary check-ups. Mental stimulation through toys and training is essential.',
    healthConcerns: 'Common concerns vary by breed but may include hip dysplasia, eye conditions, and dental issues. Regular vet visits help catch problems early.',
    exerciseNeeds: 'Most dogs need at least 30-60 minutes of exercise daily including walks, playtime, and mental stimulation activities.',
    grooming: 'Regular brushing, nail trimming, ear cleaning, and dental care are important for all breeds.',
    trainability: 'Positive reinforcement training works well for most dogs. Consistency and patience are key to successful training.',
  }
}

export default apiClient
