<template>
  <div
    v-if="message"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm card-puppy bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 animate-slide-up z-50"
  >
    <div class="p-4 flex items-start gap-3">
      <span class="text-2xl flex-shrink-0">😢</span>
      <div class="flex-1">
        <h3 class="font-semibold text-red-900 dark:text-red-300">Oops!</h3>
        <p class="text-sm text-red-800 dark:text-red-400">{{ message }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string | null
}

defineProps<Props>()
defineEmits<{ close: [] }>()
</script>
