# 🚀 Quick Start Guide - Daily Dog v2.0

Get up and running in 5 minutes!

## 1️⃣ Prerequisites

- Node.js 16+ ([download](https://nodejs.org/))
- npm (comes with Node.js)
- Dog API Key ([get free key](https://www.thedogapi.com/))

## 2️⃣ Installation

```bash
# Navigate to project directory
cd dailydog

# Install dependencies
npm install
```

## 3️⃣ Setup Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your API key:
# VITE_DOG_API_KEY=your_key_here
# VITE_API_BASE_URL=http://localhost:5173
```

## 4️⃣ Start Development Server

```bash
npm run dev
```

The app will automatically open at **http://localhost:5173** 🎉

## 5️⃣ Start Using Daily Dog!

- 🎲 Click "Get Daily Dog" to see a random dog
- ❤️ Click the heart to favorite dogs
- 📜 Check your favorites and history
- 🌙 Toggle dark mode

## 📦 Available Commands

```bash
npm run dev          # 🚀 Start development server
npm run build        # 🏗️  Build for production
npm run preview      # 👀 Preview production build
npm run lint         # ✨ Check code quality
npm run type-check   # 🔍 Check TypeScript types
```

## 🎨 What You Get

✅ Modern Vue 3 + TypeScript
✅ Beautiful Tailwind CSS design
✅ Dark mode support
✅ Favorites & History tracking
✅ Responsive mobile design
✅ PWA ready (installable)
✅ Smooth animations
✅ Offline support

## 🚀 Ready to Deploy?

### Deploy to Netlify (Recommended)

1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_DOG_API_KEY`

That's it! Your app will auto-deploy on every push. 🚀

## 📱 Try as PWA

1. Open the app in a browser
2. Click the install button in the address bar (or use Share → Add to Home Screen on iOS)
3. App runs like a native app!

## ❓ Stuck?

Check the full **[README.md](./README.md)** for detailed docs.

## 🐕 Let's Go!

```bash
npm install && npm run dev
```

Happy dog discovering! 🎉❤️
