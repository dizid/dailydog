import { ref, onMounted } from 'vue'

/**
 * PWA support composable
 * Handles service worker registration and installation prompts
 */

export function usePWA() {
  const isInstallable = ref(false)
  const isInstalled = ref(false)
  let deferredPrompt: BeforeInstallPromptEvent | null = null

  onMounted(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt = e as BeforeInstallPromptEvent
      isInstallable.value = true
    })

    // Listen for install success
    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt = null
    })
  })

  const installApp = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to install prompt: ${outcome}`)
    deferredPrompt = null
    isInstallable.value = false
  }

  return {
    isInstallable,
    isInstalled,
    installApp,
  }
}

// Type definitions
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed'
    }>
  }
}
