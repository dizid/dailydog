<template>
  <div
    v-if="message"
    class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm card-puppy bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 animate-slide-up z-50"
  >
    <div class="p-4 flex items-start gap-3">
      <span class="text-2xl flex-shrink-0">🎉</span>
      <div class="flex-1">
        <h3 class="font-semibold text-green-900 dark:text-green-300">{{ title }}</h3>
        <p class="text-sm text-green-800 dark:text-green-400">{{ message }}</p>
      </div>
      <button
        @click="$emit('close')"
        class="flex-shrink-0 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string | null
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Success!',
})

defineEmits<{ close: [] }>()
</script>
