# Migration Notes

## Required Database Migration

After updating the Prisma schema, you need to run a migration:

```bash
npx prisma migrate dev --name add_service_and_message_status
```

This will create a migration that adds:
1. `Service.status` field (enum: ACTIVE, INACTIVE) - defaults to ACTIVE
2. `ChatMessage.status` field (enum: sent, delivered, seen) - defaults to sent
3. `MessageType` enum (TEXT, MEDIA, LOCATION, VOICE, OFFER, TODO)
4. `MessageStatus` enum (sent, delivered, seen)

## What's Been Completed

### ✅ Service System
- [x] Service model updated with status field
- [x] Service APIs updated to support status (GET, POST, PATCH, DELETE)
- [x] Service management UI with sidebar layout
- [x] Search and filter functionality (by status, by name)
- [x] Rich text editor (TipTap) with Bold, Italic, Underline, Headings, Lists
- [x] Status toggle (Active/Inactive)
- [x] Profile page updated to show services dynamically from DB

### ✅ Chat Enhancements (Partial)
- [x] ChatMessage schema updated with type, payload, status fields
- [x] Message API updated to properly use type + payload
- [x] Status update API endpoint created (`/api/chats/messages/[id]/status`)
- [x] Supabase client setup (requires Supabase credentials)
- [ ] Supabase Realtime subscriptions (see `docs/supabase-realtime-setup.md`)
- [ ] Voice message improvements
- [ ] Full emoji picker
- [ ] TODO message type
- [ ] Media lightbox viewer
- [ ] Enhanced location cards

## Database Migration Decision

**⚠️ IMPORTANT**: You're currently using Aiven PostgreSQL. For Supabase Realtime to work, you have two options:

### Option A: Migrate to Supabase PostgreSQL (Recommended)
- Export data from Aiven
- Import to Supabase managed PostgreSQL
- See `docs/aiven-to-supabase-migration.md` for detailed steps
- ✅ Realtime works out of the box

### Option B: Keep Aiven + Alternative Realtime
- Keep Aiven as your database
- Use Socket.io, Pusher, or another realtime solution
- See `docs/realtime-alternatives.md` for options
- ❌ Requires custom implementation

## Next Steps

1. **Decide on Database Strategy**: Choose Option A or B above
2. **Run Prisma Migration**: Execute the Prisma migration command above (works with either option)
3. **If Using Supabase**: Follow `docs/supabase-realtime-setup.md` to set up Realtime
4. **If Using Alternative**: Follow `docs/realtime-alternatives.md`
5. **Replace Chat Polling**: Update `app/chats/page.tsx` to use chosen realtime solution
6. **Implement Remaining Features**: Complete the remaining chat enhancements

## Environment Variables Needed (If Using Supabase)

Add to `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: If staying with Aiven, you only need to update `DATABASE_URL` after running migrations.

