import { ref, computed } from 'vue'

const STORAGE_KEY_STREAK = 'dailydog_streak'
const STORAGE_KEY_LAST_VISIT = 'dailydog_last_visit'

interface StreakData {
  currentStreak: number
  lastVisitDate: string // YYYY-MM-DD
  longestStreak: number
}

/**
 * Composable for tracking daily usage streaks
 * Provides habit-forming daily engagement tracking
 */
export function useStreak() {
  const currentStreak = ref(0)
  const longestStreak = ref(0)
  const hasCheckedToday = ref(false)

  /**
   * Load streak data from localStorage
   */
  function loadStreakData(): StreakData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK)
      const lastVisit = localStorage.getItem(STORAGE_KEY_LAST_VISIT)

      if (saved && lastVisit) {
        const data: StreakData = JSON.parse(saved)
        return {
          currentStreak: data.currentStreak || 0,
          lastVisitDate: lastVisit,
          longestStreak: data.longestStreak || 0,
        }
      }
    } catch (err) {
      console.error('Error loading streak data:', err)
    }

    return {
      currentStreak: 0,
      lastVisitDate: '',
      longestStreak: 0,
    }
  }

  /**
   * Save streak data to localStorage
   */
  function saveStreakData(data: StreakData) {
    localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(data))
    localStorage.setItem(STORAGE_KEY_LAST_VISIT, data.lastVisitDate)
  }

  /**
   * Get today's date as YYYY-MM-DD string
   */
  function getTodayString(): string {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  /**
   * Check if two dates are consecutive days
   */
  function areConsecutiveDays(date1: string, date2: string): boolean {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1
  }

  /**
   * Initialize and update streak on app load
   * Call this once when the app starts
   */
  function initializeStreak(): { streakIncreased: boolean; currentStreak: number } {
    const data = loadStreakData()
    const today = getTodayString()
    let streakIncreased = false

    if (!data.lastVisitDate) {
      // First time user
      currentStreak.value = 1
      longestStreak.value = 1
      streakIncreased = true
    } else if (data.lastVisitDate === today) {
      // Already visited today
      currentStreak.value = data.currentStreak
      longestStreak.value = data.longestStreak
      hasCheckedToday.value = true
    } else if (areConsecutiveDays(data.lastVisitDate, today)) {
      // Consecutive day — increase streak
      currentStreak.value = data.currentStreak + 1
      longestStreak.value = Math.max(currentStreak.value, data.longestStreak)
      streakIncreased = true
    } else {
      // Streak broken
      currentStreak.value = 1
      longestStreak.value = data.longestStreak
      streakIncreased = true
    }

    // Save updated data
    const newData: StreakData = {
      currentStreak: currentStreak.value,
      lastVisitDate: today,
      longestStreak: longestStreak.value,
    }
    saveStreakData(newData)

    return { streakIncreased, currentStreak: currentStreak.value }
  }

  /**
   * Get a friendly streak message
   */
  function getStreakMessage(): string {
    if (currentStreak.value === 0) return 'Start your streak today!'
    if (currentStreak.value === 1) return 'Great start! Come back tomorrow.'
    if (currentStreak.value < 7) return `${currentStreak.value} days strong!`
    if (currentStreak.value < 30) return `Amazing! ${currentStreak.value} day streak!`
    return `Legend! ${currentStreak.value} day streak! 🏆`
  }

  const streakDisplay = computed(() => currentStreak.value)

  return {
    currentStreak,
    longestStreak,
    hasCheckedToday,
    initializeStreak,
    getStreakMessage,
    streakDisplay,
  }
}
