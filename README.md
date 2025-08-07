# XShortUrl

A powerful and reliable Node.js library for URL shortening with multiple provider support and automatic failover.

[![npm version](https://badge.fury.io/js/xshorturl.svg)](https://badge.fury.io/js/xshorturl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔄 **Multiple Providers**: Supports 5 different URL shortening services
- 🎲 **Random Provider Selection**: Automatically uses random provider when none specified
- 🔁 **Automatic Failover**: Falls back to other providers if one fails
- ⚡ **Batch Processing**: Shorten multiple URLs simultaneously
- 🔧 **Configurable**: Customizable timeout, retries, and retry delays
- 📊 **Provider Status**: Check availability and performance of all providers
- 🏷️ **Custom Aliases**: Support for custom short URLs (provider dependent)

## Supported Providers

| Provider | Website | Custom Alias Support |
|----------|---------|---------------------|
| ShortURL.at | https://www.shorturl.at | ❌ |
| H1.nu | https://h1.nu | ✅ |
| ShortURLBase | https://shorturlbase.com | ❌ |
| Clik.now | https://clik.now | ✅ |
| ShortURL.st | https://shorturl.st | ❌ |

## Installation

```bash
npm install xshorturl
```

## Quick Start

```javascript
const { XShortUrl, shorten } = require('xshorturl');

// Simple usage with random provider
const result = await shorten('https://www.example.com');
console.log(result.shortUrl); // e.g., https://shorturl.at/abc123

// Using specific provider
const result2 = await shorten('https://www.example.com', { 
  provider: 'h1nu',
  alias: 'mylink' 
});
console.log(result2.shortUrl); // e.g., https://h1.nu/mylink
```

## Usage

### Basic Usage

```javascript
const { XShortUrl } = require('xshorturl');

const shortener = new XShortUrl();

// Shorten URL with random provider
const result = await shortener.shorten('https://www.example.com');
console.log(result);
// Output:
// {
//   shortUrl: 'https://shorturl.at/abc123',
//   originalUrl: 'https://www.example.com',
//   provider: 'shorturlat',
//   createdAt: '2024-01-01T12:00:00.000Z'
// }
```

### Using Specific Provider

```javascript
// Use specific provider without fallback
const result = await shortener.shorten('https://www.example.com', {
  provider: 'h1nu',
  fallback: false
});

// Use specific provider with fallback to others if it fails
const result2 = await shortener.shorten('https://www.example.com', {
  provider: 'h1nu',
  fallback: true // default
});
```

### Custom Aliases

```javascript
// Only works with providers that support aliases (h1nu, cliknow)
const result = await shortener.shorten('https://www.example.com', {
  provider: 'h1nu',
  alias: 'my-custom-link'
});
console.log(result.shortUrl); // https://h1.nu/my-custom-link
```

### Batch Processing

```javascript
const urls = [
  'https://www.example1.com',
  'https://www.example2.com',
  'https://www.example3.com'
];

const results = await shortener.shortenBatch(urls, {
  concurrency: 3, // Process 3 URLs simultaneously
  provider: 'h1nu' // Optional: use specific provider
});

console.log(results);
// Array of results with success/error information
```

### Configuration

```javascript
const shortener = new XShortUrl({
  timeout: 30000,        // Request timeout in milliseconds (default: 30000)
  retries: 3,           // Number of retries per provider (default: 3)
  retryDelay: 1000,     // Base delay between retries in ms (default: 1000)
  useRandomProvider: true // Use random provider when none specified (default: true)
});
```

### Provider Information

```javascript
// Get information about all providers
const providerInfo = shortener.getProviderInfo();
console.log(providerInfo);

// Get list of available providers
const providers = shortener.getAvailableProviders();
console.log(providers); // ['shorturlat', 'h1nu', 'shorturlbase', 'cliknow', 'shorturlst']
```

### Provider Status Check

```javascript
// Check status and performance of all providers
const status = await shortener.getProviderStatus();
console.log(status);
// Output:
// {
//   shorturlat: {
//     status: 'online',
//     responseTime: 1234,
//     testShortUrl: 'https://shorturl.at/xyz789',
//     info: { name: 'ShortURL.at', website: 'https://www.shorturl.at', supportsAlias: false }
//   },
//   h1nu: {
//     status: 'offline',
//     error: 'Request timeout',
//     info: { name: 'H1.nu', website: 'https://h1.nu', supportsAlias: true }
//   }
// }
```

## API Reference

### XShortUrl Class

#### Constructor

```javascript
new XShortUrl(config?)
```

**Parameters:**
- `config` (optional): Configuration object
  - `timeout`: Request timeout in milliseconds (default: 30000)
  - `retries`: Number of retry attempts (default: 3)
  - `retryDelay`: Base delay between retries (default: 1000)
  - `useRandomProvider`: Use random provider selection (default: true)

#### Methods

##### `shorten(longUrl, options?)`

Shortens a single URL.

**Parameters:**
- `longUrl`: The URL to shorten
- `options` (optional):
  - `provider`: Specific provider to use
  - `alias`: Custom alias (only for supported providers)
  - `fallback`: Enable fallback to other providers (default: true)

**Returns:** Promise resolving to result object

##### `shortenBatch(urls, options?)`

Shortens multiple URLs in batches.

**Parameters:**
- `urls`: Array of URLs to shorten
- `options` (optional):
  - `concurrency`: Number of concurrent requests (default: 3)
  - `provider`: Specific provider to use
  - `alias`: Custom alias
  - `fallback`: Enable fallback to other providers

**Returns:** Promise resolving to array of results

##### `getProviderInfo()`

Returns information about all available providers.

##### `getAvailableProviders()`

Returns array of available provider names.

##### `getProviderStatus()`

Tests and returns the status of all providers.

### Standalone Functions

```javascript
const { shorten, shortenBatch } = require('xshorturl');

// Equivalent to creating new XShortUrl() and calling methods
const result = await shorten('https://example.com');
const results = await shortenBatch(['https://example1.com', 'https://example2.com']);
```

## Error Handling

```javascript
try {
  const result = await shortener.shorten('https://example.com');
  console.log(result.shortUrl);
} catch (error) {
  if (error.message === 'All providers failed to shorten the URL') {
    console.log('All URL shortening services are currently unavailable');
  } else if (error.message === 'Invalid URL provided') {
    console.log('Please provide a valid URL');
  } else {
    console.log('Error:', error.message);
  }
}
```

## Examples

### Random Provider with Fallback

```javascript
const { XShortUrl } = require('xshorturl');

const shortener = new XShortUrl();

async function example() {
  try {
    // Will randomly select a provider and fallback to others if needed
    const result = await shortener.shorten('https://www.github.com');
    
    console.log(`Original URL: ${result.originalUrl}`);
    console.log(`Short URL: ${result.shortUrl}`);
    console.log(`Provider used: ${result.provider}`);
    console.log(`Created at: ${result.createdAt}`);
  } catch (error) {
    console.error('Failed to shorten URL:', error.message);
  }
}

example();
```

### Batch Processing with Custom Provider

```javascript
async function batchExample() {
  const urls = [
    'https://www.google.com',
    'https://www.github.com',
    'https://www.stackoverflow.com'
  ];

  const results = await shortener.shortenBatch(urls, {
    provider: 'h1nu',
    concurrency: 2
  });

  results.forEach(result => {
    if (result.error) {
      console.log(`Failed to shorten ${result.originalUrl}: ${result.error}`);
    } else {
      console.log(`${result.originalUrl} -> ${result.shortUrl}`);
    }
  });
}

batchExample();
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/yourusername/xshorturl).

## Changelog

### v1.0.0
- Initial release with 5 provider support
- Random provider selection
- Automatic failover
- Batch processing
- Provider status checking