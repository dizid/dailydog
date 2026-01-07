import type { Context } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

/**
 * Netlify serverless function to fetch comprehensive breed information
 * Uses Claude AI to generate accurate, detailed breed info
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

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      console.error('Missing ANTHROPIC_API_KEY environment variable')
      // Return fallback response
      return new Response(
        JSON.stringify(getFallbackBreedInfo(breedName)),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=604800', // Cache for 1 week
          },
        }
      )
    }

    const client = new Anthropic({ apiKey })

    const prompt = `You are a dog breed expert. Provide comprehensive information about the ${breedName} dog breed in JSON format. Be concise but informative - each field should be 2-3 sentences.

Return ONLY valid JSON with these exact fields:
{
  "breedName": "${breedName}",
  "history": "Brief history and origin of the breed",
  "careTips": "Key care tips for owners",
  "healthConcerns": "Common health issues to watch for",
  "exerciseNeeds": "Exercise requirements and activity level",
  "grooming": "Grooming needs and frequency",
  "trainability": "Training difficulty and tips"
}

If you don't recognize the breed name, still provide your best general dog care advice in each field.`

    const message = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    // Extract text content
    const textContent = message.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI')
    }

    // Parse the JSON response
    const breedInfo: BreedInfoResponse = JSON.parse(textContent.text)

    return new Response(JSON.stringify(breedInfo), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=604800', // Cache for 1 week
      },
    })
  } catch (error) {
    console.error('Function error:', error)

    // Try to extract breed name for fallback
    const url = new URL(req.url)
    const breedName = url.searchParams.get('breed') || 'Unknown Breed'

    return new Response(
      JSON.stringify(getFallbackBreedInfo(breedName)),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600', // Cache fallback for 1 hour
        },
      }
    )
  }
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
