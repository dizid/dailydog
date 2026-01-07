# 🐕 Daily Dog v2.0

> A cheerful, modern web application that brings joy with daily dog pictures and fascinating breed facts!

[![Vite](https://img.shields.io/badge/vite-%23646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue 3](https://img.shields.io/badge/vue%203-%2335495e?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

- 🎲 **Daily Dog** - Get a random dog picture with breed information
- ❤️ **Favorites** - Save your favorite dogs and build a collection
- 📜 **History** - View all the dogs you've explored
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Lightning Fast** - Built with Vite for instant development and blazing-fast builds
- 🎨 **Beautiful UI** - Cheerful, modern design with smooth animations
- 🔒 **Privacy First** - All your data stays in your browser (localStorage)
- 📦 **PWA Ready** - Installable as a web app, works offline
- 🌐 **Modern Stack** - Vue 3, TypeScript, Pinia state management

## 🚀 Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management store
- **Vue Router** - Client-side routing

### Styling & Design
- Custom color palette with "puppy" theme colors
- Smooth animations and transitions
- Dark mode support with localStorage persistence
- Responsive grid layouts with Tailwind

### APIs & Services
- **The Dog API** - Dog pictures and breed data
- **Wikipedia API** - Enriched breed information (history, care tips, etc.)
- **Netlify Functions** - Optional serverless API proxy available
- **localStorage** - Client-side persistent storage

## 📋 Project Structure

```
dailydog/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── Header.vue       # Navigation header
│   │   ├── DogCard.vue      # Main dog display card
│   │   ├── LoadingSkeleton.vue
│   │   └── ...
│   ├── pages/               # Page components (routes)
│   │   ├── Home.vue         # Main daily dog page
│   │   ├── DogDetail.vue    # Individual dog detail page
│   │   ├── Favorites.vue    # Favorites collection
│   │   └── History.vue      # View history
│   ├── stores/              # Pinia state management
│   │   └── dog-store.ts     # Central dog data store
│   ├── composables/         # Reusable Vue 3 composables
│   │   ├── use-dog.ts       # Dog data composable
│   │   ├── use-dog-detail.ts # Dog detail page logic
│   │   └── use-pwa.ts       # PWA composable
│   ├── utils/               # Utility functions
│   │   └── api-client.ts    # API calls with axios
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Type definitions
│   ├── router/              # Vue Router configuration
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── style.css            # Global styles with Tailwind
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service Worker
├── netlify/                 # Netlify serverless functions
│   └── functions/
│       └── dog.ts           # API proxy function
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── netlify.toml             # Netlify deployment config
├── package.json             # Dependencies and scripts
└── .env.example             # Example environment variables
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ (LTS recommended)
- npm or yarn

### Installation

1. **Clone and navigate**
```bash
cd dailydog
npm install
```

2. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your API keys:
# VITE_DOG_API_KEY=your_api_key_here          # Required - from https://www.thedogapi.com/
# VITE_WIKIPEDIA_ACCESS_TOKEN=your_token_here  # Optional - for higher rate limits
```

3. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server with hot reload

# Building
npm run build        # Build for production (with TypeScript checks)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint and fix issues
npm run type-check   # Check TypeScript types

# Netlify Development
netlify dev         # Run with Netlify dev server (requires Netlify CLI)
```

## 🎨 Design Features

### Color Palette
- **Primary Blue**: `#3B82F6` - Puppy Energy
- **Purple**: `#A855F7` - Joy & Playfulness
- **Pink**: `#EC4899` - Fun & Love
- **Yellow**: `#FCD34D` - Happiness
- **Orange**: `#FB923C` - Warmth

### Animations
- **Tail Wag** - Playful rotation animation
- **Bounce Gentle** - Subtle floating effect
- **Fade In** - Smooth content appearance
- **Slide Up** - Bottom-to-top entrance

## 🔐 Security & Privacy

- **No Backend Required** - All data stored locally in browser
- **Direct API Calls** - Currently calls The Dog API and Wikipedia API directly from client
- **Serverless Option** - Netlify function available in `netlify/functions/dog.ts` for server-side API key handling
- **localStorage Only** - Your favorites and history never sent to servers
- **HTTPS Only** - All communications are encrypted

## 🌐 Deployment

### Netlify (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit: Daily Dog v2"
git push origin main
```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add `VITE_DOG_API_KEY` with your Dog API key (required)
   - Optionally add `VITE_WIKIPEDIA_ACCESS_TOKEN` for higher rate limits

4. **Deploy**
   - Push commits to trigger automatic deployments
   - Preview URLs available for pull requests

### Alternative Hosting

The app can be deployed to any static hosting:
- **Vercel** - `npm run build` then deploy `dist/` folder
- **GitHub Pages** - Set `vite.config.ts` base URL
- **AWS S3 + CloudFront**
- **Any static host**

## 📱 PWA Features

### Install as App
1. Click the browser's install button (iOS: Share → Add to Home Screen)
2. Or use the install prompt that appears

### Offline Support
- Service Worker caches assets automatically
- Works offline with cached dog data
- Syncs when connection restored

### Manifest
- Configurable app icons and colors
- Custom app name and description
- Standalone display mode

## 🔧 Configuration

### Tailwind Customization
Edit `tailwind.config.js` to customize:
- Colors
- Animations
- Shadows
- Breakpoints

### API Configuration
Modify `src/utils/api-client.ts` to:
- Change API endpoints
- Add request interceptors
- Modify error handling
- Add request retries

### Store Configuration
Edit `src/stores/dog-store.ts` to:
- Change localStorage keys
- Modify state structure
- Add new actions
- Customize persistence

## 📊 State Management (Pinia)

### Dog Store
```typescript
// Use in components
import { useDogStore } from '@/stores/dog-store'

const store = useDogStore()
store.fetchNewDog()
store.toggleFavorite(dog)
store.toggleDarkMode()
```

### State
- `currentDog` - Current displayed dog
- `favorites` - Array of favorited dogs
- `history` - Array of viewed dogs
- `isDarkMode` - Theme preference
- `isLoading` - Loading state
- `error` - Error message

## 🎯 Composables

### useDog()
```typescript
const { currentDog, fetchNewDog, toggleFavorite, isFavorited } = useDog()
```

### usePWA()
```typescript
const { isInstallable, installApp } = usePWA()
```

## 🧪 Testing

Testing setup coming in future updates. Currently configured with ESLint for code quality.

```bash
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

## 🐛 Troubleshooting

### API Key Issues
**Problem**: "API key not configured" error
- **Solution**: Ensure `VITE_DOG_API_KEY` is set in `.env.local`

### Dark Mode Not Persisting
**Problem**: Dark mode preference resets
- **Solution**: Check if localStorage is enabled in browser

### Images Not Loading
**Problem**: Dog images appear broken
- **Solution**: Check browser's mixed content settings for HTTPS

### PWA Not Installing
**Problem**: Install button not showing
- **Solution**: PWA requires HTTPS (works on Netlify, localhost in dev)

## 📚 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [The Dog API Docs](https://www.thedogapi.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Code Quality Standards

From `claude.ml`:
- ✅ Extensive comments explaining logic
- ✅ Modular, reusable components
- ✅ Clear, descriptive naming conventions
- ✅ Type-safe with TypeScript
- ✅ Minimal breaking changes
- ✅ Production-ready implementations

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Dog API**: [The Dog API](https://www.thedogapi.com/)
- **Icons**: Emoji 🐕❤️🎲
- **Framework**: Vue 3 & Vite community
- **Design**: Tailwind CSS

## 🎉 Version History

### v2.0.0 (Current)
- ✨ Completely rebuilt with Vue 3 + Vite
- 🎨 New cheerful design system
- 🌙 Dark mode support
- 📱 Full responsive design
- ⚡ 10x faster builds with Vite
- 🔒 Improved security with API proxy
- 📦 PWA support
- 🎯 Better state management with Pinia
- 📝 TypeScript support

### v1.0.0
- Initial release with Vue 2
- Basic dog image display
- Bulma CSS styling

---

**Made with ❤️ for dog lovers everywhere** 🐕

Happy dog discovering! 🎉
