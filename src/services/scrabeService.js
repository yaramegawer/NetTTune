import axios from 'axios';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const cheerio = require('cheerio');
import { Content } from '../../DB/models/contentModel.js';
import puppeteer from 'puppeteer';
import pLimit from 'p-limit';

const baseUrl = 'https://ww25.soap2day.day';
const listingPath = '/movies-2kjgs';
const listPageLimit = pLimit(6);         // Controls list page concurrency
const puppeteerLimit = pLimit(4);        // Controls Puppeteer usage

async function getTotalPages() {
  const { data } = await axios.get(`${baseUrl}${listingPath}`);
  const $ = cheerio.load(data);
  const lastPageLink = $('ul.pagination li a').last().attr('href');
  const match = lastPageLink?.match(/page\/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

async function scrapeMovies() {                                                                                                                                                                                                                                                                
  const totalPages = await getTotalPages();
  console.log(`🔎 Total pages: ${totalPages}`);
  const browser = await puppeteer.launch({ headless: true });

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
    const { data } = await axios.get(pageUrl, { timeout: 10000 });
    const $ = cheerio.load(data);
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
    const { data } = await axios.get(movieUrl, { timeout: 10000 });
    const $ = cheerio.load(data);

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
