const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Paths to the OAuth2 credentials files in the SimplyMobility root folder
const SECRETS_PATH = path.join(__dirname, '..', '..', 'client_secrets.json');
const TOKEN_PATH = path.join(__dirname, '..', '..', 'leslies_oauth_tokens.json');
const DB_PATH = path.join(__dirname, 'seo_state.db');

// We want exactly 66 URLs per group to hit ~198 total per day
const URLS_PER_GROUP = 66;
// Only push URLs that haven't been pushed in the last 7 days
const PUSH_COOLDOWN_DAYS = 7;

function getBatchFromDB(db, group, limit) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT url FROM page_indexing
            WHERE ab_group = ? 
              AND (last_pushed_at IS NULL OR last_pushed_at <= datetime('now', '-${PUSH_COOLDOWN_DAYS} days'))
            ORDER BY last_pushed_at ASC /* nulls first, then oldest */
            LIMIT ?
        `;
        db.all(query, [group, limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.url));
        });
    });
}

function updateUrlStatus(db, url, status, errorMessage = null) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE page_indexing
            SET last_pushed_at = CURRENT_TIMESTAMP, status = ?, error_message = ?
            WHERE url = ?
        `;
        db.run(query, [status, errorMessage, url], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

async function main() {
    console.log("Connecting to Leslie's SEO State Database...");
    const db = new sqlite3.Database(DB_PATH);

    try {
        console.log(`Querying ${URLS_PER_GROUP} URLs for each group (A, B, C)...`);
        const groupA = await getBatchFromDB(db, 'A', URLS_PER_GROUP);
        const groupB = await getBatchFromDB(db, 'B', URLS_PER_GROUP);
        const groupC = await getBatchFromDB(db, 'C', URLS_PER_GROUP);

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

        const oauth2Client = new google.auth.OAuth2(
            credentials.installed.client_id,
            credentials.installed.client_secret,
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
                
                await updateUrlStatus(db, url, 'success');
                successCount++;
                console.log(`[SUCCESS] Pushed: ${url}`);
            } catch (err) {
                failCount++;
                await updateUrlStatus(db, url, 'failed', err.message);
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
        db.close();
    }
}

main();
