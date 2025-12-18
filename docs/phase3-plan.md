# Phase 3: Core APIs & Flows

## Goals
- Deliver read + basic write APIs to support the defined client/escort flows.
- Keep schemas minimal (no extra tables yet) to ship quickly; extend later for favorites/calls/history.

## Endpoints (MVP)
- **Public**
  - `GET /api/cities` — list cities for filters.
  - `GET /api/escorts` — list/search escorts (city, verified, vip, q, limit/offset).
  - `GET /api/escorts/:id` — escort profile detail with photos/listing.
- **Auth/Client**
  - `GET /api/favorites` — list favorites for current user.
  - `POST /api/favorites` — add favorite (client only).
  - `DELETE /api/favorites` — remove favorite (client only).
- **Auth (existing)**
  - `POST /api/auth/signup` — already live.
  - `POST /api/auth/[...nextauth]` — login via credentials (will add OTP later).

## Next Increment (after MVP)
- Favorites: add `Favorite` table + endpoints.
- Messaging: threads/messages with RBAC.
- Calls: call requests/logs + toggles for escort availability.
- OTP login: email-based OTP flow.
- Block/report: block list + report table + endpoints.
- Availability: add schedule fields and toggle.
- Subscription/billing: plan enforcement on escort side.
- Delete account: user-driven delete + cascading cleanup.

## Filters for /api/escorts
- `city` (slug)
- `verified` (boolean)
- `vip` (boolean)
- `q` (search in displayName/about)
- `limit` (default 20, max 50)
- `offset` (default 0)

## Response shapes (MVP)
- City: `{ id, name, slug, heroImg }`
- Escort list item: `{ id, displayName, city, rateHourly, isVerified, isVip, mainPhotoUrl, services, listingTitle, about }`
- Escort detail: adds `photos`, `listing`, `bio`, `age`, `createdAt`

## Security & Validation
- Use Zod for query validation.
- Public endpoints read-only; no auth required for MVP.
- Sanitize search input; clamp pagination limits.

## Plan of Attack
1) Implement public read APIs: cities, escorts list, escort detail.
2) Wire UI to these APIs (later step).
3) Extend with favorites/messaging/calls in subsequent increments.

