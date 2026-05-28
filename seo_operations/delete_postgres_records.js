const { Client } = require('pg');

const POSTGRES_CONN_STRING = "postgresql://neondb_owner:npg_P7TvY0rpwLcR@ep-plain-flower-an7t5aj5-pooler.c-6.us-east-1.aws.neon.tech/leslies_seo_db?channel_binding=require&sslmode=require";

async function main() {
    if (process.env.SEO_SYNC_AUTHORIZED !== 'true') {
        console.error("CRITICAL: Unauthorized execution attempt. Please set SEO_SYNC_AUTHORIZED=true to run this script.");
        process.exit(1);
    }
    console.log("Connecting to PostgreSQL...");
    const pgClient = new Client({ connectionString: POSTGRES_CONN_STRING });
    await pgClient.connect();

    try {
        // 1. Count keywords before delete
        const kwRes = await pgClient.query("SELECT COUNT(*) FROM combined_keywords WHERE keyword ILIKE '% Wall Coverings Coverings'");
        console.log(`Found ${kwRes.rows[0].count} matching keywords in PostgreSQL to delete.`);

        // 2. Count pages before delete
        const pageRes = await pgClient.query("SELECT COUNT(*) FROM page_indexing WHERE target_keyword ILIKE '% Wall Coverings Coverings'");
        console.log(`Found ${pageRes.rows[0].count} matching pages in PostgreSQL to delete.`);

        // 3. Perform deletes
        const deletePageRes = await pgClient.query("DELETE FROM page_indexing WHERE target_keyword ILIKE '% Wall Coverings Coverings'");
        console.log(`Deleted ${deletePageRes.rowCount} pages from PostgreSQL page_indexing.`);

        const deleteKwRes = await pgClient.query("DELETE FROM combined_keywords WHERE keyword ILIKE '% Wall Coverings Coverings'");
        console.log(`Deleted ${deleteKwRes.rowCount} keywords from PostgreSQL combined_keywords.`);

        // 4. Verify counts
        const totalKwRes = await pgClient.query("SELECT COUNT(*) FROM combined_keywords");
        const totalPagesRes = await pgClient.query("SELECT COUNT(*) FROM page_indexing");

        console.log(`Post-delete counts in PostgreSQL:`);
        console.log(`- Total keywords: ${totalKwRes.rows[0].count} (expected: 350)`);
        console.log(`- Total pages: ${totalPagesRes.rows[0].count} (expected: 35005)`);

    } catch (err) {
        console.error("Error modifying PostgreSQL:", err.message);
    } finally {
        await pgClient.end();
    }
}

main().catch(console.error);
