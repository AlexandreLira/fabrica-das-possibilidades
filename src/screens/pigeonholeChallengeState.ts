import {
  pigeonholeStorageChallenge,
  type PigeonholeChallengeDefinition,
} from '../content/challenges';

export type BoxIndex = number;
export type BoxCounts = readonly number[];

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

export function createPigeonholeChallengeState(
  challenge: PigeonholeChallengeDefinition = pigeonholeStorageChallenge,
): PigeonholeChallengeState {
  return {
    counts: Array.from({ length: challenge.boxes }, () => 0),
    remaining: challenge.items,
    selectedAnswer: null,
    hintVisible: false,
    feedback: '',
    completed: false,
  };
}

export const pigeonholeChallengeInitialState = createPigeonholeChallengeState();

export function reducePigeonholeChallenge(
  state: PigeonholeChallengeState,
  action: PigeonholeChallengeAction,
  challenge: PigeonholeChallengeDefinition = pigeonholeStorageChallenge,
): PigeonholeChallengeState {
  if (action.type === 'reset' || action.type === 'reset-distribution') return createPigeonholeChallengeState(challenge);
  if (state.completed) return state;

  switch (action.type) {
    case 'place-item': {
      if (state.remaining === 0 || action.boxIndex < 0 || action.boxIndex >= state.counts.length) return state;
      const counts = [...state.counts];
      counts[action.boxIndex] = (counts[action.boxIndex] ?? 0) + 1;
      return { ...state, counts, remaining: state.remaining - 1, selectedAnswer: null, feedback: '' };
    }
    case 'select-answer':
      return state.remaining === 0 ? { ...state, selectedAnswer: action.answer, feedback: '' } : state;
    case 'show-hint':
      return { ...state, hintVisible: true };
    case 'confirm-answer': {
      if (state.selectedAnswer === null) return state;
      if (state.selectedAnswer === challenge.correctAnswer) {
        return { ...state, completed: true, feedback: challenge.successExplanation };
      }
      return {
        ...state,
        selectedAnswer: null,
        feedback: challenge.feedback[state.selectedAnswer] ?? `Observe quantas ${challenge.itemPlural} podem ficar sem que algum ${challenge.boxLabel} ultrapasse o limite.`,
      };
    }
  }
}
