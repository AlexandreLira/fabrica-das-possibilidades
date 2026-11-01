import { additionRouteChallenge, type AdditionRouteId } from '../content/challenges';

export interface AdditionChallengeState {
  revealedRoutes: readonly AdditionRouteId[];
  selectedAnswer: number | null;
  hintVisible: boolean;
  feedback: string;
  completed: boolean;
}

export type AdditionChallengeAction =
  | { type: 'reveal-route'; routeId: AdditionRouteId }
  | { type: 'select-answer'; answer: number }
  | { type: 'show-hint' }
  | { type: 'confirm-answer' };

export const additionChallengeInitialState: AdditionChallengeState = {
  revealedRoutes: [],
  selectedAnswer: null,
  hintVisible: false,
  feedback: '',
  completed: false,
};

export function reduceAdditionChallenge(
  state: AdditionChallengeState,
  action: AdditionChallengeAction,
): AdditionChallengeState {
  if (state.completed) return state;

  switch (action.type) {
    case 'reveal-route':
      return state.revealedRoutes.includes(action.routeId)
        ? state
        : { ...state, revealedRoutes: [...state.revealedRoutes, action.routeId], feedback: '' };
    case 'select-answer':
      return state.revealedRoutes.length < additionRouteChallenge.groups.length
        ? state
        : { ...state, selectedAnswer: action.answer, feedback: '' };
    case 'show-hint':
      return { ...state, hintVisible: true };
    case 'confirm-answer': {
      if (state.selectedAnswer === null) return state;
      if (state.selectedAnswer === additionRouteChallenge.correctAnswer) {
        return {
          ...state,
          completed: true,
          feedback: additionRouteChallenge.successExplanation,
        };
      }
      return {
        ...state,
        selectedAnswer: null,
        feedback: additionRouteChallenge.feedback[state.selectedAnswer] ?? 'Tente contar as opções novamente.',
      };
    }
  }
}
