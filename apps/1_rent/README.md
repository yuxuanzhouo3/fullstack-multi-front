# RentHub - Secure Rental Deposit Platform

RentHub is a comprehensive deposit platform designed to facilitate safe and secure rental transactions between renters and landlords. Built with Next.js, Supabase, and modern web technologies.

## Features

- **Authentication**: Multi-factor authentication with social login options
- **Secure Chat**: End-to-end encrypted messaging between renters and landlords
- **Payments**: Secure deposit handling with escrow protection
- **Security Dashboard**: Comprehensive security monitoring and alerts
- **AI Analysis**: AI-powered rent price analysis and market insights

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Cache/Queue**: Redis
- **Payments**: Stripe integration (mock implementation)
- **Deployment**: Vercel

## Project Structure

This is a sub-product within a multi-tenant monorepo. The structure follows:

\`\`\`
apps/1_rent/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utility functions
├── public/                 # Static assets
└── README.md              # This file
\`\`\`

## Getting Started

1. Install dependencies from the monorepo root:
   \`\`\`bash
   pnpm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

3. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `REDIS_URL`: Redis connection URL

## Database Schema

The application expects the following Supabase tables:

- `profiles`: User profiles and metadata
- `chats`: Chat conversations
- `messages`: Chat messages
- `payments`: Payment transactions
- `properties`: Property listings
- `security_events`: Security audit log

## Deployment

This application is designed to be deployed on Vercel as part of the monorepo structure. The deployment configuration is handled at the monorepo level.

## Security Features

- End-to-end encrypted messaging
- Two-factor authentication
- Security event monitoring
- Escrow-based payment protection
- Activity logging and alerts

## Contributing

This is a generated sub-product. For modifications, please update the generation prompt and regenerate the entire application.

## Version

Generated on: ${new Date().toISOString().split('T')[0]}
Version: 1.0.0
