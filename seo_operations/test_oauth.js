const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SECRETS_PATH = path.join(__dirname, '../../leslies_client_secrets.json');
const TOKEN_PATH = path.join(__dirname, '../../leslies_oauth_tokens.json');

async function main() {
    console.log("Loading OAuth2 credentials...");
    if (!fs.existsSync(SECRETS_PATH) || !fs.existsSync(TOKEN_PATH)) {
        console.error("Missing files!");
        process.exit(1);
    }
    
    const credentials = JSON.parse(fs.readFileSync(SECRETS_PATH));
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    
    const config = credentials.installed || credentials.web;
    if (!config) {
        console.error("Invalid client secrets format");
        process.exit(1);
    }
    
    const redirectUri = (config.redirect_uris && config.redirect_uris[0]) || 'http://localhost:8765/oauth2callback';
    console.log("Using redirect URI:", redirectUri);
    
    const oauth2Client = new google.auth.OAuth2(
        config.client_id,
        config.client_secret,
        redirectUri
    );
    
    oauth2Client.setCredentials(tokens);
    
    oauth2Client.on('tokens', (newTokens) => {
        console.log('Successfully refreshed and received new tokens!');
        const currentTokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
        const updated = { ...currentTokens, ...newTokens };
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
        console.log("New tokens saved.");
    });
    
    try {
        console.log("Testing token refresh by requesting access token...");
        const response = await oauth2Client.getAccessToken();
        console.log("Access token retrieved successfully!");
        console.log("Token starts with:", response.token.substring(0, 15) + "...");
        
        // Let's try listing verified sites to verify Search Console access
        const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
        const listRes = await searchconsole.sites.list();
        console.log("\nVerified Sites in Search Console:");
        console.log(listRes.data.siteEntry.map(s => s.siteUrl));
        
    } catch (err) {
        console.error("\nOAuth authentication test FAILED:", err.message);
    }
}

main().catch(console.error);
