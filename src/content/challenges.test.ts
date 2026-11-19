import { describe, expect, it } from 'vitest';
import {
  additionMaterialsChallenge,
  additionSeparationChallenge,
  allChallenges,
  multiplicationAssemblyChallenge,
  multiplicationRoutesChallenge,
  pigeonholeComponentsChallenge,
  pigeonholeDistributionChallenge,
} from './challenges';

describe('fases adicionais do catálogo', () => {
  it('mantém as seis fases selecionadas em dois slots de cada princípio', () => {
    expect(allChallenges.map(({ id }) => id)).toEqual([
      'adicao-1', 'adicao-2', 'adicao-3',
      'multiplicacao-1', 'multiplicacao-2', 'multiplicacao-3',
      'casas-de-pombo-1', 'casas-de-pombo-2', 'casas-de-pombo-3',
    ]);
  });

  it('conta as alternativas distintas de adição em dois ou três grupos', () => {
    expect(additionSeparationChallenge).toMatchObject({ id: 'adicao-2', correctAnswer: 7 });
    expect(additionSeparationChallenge.groups.map(({ count }) => count)).toEqual([4, 3]);
    expect(additionMaterialsChallenge).toMatchObject({ id: 'adicao-3', correctAnswer: 12 });
    expect(additionMaterialsChallenge.groups.map(({ count }) => count)).toEqual([5, 4, 3]);
  });

  it('conta combinações de duas peças e caminhos por três etapas', () => {
    expect(multiplicationAssemblyChallenge).toMatchObject({ id: 'multiplicacao-2', correctAnswer: 12 });
    expect(multiplicationAssemblyChallenge.stages.map(({ options }) => options.length)).toEqual([4, 3]);
    expect(multiplicationRoutesChallenge).toMatchObject({ id: 'multiplicacao-3', correctAnswer: 12 });
    expect(multiplicationRoutesChallenge.stages.map(({ options }) => options.length)).toEqual([2, 3, 2]);
  });

  it('calcula a ocupação mínima garantida para cinco caixas ou seis categorias', () => {
    expect(pigeonholeDistributionChallenge).toMatchObject({
      id: 'casas-de-pombo-2', items: 13, boxes: 5, correctAnswer: 3,
    });
    expect(pigeonholeComponentsChallenge).toMatchObject({
      id: 'casas-de-pombo-3', items: 31, boxes: 6, correctAnswer: 6,
    });
  });
});
