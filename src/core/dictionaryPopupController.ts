/**
 * ATHENA Smart Dictionary - DictionaryPopupController
 * Manages UI state for quick popups, stack history for chained word lookup,
 * TTS audio triggers, and bookmark sync.
 */

import { WordEntity } from '../types/athena';

export interface PopupState {
  isOpen: boolean;
  activeWord: string | null;
  historyStack: string[];
}

export class DictionaryPopupController {
  private state: PopupState = {
    isOpen: false,
    activeWord: null,
    historyStack: [],
  };

  private listeners: ((state: PopupState) => void)[] = [];

  public openWord(wordText: string): void {
    if (!wordText || !wordText.trim()) return;
    const clean = wordText.trim();

    const stack = [...this.state.historyStack];
    if (this.state.activeWord && this.state.activeWord.toLowerCase() !== clean.toLowerCase()) {
      stack.push(this.state.activeWord);
    }

    this.state = {
      isOpen: true,
      activeWord: clean,
      historyStack: stack,
    };
    this.notify();
  }

  public back(): boolean {
    if (this.state.historyStack.length === 0) {
      this.close();
      return false;
    }

    const previous = this.state.historyStack.pop()!;
    this.state = {
      isOpen: true,
      activeWord: previous,
      historyStack: [...this.state.historyStack],
    };
    this.notify();
    return true;
  }

  public close(): void {
    this.state = {
      isOpen: false,
      activeWord: null,
      historyStack: [],
    };
    this.notify();
  }

  public getState(): PopupState {
    return { ...this.state };
  }

  public subscribe(listener: (state: PopupState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.getState()));
  }
}
