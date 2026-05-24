const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

// Paths to the OAuth2 credentials files in the SimplyMobility root folder
const SECRETS_PATH = path.join(__dirname, '..', '..', 'client_secrets.json');
const TOKEN_PATH = path.join(__dirname, '..', '..', 'leslies_oauth_tokens.json');

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

async function syncPerformance() {
    console.log("Starting Leslie's GSC Performance Sync...");
    
    const connStr = getDatabaseUrl();
    if (!connStr) {
        console.error("Error: DATABASE_URL not found.");
        process.exit(1);
    }

    const pgClient = new Client({ connectionString: connStr });
    await pgClient.connect();

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
            
            let updated = 0;
            for (const row of resPages.data.rows) {
                const pageUrl = row.keys[0];
                const updateQuery = `
                    UPDATE page_indexing 
                    SET clicks = $1, impressions = $2, ctr = $3, position = $4, updated_at = NOW() 
                    WHERE url = $5
                `;
                const res = await pgClient.query(updateQuery, [
                    row.clicks,
                    row.impressions,
                    row.ctr || 0.0,
                    row.position || 0.0,
                    pageUrl
                ]);
                if (res.rowCount > 0) {
                    updated++;
                }
            }
            console.log(`Database updated successfully. Matched and updated ${updated} URLs in Leslie's PostgreSQL page_indexing.`);
        } else {
            console.log("No page data found in GSC for this period.");
        }

    } catch (error) {
        console.error("Error syncing performance data:", error.message);
    } finally {
        await pgClient.end();
    }
}

syncPerformance().catch(console.error);
