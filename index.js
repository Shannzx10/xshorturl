const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');
const FormData = require('form-data');

class XShortUrl {
  constructor(config = {}) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      useRandomProvider: true,
      ...config
    };
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  getRandomProvider() {
    const providers = ['shorturlat', 'h1nu', 'shorturlbase', 'cliknow', 'shorturlst'];
    return providers[Math.floor(Math.random() * providers.length)];
  }

  async withRetry(fn, retries = this.config.retries) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * (i + 1)));
      }
    }
  }

  async shorturlAt(longUrl) {
    if (!this.isValidUrl(longUrl)) {
      throw new Error('Invalid URL provided');
    }

    return this.withRetry(async () => {
      const data = qs.stringify({ 'u': longUrl });
      
      const response = await axios.post('https://www.shorturl.at/shortener.php', data, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Content-Type': 'application/x-www-form-urlencoded',
          'origin': 'https://www.shorturl.at',
          'referer': 'https://www.shorturl.at/'
        },
        timeout: this.config.timeout
      });

      const $ = cheerio.load(response.data);
      const shortUrl = $('#shortenurl').val();

      if (!shortUrl) {
        throw new Error('Failed to get short URL from shorturl.at');
      }

      return {
        shortUrl: shortUrl,
        originalUrl: longUrl,
        provider: 'shorturlat',
        createdAt: new Date().toISOString()
      };
    });
  }

  async h1nu(longUrl, alias = null) {
    if (!this.isValidUrl(longUrl)) {
      throw new Error('Invalid URL provided');
    }

    return this.withRetry(async () => {
      const data = qs.stringify({
        'url': longUrl,
        'keyword': alias
      });

      const response = await axios.post('https://h1.nu', data, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Content-Type': 'application/x-www-form-urlencoded',
          'origin': 'https://h1.nu',
          'referer': 'https://h1.nu/'
        },
        timeout: this.config.timeout
      });

      const $ = cheerio.load(response.data);
      const shortUrl = $('input.short-url').val();

      if (!shortUrl) {
        throw new Error('Failed to get short URL from h1.nu');
      }

      return {
        shortUrl: shortUrl,
        originalUrl: longUrl,
        provider: 'h1nu',
        alias: alias,
        createdAt: new Date().toISOString()
      };
    });
  }

  async shorturlbase(longUrl) {
    if (!this.isValidUrl(longUrl)) {
      throw new Error('Invalid URL provided');
    }

    return this.withRetry(async () => {
      const data = JSON.stringify({
        "longUrl": longUrl
      });

      const response = await axios.post('https://shorturlbase.com/api/url', data, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
          'Content-Type': 'application/json',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'dnt': '1',
          'sec-ch-ua-mobile': '?1',
          'origin': 'https://shorturlbase.com',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://shorturlbase.com/',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i'
        },
        timeout: this.config.timeout
      });

      if (!response.data || !response.data.url || !response.data.url.fullShortUrl) {
        throw new Error('Failed to get short URL from shorturlbase.com');
      }

      return {
        shortUrl: response.data.url.fullShortUrl,
        originalUrl: longUrl,
        provider: 'shorturlbase',
        createdAt: new Date().toISOString()
      };
    });
  }

  async cliknow(longUrl, alias = null) {
    if (!this.isValidUrl(longUrl)) {
      throw new Error('Invalid URL provided');
    }

    return this.withRetry(async () => {
      const data = qs.stringify({
        'url': longUrl,
        'personalize': alias
      });

      const response = await axios.post('https://clik.now/en/shorten', data, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'max-age=0',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'origin': 'https://clik.now',
          'dnt': '1',
          'upgrade-insecure-requests': '1',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-user': '?1',
          'sec-fetch-dest': 'document',
          'referer': 'https://clik.now/en',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=0, i'
        },
        timeout: this.config.timeout
      });

      const $ = cheerio.load(response.data);
      const shortUrl = $('#shortenedUrl').text().trim();

      if (!shortUrl) {
        throw new Error('Failed to get short URL from clik.now');
      }

      return {
        shortUrl: shortUrl,
        originalUrl: longUrl,
        provider: 'cliknow',
        alias: alias,
        createdAt: new Date().toISOString()
      };
    });
  }

  async shorturlst(longUrl) {
    if (!this.isValidUrl(longUrl)) {
      throw new Error('Invalid URL provided');
    }

    return this.withRetry(async () => {
      let data = new FormData();
      data.append('url', longUrl);

      const response = await axios.post('https://shorturl.st/shorten', data, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'sec-ch-ua-platform': '"Android"',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?1',
          'x-requested-with': 'XMLHttpRequest',
          'dnt': '1',
          'origin': 'https://shorturl.st',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'referer': 'https://shorturl.st/',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'priority': 'u=1, i',
          ...data.getHeaders()
        },
        timeout: this.config.timeout
      });

      if (!response.data || !response.data.data || !response.data.data.shorturl) {
        throw new Error('Failed to get short URL from shorturl.st');
      }

      return {
        shortUrl: response.data.data.shorturl,
        originalUrl: longUrl,
        provider: 'shorturlst',
        createdAt: new Date().toISOString()
      };
    });
  }

  async shorten(longUrl, options = {}) {
    const { provider, alias, fallback = true } = options;
    const targetProvider = provider || this.getRandomProvider();
    const providers = ['shorturlat', 'h1nu', 'shorturlbase', 'cliknow', 'shorturlst'];

    if (targetProvider && !fallback) {
      switch (targetProvider) {
        case 'shorturlat':
          return this.shorturlAt(longUrl);
        case 'h1nu':
          return this.h1nu(longUrl, alias);
        case 'shorturlbase':
          return this.shorturlbase(longUrl);
        case 'cliknow':
          return this.cliknow(longUrl, alias);
        case 'shorturlst':
          return this.shorturlst(longUrl);
        default:
          throw new Error(`Unknown provider: ${targetProvider}`);
      }
    }

    const tryProviders = targetProvider ? [targetProvider, ...providers.filter(p => p !== targetProvider)] : providers;
    
    for (const prov of tryProviders) {
      try {
        switch (prov) {
          case 'shorturlat':
            return await this.shorturlAt(longUrl);
          case 'h1nu':
            return await this.h1nu(longUrl, alias);
          case 'shorturlbase':
            return await this.shorturlbase(longUrl);
          case 'cliknow':
            return await this.cliknow(longUrl, alias);
          case 'shorturlst':
            return await this.shorturlst(longUrl);
        }
      } catch (error) {
        console.warn(`Provider ${prov} failed: ${error.message}`);
        continue;
      }
    }
    
    throw new Error('All providers failed to shorten the URL');
  }

  async shortenBatch(urls, options = {}) {
    const results = [];
    const { concurrency = 3 } = options;
    
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const batchPromises = batch.map(async (url) => {
        try {
          return await this.shorten(url, options);
        } catch (error) {
          return {
            originalUrl: url,
            error: error.message,
            success: false
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  getProviderInfo() {
    return {
      'shorturlat': {
        name: 'ShortURL.at',
        website: 'https://www.shorturl.at',
        supportsAlias: false
      },
      'h1nu': {
        name: 'H1.nu',
        website: 'https://h1.nu',
        supportsAlias: true
      },
      'shorturlbase': {
        name: 'ShortURLBase',
        website: 'https://shorturlbase.com',
        supportsAlias: false
      },
      'cliknow': {
        name: 'Clik.now',
        website: 'https://clik.now',
        supportsAlias: true
      },
      'shorturlst': {
        name: 'ShortURL.st',
        website: 'https://shorturl.st',
        supportsAlias: false
      }
    };
  }

  async getProviderStatus() {
    const providers = ['shorturlat', 'h1nu', 'shorturlbase', 'cliknow', 'shorturlst'];
    const testUrl = 'https://www.google.com';
    const results = {};
    const providerInfo = this.getProviderInfo();
    
    for (const provider of providers) {
      try {
        const start = Date.now();
        const result = await this.shorten(testUrl, { provider, fallback: false });
        results[provider] = {
          status: 'online',
          responseTime: Date.now() - start,
          testShortUrl: result.shortUrl,
          info: providerInfo[provider]
        };
      } catch (error) {
        results[provider] = {
          status: 'offline',
          error: error.message,
          info: providerInfo[provider]
        };
      }
    }
    
    return results;
  }

  getAvailableProviders() {
    return Object.keys(this.getProviderInfo());
  }
}

function createShortener(config = {}) {
  return new XShortUrl(config);
}

async function shorten(longUrl, options = {}) {
  const shortener = new XShortUrl();
  return shortener.shorten(longUrl, options);
}

async function shortenBatch(urls, options = {}) {
  const shortener = new XShortUrl();
  return shortener.shortenBatch(urls, options);
}

module.exports = {
  XShortUrl,
  createShortener,
  shorten,
  shortenBatch
};