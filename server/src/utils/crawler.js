const axios = require('axios');
const { Firecrawl: FirecrawlApp } = require('@mendable/firecrawl-js');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const config = require('../config/config');

const extractUrls = (text) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
};

const crawlWithFirecrawl = async (url) => {
    if (!config.crawlers.firecrawlApiKey) {
        throw new Error('Firecrawl API key not configured');
    }
    const app = new FirecrawlApp({ apiKey: config.crawlers.firecrawlApiKey });
    const scrapeResult = await app.scrape(url, { formats: ['markdown'] });
    
    if (scrapeResult && (scrapeResult.markdown || scrapeResult.data?.markdown)) {
        return scrapeResult.markdown || scrapeResult.data.markdown;
    }
    
    console.error('Firecrawl Error Object:', JSON.stringify(scrapeResult, null, 2));
    throw new Error(`Firecrawl failed: ${scrapeResult.error || 'No content found'}`);
};

const crawlWithJina = async (url) => {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const headers = {};
    if (config.crawlers.jinaApiKey) {
        headers['Authorization'] = `Bearer ${config.crawlers.jinaApiKey}`;
    }
    
    const response = await axios.get(jinaUrl, { headers, timeout: 30000 });
    return response.data;
};

const crawlWithPuppeteer = async (url) => {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
        
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } catch (gotoError) {
            console.warn(`Initial goto failed: ${gotoError.message}`);
        }
        
        await page.waitForSelector('body', { timeout: 10000 }).catch(() => {});
        
        const content = await page.content();
        const $ = cheerio.load(content);
        
        $('script, style, nav, footer, header').remove();
        
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        
        return bodyText.slice(0, 10000);
    } finally {
        if (browser) await browser.close();
    }
};

const crawlUrl = async (url) => {
    console.log(`Attempting to crawl: ${url}`);
    
    try {
        console.log('Trying Firecrawl...');
        return await crawlWithFirecrawl(url);
    } catch (err) {
        console.warn(`Firecrawl failed for ${url}:`, err.message);
    }

    try {
        console.log('Trying Jina Reader...');
        return await crawlWithJina(url);
    } catch (err) {
        console.warn(`Jina Reader failed for ${url}:`, err.message);
    }

    try {
        console.log('Trying Puppeteer...');
        return await crawlWithPuppeteer(url);
    } catch (err) {
        console.error(`Puppeteer failed for ${url}:`, err.message);
        throw new Error(`All crawlers failed for ${url}`);
    }
};

const enrichPromptWithWebData = async (prompt) => {
    const urls = extractUrls(prompt);
    if (urls.length === 0) return prompt;

    let enrichedPrompt = prompt;
    for (const url of urls) {
        try {
            let webContent = await crawlUrl(url);
            
            if (webContent.length > 8000) {
                webContent = webContent.slice(0, 8000) + "... [Content truncated due to size]";
            }

            enrichedPrompt += `\n\n--- Web Content from ${url} ---\n${webContent}\n------------------------\n`;
        } catch (err) {
            console.error(`Failed to enrich prompt with ${url}:`, err.message);
        }
    }
    
    return enrichedPrompt;
};

module.exports = {
    crawlUrl,
    enrichPromptWithWebData,
    extractUrls
};
