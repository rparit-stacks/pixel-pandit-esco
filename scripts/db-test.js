const fs = require("fs")
const { Client } = require("pg")

function loadDatabaseUrl() {
  // Prefer env variable if already exported
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  // Fallback: read from .env file locally
  try {
    const envLines = fs.readFileSync(".env", "utf8").split(/\r?\n/)
    const line = envLines.find((l) => l.trim().startsWith("DATABASE_URL="))
    return line ? line.slice("DATABASE_URL=".length) : ""
  } catch (err) {
    return ""
  }
}

async function main() {
  // Disable TLS verification for this test (Aiven uses custom CA)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

  const connectionString = loadDatabaseUrl()
  if (!connectionString) {
    console.error("DATABASE_URL is missing. Set it in .env or environment.")
    process.exit(1)
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }, // quick test: skip CA validation
  })

  try {
    await client.connect()
    const { rows } = await client.query("select now() as now")
    console.log("✅ Connected to Postgres. Server time:", rows[0].now)
  } catch (err) {
    console.error("❌ Connection failed:", err.message)
    process.exit(1)
  } finally {
    await client.end().catch(() => {})
  }
}

main()

