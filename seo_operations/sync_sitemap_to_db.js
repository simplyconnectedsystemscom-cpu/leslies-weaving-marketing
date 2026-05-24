const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'seo_state.db');
const SITEMAP_URL = 'https://lesliesweavingstudio.com/sitemap-marketing.xml';

async function syncSitemap() {
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

        const db = new sqlite3.Database(DB_PATH);
        
        db.serialize(() => {
            // Purge old invalid shorthand URLs first (no additional slash after /fabric/)
            db.run(`
                DELETE FROM page_indexing 
                WHERE url LIKE '%/fabric/%' AND url NOT LIKE '%/fabric/%/%'
            `, function(err) {
                if (err) {
                    console.error("Failed to purge invalid shorthand URLs:", err.message);
                } else {
                    console.log(`Purged ${this.changes} invalid shorthand URLs from the indexing queue.`);
                }
            });

            // Purge old non-www URLs (to prevent duplicate queue entries)
            db.run(`
                DELETE FROM page_indexing 
                WHERE url LIKE 'https://lesliesweavingstudio.com/%'
            `, function(err) {
                if (err) {
                    console.error("Failed to purge non-www URLs:", err.message);
                } else {
                    console.log(`Purged ${this.changes} non-www URLs from the indexing queue.`);
                }
            });

            db.run('BEGIN TRANSACTION');
            
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO page_indexing (url, ab_group) 
                VALUES (?, ?)
            `);
            
            let inserted = 0;
            const groups = ['A', 'B', 'C'];
            
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                // Randomly assign A, B, or C to split the load for the API
                const group = groups[i % 3]; 
                
                stmt.run(url, group, function(err) {
                    if (!err && this.changes > 0) {
                        inserted++;
                    }
                });
            }
            
            stmt.finalize();
            
            db.run('COMMIT', (err) => {
                if (err) {
                    console.error("Transaction commit failed:", err);
                } else {
                    console.log(`Sitemap sync complete. Added ${inserted} new URLs to the queue.`);
                }
                db.close();
            });
        });

    } catch (error) {
        console.error("Error syncing sitemap:", error.message);
    }
}

syncSitemap();
