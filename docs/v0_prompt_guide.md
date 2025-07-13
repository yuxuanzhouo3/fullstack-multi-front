# Guide: Generating Frontends with v0.dev for This Project

This guide helps you generate production-ready frontends for all products in this monorepo using [v0.dev](https://v0.dev) (Vercel's AI code generator). It ensures all generated code is compatible with your stack and project structure.

## Tech Stack Requirements
- **Frontend Framework:** Next.js (React-based, supports SSR/SSG/ISR)
- **API:** Serverless API routes (Next.js API routes or Vercel serverless functions)
- **Database:** Supabase (Postgres + Auth + Storage)
- **Cache/Queue:** Redis
- **Styling:** Tailwind CSS
- **Type Checking:** TypeScript
- **Deployment:** Vercel (or similar serverless platform)

## Common Features & UI Requirements

### Authentication
- Social login/sign up must use **Google, Facebook, TikTok, WeChat, and LinkedIn** (do not include GitHub).
- Social login/sign up buttons must link to the real social platform sign up pages and allow users to sign up or log in with their actual social accounts (real OAuth integration).
- All social login logos must be displayed in a single horizontal row for a clean UI.
- Password input must be toggleable (show/hide).
- Sign up must create a user in the Supabase DB.
- Login must redirect to the home page/dashboard after success.
- The mock account (email: `testuser@example.com`, password: `Test1234!`) must actually allow login and redirect to the dashboard.

### Payments
- Payment options must include **Stripe, PayPal, WeChat Pay, Alipay, self credit/bank card, and deposits from the platform**.
- All payment method logos must be displayed in a single horizontal row for user selection.

## Universal v0.dev Prompt Template

```
Tech Stack:
- Frontend: Next.js (TypeScript)
- API: Next.js API routes (serverless)
- Database: Supabase (auth, user data, storage)
- Cache/Queue: Redis (for chat and real-time features)
- Styling: Tailwind CSS
- Deployment: Vercel

Features to Implement:
1. Authentication: Sign up/in, social login (Google, Meta, LinkedIn, GitHub), forgot/reset password, 2FA, session management (Supabase Auth).
2. Chat: Real-time chat (Redis pub/sub), chat list, group chat, emoji support, user presence.
3. Payments: Payment form (credit/debit), Stripe/PayPal integration, payment history, save payment methods, feedback messages.
4. Security Operations: Security alerts, user activity logs, 2FA management, account lockout/recovery, admin security dashboard.
5. AI Feature: [Describe the AI feature for this product, e.g., “AI-powered job matching”, “deepfake analysis”, “startup pitch analysis”, etc.]

Instructions:
- Organize code for a Next.js monorepo, with API logic in `/pages/api` or `/app/api`, and frontend in `/pages` or `/app`.
- Use Supabase client for database/auth, and connect to Redis for real-time/chat features.
- UI should be clean, responsive, and production-ready, using Tailwind CSS.
- All code should be in TypeScript.
- The project should be ready for deployment on Vercel.
```

## Example Prompts for Each Product

### RentHub
```
Tech Stack: [as above]
Features to Implement:
1. Authentication (Supabase Auth, social login, 2FA)
2. Real-time chat (Redis pub/sub)
3. Payments (Stripe integration)
4. Security dashboard (user logs, 2FA management)
5. AI-powered rent price analysis (user submits property details, gets AI suggestions)
[Follow the instructions above.]
```

### JobFinder
```
Tech Stack: [as above]
Features to Implement:
1. Authentication (Supabase Auth, social login, 2FA)
2. Real-time chat (Redis pub/sub)
3. Payments (Stripe integration for premium features)
4. Security dashboard (user logs, 2FA management)
5. AI-powered job matching (resume analysis, job suggestions)
[Follow the instructions above.]
```

### SocialConnect
```
Tech Stack: [as above]
Features to Implement:
1. Authentication (Supabase Auth, social login, 2FA)
2. Real-time chat (Redis pub/sub)
3. Payments (Stripe integration for premium features)
4. Security dashboard (user logs, 2FA management)
5. AI-powered social post suggestions and moderation
[Follow the instructions above.]
```

### Deepfake Detector
```
Tech Stack: [as above]
Features to Implement:
1. Authentication (Supabase Auth, social login, 2FA)
2. Real-time chat (Redis pub/sub for support/community)
3. Payments (Stripe integration for premium analysis)
4. Security dashboard (user logs, 2FA management)
5. Deepfake analysis (user uploads media, receives AI-generated authenticity results)
[Follow the instructions above.]
```

### Accelerator
```
Tech Stack: [as above]
Features to Implement:
1. Authentication (Supabase Auth, social login, 2FA)
2. Real-time chat (Redis pub/sub for startups/mentors)
3. Payments (Stripe integration for program fees)
4. Security dashboard (user logs, 2FA management)
5. AI-powered startup pitch analysis and mentor matching
[Follow the instructions above.]
```

---

**How to Use:**
1. Copy the universal template or a product-specific example.
2. Paste it into v0.dev or your preferred AI code generator.
3. Adjust the AI feature or other details as needed for your use case. 

## How to Use with Sub-Product Prompts
- In each sub-product prompt, reference the 'Common Features & UI Requirements' section of this guide for authentication and payment requirements.
- Only specify additional, product-specific requirements in the sub-product prompt. 