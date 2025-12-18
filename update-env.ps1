# Update .env file with Supabase credentials
$envFile = ".env"
$lines = Get-Content $envFile -ErrorAction SilentlyContinue

# Remove old database URLs and Supabase settings
$filtered = $lines | Where-Object {
    $_ -notmatch "^DATABASE_URL=" `
    -and $_ -notmatch "^DIRECT_URL=" `
    -and $_ -notmatch "^NEXT_PUBLIC_SUPABASE_URL=" `
    -and $_ -notmatch "^NEXT_PUBLIC_SUPABASE_ANON_KEY="
}

# Add Supabase configuration
$supabaseConfig = @"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qfikoqozexxaucrugkao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_j9MSrL90Gn3dfCiGDmj6lA_yK27U3du

# Database Connection - Connection Pooling (for app runtime)
DATABASE_URL="postgresql://postgres.qfikoqozexxaucrugkao:gZFXy2Bmggmcb3hV@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Database Connection - Used for migrations only
DIRECT_URL="postgresql://postgres.qfikoqozexxaucrugkao:gZFXy2Bmggmcb3hV@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
"@

($filtered + $supabaseConfig) | Out-File -FilePath $envFile -Encoding utf8
Write-Host "Updated .env file with Supabase credentials!"

