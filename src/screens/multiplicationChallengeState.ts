import {
  multiplicationRobotChallenge,
  type MultiplicationChallengeDefinition,
} from '../content/challenges';

export interface MultiplicationChallengeState {
  selections: Readonly<Record<string, string>>;
  selectedAnswer: number | null;
  hintVisible: boolean;
  feedback: string;
  completed: boolean;
}

export type MultiplicationChallengeAction =
  | { type: 'select-option'; stageId: string; optionId: string }
  | { type: 'select-answer'; answer: number }
  | { type: 'show-hint' }
  | { type: 'confirm-answer' }
  | { type: 'reset' };

export function createMultiplicationChallengeState(): MultiplicationChallengeState {
  return { selections: {}, selectedAnswer: null, hintVisible: false, feedback: '', completed: false };
}

export const multiplicationChallengeInitialState = createMultiplicationChallengeState();

export function reduceMultiplicationChallenge(
  state: MultiplicationChallengeState,
  action: MultiplicationChallengeAction,
  challenge: MultiplicationChallengeDefinition = multiplicationRobotChallenge,
): MultiplicationChallengeState {
  if (action.type === 'reset') return createMultiplicationChallengeState();
  if (state.completed) return state;

  switch (action.type) {
    case 'select-option': {
      const stage = challenge.stages.find((candidate) => candidate.id === action.stageId);
      if (!stage?.options.some((option) => option.id === action.optionId)) return state;
      return {
        ...state,
        selections: { ...state.selections, [action.stageId]: action.optionId },
        feedback: '',
      };
    }
    case 'select-answer':
      return challenge.stages.some((stage) => !state.selections[stage.id])
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
        feedback: challenge.feedback[state.selectedAnswer] ?? 'Experimente contar todas as combinações novamente.',
      };
    }
  }
}
