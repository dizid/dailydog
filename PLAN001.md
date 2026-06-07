# PLAN001 — Daily Dog Growth & Monetization Plan

**Date:** 2025-04-05  
**Status:** Active  
**Focus:** Massive improvement + commercialization paths

---

## 1. Vision

Transform Daily Dog from a "fun little dog viewer" into a **habit-forming, shareable, and monetizable** product while preserving its joyful, lightweight personality.

---

## 2. Improvement Areas

### 2.1 UX & Engagement (High Impact)
- Shareable dog cards (beautiful branded images for social sharing)
- Daily streak system + local notification prompts
- Enhanced micro-interactions and glassmorphism polish
- "Dog of the Day" community voting (future)
- AI personality quiz (future)

### 2.2 Retention & Habit
- Streak counter + celebration modals
- Push notification prompts (web)
- History stats and achievements

### 2.3 Monetization Paths (Ranked)
1. **Affiliate links** (Amazon, Chewy, pet brands) — fastest to implement
2. **Freemium** — unlimited favorites, streaks, ad-free, export
3. **Sponsored breeds** — paid featured placements
4. **Print-on-demand merch** — custom shirts/posters of dogs
5. **B2B white-label** for shelters/vets (long-term)
6. **Pet insurance lead gen**

### 2.4 Technical Improvements
- Better image caching & offline support
- Shareable OG image generation (client-side canvas)
- Analytics events (privacy-friendly)
- Type-safe API layer improvements

---

## 3. Implementation Batches (This Plan)

### Batch 1 (Current)
- **Feature 1:** Shareable dog cards (download + web share)
- **Feature 2:** Daily streak system with persistence

### Batch 2 (Next)
- Affiliate link integration
- Freemium gating logic

### Batch 3 (Future)
- Personality quiz
- Merch store integration
- Sponsored content system

---

## 4. Chosen Implementation: Features 1 & 2

### Feature 1: Shareable Dog Cards
**Goal:** Allow users to generate and share beautiful, branded images of dogs.

**Requirements:**
- "Share" button on DogCard and DogDetail
- Generates a canvas image with:
  - Dog photo
  - Breed name
  - "Daily Dog" branding + logo
  - Optional streak count
- Supports native Web Share API + fallback to download
- Works on mobile (primary device)

**Files to modify:**
- `src/components/DogCard.vue`
- `src/pages/DogDetail.vue`
- New composable: `src/composables/use-share-card.ts`

### Feature 2: Daily Streak System
**Goal:** Create habit-forming daily usage.

**Requirements:**
- Track consecutive days user opened the app
- Show streak counter in header
- Celebration when streak increases
- Persist in localStorage via Pinia
- Simple "Come back tomorrow" messaging

**Files to modify:**
- `src/stores/dog-store.ts`
- `src/components/Header.vue`
- New composable: `src/composables/use-streak.ts`

---

## 5. Success Metrics (Manual)

- Users click "Share" at least once per session
- Average streak length > 3 days (tracked locally)
- Increased return visits (qualitative via dev tools)

---

## 6. Constraints

- Keep app lightweight (< 100KB gzipped target)
- No external analytics or tracking
- Mobile-first design
- No new dependencies unless essential
- Follow all Dizid coding standards

---

## 7. Next Steps After Batch 1

- Verify build passes (`npm run build`)
- Run type check
- Update documentation
- Plan Batch 2 (affiliate + freemium)

---

**End of PLAN001**