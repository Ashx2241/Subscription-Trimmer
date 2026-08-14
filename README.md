# Subscription Trimmer

A privacy-first FinTech co-pilot for detecting recurring subscriptions, analyzing spending metrics, and managing user-authorized cancellation workflows.

## Features
- **Automatic Subscription Detection**: Analyzes transaction cadences and identifies recurring charges.
- **Smart Spend Analytics**: Category breakdown, spend forecasting, and annualized cost metrics.
- **Cancellation Center**: Automated AI cancellation email generator and certified mail dispatch workflows.
- **Enterprise Security**: Edge Proxy middleware, SHA-256 API key hashing, and RBAC authentication.
- **Cloud Database**: Powered by Supabase PostgreSQL and Prisma ORM.

## Tech Stack
- **Framework**: Next.js 16 (Turbopack, App Router)
- **Database**: PostgreSQL (Supabase) via Prisma ORM
- **Authentication**: JWT HttpOnly Cookies, bcrypt, Google OAuth
- **Styling**: Vanilla CSS / TailwindCSS
- **Payment & Banking**: Stripe Billing & Plaid Integration Stubs

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Initialize Database & Seed**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.
