# Backend Plan

## Stack & Setup
- Runtime: Node.js with Next.js API routes or separate Express/Nest service (decide early).
- DB: PostgreSQL (provided). ORM: Drizzle or Prisma (pick one; Drizzle recommended).
- Env: use `.env` (not committed). Required now: `DATABASE_URL`, `POSTGRES_HOST/PORT/DB/USER/PASSWORD/SSL_MODE`. Add auth/storage keys later.
- Tooling: Prettier/ESLint, TS strict, lint/test scripts.

## Phase 1: Database Schema
- Users: id, email, hashed_password, role (admin/escort/client), status, created_at.
- Profiles (escort): user_id FK, display_name, bio, age, city_id, rate_hourly, services (json/tags), is_verified, is_vip, photos table (url, alt).
- Listings: derived from profile (view model) or table with visibility flags.
- Reviews: author_id, escort_id, booking_id, rating, comment, created_at.
- Bookings: client_id, escort_id, start/end, status (pending/confirmed/completed/cancelled), price, notes.
- Messages: thread per booking/user-pair, sender_id, body, created_at.
- Cities: id, name, slug, hero_img.
- Subscriptions/Plans: plan_id, user_id, status, limits; Payments table if needed.
- Audit/Reports: optional for admin actions and abuse reports.
- Migrations + seed: seed cities, sample escorts, sample users.

## Phase 2: Auth & Security
- Auth: NextAuth credentials/JWT or custom sessions; hash passwords (bcrypt/argon2).
- RBAC: middleware/guards per role (admin/escort/client).
- Rate limit: login/signup/messaging.
- Validation: zod/valibot for inputs; sanitize outputs.
- CSRF (for form posts) and CORS rules if separate frontend.

## Phase 3: Core APIs
- Auth: signup/login/logout, password reset (optional).
- Users/Profiles: get/update profile, escort onboarding, verification toggle (admin).
- Listings: list/search escorts (filters: city, verified, VIP, price range, availability); get by id.
- Reviews: create/list; allow only after completed booking.
- Bookings: create/update status, availability check, list by user.
- Messaging: send/list messages in booking thread; pagination.
- Cities: list/featured cities for filters.
- Subscriptions/Plans: assign plan, enforce limits; optional payments hook.
- Admin: review reports, ban/unban, verify escorts, audit log.

## Phase 4: Media/Files
- Storage: S3/Supabase/etc. Signed upload URLs; store URLs + metadata in DB.
- Validate mime/size; generate thumbs if needed.

## Phase 5: Payments (optional)
- Provider (e.g., Stripe). Products/prices for plans.
- Webhooks to sync subscription status; secure idempotency.

## Phase 6: Observability/Ops
- Logging: structured (pino/winston) with request IDs.
- Errors: consistent API error shape.
- Health: `/healthz` with DB check; simple metrics if available.
- Monitoring/alerts for errors and DB connectivity.

## Phase 7: Testing
- Unit: validation/auth helpers.
- Integration: auth, listings, bookings, reviews.
- Seeded test DB or transactional tests.
- Smoke: signup/login, list escorts, create booking, leave review.

## Phase 8: Deployment
- Hosting: Vercel (Next API) or Node host (Express/Nest).
- Migrations run in CI/CD; backups enabled on Postgres.
- Separate prod `.env` with secrets, DB URL, storage keys, webhook secrets.

## Immediate Next Steps
1) Pick ORM (Drizzle/Prisma) and initialize (schema + first migration).
2) Add `.gitignore` to exclude `.env`, `.next`, `node_modules`.
3) Create DB schema tables above and run migration against provided Postgres.
4) Seed cities and a few escorts for UI.
5) Scaffold auth endpoints and listings read endpoints first; then bookings/reviews.

