const https = require('https');

const url = 'https://leslies-weaving-marketing.vercel.app/sitemap.xml';
console.log(`Fetching production sitemap from Vercel: ${url}`);

https.get(url, (res) => {
    const { statusCode } = res;
    console.log(`Status Code: ${statusCode}`);
    if (statusCode !== 200) {
        console.error('Request failed!');
        res.resume();
        return;
    }
    
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        console.log(`Length of XML: ${rawData.length} characters.`);
        
        // Count url and loc tags
        const urlOpenCount = (rawData.match(/<url>/g) || []).length;
        const urlCloseCount = (rawData.match(/<\/url>/g) || []).length;
        const locOpenCount = (rawData.match(/<loc>/g) || []).length;
        const locCloseCount = (rawData.match(/<\/loc>/g) || []).length;
        
        console.log(`Tag counts:`);
        console.log(`- <url> opening: ${urlOpenCount}, closing: ${urlCloseCount}`);
        console.log(`- <loc> opening: ${locOpenCount}, closing: ${locCloseCount}`);

        const urls = [...rawData.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map(m => m[1]);
        console.log(`Total URLs: ${urls.length}`);
        
        const uniqueUrls = new Set(urls);
        console.log(`Unique URLs: ${uniqueUrls.size}`);
        console.log(`Duplicate URLs: ${urls.length - uniqueUrls.size}`);

        console.log(`First 5 URLs:`, urls.slice(0, 5));
        console.log(`Last 5 URLs:`, urls.slice(-5));
        
        if (urls.length === 35005 && uniqueUrls.size === 35005) {
            console.log('[SUCCESS] Production sitemap is 100% correct!');
        } else {
            console.warn('[WARNING] Production sitemap length or uniqueness mismatch!');
        }
    });
}).on('error', (e) => {
    console.error(`Error: ${e.message}`);
});
