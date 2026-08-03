/**
 * ATHENA FSRS 4.5 Learning Engine
 * Core Module 2: Pure Free Spaced Repetition Scheduler (FSRS 4.5) implementation.
 * Pure mathematical model storing Stability, Difficulty, Retrievability, Review Count,
 * Lapse Count, and Review Logs. (SM-2 and Leitner algorithms strictly excluded).
 */

import { CardMemoryState, FsrsRating, ReviewLog, VocabularyLearningState } from '../types/athena';

export interface FsrsParameters {
  requestRetention: number; // Default 0.90 (90%)
  w: number[]; // 17 parameters for FSRS 4.5
}

// Default FSRS 4.5 optimized weights
export const DEFAULT_FSRS_4_5_PARAMS: FsrsParameters = {
  requestRetention: 0.90,
  w: [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
    0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898,
  ],
};

export class FsrsEngine {
  private params: FsrsParameters;

  constructor(params: FsrsParameters = DEFAULT_FSRS_4_5_PARAMS) {
    this.params = params;
  }

  public getParameters(): FsrsParameters {
    return { ...this.params };
  }

  public setRequestRetention(retention: number): void {
    if (retention < 0.70 || retention > 0.98) {
      throw new Error('Target retention must be between 0.70 and 0.98');
    }
    this.params.requestRetention = retention;
  }

  /**
   * Calculate Retrievability (R) probability of recall given elapsed days t and stability S.
   * R(t, S) = (1 + (19/81) * (t / S))^-1
   * Note: When t = S, R = (1 + 19/81)^-1 = 81/100 = 0.90.
   */
  public calculateRetrievability(elapsedDays: number, stability: number): number {
    if (stability <= 0) return 0;
    if (elapsedDays <= 0) return 1.0;
    const factor = 19 / 81; // 0.2345679
    const retrievability = Math.pow(1 + factor * (elapsedDays / stability), -1);
    return Math.min(1.0, Math.max(0.0, Math.round(retrievability * 10000) / 10000));
  }

  /**
   * Initialize a brand new FSRS memory state for a card.
   */
  public createInitialState(cardId: string): CardMemoryState {
    const now = new Date().toISOString();
    return {
      id: `fsrs_${cardId}`,
      cardId,
      stability: 0,
      difficulty: 0,
      retrievability: 1.0,
      lastReviewTimestamp: now,
      nextReviewTimestamp: now,
      reviewCount: 0,
      lapseCount: 0,
      successCount: 0,
      failureCount: 0,
      averageRecallTimeMs: 0,
      lastRating: 'GOOD',
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Pure FSRS 4.5 State Transition
   */
  public reviewCard(
    state: CardMemoryState,
    rating: FsrsRating,
    responseTimeMs = 1500,
    reviewTime: Date = new Date()
  ): { newState: CardMemoryState; log: ReviewLog } {
    const nowIso = reviewTime.toISOString();
    const w = this.params.w;

    // Convert rating to grade g: AGAIN=1, HARD=2, GOOD=3, EASY=4
    const gradeMap: Record<FsrsRating, number> = {
      AGAIN: 1,
      HARD: 2,
      GOOD: 3,
      EASY: 4,
    };
    const g = gradeMap[rating];

    // Calculate elapsed time in days
    const lastReview = new Date(state.lastReviewTimestamp);
    const elapsedDays = Math.max(0, (reviewTime.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24));

    let newStability = state.stability;
    let newDifficulty = state.difficulty;
    let newLapseCount = state.lapseCount;
    let newSuccessCount = state.successCount;
    let newFailureCount = state.failureCount;

    // FIRST REVIEW OF NEW CARD
    if (state.reviewCount === 0 || state.stability === 0) {
      // S0(g) = w[g - 1]
      newStability = w[g - 1];
      // D0(g) = w[4] - w[5] * (g - 3)
      newDifficulty = Math.min(10.0, Math.max(1.0, w[4] - w[5] * (g - 3)));

      if (rating === 'AGAIN') {
        newLapseCount += 1;
        newFailureCount += 1;
      } else {
        newSuccessCount += 1;
      }
    } else {
      // REPEATED REVIEW
      const R = this.calculateRetrievability(elapsedDays, state.stability);

      // 1. Difficulty Update: D_new = D - w[6] * (g - 3)
      // Mean reversion towards initial D0(GOOD) = w[4]
      const deltaD = -w[6] * (g - 3);
      const D_raw = state.difficulty + deltaD;
      const D0_GOOD = w[4];
      newDifficulty = Math.min(10.0, Math.max(1.0, w[7] * D0_GOOD + (1 - w[7]) * D_raw));

      if (rating === 'AGAIN') {
        // FORGETTING: S_new_forget = w[11] * D^-w[12] * S^w[13] * e^(w[14] * (1 - R))
        newLapseCount += 1;
        newFailureCount += 1;
        newStability = Math.max(
          0.1,
          w[11] *
            Math.pow(state.difficulty, -w[12]) *
            Math.pow(state.stability, w[13]) *
            Math.exp(w[14] * (1 - R))
        );
      } else {
        // RECALL SUCCESS: S_new_recall = S * (1 + exp(w[8]) * (11 - D) * S^-w[9] * (exp(w[10] * (1 - R)) - 1) * hard_penalty * easy_bonus)
        newSuccessCount += 1;

        const hardPenalty = rating === 'HARD' ? w[15] : 1.0;
        const easyBonus = rating === 'EASY' ? w[16] : 1.0;

        const S_inc =
          Math.exp(w[8]) *
          (11 - state.difficulty) *
          Math.pow(state.stability, -w[9]) *
          (Math.exp(w[10] * (1 - R)) - 1) *
          hardPenalty *
          easyBonus;

        newStability = Math.max(0.1, state.stability * (1 + S_inc));
      }
    }

    // Calculate next review interval in days based on target retention
    // interval = (stability / (19/81)) * (requestRetention^-1 - 1)
    const factor = 19 / 81;
    const intervalDays = Math.max(1, Math.round((newStability / factor) * (Math.pow(this.params.requestRetention, -1) - 1)));

    const nextReviewDate = new Date(reviewTime.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    // Calculate rolling average recall time
    const totalReviews = state.reviewCount + 1;
    const newAverageTime = Math.round(
      (state.averageRecallTimeMs * state.reviewCount + responseTimeMs) / totalReviews
    );

    const newState: CardMemoryState = {
      ...state,
      stability: Math.round(newStability * 1000) / 1000,
      difficulty: Math.round(newDifficulty * 1000) / 1000,
      retrievability: 1.0, // reset on review
      lastReviewTimestamp: nowIso,
      nextReviewTimestamp: nextReviewDate.toISOString(),
      reviewCount: totalReviews,
      lapseCount: newLapseCount,
      successCount: newSuccessCount,
      failureCount: newFailureCount,
      averageRecallTimeMs: newAverageTime,
      lastRating: rating,
      updatedAt: nowIso,
    };

    const log: ReviewLog = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      cardId: state.cardId,
      timestamp: nowIso,
      rating,
      performanceRating: rating,
      elapsedDays: Math.round(elapsedDays * 10) / 10,
      scheduledDays: intervalDays,
      reviewTimeMs: responseTimeMs,
      stabilityAfter: newState.stability,
      difficultyAfter: newState.difficulty,
    };

    return { newState, log };
  }

  /**
   * Determine if a card is currently due for review.
   */
  public isCardDue(state: CardMemoryState, currentTime: Date = new Date()): boolean {
    if (state.reviewCount === 0) return true;
    return new Date(state.nextReviewTimestamp).getTime() <= currentTime.getTime();
  }

  /**
   * Calculate Vocabulary Learning State directly from FSRS 4.5 parameters (Requirement 4)
   */
  public calculateVocabularyState(state: CardMemoryState): VocabularyLearningState {
    if (state.reviewCount === 0 || state.stability === 0) {
      return 'New';
    }
    if (state.stability < 7) {
      return 'Learning';
    }
    if (state.stability >= 7 && state.stability < 21) {
      return 'Young Memory';
    }
    if (state.stability >= 21 && state.stability < 90) {
      return 'Mature';
    }
    return 'Mastered';
  }
}
