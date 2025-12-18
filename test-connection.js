const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to database!')
    
    // Test query
    const result = await prisma.$queryRaw`
      SELECT 
        NOW() as current_time,
        current_database() as database_name,
        version() as postgres_version
    `
    
    console.log('\n📊 Database Info:')
    console.log('  Time:', result[0].current_time)
    console.log('  Database:', result[0].database_name)
    console.log('  PostgreSQL:', result[0].postgres_version.split(',')[0])
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    console.log('\n📋 Tables found:', tables.length)
    tables.forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.table_name}`)
    })
    
    // Check ChatMessage table structure
    const chatMessageColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ChatMessage'
      ORDER BY ordinal_position
    `
    
    console.log('\n🔍 ChatMessage table columns:')
    chatMessageColumns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })
    
    console.log('\n✅ Connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    console.error('Error details:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

