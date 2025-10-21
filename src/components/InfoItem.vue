<template>
  <div class="flex flex-col">
    <div class="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
      <span class="text-lg">{{ icon }}</span>
      <span>{{ label }}</span>
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string
}

defineProps<Props>()
</script>
