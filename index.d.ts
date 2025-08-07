export interface ShortenResult {
  shortUrl: string;
  originalUrl: string;
  provider: string;
  alias?: string;
  domain?: string;
  createdAt: string;
}

export interface ProviderInfo {
  name: string;
  website: string;
  supportsAlias: boolean;
}

export interface ProviderStatus {
  status: 'online' | 'offline';
  responseTime?: number;
  testShortUrl?: string;
  error?: string;
  info: ProviderInfo;
}

export interface XShortUrlConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  defaultProvider?: string;
  useRandomProvider?: boolean;
  tinyurlApiKey?: string;
}

export interface ShortenOptions {
  provider?: string;
  alias?: string;
  fallback?: boolean;
}

export interface BatchOptions extends ShortenOptions {
  concurrency?: number;
}

export class XShortUrl {
  constructor(config?: XShortUrlConfig);

  shorten(longUrl: string, options?: ShortenOptions): Promise<ShortenResult>;
  shortenBatch(urls: string[], options?: BatchOptions): Promise<any[]>;

  getProviderInfo(): Record<string, ProviderInfo>;
  getProviderStatus(): Promise<Record<string, ProviderStatus>>;
  getAvailableProviders(): string[];

  isValidUrl(url: string): boolean;
  getRandomProvider(): string;

  shorturlAt(longUrl: string): Promise<ShortenResult>;
  h1nu(longUrl: string, alias?: string): Promise<ShortenResult>;
  shorturlbase(longUrl: string): Promise<ShortenResult>;
  cliknow(longUrl: string, alias?: string): Promise<ShortenResult>;
  shorturlst(longUrl: string): Promise<ShortenResult>;
}

export function createShortener(config?: XShortUrlConfig): XShortUrl;
export function shorten(longUrl: string, options?: ShortenOptions): Promise<ShortenResult>;
export function shortenBatch(urls: string[], options?: BatchOptions): Promise<any[]>;