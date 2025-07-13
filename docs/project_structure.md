# Project Structure Overview

This monorepo is designed to support 1000+ sub-products (multi-tenant architecture). Each sub-product is organized under the `apps/` and `api/products/` directories, with shared logic and resources in `api/shared/` and `shared/`.

## Directory Layout

```
fullstack-multi-front/
├── api/
│   ├── auth.js
│   ├── products/
│   │   ├── 1_rent/
│   │   ├── 2_job/
│   │   ├── 3_social/
│   │   ├── 4_deepfake_detector/
│   │   ├── 5_accelerator/
│   │   └── ... (up to 1000+ sub-products)
│   ├── shared/
│   └── system/
├── apps/
│   ├── 1_rent/
│   ├── 2_job/
│   ├── 3_social/
│   ├── 4_deepfake_detector/
│   ├── 5_accelerator/
│   └── ... (up to 1000+ sub-products)
├── backend/
├── config/
├── db/
├── docker/
├── docs/
├── local_setup/
├── logs/
├── scripts/
├── shared/
├── src/
└── ...
```

## Key Points
- **Scalability:** The structure is built to handle 1000+ sub-products, each with its own frontend and backend logic.
- **Separation of Concerns:** Each sub-product is isolated in its own directory for maintainability.
- **Shared Logic:** Common code is placed in `api/shared/` and `shared/` for reuse across products.
- **Serverless & Modern Stack:** The project uses Next.js, serverless API routes, Supabase, Redis, and Tailwind CSS.

## How to Use with v0.dev
- When generating code with v0.dev, include this structure and explain that the project is designed for massive multi-product scalability.
- Attach this file and the v0 prompt guide to your v0.dev prompt for best results. 