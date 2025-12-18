# Supabase Realtime Setup Guide

## Prerequisites

1. **Supabase Project Setup**
   - Create a Supabase project at https://supabase.com
   - Get your project URL and anon key from Settings > API
   - Add to `.env`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

2. **Database Connection Options**

   **⚠️ Important Decision: You have 3 options:**

   **Option A: Migrate to Supabase PostgreSQL (Recommended for Realtime)**
   - Create a new Supabase project (includes managed PostgreSQL)
   - Export data from Aiven
   - Import to Supabase
   - Update `DATABASE_URL` to point to Supabase
   - ✅ Realtime works out of the box
   - ✅ Simpler setup
   - ❌ Requires data migration

   **Option B: Keep Aiven + Use Supabase Realtime (Complex)**
   - Keep your Aiven PostgreSQL as primary database
   - Set up logical replication from Aiven to Supabase
   - Supabase reads replicated data for Realtime
   - ✅ Keep existing database
   - ❌ Complex replication setup
   - ❌ Two databases to manage
   - ❌ Potential sync delays

   **Option C: Alternative - Use WebSockets/Pusher/Socket.io**
   - Keep Aiven PostgreSQL
   - Use alternative realtime solution (not Supabase Realtime)
   - Requires custom implementation
   - ✅ No database migration
   - ❌ More custom code to maintain

   **Recommendation**: If you're starting fresh or can migrate, use Option A. It's the simplest path to working Realtime.

## Implementation Steps

### 1. Enable Realtime on ChatMessage Table

In Supabase Dashboard:
1. Go to Database > Replication
2. Enable replication for `ChatMessage` table
3. Ensure RLS (Row Level Security) policies allow users to:
   - INSERT their own messages
   - SELECT messages in threads they're part of
   - UPDATE message status for messages they receive

### 2. RLS Policies (SQL in Supabase SQL Editor)

```sql
-- Allow users to read messages in threads they're part of
CREATE POLICY "Users can read messages in their threads"
ON "ChatMessage"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "ChatThread" t
    WHERE t.id = "ChatMessage"."threadId"
    AND (t."clientId" = auth.uid()::text OR 
         EXISTS (SELECT 1 FROM "Profile" p WHERE p."userId" = auth.uid()::text AND p.id = t."escortProfileId"))
  )
);

-- Allow users to insert their own messages
CREATE POLICY "Users can insert their own messages"
ON "ChatMessage"
FOR INSERT
WITH CHECK (
  "senderId" = auth.uid()::text
);

-- Allow recipients to update message status
CREATE POLICY "Recipients can update message status"
ON "ChatMessage"
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM "ChatThread" t
    WHERE t.id = "ChatMessage"."threadId"
    AND ("senderId" != auth.uid()::text)
    AND (t."clientId" = auth.uid()::text OR 
         EXISTS (SELECT 1 FROM "Profile" p WHERE p."userId" = auth.uid()::text AND p.id = t."escortProfileId"))
  )
);
```

### 3. Update Chat Page to Use Realtime

Replace polling in `app/chats/page.tsx` with Supabase Realtime subscriptions:

```typescript
import { supabase } from "@/lib/supabase"

// Subscribe to messages for a thread
useEffect(() => {
  if (!selectedThread || !supabase) return

  const channel = supabase
    .channel(`thread:${selectedThread.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "ChatMessage",
        filter: `threadId=eq.${selectedThread.id}`,
      },
      (payload) => {
        // Handle new message
        const newMessage = payload.new
        mutateMessages((current) => ({
          messages: [...(current?.messages ?? []), newMessage],
          status: current?.status ?? selectedThread.status,
        }))
        playReceiveSound()
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "ChatMessage",
        filter: `threadId=eq.${selectedThread.id}`,
      },
      (payload) => {
        // Handle status update (delivered/seen)
        const updated = payload.new
        mutateMessages((current) => ({
          messages: current?.messages.map((m) =>
            m.id === updated.id ? { ...m, status: updated.status } : m
          ) ?? [],
          status: current?.status ?? selectedThread.status,
        }))
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [selectedThread])
```

### 4. Message Status Updates

After sending a message, the recipient should mark it as delivered/seen via Supabase Realtime:

```typescript
// Mark messages as delivered when thread is opened
useEffect(() => {
  if (!selectedThread || !userId || !supabase) return
  
  // Mark all messages from other user as delivered/seen
  const updateStatus = async () => {
    const messages = messagesData?.messages.filter(
      (m) => m.senderId !== userId && m.status !== "seen"
    ) ?? []
    
    for (const msg of messages) {
      await fetch(`/api/chats/messages/${msg.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "seen" }),
      })
    }
  }
  
  updateStatus()
}, [selectedThread, messagesData])
```

## Notes

- Supabase Realtime requires the database to be connected to Supabase's infrastructure
- If using external PostgreSQL, you may need to set up logical replication
- RLS policies are critical for security - test thoroughly
- The current implementation uses Prisma, but Supabase client connects directly to PostgreSQL for Realtime

