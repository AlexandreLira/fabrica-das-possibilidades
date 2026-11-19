import { expect, it } from 'vitest';
import {
  additionMaterialsChallenge,
  multiplicationRoutesChallenge,
  pigeonholeComponentsChallenge,
} from '../content/challenges';
import {
  createAdditionChallengeState,
  reduceAdditionChallenge,
} from './additionChallengeState';
import {
  createMultiplicationChallengeState,
  reduceMultiplicationChallenge,
} from './multiplicationChallengeState';
import {
  createPigeonholeChallengeState,
  reducePigeonholeChallenge,
} from './pigeonholeChallengeState';

it('addition unlocks the answer only after every group is examined', () => {
  const challenge = additionMaterialsChallenge;
  const initial = createAdditionChallengeState();
  const oneGroup = reduceAdditionChallenge(initial, { type: 'reveal-group', groupId: 'ferramentas' }, challenge);
  expect(reduceAdditionChallenge(oneGroup, { type: 'select-answer', answer: 12 }, challenge).selectedAnswer).toBeNull();

  const ready = challenge.groups.reduce(
    (state, group) => reduceAdditionChallenge(state, { type: 'reveal-group', groupId: group.id }, challenge),
    oneGroup,
  );
  expect(reduceAdditionChallenge(ready, { type: 'select-answer', answer: 12 }, challenge).selectedAnswer).toBe(12);
});

it('multiplication unlocks after selecting an option in each of three stages', () => {
  const challenge = multiplicationRoutesChallenge;
  const initial = createMultiplicationChallengeState();
  const firstStage = challenge.stages[0]!;
  const partial = reduceMultiplicationChallenge(initial, {
    type: 'select-option', stageId: firstStage.id, optionId: firstStage.options[0]!.id,
  }, challenge);
  expect(reduceMultiplicationChallenge(partial, { type: 'select-answer', answer: 12 }, challenge).selectedAnswer).toBeNull();

  const ready = challenge.stages.reduce(
    (state, stage) => reduceMultiplicationChallenge(state, {
      type: 'select-option', stageId: stage.id, optionId: stage.options[0]!.id,
    }, challenge),
    partial,
  );
  expect(reduceMultiplicationChallenge(ready, { type: 'select-answer', answer: 12 }, challenge).selectedAnswer).toBe(12);
});

it('pigeonhole distribution supports 31 items in six categories and resets', () => {
  const challenge = pigeonholeComponentsChallenge;
  const initial = createPigeonholeChallengeState(challenge);
  expect(initial.counts).toEqual([0, 0, 0, 0, 0, 0]);
  expect(initial.remaining).toBe(31);

  let full = initial;
  for (let index = 0; index < challenge.items; index += 1) {
    full = reducePigeonholeChallenge(full, { type: 'place-item', boxIndex: index % challenge.boxes }, challenge);
  }
  expect(full.counts.reduce((sum, count) => sum + count, 0)).toBe(31);
  expect(full.remaining).toBe(0);
  expect(reducePigeonholeChallenge(full, { type: 'reset-distribution' }, challenge)).toEqual(initial);
});
