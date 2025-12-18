const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function testConnection(url, description) {
  console.log(`\n🔄 Testing: ${description}`)
  console.log(`URL: ${url.replace(/:[^:@]+@/, ':****@')}`)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  })
  
  try {
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT NOW() as time, current_database() as db`
    console.log(`✅ SUCCESS! Time: ${result[0].time}, DB: ${result[0].db}`)
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.log(`❌ FAILED: ${error.message.split('\n')[0]}`)
    await prisma.$disconnect().catch(() => {})
    return false
  }
}

async function main() {
  console.log('Testing Supabase Connection Strings...\n')
  
  const password = 'gZFXy2Bmggmcb3hV'
  const projectRef = 'qfikoqozexxaucrugkao'
  
  const connections = [
    // Connection pooling (for app)
    {
      url: `postgresql://postgres.${projectRef}:${password}@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`,
      desc: 'Connection Pooling (6543)'
    },
    // Direct connection options
    {
      url: `postgresql://postgres.${projectRef}:${password}@db.${projectRef}.supabase.co:5432/postgres`,
      desc: 'Direct Connection (db.*.supabase.co:5432)'
    },
    {
      url: `postgresql://postgres.${projectRef}:${password}@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`,
      desc: 'Direct via Pooler (5432) - Current'
    },
    {
      url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
      desc: 'Direct with postgres user (no project prefix)'
    }
  ]
  
  for (const conn of connections) {
    const success = await testConnection(conn.url, conn.desc)
    if (success) {
      console.log(`\n✅ Working connection found: ${conn.desc}`)
      console.log(`Use this URL: ${conn.url}`)
      break
    }
  }
}

main().catch(console.error)

