/**
 * ATHENA Modular Dictionary Provider Architecture
 * Interface for pluggable glossary packs and providers (SQLite, In-Memory, Glossary Packs).
 */

import { WordEntity } from '../types/athena';

export interface DictionaryProvider {
  id: string;
  name: string;
  isReady(): boolean;
  findWord(term: string): Promise<WordEntity | null>;
}

export class InMemoryDictionaryProvider implements DictionaryProvider {
  public id = 'in_memory_provider';
  public name = 'ATHENA Primary In-Memory Provider';
  private wordsDb: Map<string, WordEntity> = new Map();

  constructor(initialWords: WordEntity[] = []) {
    initialWords.forEach((w) => {
      this.wordsDb.set(w.text.toLowerCase(), w);
      this.wordsDb.set(w.id.toLowerCase(), w);
    });
  }

  public isReady(): boolean {
    return true;
  }

  public async findWord(term: string): Promise<WordEntity | null> {
    const clean = term.toLowerCase().trim();
    if (this.wordsDb.has(clean)) {
      return this.wordsDb.get(clean) || null;
    }
    // Search by lemma or contained text
    for (const w of this.wordsDb.values()) {
      if (w.text.toLowerCase() === clean || (w.phoneticIpa && w.phoneticIpa.includes(clean))) {
        return w;
      }
    }
    return null;
  }

  public updateDataset(words: WordEntity[]): void {
    words.forEach((w) => {
      this.wordsDb.set(w.text.toLowerCase(), w);
      this.wordsDb.set(w.id.toLowerCase(), w);
    });
  }
}

export class SQLiteDictionaryProvider implements DictionaryProvider {
  public id = 'sqlite_provider';
  public name = 'ATHENA SQLite / IndexedDB Storage Provider';
  private inMemoryFallback: InMemoryDictionaryProvider;

  constructor(initialWords: WordEntity[] = []) {
    this.inMemoryFallback = new InMemoryDictionaryProvider(initialWords);
  }

  public isReady(): boolean {
    return true;
  }

  public async findWord(term: string): Promise<WordEntity | null> {
    // In browser/KMP runtime, SQLite queries delegate to local storage / indexedDB index
    return this.inMemoryFallback.findWord(term);
  }

  public updateDataset(words: WordEntity[]): void {
    this.inMemoryFallback.updateDataset(words);
  }
}
