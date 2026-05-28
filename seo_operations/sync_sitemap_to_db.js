const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const SITEMAP_URL = 'https://lesliesweavingstudio.com/sitemap-marketing.xml';

function getDatabaseUrl() {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.startsWith('DATABASE_URL=')) {
                let val = trimmed.substring('DATABASE_URL='.length).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                return val;
            }
        }
    }
    return process.env.DATABASE_URL;
}

async function syncSitemap() {
    if (process.env.SEO_SYNC_AUTHORIZED !== 'true') {
        console.error("CRITICAL: Unauthorized execution attempt. Please set SEO_SYNC_AUTHORIZED=true to run this script.");
        process.exit(1);
    }
    console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
    
    try {
        const response = await fetch(SITEMAP_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
        }
        
        const xmlText = await response.text();
        
        // Simple regex to extract all <loc> tags from the XML
        const locRegex = /<loc>(.*?)<\/loc>/g;
        let match;
        const urls = [];
        
        while ((match = locRegex.exec(xmlText)) !== null) {
            urls.push(match[1]);
        }
        
        console.log(`Found ${urls.length} URLs in sitemap.`);
        
        if (urls.length === 0) {
            console.log("No URLs found. Exiting.");
            return;
        }

        const connStr = getDatabaseUrl();
        if (!connStr) {
            console.error("Error: DATABASE_URL not found.");
            process.exit(1);
        }

        const pgClient = new Client({ connectionString: connStr });
        await pgClient.connect();

        try {
            // Purge old invalid shorthand URLs first (no additional slash after /fabric/)
            const purgeRes1 = await pgClient.query(`
                DELETE FROM page_indexing 
                WHERE url LIKE '%/fabric/%' AND url NOT LIKE '%/fabric/%/%'
            `);
            console.log(`Purged ${purgeRes1.rowCount} invalid shorthand URLs from the indexing queue.`);

            // Purge old non-www URLs (to prevent duplicate queue entries)
            const purgeRes2 = await pgClient.query(`
                DELETE FROM page_indexing 
                WHERE url LIKE 'https://lesliesweavingstudio.com/%'
            `);
            console.log(`Purged ${purgeRes2.rowCount} non-www URLs from the indexing queue.`);

            let inserted = 0;
            const groups = ['A', 'B', 'C'];
            
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                // Randomly assign A, B, or C to split the load for the API
                const group = groups[i % 3]; 
                
                const insertQuery = `
                    INSERT INTO page_indexing (url, ab_group) 
                    VALUES ($1, $2)
                    ON CONFLICT (url) DO NOTHING
                `;
                const res = await pgClient.query(insertQuery, [url, group]);
                if (res.rowCount > 0) {
                    inserted++;
                }
            }
            
            console.log(`Sitemap sync complete. Added ${inserted} new URLs to the queue.`);

        } catch (dbErr) {
            console.error("Database operation failed:", dbErr.message);
        } finally {
            await pgClient.end();
        }

    } catch (error) {
        console.error("Error syncing sitemap:", error.message);
    }
}

syncSitemap().catch(console.error);
