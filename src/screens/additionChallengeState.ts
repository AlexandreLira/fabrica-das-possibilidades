import { additionRouteChallenge, type AdditionChallengeDefinition } from '../content/challenges';

export interface AdditionChallengeState {
  revealedGroups: readonly string[];
  selectedAnswer: number | null;
  hintVisible: boolean;
  feedback: string;
  completed: boolean;
}

export type AdditionChallengeAction =
  | { type: 'reveal-group'; groupId: string }
  | { type: 'select-answer'; answer: number }
  | { type: 'show-hint' }
  | { type: 'confirm-answer' }
  | { type: 'reset' };

export function createAdditionChallengeState(): AdditionChallengeState {
  return { revealedGroups: [], selectedAnswer: null, hintVisible: false, feedback: '', completed: false };
}

export const additionChallengeInitialState = createAdditionChallengeState();

export function reduceAdditionChallenge(
  state: AdditionChallengeState,
  action: AdditionChallengeAction,
  challenge: AdditionChallengeDefinition = additionRouteChallenge,
): AdditionChallengeState {
  if (action.type === 'reset') return createAdditionChallengeState();
  if (state.completed) return state;

  switch (action.type) {
    case 'reveal-group':
      if (!challenge.groups.some((group) => group.id === action.groupId) || state.revealedGroups.includes(action.groupId)) return state;
      return { ...state, revealedGroups: [...state.revealedGroups, action.groupId], feedback: '' };
    case 'select-answer':
      return state.revealedGroups.length < challenge.groups.length
        ? state
        : { ...state, selectedAnswer: action.answer, feedback: '' };
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
        feedback: challenge.feedback[state.selectedAnswer] ?? 'Tente contar as opções novamente.',
      };
    }
  }
}
