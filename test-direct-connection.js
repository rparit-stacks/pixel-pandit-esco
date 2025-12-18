const { Client } = require('pg')
require('dotenv').config()

async function testDirectConnection() {
  const password = 'gZFXy2Bmggmcb3hV'
  const projectRef = 'qfikoqozexxaucrugkao'
  
  const directUrls = [
    `postgresql://postgres.${projectRef}:${password}@db.${projectRef}.supabase.co:5432/postgres`,
    `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
  ]
  
  for (const url of directUrls) {
    console.log(`\n🔄 Testing direct connection...`)
    console.log(`URL: ${url.replace(/:[^:@]+@/, ':****@')}`)
    
    const client = new Client({ connectionString: url })
    
    try {
      await client.connect()
      const result = await client.query('SELECT NOW() as time, current_database() as db')
      console.log(`✅ Direct connection SUCCESS!`)
      console.log(`   Time: ${result.rows[0].time}`)
      console.log(`   DB: ${result.rows[0].db}`)
      await client.end()
      console.log(`\n✅ Use this for DIRECT_URL: ${url}`)
      return url
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`)
      await client.end().catch(() => {})
    }
  }
  
  return null
}

testDirectConnection().catch(console.error)

