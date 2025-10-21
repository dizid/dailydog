import type { Context } from '@netlify/functions'

/**
 * Netlify serverless function to proxy The Dog API requests
 * This keeps API keys secure and prevents CORS issues
 *
 * Usage:
 * GET /.netlify/functions/dog?endpoint=/images/search&params=...
 */

export async function handler(req: Request, context: Context) {
  // Only allow GET requests
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.searchParams.get('endpoint') || '/images/search'
    const apiKey = process.env.VITE_DOG_API_KEY

    if (!apiKey) {
      console.error('Missing VITE_DOG_API_KEY environment variable')
      return new Response('API key not configured', { status: 500 })
    }

    // Construct the API URL
    const apiUrl = new URL(`https://api.thedogapi.com/v1${endpoint}`)

    // Forward query parameters (except our internal ones)
    for (const [key, value] of url.searchParams) {
      if (!['endpoint'].includes(key)) {
        apiUrl.searchParams.append(key, value)
      }
    }

    // Make the request to The Dog API
    const response = await fetch(apiUrl.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    })

    // Check if response is ok
    if (!response.ok) {
      console.error(`Dog API error: ${response.status} ${response.statusText}`)
      return new Response('Failed to fetch dog data', { status: response.status })
    }

    const data = await response.json()

    // Return with appropriate headers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
