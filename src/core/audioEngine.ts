/**
 * ATHENA Lightweight Audio Engine
 * Downloads audio on demand from audio servers / Web Speech API without bundling heavy
 * mp3 assets inside the application package. Caches downloaded audio locally for speed.
 */

export class AudioEngine {
  private static instance: AudioEngine;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private autoPronounceEnabled = false;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public setAutoPronounce(enabled: boolean): void {
    this.autoPronounceEnabled = enabled;
  }

  public isAutoPronounceEnabled(): boolean {
    return this.autoPronounceEnabled;
  }

  /**
   * Speak a word using Web Speech API or On-Demand CDN Audio with local caching.
   */
  public async speakWord(word: string, accent: 'US' | 'UK' = 'US'): Promise<void> {
    if (!word || !word.trim()) return;
    const cleanWord = word.trim().toLowerCase();

    // 1. Check local audio cache
    const cacheKey = `${cleanWord}_${accent}`;
    if (this.audioCache.has(cacheKey)) {
      const audio = this.audioCache.get(cacheKey)!;
      audio.currentTime = 0;
      audio.play().catch(() => this.fallbackSpeechSynthesis(cleanWord, accent));
      return;
    }

    // 2. Try fetching on-demand pronunciation audio stream from free dictionary CDN
    const cdnUrl = `https://api.dictionaryapi.dev/media/pronunciations/en/${cleanWord}-${accent.toLowerCase()}.mp3`;

    try {
      const audio = new Audio(cdnUrl);
      audio.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        audio.oncanplaythrough = () => {
          this.audioCache.set(cacheKey, audio);
          audio.play().then(resolve).catch(reject);
        };
        audio.onerror = () => reject(new Error('CDN audio unavailable'));
        audio.load();
      });
    } catch {
      // 3. Fallback to Web Speech API (Local zero-byte audio rendering)
      this.fallbackSpeechSynthesis(cleanWord, accent);
    }
  }

  private fallbackSpeechSynthesis(text: string, accent: 'US' | 'UK'): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
}
