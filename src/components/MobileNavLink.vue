<template>
  <RouterLink
    :to="to"
    class="flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 w-full"
    :class="[
      isActive
        ? 'bg-gradient-to-r from-puppy-blue to-puppy-purple text-white shadow-puppy'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
    ]"
    @click="$emit('click')"
  >
    <span class="text-lg">{{ icon }}</span>
    <span class="font-medium flex-1">{{ label }}</span>
    <span
      v-if="badge"
      class="px-2 py-0.5 text-xs rounded-full bg-puppy-yellow text-gray-900 font-bold"
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

const props = defineProps<Props>()
defineEmits<{ click: [] }>()

const route = useRoute()

const isActive = computed(() => {
  return route.path === props.to
})
</script>
