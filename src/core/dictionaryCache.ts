/**
 * ATHENA Smart Dictionary - DictionaryCache
 * High-performance, O(1) in-memory cache for word lookup results.
 */

import { WordEntity } from '../types/athena';

export class DictionaryCache {
  private cache = new Map<string, WordEntity>();
  private maxCapacity: number;
  private hits = 0;
  private misses = 0;

  constructor(maxCapacity = 500) {
    this.maxCapacity = maxCapacity;
  }

  public get(key: string): WordEntity | undefined {
    const normalizedKey = key.trim().toLowerCase();
    if (this.cache.has(normalizedKey)) {
      this.hits++;
      const val = this.cache.get(normalizedKey)!;
      // Refresh key for LRU ordering
      this.cache.delete(normalizedKey);
      this.cache.set(normalizedKey, val);
      return val;
    }
    this.misses++;
    return undefined;
  }

  public set(key: string, value: WordEntity): void {
    const normalizedKey = key.trim().toLowerCase();
    if (this.cache.has(normalizedKey)) {
      this.cache.delete(normalizedKey);
    } else if (this.cache.size >= this.maxCapacity) {
      // Evict oldest item (first key)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(normalizedKey, value);
  }

  public has(key: string): boolean {
    return this.cache.has(key.trim().toLowerCase());
  }

  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  public getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    return {
      size: this.cache.size,
      maxCapacity: this.maxCapacity,
      hits: this.hits,
      misses: this.misses,
      hitRatePercent: Math.round(hitRate),
    };
  }
}
