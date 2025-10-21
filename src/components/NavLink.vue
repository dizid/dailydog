<template>
  <RouterLink
    :to="to"
    class="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
    :class="[
      isActive
        ? 'bg-gradient-to-r from-puppy-blue to-puppy-purple text-white shadow-puppy'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
    ]"
  >
    <span class="text-lg">{{ icon }}</span>
    <span class="font-medium">{{ label }}</span>
    <span
      v-if="badge"
      class="ml-2 px-2 py-0.5 text-sm rounded-full bg-puppy-yellow text-gray-900 font-bold"
    >
      {{ badge }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

interface Props {
  to: string
  label: string
  icon: string
  badge?: number
}

defineProps<Props>()

const route = useRoute()

const isActive = computed(() => {
  return route.path === (props.to as string)
})

const props = defineProps<Props>()
</script>
