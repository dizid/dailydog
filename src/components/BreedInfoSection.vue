<template>
  <div class="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0 last:pb-0">
    <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">
      <span>{{ icon }}</span>
      <span>{{ title }}</span>
    </h3>
    <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
      {{ content }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  content: string
}

defineProps<Props>()
</script>
