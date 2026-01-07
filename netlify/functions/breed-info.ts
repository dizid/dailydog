import type { Context } from '@netlify/functions'

/**
 * Netlify serverless function to fetch comprehensive breed information
 * Uses Wikipedia API (free, no auth required)
 *
 * Usage:
 * GET /.netlify/functions/breed-info?breed=Golden%20Retriever
 */

interface BreedInfoResponse {
  breedName: string
  history: string
  careTips: string
  healthConcerns: string
  exerciseNeeds: string
  grooming: string
  trainability: string
}

interface WikiSummary {
  title: string
  extract: string
  description?: string
}

export async function handler(req: Request, context: Context) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const url = new URL(req.url)
    const breedName = url.searchParams.get('breed')

    if (!breedName) {
      return new Response(
        JSON.stringify({ error: 'Missing breed parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Try to fetch from Wikipedia
    const wikiInfo = await fetchWikipediaInfo(breedName)

    if (wikiInfo) {
      return new Response(JSON.stringify(wikiInfo), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'public, max-age=604800', // Cache for 1 week
        },
      })
    }

    // Fallback to static response
    return new Response(
      JSON.stringify(getFallbackBreedInfo(breedName)),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=604800',
        },
      }
    )
  } catch (error) {
    console.error('Function error:', error)

    const url = new URL(req.url)
    const breedName = url.searchParams.get('breed') || 'Unknown Breed'

    return new Response(
      JSON.stringify(getFallbackBreedInfo(breedName)),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    )
  }
}

async function fetchWikipediaInfo(breedName: string): Promise<BreedInfoResponse | null> {
  // Format breed name for Wikipedia URL (e.g., "Golden Retriever" -> "Golden_Retriever")
  const formattedName = breedName.replace(/\s+/g, '_')

  // Try different Wikipedia article patterns
  const patterns = [
    `${formattedName}_(dog)`,
    `${formattedName}_dog`,
    formattedName,
  ]

  for (const pattern of patterns) {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pattern)}`,
        {
          headers: {
            'User-Agent': 'DailyDog/2.0 (https://dailydog.app; contact@dailydog.app)',
          },
        }
      )

      if (response.ok) {
        const data: WikiSummary = await response.json()

        // Make sure it's about a dog breed
        const extract = data.extract?.toLowerCase() || ''
        if (extract.includes('dog') || extract.includes('breed') || extract.includes('canine')) {
          return parseWikipediaToBreedInfo(breedName, data)
        }
      }
    } catch (err) {
      console.error(`Wikipedia fetch failed for pattern ${pattern}:`, err)
    }
  }

  return null
}

function parseWikipediaToBreedInfo(breedName: string, wiki: WikiSummary): BreedInfoResponse {
  const extract = wiki.extract || ''

  // Split extract into sentences for distribution
  const sentences = extract.split(/(?<=[.!?])\s+/).filter(s => s.length > 10)

  return {
    breedName,
    history: sentences.slice(0, 2).join(' ') || `The ${breedName} is a distinguished dog breed with a rich history.`,
    careTips: getBreedSpecificCareTips(breedName, extract),
    healthConcerns: getBreedSpecificHealth(breedName, extract),
    exerciseNeeds: getBreedSpecificExercise(breedName, extract),
    grooming: getBreedSpecificGrooming(breedName, extract),
    trainability: getBreedSpecificTrainability(breedName, extract),
  }
}

function getBreedSpecificCareTips(breedName: string, extract: string): string {
  const lowerExtract = extract.toLowerCase()

  if (lowerExtract.includes('active') || lowerExtract.includes('energetic')) {
    return `The ${breedName} is an active breed requiring regular exercise and mental stimulation. Provide a balanced diet appropriate for their activity level and ensure they have plenty of space to move.`
  }
  if (lowerExtract.includes('companion') || lowerExtract.includes('lap dog')) {
    return `The ${breedName} thrives on human companionship and does well in various living situations. Regular grooming, dental care, and quality time with their family are essential.`
  }
  return `Provide fresh water daily, high-quality dog food appropriate for their age and size, and regular veterinary check-ups. The ${breedName} benefits from mental stimulation through toys and training.`
}

function getBreedSpecificHealth(breedName: string, extract: string): string {
  const lowerExtract = extract.toLowerCase()

  if (lowerExtract.includes('large') || lowerExtract.includes('giant')) {
    return `Like many larger breeds, the ${breedName} may be prone to hip dysplasia and joint issues. Regular vet check-ups and maintaining a healthy weight are important for their wellbeing.`
  }
  if (lowerExtract.includes('small') || lowerExtract.includes('toy')) {
    return `Small breeds like the ${breedName} may be prone to dental issues and patellar luxation. Regular dental care and gentle exercise help maintain their health.`
  }
  return `Regular veterinary check-ups help catch any health concerns early. The ${breedName} benefits from preventive care including vaccinations, dental cleaning, and parasite prevention.`
}

function getBreedSpecificExercise(breedName: string, extract: string): string {
  const lowerExtract = extract.toLowerCase()

  if (lowerExtract.includes('hunting') || lowerExtract.includes('working') || lowerExtract.includes('herding')) {
    return `Originally bred for work, the ${breedName} has high energy levels and needs substantial daily exercise. Long walks, runs, or activities that engage their natural instincts are ideal.`
  }
  if (lowerExtract.includes('companion') || lowerExtract.includes('toy') || lowerExtract.includes('lap')) {
    return `The ${breedName} has moderate exercise needs. Daily walks and indoor play sessions are usually sufficient to keep them healthy and happy.`
  }
  return `The ${breedName} benefits from 30-60 minutes of exercise daily. This can include walks, playtime, and activities that provide mental stimulation.`
}

function getBreedSpecificGrooming(breedName: string, extract: string): string {
  const lowerExtract = extract.toLowerCase()

  if (lowerExtract.includes('long coat') || lowerExtract.includes('long-haired') || lowerExtract.includes('fluffy')) {
    return `The ${breedName}'s coat requires regular brushing, ideally several times a week, to prevent matting and tangles. Professional grooming every 6-8 weeks is recommended.`
  }
  if (lowerExtract.includes('short coat') || lowerExtract.includes('smooth coat') || lowerExtract.includes('short-haired')) {
    return `The ${breedName} has a low-maintenance coat that requires weekly brushing to remove loose hair. Regular nail trimming and ear cleaning complete their grooming routine.`
  }
  return `Regular brushing, nail trimming, ear cleaning, and dental care are important for the ${breedName}. Grooming frequency depends on their coat type and activity level.`
}

function getBreedSpecificTrainability(breedName: string, extract: string): string {
  const lowerExtract = extract.toLowerCase()

  if (lowerExtract.includes('intelligent') || lowerExtract.includes('eager to please') || lowerExtract.includes('trainable')) {
    return `The ${breedName} is known for being highly intelligent and eager to please, making them relatively easy to train. Positive reinforcement methods work exceptionally well.`
  }
  if (lowerExtract.includes('independent') || lowerExtract.includes('stubborn')) {
    return `The ${breedName} has an independent nature and may require patient, consistent training. Short, engaging sessions with high-value rewards yield the best results.`
  }
  return `The ${breedName} responds well to positive reinforcement training. Consistency and patience are key, and early socialization helps develop a well-rounded companion.`
}

function getFallbackBreedInfo(breedName: string): BreedInfoResponse {
  return {
    breedName,
    history: `The ${breedName} is a beloved companion dog with a rich heritage. Each breed has unique origins that shape their temperament and characteristics.`,
    careTips: 'Provide fresh water daily, high-quality dog food appropriate for their age and size, and regular veterinary check-ups. Mental stimulation through toys and training is also essential.',
    healthConcerns: 'Common concerns vary by breed but may include hip dysplasia, eye conditions, and dental issues. Regular vet visits help catch problems early.',
    exerciseNeeds: 'Most dogs need at least 30-60 minutes of exercise daily. This can include walks, playtime, and mental stimulation activities.',
    grooming: 'Grooming needs vary by coat type. Regular brushing, nail trimming, ear cleaning, and dental care are important for all breeds.',
    trainability: 'Positive reinforcement training works well for most dogs. Consistency and patience are key to successful training outcomes.',
  }
}
