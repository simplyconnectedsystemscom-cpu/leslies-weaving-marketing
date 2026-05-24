const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Paths to the OAuth2 credentials files in the SimplyMobility root folder
const SECRETS_PATH = path.join(__dirname, '..', '..', 'client_secrets.json');
const TOKEN_PATH = path.join(__dirname, '..', '..', 'leslies_oauth_tokens.json');
const DB_PATH = path.join(__dirname, 'seo_state.db');

async function syncPerformance() {
    console.log("Starting Leslie's GSC Performance Sync...");
    
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
            process.exit(1);
        }
    });

    try {
        if (!fs.existsSync(SECRETS_PATH) || !fs.existsSync(TOKEN_PATH)) {
            throw new Error(`Missing OAuth2 files! Please ensure client_secrets.json and leslies_oauth_tokens.json exist.`);
        }

        const credentials = JSON.parse(fs.readFileSync(SECRETS_PATH));
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));

        const oauth2Client = new google.auth.OAuth2(
            credentials.installed.client_id,
            credentials.installed.client_secret,
            'http://localhost:8765/oauth2callback'
        );

        oauth2Client.setCredentials(tokens);

        // Keep tokens fresh
        oauth2Client.on('tokens', (newTokens) => {
            console.log("Saving refreshed OAuth2 tokens for Leslie's Sync...");
            const currentTokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
            const updated = { ...currentTokens, ...newTokens };
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
        });

        const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const siteUrl = 'sc-domain:lesliesweavingstudio.com';

        console.log(`Querying Google Search Console for ${siteUrl} (${startDate} to ${endDate})...`);

        const resPages = await searchconsole.searchanalytics.query({
            siteUrl: siteUrl,
            requestBody: {
                startDate,
                endDate,
                dimensions: ['page'],
                rowLimit: 5000,
            },
        });

        if (resPages.data.rows) {
            console.log(`Found performance data for ${resPages.data.rows.length} pages.`);
            
            const stmt = db.prepare(`UPDATE page_indexing SET clicks = ?, impressions = ?, ctr = ?, position = ? WHERE url = ?`);
            
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                let updated = 0;
                for (const row of resPages.data.rows) {
                    const pageUrl = row.keys[0];
                    stmt.run(row.clicks, row.impressions, row.ctr || 0.0, row.position || 0.0, pageUrl, function(err) {
                        if (!err && this.changes > 0) {
                            updated++;
                        }
                    });
                }
                stmt.finalize();
                db.run('COMMIT', (err) => {
                    if (err) {
                        console.error("Transaction commit failed:", err);
                    } else {
                        console.log(`Database updated successfully. Matched and updated ${updated} URLs in Leslie's seo_state.db.`);
                    }
                    db.close();
                });
            });
        } else {
            console.log("No page data found in GSC for this period.");
            db.close();
        }

    } catch (error) {
        console.error("Error syncing performance data:", error.message);
        db.close();
    }
}

syncPerformance();
