# WorldPals — International Friendship App

A Bumble-style web app for making genuine international friendships. Connect with people from 150+ countries for cultural exchange, language learning, and real conversations.

## Tech Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + Framer Motion
- **Prisma** + SQLite (local database — no account needed)
- **NextAuth.js** (email/password auth)
- **Socket.io** (real-time chat)
- **Google AdSense** (optional, earns you money)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.local.example .env.local
# Edit .env.local — the defaults work for local dev
```

### 3. Set up database
```bash
npx prisma db push
```

### 4. Create the uploads folder
```bash
mkdir -p public/uploads
```

### 5. Run the app
```bash
npm run dev
```

Visit **http://localhost:3000**

---

## Features
- **Auth** — Email/password signup + optional Google OAuth
- **Onboarding** — 5-step wizard (photo, bio, languages, interests, countries)
- **Discover** — Swipe cards with Framer Motion drag gestures
- **Matching** — Mutual likes create a match with animated celebration
- **Chat** — Real-time messaging via Socket.io
- **Safety** — Report users, block users, manage blocked list
- **Ads** — Google AdSense placeholders (add your publisher ID to go live)

## Google AdSense Setup (optional — they pay you)
1. Sign up at [adsense.google.com](https://adsense.google.com) (free)
2. Get your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
3. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

## Google OAuth Setup (optional — free)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable "Google+ API" → Create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` as authorized redirect URI
4. Copy Client ID and Secret to `.env.local`

## Database Management
```bash
npx prisma studio    # Visual database browser
npx prisma db push   # Sync schema changes
```
