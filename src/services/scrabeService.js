import axios from 'axios';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');
import { Content } from '../../DB/models/contentModel.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import pLimit from 'p-limit';

puppeteer.use(StealthPlugin());

const baseUrl = 'https://ww25.soap2day.day';
const listingPath = '/movies';
const listPageLimit = pLimit(3);
const puppeteerLimit = pLimit(2);

const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

async function getTotalPages() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });
  
  // Visit homepage first to establish session
  await new Promise(resolve => setTimeout(resolve, randomDelay(2000, 4000)));
  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(resolve => setTimeout(resolve, randomDelay(3000, 5000)));
  
  // Then navigate to movies
  await page.goto(`${baseUrl}${listingPath}`, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(resolve => setTimeout(resolve, randomDelay(3000, 5000)));
  
  const content = await page.content();
  await browser.close();
  
  const $ = cheerio.load(content);
  const lastPageLink = $('ul.pagination li a').last().attr('href');
  const match = lastPageLink?.match(/page\/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

async function scrapeMovies() {                                                                                                                                                                                                                                                                
  const totalPages = await getTotalPages();
  console.log(`🔎 Total pages: ${totalPages}`);
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  let savedCount = 0;
  const pageTasks = [];

  for (let page = 1; page <= totalPages; page++) {
    const pageUrl = `${baseUrl}${listingPath}/page/${page}/`;
    pageTasks.push(listPageLimit(() => scrapeMovieListPage(pageUrl, browser)));
  }

  const results = await Promise.all(pageTasks);
  for (const saved of results.flat()) {
    if (saved) savedCount++;
  }

  await browser.close();
  console.log(`🎉 Finished. Total new movies saved: ${savedCount}`);
}

async function scrapeMovieListPage(pageUrl, browser) {
  console.log(`📄 Scraping: ${pageUrl}`);
  try {
    const page = await browser.newPage();
    
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.google.com/'
    });
    
    await new Promise(resolve => setTimeout(resolve, randomDelay(3000, 6000)));
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, randomDelay(3000, 5000)));
    
    const content = await page.content();
    await page.close();
    
    const $ = cheerio.load(content);
    const elements = $('.ml-item').toArray();

    const movieTasks = elements.map(async el => {
      const linkPath = $(el).find('a').attr('href');
      const imageUrl = $(el).find('img').attr('data-original');
      const title = $(el).find('a').attr('oldtitle')?.trim();
      const movieUrl = linkPath?.startsWith('http') ? linkPath : `${baseUrl}${linkPath}`;
      const description = $(el).find('#hidden_tip p.f-desc').next().text().trim();

      if (!title || await Content.findOne({ title })) return null;

      const details = await scrapeMovieDetails(movieUrl, browser);

      const movie = {
        title,
        description,
        genre: details.genre || [],
        rating: details.rating || 0,
        image: { url: imageUrl?.startsWith('http') ? imageUrl : `https:${imageUrl}` },
        videoUrl: details.videoUrl,
        type: 'movie',
      };

      if (!movie.videoUrl) return null;

      try {
        await Content.create(movie);
        console.log(`✅ Saved: ${movie.title}`);
        return true;
      } catch (err) {
        console.error(`❌ Failed to save ${movie.title}:`, err.message);
        return null;
      }
    });

    return await Promise.all(movieTasks);
  } catch (err) {
    console.error(`❌ Error scraping ${pageUrl}:`, err.message);
    return [];
  }
}

async function scrapeMovieDetails(movieUrl, browser) {
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
    
    await new Promise(resolve => setTimeout(resolve, randomDelay(2000, 5000)));
    await page.goto(movieUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, randomDelay(2000, 4000)));
    
    const content = await page.content();
    await page.close();
    
    const $ = cheerio.load(content);

    const genreArray = [];
    $('p:contains("Genre:") a').each((_, el) => genreArray.push($(el).text().trim()));
    const rating = parseFloat($('span.imdb-r').text().trim()) || 0;
    const iframeSrc = $('iframe').first().attr('src');
    const rawUrl = iframeSrc?.startsWith('http') ? iframeSrc : `https:${iframeSrc}`;

    const cleanUrl = await puppeteerLimit(() => getCleanVideoUrl(rawUrl, browser));

    return {
      genre: genreArray,
      rating,
      videoUrl: cleanUrl,
    };
  } catch (err) {
    console.error('❌ Error getting details:', err.message);
    return { genre: [], rating: 0, videoUrl: null };
  }
}

async function getCleanVideoUrl(embedUrl, browser) {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', req => {
      const url = req.url();
      const blocked = ['ads', 'doubleclick', 'googlesyndication', 'pop', 'banner', 'analytics'];
      if (blocked.some(b => url.includes(b))) req.abort();
      else req.continue();
    });

    await page.goto(embedUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('iframe, video', { timeout: 5000 });

    const src = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      if (iframe?.src?.startsWith('http')) return iframe.src;
      const video = document.querySelector('video');
      return video?.src || null;
    });

    await page.close();
    return src;
  } catch (err) {
    console.error('⚠️ Video extract error:', err.message);
    return null;
  }
}

export { scrapeMovies };
