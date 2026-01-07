<template>
  <footer class="border-t glass-effect mt-20">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- About -->
        <div>
          <h3 class="font-bold text-lg mb-3 flex items-center gap-2">
            <span class="text-2xl">🐕</span>
            <span>Daily Dog</span>
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Bringing joy, one dog at a time! Discover amazing dogs and learn fascinating breed facts every day.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-bold text-lg mb-3">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <a href="/" class="text-gray-600 dark:text-gray-400 hover:text-puppy-blue transition">
                🐕 Today's Dog
              </a>
            </li>
            <li>
              <a href="/favorites" class="text-gray-600 dark:text-gray-400 hover:text-puppy-blue transition">
                ❤️ Favorites
              </a>
            </li>
            <li>
              <a href="/history" class="text-gray-600 dark:text-gray-400 hover:text-puppy-blue transition">
                📜 History
              </a>
            </li>
          </ul>
        </div>

        <!-- Info -->
        <div>
          <h3 class="font-bold text-lg mb-3">API & Data</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Powered by <a href="https://www.thedogapi.com/" target="_blank" rel="noopener" class="text-puppy-blue hover:underline">The Dog API</a>
          </p>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Your data stays local in your browser 🔒
          </p>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <p class="text-xl font-bold text-puppy-blue">∞</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">Dogs Available</p>
          </div>
          <div>
            <p class="text-xl font-bold text-puppy-purple">🌍</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">Global Coverage</p>
          </div>
          <div>
            <p class="text-xl font-bold text-puppy-pink">💯</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">Fun Guaranteed</p>
          </div>
        </div>

        <!-- Copyright -->
        <div class="text-center text-sm text-gray-600 dark:text-gray-400">
          <p class="mb-2">
            Made with <span class="text-puppy-pink">❤️</span> for dog lovers everywhere
          </p>
          <p class="mb-3">
            © {{ new Date().getFullYear() }} Daily Dog. All rights reserved.
          </p>
          <p class="text-base font-semibold">
            A project by <a href="https://dizid.com" target="_blank" rel="noopener" class="text-puppy-blue hover:text-puppy-purple transition-colors underline underline-offset-2">dizid.com</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component - static content
</script>
