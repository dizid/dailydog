<template>
  <div class="card-puppy p-4 text-center">
    <div class="text-4xl mb-2">{{ icon }}</div>
    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ label }}</h3>
    <p class="text-2xl font-bold bg-gradient-to-r from-puppy-blue to-puppy-purple bg-clip-text text-transparent">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string | number
}

defineProps<Props>()
</script>
