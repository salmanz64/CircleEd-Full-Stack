# CircleEd Frontend

Next.js frontend for the CircleEd peer-to-peer learning platform.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /(auth)          # Authentication pages
    /login
    /register
  /(dashboard)     # Protected dashboard pages
    /dashboard
    /marketplace
    /chat
    /wallet
    /profile
    /settings
/components
  /ui              # ShadCN UI components
  SkillCard.tsx
  TokenBadge.tsx
  Sidebar.tsx
  Navbar.tsx
  ReviewCard.tsx
/data
  (mock data removed — frontend now uses backend APIs)
/lib
  utils.ts         # Utility functions
```

## Tech Stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI** components
- **Zustand** for state management
- **NextAuth** for authentication (placeholder)
- **React Hook Form + Zod** for forms
- **Lucide Icons**

## Features

- ✅ User authentication (UI)
- ✅ Dashboard with stats and quick actions
- ✅ Skill marketplace with filtering
- ✅ Skill profile pages with reviews
- ✅ Chat interface
- ✅ Token wallet and transaction history
- ✅ User profile management
- ✅ Settings page

## Design Principles

- Clean, modern UI with soft gradient tones
- Spacing priority (not cluttered)
- Responsive (mobile-first)
- Card-based UI with subtle shadows
- Consistent typography scale
- Accent color: #6366F1 (indigo)

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```




