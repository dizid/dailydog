<template>
  <div class="card-puppy overflow-hidden">
    <!-- Image Skeleton -->
    <div class="w-full h-96 bg-gray-300 dark:bg-slate-700 animate-pulse flex items-center justify-center">
      <div class="text-5xl opacity-50">🐕</div>
    </div>

    <!-- Content Skeleton -->
    <div class="p-6 space-y-4">
      <!-- Title -->
      <div class="h-8 bg-gray-300 dark:bg-slate-700 rounded-lg animate-pulse w-3/4"></div>

      <!-- Subtitle -->
      <div class="h-4 bg-gray-300 dark:bg-slate-700 rounded-lg animate-pulse w-full"></div>

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <div v-for="i in 4" :key="i" class="space-y-2">
          <div class="h-4 bg-gray-300 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
          <div class="h-3 bg-gray-300 dark:bg-slate-700 rounded animate-pulse w-full"></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="h-4 bg-gray-300 dark:bg-slate-700 rounded animate-pulse w-1/2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Loading skeleton component - no logic needed
</script>
