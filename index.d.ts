export interface ShortenResult {
  shortUrl: string;
  originalUrl: string;
  provider: string;
  alias?: string;
  domain?: string;
  createdAt: string;
}

export interface XShortUrlConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  defaultProvider?: string;
  tinyurlApiKey?: string;
}

export class XShortUrl {
  constructor(config?: XShortUrlConfig);
  shorten(longUrl: string, options?: any): Promise<ShortenResult>;
  shortenBatch(urls: string[], options?: any): Promise<any[]>;
  getProviderStatus(): Promise<any>;
}

export function createShortener(config?: XShortUrlConfig): XShortUrl;
export function shorten(longUrl: string, options?: any): Promise<ShortenResult>;
export function shortenBatch(urls: string[], options?: any): Promise<any[]>;