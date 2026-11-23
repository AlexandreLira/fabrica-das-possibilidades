import { describe, expect, it } from 'vitest';
import {
  additionCertificationChallenge,
  additionMaterialsChallenge,
  additionProductionChallenge,
  additionSeparationChallenge,
  allChallenges,
  getNextChallenge,
  multiplicationAssemblyChallenge,
  multiplicationCompleteRobotChallenge,
  multiplicationRoutesChallenge,
  pigeonholeComponentsChallenge,
  pigeonholeDistributionChallenge,
  pigeonholeProductionChallenge,
} from './challenges';
import { certificationGroups, certificationIntersections, certifiedEmployees, tripleCertificationCount } from './certifications';

describe('fases adicionais do catálogo', () => {
  it('mantém as fases na ordem de progressão', () => {
    expect(allChallenges.map(({ id }) => id)).toEqual([
      'adicao-1', 'adicao-2', 'adicao-3', 'adicao-4', 'adicao-5',
      'multiplicacao-1', 'multiplicacao-2', 'multiplicacao-3', 'multiplicacao-4', 'multiplicacao-5',
      'casas-de-pombo-1', 'casas-de-pombo-2', 'casas-de-pombo-3', 'casas-de-pombo-4', 'casas-de-pombo-5',
    ]);
  });

  it('continua para a fase 4 antes de avançar ao princípio seguinte', () => {
    expect(getNextChallenge('adicao-3')?.id).toBe('adicao-4');
    expect(getNextChallenge('multiplicacao-3')?.id).toBe('multiplicacao-4');
    expect(getNextChallenge('adicao-4')?.id).toBe('adicao-5');
    expect(getNextChallenge('adicao-5')?.id).toBe('multiplicacao-1');
    expect(getNextChallenge('multiplicacao-4')?.id).toBe('multiplicacao-5');
    expect(getNextChallenge('multiplicacao-5')?.id).toBe('casas-de-pombo-1');
    expect(getNextChallenge('casas-de-pombo-3')?.id).toBe('casas-de-pombo-4');
    expect(getNextChallenge('casas-de-pombo-4')?.id).toBe('casas-de-pombo-5');
    expect(getNextChallenge('casas-de-pombo-5')).toBeUndefined();
  });

  it('conta as alternativas distintas de adição em dois ou três grupos', () => {
    expect(additionSeparationChallenge).toMatchObject({ id: 'adicao-2', correctAnswer: 7 });
    expect(additionSeparationChallenge.groups.map(({ count }) => count)).toEqual([4, 3]);
    expect(additionMaterialsChallenge).toMatchObject({ id: 'adicao-3', correctAnswer: 12 });
    expect(additionMaterialsChallenge.groups.map(({ count }) => count)).toEqual([5, 4, 3]);
  });

  it('conta os funcionários disponíveis nos quatro setores', () => {
    expect(additionProductionChallenge.groups.map(({ count }) => count)).toEqual([8, 6, 5, 4]);
    expect(additionProductionChallenge.correctAnswer).toBe(23);
    expect(additionProductionChallenge.answers).toEqual([21, 22, 23, 24]);
  });

  it('conta uma vez cada pessoa certificada e exclui os três afastados', () => {
    expect(additionCertificationChallenge.groups.map(({ count }) => count)).toEqual([14, 11, 9]);
    expect(certificationIntersections.map(({ count }) => count)).toEqual([5, 4, 3]);
    expect(tripleCertificationCount).toBe(2);
    expect(certificationGroups.map(({ employees }) => employees.length)).toEqual([7, 5, 4, 3, 2, 1, 2]);
    expect(new Set(certifiedEmployees.map(({ name }) => name)).size).toBe(24);
    expect(certifiedEmployees.filter(({ away }) => away).map(({ ids }) => ids)).toEqual([['NR-12'], ['NR-12'], ['NR-12']]);
    expect(additionCertificationChallenge.correctAnswer).toBe(21);
  });

  it('conta combinações de duas peças e caminhos por três etapas', () => {
    expect(multiplicationAssemblyChallenge).toMatchObject({ id: 'multiplicacao-2', correctAnswer: 12 });
    expect(multiplicationAssemblyChallenge.stages.map(({ options }) => options.length)).toEqual([4, 3]);
    expect(multiplicationRoutesChallenge).toMatchObject({ id: 'multiplicacao-3', correctAnswer: 12 });
    expect(multiplicationRoutesChallenge.stages.map(({ options }) => options.length)).toEqual([2, 3, 2]);
  });

  it('conta as 36 combinações das quatro categorias de peças', () => {
    expect(multiplicationCompleteRobotChallenge.stages.map(({ options }) => options.length)).toEqual([3, 3, 2, 2]);
    expect(multiplicationCompleteRobotChallenge.answers).toEqual([10, 18, 24, 36]);
    expect(multiplicationCompleteRobotChallenge.correctAnswer).toBe(36);
  });

  it('distingue o limite de 77 lotes do menor total que garante 12 em uma linha', () => {
    expect(pigeonholeProductionChallenge).toMatchObject({
      id: 'casas-de-pombo-4', boxes: 7, targetOccupancy: 12, items: 77, correctAnswer: 78,
    });
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
