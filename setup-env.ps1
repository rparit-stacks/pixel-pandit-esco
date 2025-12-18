# PowerShell script to create .env file with Supabase credentials

$envContent = @"
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qfikoqozexxaucrugkao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j9MSrL90Gn3dfCiGDmj6lA_yK27U3du

# Database Connection - Connection Pooling (for app runtime)
DATABASE_URL="postgresql://postgres.qfikoqozexxaucrugkao:gZFXy2Bmggmcb3hV@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Database Connection - Used for migrations only
DIRECT_URL="postgresql://postgres.qfikoqozexxaucrugkao:gZFXy2Bmggmcb3hV@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_KEY=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host ".env file created successfully!"

