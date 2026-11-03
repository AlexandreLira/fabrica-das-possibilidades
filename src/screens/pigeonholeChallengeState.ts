import { pigeonholeStorageChallenge } from '../content/challenges';

export type BoxIndex = 0 | 1 | 2;
export type BoxCounts = readonly [number, number, number];

export interface PigeonholeChallengeState {
  counts: BoxCounts;
  remaining: number;
  selectedAnswer: number | null;
  hintVisible: boolean;
  feedback: string;
  completed: boolean;
}

export type PigeonholeChallengeAction =
  | { type: 'place-item'; boxIndex: BoxIndex }
  | { type: 'reset-distribution' }
  | { type: 'select-answer'; answer: number }
  | { type: 'show-hint' }
  | { type: 'confirm-answer' }
  | { type: 'reset' };

export const pigeonholeChallengeInitialState: PigeonholeChallengeState = {
  counts: [0, 0, 0],
  remaining: pigeonholeStorageChallenge.items,
  selectedAnswer: null,
  hintVisible: false,
  feedback: '',
  completed: false,
};

export function reducePigeonholeChallenge(
  state: PigeonholeChallengeState,
  action: PigeonholeChallengeAction,
): PigeonholeChallengeState {
  if (action.type === 'reset' || action.type === 'reset-distribution') return pigeonholeChallengeInitialState;
  if (state.completed) return state;

  switch (action.type) {
    case 'place-item': {
      if (state.remaining === 0) return state;
      const counts: [number, number, number] = [...state.counts];
      counts[action.boxIndex] += 1;
      return { ...state, counts, remaining: state.remaining - 1, selectedAnswer: null, feedback: '' };
    }
    case 'select-answer':
      return state.remaining === 0 ? { ...state, selectedAnswer: action.answer, feedback: '' } : state;
    case 'show-hint':
      return { ...state, hintVisible: true };
    case 'confirm-answer': {
      if (state.selectedAnswer === null) return state;
      if (state.selectedAnswer === pigeonholeStorageChallenge.correctAnswer) {
        return { ...state, completed: true, feedback: pigeonholeStorageChallenge.successExplanation };
      }
      return {
        ...state,
        selectedAnswer: null,
        feedback: pigeonholeStorageChallenge.feedback[state.selectedAnswer] ?? 'Observe quantas peças cabem sem que alguma caixa chegue a três.',
      };
    }
  }
}
