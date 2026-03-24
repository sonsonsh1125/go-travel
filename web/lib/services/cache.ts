import fs from 'fs';
import path from 'path';

interface CacheEntry {
  destination: string;
  data: any;
  timestamp: number;
}

export class CacheService {
  private cacheDir: string;
  private cacheDuration: number = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Use /tmp directory in Vercel serverless environment
    this.cacheDir = path.join(process.cwd(), '.cache');
    this.ensureCacheDir();
  }

  private ensureCacheDir() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch (error) {
      console.warn('Failed to create cache directory:', error);
    }
  }

  private getCacheFilePath(destination: string): string {
    const sanitized = destination.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-');
    return path.join(this.cacheDir, `${sanitized}.json`);
  }

  /**
   * Get cached data for a destination
   */
  get(destination: string): any | null {
    try {
      const filePath = this.getCacheFilePath(destination);

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const cacheEntry: CacheEntry = JSON.parse(fileContent);

      // Check if cache is still valid (within 24 hours)
      const now = Date.now();
      if (now - cacheEntry.timestamp > this.cacheDuration) {
        console.log(`Cache expired for "${destination}"`);
        this.delete(destination);
        return null;
      }

      console.log(`Cache hit for "${destination}" (${Math.round((now - cacheEntry.timestamp) / 1000 / 60)} minutes old)`);
      return cacheEntry.data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  }

  /**
   * Save data to cache
   */
  set(destination: string, data: any): void {
    try {
      const filePath = this.getCacheFilePath(destination);
      const cacheEntry: CacheEntry = {
        destination,
        data,
        timestamp: Date.now(),
      };

      fs.writeFileSync(filePath, JSON.stringify(cacheEntry, null, 2), 'utf-8');
      console.log(`Cached results for "${destination}"`);
    } catch (error) {
      console.warn('Failed to write cache:', error);
    }
  }

  /**
   * Delete cached data
   */
  delete(destination: string): void {
    try {
      const filePath = this.getCacheFilePath(destination);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.warn('Failed to delete cache:', error);
    }
  }

  /**
   * Clear all expired cache entries
   */
  clearExpired(): void {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        return;
      }

      const files = fs.readdirSync(this.cacheDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.cacheDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const cacheEntry: CacheEntry = JSON.parse(fileContent);

        if (now - cacheEntry.timestamp > this.cacheDuration) {
          fs.unlinkSync(filePath);
          console.log(`Deleted expired cache: ${file}`);
        }
      }
    } catch (error) {
      console.warn('Failed to clear expired cache:', error);
    }
  }
}
