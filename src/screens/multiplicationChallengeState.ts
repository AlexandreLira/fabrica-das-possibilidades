import {
  multiplicationRobotChallenge,
  type RobotAntennaId,
  type RobotBodyId,
} from '../content/challenges';

export interface MultiplicationChallengeState {
  bodyId: RobotBodyId | null;
  antennaId: RobotAntennaId | null;
  selectedAnswer: number | null;
  hintVisible: boolean;
  feedback: string;
  completed: boolean;
}

export type MultiplicationChallengeAction =
  | { type: 'select-body'; bodyId: RobotBodyId }
  | { type: 'select-antenna'; antennaId: RobotAntennaId }
  | { type: 'select-answer'; answer: number }
  | { type: 'show-hint' }
  | { type: 'confirm-answer' }
  | { type: 'reset' };

export const multiplicationChallengeInitialState: MultiplicationChallengeState = {
  bodyId: null,
  antennaId: null,
  selectedAnswer: null,
  hintVisible: false,
  feedback: '',
  completed: false,
};

export function reduceMultiplicationChallenge(
  state: MultiplicationChallengeState,
  action: MultiplicationChallengeAction,
): MultiplicationChallengeState {
  if (action.type === 'reset') return multiplicationChallengeInitialState;
  if (state.completed) return state;

  switch (action.type) {
    case 'select-body':
      return { ...state, bodyId: action.bodyId, feedback: '' };
    case 'select-antenna':
      return { ...state, antennaId: action.antennaId, feedback: '' };
    case 'select-answer':
      return state.bodyId && state.antennaId
        ? { ...state, selectedAnswer: action.answer, feedback: '' }
        : state;
    case 'show-hint':
      return { ...state, hintVisible: true };
    case 'confirm-answer': {
      if (state.selectedAnswer === null) return state;
      if (state.selectedAnswer === multiplicationRobotChallenge.correctAnswer) {
        return { ...state, completed: true, feedback: multiplicationRobotChallenge.successExplanation };
      }
      return {
        ...state,
        selectedAnswer: null,
        feedback: multiplicationRobotChallenge.feedback[state.selectedAnswer] ?? 'Experimente contar todas as combinações novamente.',
      };
    }
  }
}
