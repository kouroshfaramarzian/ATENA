/**
 * ATHENA Smart Dictionary - DictionaryEngine
 * Main orchestrator for offline dictionary lookup, normalization pipeline,
 * O(1) memory caching, search history, and popup controller events.
 */

import { WordEntity } from '../types/athena';
import { WordNormalizer, NormalizationResult } from './wordNormalizer';
import { DictionaryRepository } from './dictionaryRepository';
import { DictionaryCache } from './dictionaryCache';

export interface DictionaryQueryResult {
  rawQuery: string;
  word: WordEntity;
  normalization: NormalizationResult;
  lookupTimeMs: number;
  fromCache: boolean;
}

export class DictionaryEngine {
  private repository: DictionaryRepository;
  private searchHistory: { term: string; timestamp: string }[] = [];

  constructor(initialWords: WordEntity[] = []) {
    this.repository = new DictionaryRepository(initialWords);
  }

  public updateDataset(words: WordEntity[]): void {
    this.repository.updateWordsDb(words);
  }

  public lookupWord(rawWord: string): DictionaryQueryResult {
    const start = performance.now();
    const result = this.repository.findWord(rawWord);
    const end = performance.now();
    const lookupTimeMs = Math.round((end - start) * 100) / 100;

    // Record search history
    this.searchHistory.unshift({
      term: rawWord,
      timestamp: new Date().toISOString(),
    });
    if (this.searchHistory.length > 100) {
      this.searchHistory.pop();
    }

    return {
      rawQuery: rawWord,
      word: result.word,
      normalization: result.normalization,
      lookupTimeMs,
      fromCache: result.fromCache,
    };
  }

  public getSearchHistory(): { term: string; timestamp: string }[] {
    return [...this.searchHistory];
  }

  public searchExact(term: string): WordEntity | null {
    return this.repository.searchExact(term);
  }

  public searchPrefix(prefix: string, limit?: number): WordEntity[] {
    return this.repository.searchPrefix(prefix, limit);
  }

  public searchLemma(lemma: string): WordEntity | null {
    return this.repository.searchLemma(lemma);
  }

  public searchFuzzy(term: string, maxDistance?: number): WordEntity[] {
    return this.repository.searchFuzzy(term, maxDistance);
  }

  public clearSearchHistory(): void {
    this.searchHistory = [];
  }

  public getCacheStats() {
    return this.repository.getCacheStats();
  }
}
