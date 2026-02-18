# EcareBots MVP - Setup Guide

**Phase 1: Foundation & Authentication**  
**Status:** 🚧 In Development  
**Branch:** `dev/phase1-foundation`

---

## 🎯 Project Overview

EcareBots is a voice-first, accessible healthcare coordination platform for elderly and disabled users. This MVP focuses on:

- ✅ Core health coordination (medications & appointments)
- ✅ Voice-first accessibility (WCAG 2.1 AA)
- ✅ Manual data entry (no external APIs in MVP)
- ✅ Simplified 3-tier architecture: **Next.js + Supabase + OpenAI**

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (accessibility-first presets)
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** OpenAI GPT-4 (single agent with function calling)
- **Voice:** Web Speech API (browser-native, no external service)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Supabase account (free tier works)
- OpenAI API key

### 1. Clone Repository

```bash
git clone https://github.com/ArjunFrancis/ecarebots.git
cd ecarebots
git checkout dev/phase1-foundation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project to initialize (~2 minutes)
3. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 4. Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**
5. Verify tables created: **Database > Tables** (should see `users`, `medications`, `appointments`, `adherence_logs`)

### 5. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-4-turbo-preview

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ Verify Installation

### Test Authentication Flow

1. Go to http://localhost:3000
2. Click **Sign Up**
3. Create account with email and password
4. Check email for verification link (click to verify)
5. Go back and click **Sign In**
6. Log in with credentials
7. Should redirect to `/dashboard`

### Check Database

1. In Supabase dashboard: **Authentication > Users**
2. Your new user should appear
3. Go to **Database > Table Editor > users**
4. Your user profile should be auto-created (via trigger)

---

## 📝 Project Structure

```
ecarebots/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Login page
│   │   │   └── signup/page.tsx     # Signup page
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Main dashboard
│   │   ├── layout.tsx            # Root layout (accessibility)
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles (WCAG)
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts         # Supabase client
│   │       └── database.types.ts # TypeScript types
│   └── middleware.ts           # Auth middleware
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example
```

---

## 🛡️ Security Features (HIPAA-Ready)

✅ **Row Level Security (RLS)** - All tables have policies  
✅ **User isolation** - Users can only access their own data  
✅ **Encrypted at rest** - Supabase handles encryption  
✅ **TLS 1.3** - All API calls over HTTPS  
✅ **No sensitive data in client** - API keys server-side only  

---

## ♿ Accessibility Features (WCAG 2.1 AA)

✅ **Skip to main content** link  
✅ **High contrast focus indicators** (3px solid)  
✅ **Minimum touch targets** (44x44px)  
✅ **Large text support** (1.125rem base)  
✅ **Screen reader optimized** (`aria-label`, `role` attributes)  
✅ **Keyboard navigation** (no mouse required)  
✅ **Reduced motion support** (`prefers-reduced-motion`)  

---

## 💡 Next Steps (Week 2-4)

- [ ] Medications CRUD pages
- [ ] Appointments CRUD pages
- [ ] Voice input with Web Speech API
- [ ] OpenAI agent for intent routing
- [ ] Adherence tracking
- [ ] Reminder notifications

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error

- Check `.env.local` exists and has correct keys
- Restart dev server after changing env vars

### Email verification not received

- Check spam folder
- In Supabase: **Authentication > Settings > Email Templates** - check SMTP config
- For testing, disable email confirmation: **Settings > Auth > Email Auth > Confirm email = OFF**

### Database migration failed

- Ensure Supabase project fully initialized
- Copy SQL exactly as-is (no partial runs)
- Check **Logs** tab in Supabase for error details

---

## 📚 Documentation

For full technical documentation, see:
- [README.md](./README.md) - Project overview
- [IMPLEMENTATION_HANDOFF.md](./docs/IMPLEMENTATION_HANDOFF.md) - Complete implementation guide
- [architecture/system-architecture.md](./architecture/system-architecture.md) - System design

---

## ❓ Questions?

Create a GitHub issue with:
- Steps to reproduce
- Error messages
- Environment details (OS, Node version)

---

**Last Updated:** February 18, 2026  
**Status:** Phase 1 Foundation - In Progress  
**Next Milestone:** Medications Management (Week 3)
