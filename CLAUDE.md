# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start Vite dev server at http://localhost:5173
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
npm run lint         # ESLint with auto-fix
npm run type-check   # TypeScript type checking only
```

## Architecture Overview

Daily Dog is a Vue 3 + TypeScript web app that displays random dog pictures with breed information. It uses The Dog API for dog images and Wikipedia API for enriched breed details.

### Data Flow

1. **API Client** ([api-client.ts](src/utils/api-client.ts)) - Makes direct calls to The Dog API and Wikipedia REST API
2. **Pinia Store** ([dog-store.ts](src/stores/dog-store.ts)) - Central state management with localStorage persistence for favorites, history, and theme
3. **Composables** - Wrap store access for components:
   - `use-dog.ts` - Dog fetching and favorites
   - `use-dog-detail.ts` - Dog detail page logic
   - `use-pwa.ts` - PWA installation handling

### Key Patterns

- **Path alias**: `@` maps to `src/` (configured in [vite.config.ts](vite.config.ts))
- **localStorage keys**: `dailydog_favorites`, `dailydog_history`, `dailydog_breed_cache`
- **Breed info caching**: Wikipedia responses cached for 7 days in localStorage
- **History limit**: Last 20 viewed dogs kept in history

### Environment Variables

```bash
VITE_DOG_API_KEY=           # The Dog API key (required)
VITE_WIKIPEDIA_ACCESS_TOKEN= # Optional Wikipedia API token
```

### Netlify Serverless Function

[dog.ts](netlify/functions/dog.ts) provides an API proxy for secure server-side API key usage. The client currently calls APIs directly, but this function is available for production use.

### Tailwind Configuration

Custom theme in [tailwind.config.js](tailwind.config.js):
- Custom "puppy" color palette with blue, purple, pink, yellow, orange
- Custom animations: `tail-wag`, `bounce-gentle`, `fade-in`, `slide-up`
- Dark mode via `class` strategy (toggled via Pinia store)
