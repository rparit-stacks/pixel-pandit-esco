# Migrating from Aiven PostgreSQL to Supabase

## Overview

If you want to use Supabase Realtime features, migrating to Supabase's managed PostgreSQL is the recommended approach. This guide covers the migration process.

## Prerequisites

1. **Backup your Aiven database** (critical!)
2. **Create a Supabase project** at https://supabase.com
3. **Ensure you have database connection strings for both**

## Migration Steps

### Step 1: Export Data from Aiven

Using `pg_dump` or Supabase's migration tool:

```bash
# Export schema
pg_dump -h <aiven-host> -U <user> -d <database> -F c -f schema.dump --schema-only

# Export data
pg_dump -h <aiven-host> -U <user> -d <database> -F c -f data.dump --data-only
```

### Step 2: Update Supabase Database Connection String

Get your Supabase connection string from:
- Supabase Dashboard > Settings > Database > Connection string
- Use the "Connection pooling" string for Prisma

### Step 3: Apply Schema to Supabase

```bash
# Update DATABASE_URL temporarily to Supabase
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run migrations
npx prisma migrate deploy

# Or if you exported schema, restore it
pg_restore -h db.[PROJECT-REF].supabase.co -U postgres -d postgres schema.dump
```

### Step 4: Import Data

```bash
# Restore data
pg_restore -h db.[PROJECT-REF].supabase.co -U postgres -d postgres data.dump
```

### Step 5: Update Environment Variables

Update your `.env`:

```env
# Update DATABASE_URL to Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Add Supabase Realtime credentials
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 6: Verify Connection

```bash
# Test connection
npx prisma db pull

# Run seed if needed
npm run prisma:seed
```

### Step 7: Enable Realtime in Supabase

1. Go to Supabase Dashboard > Database > Replication
2. Enable replication for tables you need:
   - `ChatMessage` (for chat)
   - `ChatThread` (optional, for thread updates)
   - Any other tables you want realtime on

### Step 8: Set Up RLS Policies

In Supabase SQL Editor, run the policies from `docs/supabase-realtime-setup.md`

## Important Notes

⚠️ **Before switching:**
- Test migration in a staging environment first
- Keep Aiven database as backup until migration is verified
- Update all services/deployments that use DATABASE_URL

⚠️ **After migration:**
- Verify all API endpoints work correctly
- Test authentication flows
- Test chat functionality with Realtime
- Monitor for any connection issues

## Troubleshooting

**Connection issues:**
- Ensure you're using connection pooling string for Prisma
- Check firewall/network access
- Verify credentials

**Data inconsistencies:**
- Double-check data import completed
- Verify all foreign key relationships
- Check enum types match

**Realtime not working:**
- Ensure replication is enabled for relevant tables
- Check RLS policies allow access
- Verify Supabase client is initialized correctly

## Alternative: Keep Both Databases

If you prefer to keep Aiven and use Supabase only for Realtime:
- Keep Aiven as primary database
- Set up logical replication to Supabase
- Use Supabase client only for Realtime subscriptions
- Continue using Prisma with Aiven for all writes

This is more complex but keeps your existing infrastructure.

