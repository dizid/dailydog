import { ref } from 'vue'
import type { Dog } from '@/types'

/**
 * Composable for generating and sharing branded dog cards
 * Creates beautiful shareable images with dog photo + branding
 */
export function useShareCard() {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  /**
   * Generate a branded shareable image from a dog
   * Returns a data URL that can be shared or downloaded
   */
  async function generateShareCard(dog: Dog, streak?: number): Promise<string | null> {
    if (!dog?.url) {
      error.value = 'No dog image available'
      return null
    }

    isGenerating.value = true
    error.value = null

    try {
      // Create canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) throw new Error('Could not get canvas context')

      // Set dimensions (Instagram-friendly 1080x1080 square)
      const size = 1080
      canvas.width = size
      canvas.height = size

      // Background gradient (dark elegant)
      const gradient = ctx.createLinearGradient(0, 0, 0, size)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      // Load dog image
      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = dog.url
      })

      // Calculate image dimensions to fit nicely
      const imgSize = size * 0.72
      const imgX = (size - imgSize) / 2
      const imgY = 80

      // Draw rounded image
      ctx.save()
      ctx.beginPath()
      const radius = 24
      ctx.roundRect(imgX, imgY, imgSize, imgSize, radius)
      ctx.clip()

      // Draw image maintaining aspect ratio
      const aspectRatio = img.width / img.height
      let drawWidth = imgSize
      let drawHeight = imgSize
      let drawX = imgX
      let drawY = imgY

      if (aspectRatio > 1) {
        drawHeight = imgSize / aspectRatio
        drawY = imgY + (imgSize - drawHeight) / 2
      } else {
        drawWidth = imgSize * aspectRatio
        drawX = imgX + (imgSize - drawWidth) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()

      // Subtle border around image
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(imgX, imgY, imgSize, imgSize, radius)
      ctx.stroke()

      // Brand text at bottom
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 42px Inter, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Daily Dog', size / 2, size - 140)

      ctx.font = '28px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText('🐕 A new friend every day', size / 2, size - 90)

      // Streak badge (if provided)
      if (streak && streak > 0) {
        ctx.fillStyle = '#f59e0b'
        ctx.font = 'bold 32px Inter, system-ui, sans-serif'
        ctx.fillText(`🔥 ${streak} day streak`, size / 2, size - 40)
      }

      // Breed name overlay on image
      const breedName = dog.breeds?.[0]?.name || 'Unknown Breed'
      ctx.fillStyle = 'rgba(0,0,0,0.65)'
      ctx.fillRect(imgX + 40, imgY + imgSize - 90, imgSize - 80, 60)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px Inter, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(breedName, size / 2, imgY + imgSize - 50)

      const dataUrl = canvas.toDataURL('image/png', 0.95)
      return dataUrl
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate card'
      return null
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Share the generated card using Web Share API or fallback to download
   */
  async function shareCard(dataUrl: string, breedName: string): Promise<void> {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], `daily-dog-${breedName.toLowerCase().replace(/\s+/g, '-')}.png`, {
        type: 'image/png',
      })

      // Try native share first (mobile)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Daily Dog - ${breedName}`,
          text: 'Check out this adorable dog!',
          files: [file],
        })
        return
      }

      // Fallback: download
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `daily-dog-${breedName.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      // Final fallback: open in new tab
      const link = document.createElement('a')
      link.href = dataUrl
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return {
    isGenerating,
    error,
    generateShareCard,
    shareCard,
  }
}
