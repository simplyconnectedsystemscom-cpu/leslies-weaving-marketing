const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

// Paths to the OAuth2 credentials files in the SimplyMobility root folder
const SECRETS_PATH = path.join(__dirname, '..', '..', 'leslies_client_secrets.json');
const TOKEN_PATH = path.join(__dirname, '..', '..', 'leslies_oauth_tokens.json');

// We want exactly 66 URLs per group to hit ~198 total per day
const URLS_PER_GROUP = 66;
// Only push URLs that haven't been pushed in the last 7 days
const PUSH_COOLDOWN_DAYS = 7;

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

async function getBatchFromDB(client, group, limit) {
    const query = `
        SELECT url FROM page_indexing
        WHERE ab_group = $1 
          AND (last_pushed_at IS NULL OR last_pushed_at <= NOW() - INTERVAL '${PUSH_COOLDOWN_DAYS} days')
        ORDER BY last_pushed_at ASC NULLS FIRST
        LIMIT $2
    `;
    const res = await client.query(query, [group, limit]);
    return res.rows.map(r => r.url);
}

async function updateUrlStatus(client, url, status, errorMessage = null) {
    const query = `
        UPDATE page_indexing
        SET last_pushed_at = CURRENT_TIMESTAMP, status = $1, error_message = $2
        WHERE url = $3
    `;
    await client.query(query, [status, errorMessage, url]);
}

async function main() {
    const connStr = getDatabaseUrl();
    if (!connStr) {
        console.error("Error: DATABASE_URL not found.");
        process.exit(1);
    }

    console.log("Connecting to Leslie's PostgreSQL SEO Database...");
    const client = new Client({ connectionString: connStr });
    await client.connect();

    try {
        console.log(`Querying ${URLS_PER_GROUP} URLs for each group (A, B, C)...`);
        const groupA = await getBatchFromDB(client, 'A', URLS_PER_GROUP);
        const groupB = await getBatchFromDB(client, 'B', URLS_PER_GROUP);
        const groupC = await getBatchFromDB(client, 'C', URLS_PER_GROUP);

        const urlsToPush = [...groupA, ...groupB, ...groupC];
        console.log(`Found ${groupA.length} for Group A.`);
        console.log(`Found ${groupB.length} for Group B.`);
        console.log(`Found ${groupC.length} for Group C.`);
        console.log(`Total batch to push today: ${urlsToPush.length}`);

        if (urlsToPush.length === 0) {
            console.log("No URLs eligible for pushing today. Exiting.");
            return;
        }

        console.log(`Authenticating with Google Indexing API (OAuth2)...`);
        if (!fs.existsSync(SECRETS_PATH) || !fs.existsSync(TOKEN_PATH)) {
            throw new Error(`Missing OAuth2 files! Please ensure client_secrets.json and leslies_oauth_tokens.json exist.`);
        }

        const credentials = JSON.parse(fs.readFileSync(SECRETS_PATH));
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
        const config = credentials.installed || credentials.web;
        if (!config) {
            throw new Error("Invalid client_secrets.json structure: must contain 'installed' or 'web' object.");
        }

        const oauth2Client = new google.auth.OAuth2(
            config.client_id,
            config.client_secret,
            'http://localhost:8765/oauth2callback'
        );

        oauth2Client.setCredentials(tokens);

        // Keep tokens fresh
        oauth2Client.on('tokens', (newTokens) => {
            console.log('Saving refreshed OAuth2 tokens...');
            const currentTokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
            const updated = { ...currentTokens, ...newTokens };
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
        });

        let successCount = 0;
        let failCount = 0;

        for (const url of urlsToPush) {
            try {
                await oauth2Client.request({
                    url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
                    method: 'POST',
                    data: { url: url, type: 'URL_UPDATED' },
                    headers: { 'Content-Type': 'application/json' }
                });
                
                await updateUrlStatus(client, url, 'success');
                successCount++;
                console.log(`[SUCCESS] Pushed: ${url}`);
            } catch (err) {
                failCount++;
                await updateUrlStatus(client, url, 'failed', err.message);
                console.log(`[FAILED] ${url} - ${err.message}`);
                
                if (err.message.includes('Indexing API has not been used')) {
                    console.error("\nCRITICAL: API needs to be enabled for this service account!");
                    break;
                }
            }
            
            // Sleep to avoid rate limits
            await new Promise(r => setTimeout(r, 500));
        }
        
        console.log(`\nBatch Complete! Successfully pushed: ${successCount} | Failed: ${failCount}`);

    } catch (e) {
        console.error("Script failed:", e.message);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
