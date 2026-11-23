import { expect, it } from 'vitest';
import {
  additionMaterialsChallenge,
  additionProductionChallenge,
  multiplicationRoutesChallenge,
  pigeonholeComponentsChallenge,
  pigeonholeProductionChallenge,
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

it('validates each retry and completes the final addition phase with 23', () => {
  const challenge = additionProductionChallenge;
  const apply = (state: ReturnType<typeof createAdditionChallengeState>, action: Parameters<typeof reduceAdditionChallenge>[1]) =>
    reduceAdditionChallenge(state, action, challenge);
  const ready = challenge.groups.reduce(
    (state, { id }) => apply(state, { type: 'reveal-group', groupId: id }),
    createAdditionChallengeState(),
  );
  for (const answer of [21, 22, 24]) {
    const attempted = apply(apply(ready, { type: 'select-answer', answer }), { type: 'confirm-answer' });
    expect(attempted).toMatchObject({ selectedAnswer: null, completed: false, feedback: challenge.feedback[answer] });
  }
  const selected = apply(ready, { type: 'select-answer', answer: 23 });
  const completed = apply(selected, { type: 'confirm-answer' });
  expect(completed).toMatchObject({ completed: true, feedback: challenge.successExplanation });
  expect(apply(completed, { type: 'reset' })).toEqual(createAdditionChallengeState());
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

it('fills each production line once and completes only with the minimum guaranteed total', () => {
  const challenge = pigeonholeProductionChallenge;
  const initial = createPigeonholeChallengeState(challenge);
  const apply = (state: typeof initial, action: Parameters<typeof reducePigeonholeChallenge>[1]) =>
    reducePigeonholeChallenge(state, action, challenge);
  const first = apply(initial, { type: 'place-item', boxIndex: 0 });
  expect(first.counts[0]).toBe(11);
  expect(apply(first, { type: 'place-item', boxIndex: 0 })).toBe(first);
  expect(apply(first, { type: 'select-answer', answer: 78 })).toBe(first);
  const full = first.counts.reduce((state, _, boxIndex) => apply(state, { type: 'place-item', boxIndex }), first);
  expect(full).toMatchObject({ counts: [11, 11, 11, 11, 11, 11, 11], remaining: 0 });
  for (const answer of [77, 84, 85]) {
    expect(apply(apply(full, { type: 'select-answer', answer }), { type: 'confirm-answer' }))
      .toMatchObject({ completed: false, selectedAnswer: null, feedback: challenge.feedback[answer] });
  }
  const completed = apply(apply(full, { type: 'select-answer', answer: 78 }), { type: 'confirm-answer' });
  expect(completed.completed).toBe(true);
  expect(apply(completed, { type: 'reset' })).toEqual(initial);
});
