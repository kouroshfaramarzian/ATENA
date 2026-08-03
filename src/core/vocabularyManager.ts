/**
 * ATHENA Vocabulary Manager
 * Core Module 1: Handles lightweight vocabulary card creation, editing, deletion,
 * manual entry, tagging, and synchronization with FSRS 4.5 Memory Engine.
 */

import { VocabularyCard, CardMemoryState } from '../types/athena';

export interface CreateCardInput {
  word: string;
  lemma?: string;
  persianMeaning: string;
  englishDefinition: string;
  exampleSentence: string;
  cefrLevel?: string;
  tags?: string[] | string;
  notes?: string;
  source?: string;
}

export class VocabularyManager {
  private cards: Map<string, VocabularyCard> = new Map();

  constructor(initialCards: VocabularyCard[] = []) {
    initialCards.forEach((card) => this.cards.set(card.id, card));
  }

  /**
   * Create a new vocabulary card with lightweight essential fields.
   */
  public createCard(input: CreateCardInput): VocabularyCard {
    if (!input.word || !input.word.trim()) {
      throw new Error('Word is required to create a vocabulary card');
    }

    const cleanedWord = input.word.trim();
    const lemma = input.lemma?.trim() || cleanedWord.toLowerCase();
    
    // Parse tags (array or comma-separated string)
    let parsedTags: string[] = [];
    if (Array.isArray(input.tags)) {
      parsedTags = input.tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof input.tags === 'string') {
      parsedTags = input.tags.split(/[,;\s]+/).map((t) => t.trim()).filter(Boolean);
    }

    const card: VocabularyCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      word: cleanedWord,
      lemma,
      persianMeaning: input.persianMeaning?.trim() || '',
      englishDefinition: input.englishDefinition?.trim() || '',
      exampleSentence: input.exampleSentence?.trim() || '',
      cefrLevel: input.cefrLevel?.trim() || 'B1',
      tags: parsedTags.length > 0 ? parsedTags : ['manual'],
      notes: input.notes?.trim() || '',
      source: input.source?.trim() || 'Manual Entry',
      createdAt: new Date().toISOString(),
    };

    this.cards.set(card.id, card);
    return card;
  }

  public getCard(id: string): VocabularyCard | undefined {
    return this.cards.get(id);
  }

  public getCardByWord(word: string): VocabularyCard | undefined {
    const clean = word.toLowerCase().trim();
    return Array.from(this.cards.values()).find(
      (c) => c.word.toLowerCase() === clean || c.lemma.toLowerCase() === clean
    );
  }

  public getAllCards(): VocabularyCard[] {
    return Array.from(this.cards.values());
  }

  public updateCard(id: string, updates: Partial<CreateCardInput>): VocabularyCard {
    const existing = this.cards.get(id);
    if (!existing) {
      throw new Error(`Card with ID ${id} not found`);
    }

    let parsedTags = existing.tags;
    if (updates.tags !== undefined) {
      if (Array.isArray(updates.tags)) {
        parsedTags = updates.tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof updates.tags === 'string') {
        parsedTags = updates.tags.split(/[,;\s]+/).map((t) => t.trim()).filter(Boolean);
      }
    }

    const updatedCard: VocabularyCard = {
      ...existing,
      word: updates.word !== undefined ? updates.word.trim() : existing.word,
      lemma: updates.lemma !== undefined ? updates.lemma.trim() : existing.lemma,
      persianMeaning: updates.persianMeaning !== undefined ? updates.persianMeaning.trim() : existing.persianMeaning,
      englishDefinition: updates.englishDefinition !== undefined ? updates.englishDefinition.trim() : existing.englishDefinition,
      exampleSentence: updates.exampleSentence !== undefined ? updates.exampleSentence.trim() : existing.exampleSentence,
      cefrLevel: updates.cefrLevel !== undefined ? updates.cefrLevel.trim() : existing.cefrLevel,
      tags: parsedTags,
      notes: updates.notes !== undefined ? updates.notes.trim() : existing.notes,
      source: updates.source !== undefined ? updates.source.trim() : existing.source,
    };

    this.cards.set(id, updatedCard);
    return updatedCard;
  }

  public deleteCard(id: string): boolean {
    return this.cards.delete(id);
  }

  public bulkAddCards(newCards: VocabularyCard[]): number {
    let count = 0;
    newCards.forEach((c) => {
      if (!this.cards.has(c.id)) {
        this.cards.set(c.id, c);
        count++;
      }
    });
    return count;
  }

  public getCount(): number {
    return this.cards.size;
  }
}
