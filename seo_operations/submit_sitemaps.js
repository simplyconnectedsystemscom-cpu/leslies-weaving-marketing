const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const KEY_PATH = path.join(__dirname, '../../leslies-weaving-site/server/gsc-service-account.json');

async function main() {
    console.log("Loading Service Account credentials from:", KEY_PATH);
    if (!fs.existsSync(KEY_PATH)) {
        console.error("Credentials file not found!");
        process.exit(1);
    }
    
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_PATH,
        scopes: ['https://www.googleapis.com/auth/webmasters']
    });
    
    const searchconsole = google.searchconsole({
        version: 'v1',
        auth: auth
    });
    
    const targetSites = [
        'https://www.lesliesweavingstudio.com/',
        'https://lesliesweavingstudio.com/',
        'sc-domain:lesliesweavingstudio.com'
    ];
    
    const sitemaps = [
        'https://lesliesweavingstudio.com/sitemap.xml',
        'https://lesliesweavingstudio.com/sitemap-marketing.xml'
    ];
    
    for (const siteUrl of targetSites) {
        console.log(`\nChecking properties for site: ${siteUrl}`);
        for (const feedpath of sitemaps) {
            try {
                console.log(`Submitting sitemap: ${feedpath} to ${siteUrl}`);
                await searchconsole.sitemaps.submit({
                    siteUrl: siteUrl,
                    feedpath: feedpath
                });
                console.log(`[SUCCESS] Sitemap submitted successfully!`);
            } catch (err) {
                console.log(`[FAILED] Submission failed for ${siteUrl}: ${err.message}`);
            }
        }
    }
}

main().catch(console.error);
