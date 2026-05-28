const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
require('dotenv').config();

// 1. Check local SQLite
const db = new sqlite3.Database('./seo_operations/seo_state.db');
db.all("SELECT slug_category, COUNT(*), MIN(url), MAX(url) FROM page_indexing GROUP BY slug_category", (err, rows) => {
  if (err) {
    console.error("SQLite Error:", err);
  } else {
    console.log("SQLite slug_category counts:");
    console.log(rows);
  }
  
  // 2. Check Postgres
  checkPostgres().catch(console.error);
});

async function checkPostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query(
    "SELECT slug_category, COUNT(*), MIN(url), MAX(url) FROM page_indexing GROUP BY slug_category"
  );
  console.log("Postgres slug_category counts:");
  console.log(res.rows);
  await client.end();
}
