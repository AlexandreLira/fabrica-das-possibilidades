import {
  countAlternatives,
  countCombinations,
  minimumGuaranteedOccupancy,
} from '../domain/math/counting';
import { sectors, type ChallengeDefinition, type ChallengeId } from './sectors';
import { criticalStorageGuarantee } from '../domain/math/criticalStorage';
import { vaultCodeCount } from '../domain/math/vaultCode';
import { certificationLists, certifiedEmployees } from './certifications';

export interface AdditionChallengeDefinition extends ChallengeDefinition {
  principle: 'addition';
  overlappingCertifications?: boolean;
  completionMessage?: string;
  equation: string;
  groups: readonly {
    id: string;
    name: string;
    count: number;
    optionsLabel: string;
    symbol?: string;
  }[];
}

const additionRouteGroups = [
  { id: 'local', name: 'Rota local', count: 3, optionsLabel: '3 veículos disponíveis' },
  { id: 'express', name: 'Rota expressa', count: 4, optionsLabel: '4 veículos disponíveis' },
] as const;

export const additionRouteChallenge: AdditionChallengeDefinition = {
  id: 'adicao-1',
  principle: 'addition',
  title: 'Pedido com rota alternativa',
  sectorLabel: 'Setor 01 — Fase demonstrativa',
  introduction: 'Um pedido precisa sair da fábrica! Vamos escolher um veículo da rota local OU da expressa. Toque nas duas rotas para conhecer as opções.',
  question: 'Quantas opções de envio existem para o pedido?',
  tutorial: [
    'Toque nas duas rotas para revelar todos os veículos.',
    'Escolha uma resposta e confirme. Se precisar, peça uma dica.',
  ],
  equation: '3 + 4 = ?',
  groups: additionRouteGroups,
  answers: [6, 7, 12],
  correctAnswer: countAlternatives(additionRouteGroups.map((group) => group.count)),
  hint: 'O pedido usa apenas uma das rotas. Conte as opções de um grupo junto com as do outro.',
  feedback: {
    6: 'Confira os dois grupos: são 3 veículos em uma rota e 4 na outra.',
    12: 'Multiplicar contaria pares de veículos. Aqui escolhemos apenas um veículo, de uma rota ou da outra.',
  },
  successExplanation: 'Isso! Como os grupos são distintos e escolhemos uma opção de um OU de outro, somamos: 3 + 4 = 7 possibilidades.',
};

export const additionSeparationChallenge: AdditionChallengeDefinition = {
  id: 'adicao-2',
  principle: 'addition',
  title: 'Separação de Produtos',
  sectorLabel: 'Setor 01 — Fase 2',
  introduction: 'Vamos organizar os produtos da fábrica. Examine os dois grupos e conte quantas opções existem ao todo.',
  question: 'Quantas opções de produtos existem ao todo?',
  tutorial: ['Examine os produtos de cada grupo.', 'Some as quantidades e escolha a resposta correta.'],
  equation: '4 + 3 = ?',
  groups: [
    { id: 'vermelhos', name: 'Produtos vermelhos', count: 4, optionsLabel: '4 caixas' },
    { id: 'azuis', name: 'Produtos azuis', count: 3, optionsLabel: '3 caixas' },
  ],
  answers: [5, 6, 7, 8],
  correctAnswer: countAlternatives([4, 3]),
  hint: 'Conte os produtos de cada grupo separadamente e depois some os resultados.',
  feedback: {
    5: 'Confira novamente a quantidade de produtos.',
    6: 'Você pode ter esquecido de contar alguma caixa.',
    8: 'Revise a soma dos dois grupos.',
  },
  successExplanation: 'Muito bem! 4 produtos vermelhos + 3 produtos azuis = 7 opções. Como são alternativas distintas, somamos as quantidades.',
};

export const additionMaterialsChallenge: AdditionChallengeDefinition = {
  id: 'adicao-3',
  principle: 'addition',
  title: 'Escolha de Materiais',
  sectorLabel: 'Setor 01 — Fase 3',
  introduction: 'O setor precisa de materiais para continuar funcionando. Examine as três categorias e descubra quantas opções estão disponíveis.',
  question: 'Quantas opções de materiais estão disponíveis?',
  tutorial: ['Examine as três categorias de materiais.', 'Some as quantidades de todas as categorias.'],
  equation: '5 + 4 + 3 = ?',
  groups: [
    { id: 'ferramentas', name: 'Ferramentas', count: 5, optionsLabel: '5 ferramentas' },
    { id: 'metal', name: 'Peças metálicas', count: 4, optionsLabel: '4 peças' },
    { id: 'eletronicos', name: 'Componentes eletrônicos', count: 3, optionsLabel: '3 componentes' },
  ],
  answers: [10, 11, 12, 15],
  correctAnswer: countAlternatives([5, 4, 3]),
  hint: 'Não esqueça de incluir todos os três grupos na operação.',
  feedback: {
    10: 'Confira se você considerou os três grupos.',
    11: 'Revise a soma dos materiais.',
    15: 'Some as quantidades, sem multiplicá-las.',
  },
  successExplanation: 'Excelente! 5 ferramentas + 4 peças metálicas + 3 componentes eletrônicos = 12 opções.',
};

const productionGroups = [
  { id: 'mecanico', name: 'Mecânico', count: 8, optionsLabel: '8 funcionários', symbol: '⚙' },
  { id: 'eletrico', name: 'Elétrico', count: 6, optionsLabel: '6 funcionários', symbol: 'ϟ' },
  { id: 'administrativo', name: 'Administrativo', count: 5, optionsLabel: '5 funcionários', symbol: '▤' },
  { id: 'logistica', name: 'Logística', count: 4, optionsLabel: '4 funcionários', symbol: '▣' },
] as const;

export const additionProductionChallenge: AdditionChallengeDefinition = {
  id: 'adicao-4',
  principle: 'addition',
  title: 'A Grande Produção',
  sectorLabel: 'Setor 01 — Fase 4',
  introduction: 'A fábrica recebeu uma encomenda muito importante e precisamos escolher um funcionário para coordenar a produção. Temos profissionais em quatro setores diferentes. Vamos descobrir quantas possibilidades existem?',
  question: 'Se a fábrica precisa escolher apenas um funcionário entre os quatro setores, quantas possibilidades de escolha existem?',
  tutorial: [
    'Examine os quatro setores e conte os funcionários de cada um.',
    'Some as quatro quantidades, escolha o resultado e confirme.',
  ],
  equation: '8 + 6 + 5 + 4 = ?',
  groups: productionGroups,
  answers: [21, 22, 23, 24],
  correctAnswer: countAlternatives(productionGroups.map(({ count }) => count)),
  hint: 'Temos quatro setores diferentes. Organize os valores e faça a soma de todos eles.',
  feedback: {
    21: 'Confira se você contou todos os funcionários do setor administrativo.',
    22: 'Revise a soma das quatro categorias.',
    24: 'Atenção! Confira os valores apresentados antes de responder.',
  },
  successExplanation: 'Somamos 8 + 6 + 5 + 4 = 23 possibilidades porque escolhemos um único funcionário entre quatro setores distintos.',
  completionMessage: 'MISSÃO CUMPRIDA! Você conseguiu resolver o desafio dos quatro setores! Nesta fase, utilizamos o princípio da adição com quatro categorias de alternativas. Você demonstrou que consegue aplicar esse conhecimento em situações mais complexas. Parabéns!',
};

export const additionCertificationChallenge: AdditionChallengeDefinition = {
  id: 'adicao-5',
  principle: 'addition',
  overlappingCertifications: true,
  title: 'Certificação Tripla',
  sectorLabel: 'Setor 01 — Fase 5',
  introduction: 'Construtor, preciso escolher um coordenador com pelo menos uma certificação de segurança. Algumas pessoas aparecem em várias listas e outras estão afastadas. Quantos funcionários diferentes posso escolher?',
  question: 'Se a fábrica precisa escolher um único coordenador que tenha pelo menos uma certificação e esteja disponível, quantas possibilidades de escolha existem?',
  tutorial: [
    'Examine as três listas de certificação e o quadro de interseções.',
    'Toque nos crachás marcados como repetidos para ver em quais listas cada pessoa aparece.',
    'Conte cada pessoa uma vez só, retire os afastados e escolha uma resposta.',
  ],
  equation: '24 − 3 = 21',
  groups: certificationLists.map(({ id, name, employees }) => ({
    id, name, count: employees.length, optionsLabel: `${employees.length} funcionários`,
  })),
  answers: [24, 31, 21, 19],
  correctAnswer: certifiedEmployees.filter(({ away }) => !away).length,
  hint: 'Das 5 pessoas que têm NR-10 e NR-12, 2 também têm NR-35. Quantas têm exatamente essas duas? Use a mesma ideia para separar as listas em grupos sem repetição.',
  feedback: {
    24: 'Ótima contagem! Mas o coordenador precisa estar disponível. Quantas pessoas afastadas devem sair da lista?',
    31: 'Quem tem duas ou três certificações aparece em várias listas. Como contar cada pessoa uma vez só?',
    19: 'As duas pessoas com as três certificações foram contadas três vezes e descontadas três vezes. Como colocá-las de volta na contagem?',
  },
  completionMessage: 'Missão cumprida, construtor! Você encontrou 24 pessoas com certificação e retirou os 3 afastados. Sobram 21 coordenadores possíveis!',
  successExplanation: 'Cada pessoa pertence a um único grupo depois da reorganização. Assim, a soma dos sete grupos conta cada funcionário uma vez.',
};

export interface MultiplicationOption {
  id: string;
  name: string;
  color?: string;
  symbol?: string;
}

export interface MultiplicationStage {
  id: string;
  name: string;
  options: readonly MultiplicationOption[];
}

export interface MultiplicationChallengeDefinition extends ChallengeDefinition {
  principle: 'multiplication';
  visual: 'robot' | 'routes' | 'complete-robot';
  equation: string;
  stages: readonly MultiplicationStage[];
}

const robotStages = [
  {
    id: 'carcaca', name: 'Carcaça', options: [
      { id: 'ciano', name: 'Carcaça ciano', color: '#71dfda' },
      { id: 'amarela', name: 'Carcaça amarela', color: '#f4c955' },
      { id: 'coral', name: 'Carcaça coral', color: '#ef7d72' },
    ],
  },
  {
    id: 'antena', name: 'Antena', options: [
      { id: 'haste', name: 'Antena de haste', color: '#f4c955' },
      { id: 'dupla', name: 'Antena dupla', color: '#71dfda' },
    ],
  },
] as const;

export const multiplicationRobotChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-1',
  principle: 'multiplication',
  visual: 'robot',
  title: 'Monte o robô',
  sectorLabel: 'Setor 02 — Fase demonstrativa',
  introduction: 'Agora vamos montar robôs! Escolha uma carcaça E uma antena. Cada carcaça funciona com qualquer uma das antenas.',
  question: 'Quantos modelos diferentes podemos montar usando uma carcaça e uma antena?',
  tutorial: [
    'Escolha uma das três carcaças e uma das duas antenas.',
    'Observe a prévia, experimente combinações e depois responda ao desafio.',
  ],
  equation: '3 × 2 = ?',
  stages: robotStages,
  answers: [5, 6, 9],
  correctAnswer: countCombinations(robotStages.map((stage) => stage.options.length)),
  hint: 'Para cada uma das três carcaças, existem duas escolhas de antena.',
  feedback: {
    5: 'Somar conta peças disponíveis. Queremos contar os modelos formados por uma carcaça E uma antena.',
    9: 'Confira quantas antenas existem para cada carcaça: são duas, não três.',
  },
  successExplanation: 'Cada uma das 3 carcaças combina com 2 antenas: 3 × 2 = 6 modelos.',
};

const assemblyStages = [
  {
    id: 'corpo', name: 'Modelo de corpo', options: [
      { id: 'corpo-1', name: 'Corpo 1', color: '#71dfda' },
      { id: 'corpo-2', name: 'Corpo 2', color: '#f4c955' },
      { id: 'corpo-3', name: 'Corpo 3', color: '#ef7d72' },
      { id: 'corpo-4', name: 'Corpo 4', color: '#b6a3eb' },
    ],
  },
  {
    id: 'rodas', name: 'Modelo de rodas', options: [
      { id: 'rodas-1', name: 'Rodas 1', color: '#71dfda' },
      { id: 'rodas-2', name: 'Rodas 2', color: '#f4c955' },
      { id: 'rodas-3', name: 'Rodas 3', color: '#b6a3eb' },
    ],
  },
] as const;

export const multiplicationAssemblyChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-2',
  principle: 'multiplication',
  visual: 'robot',
  title: 'Montagem de Robôs',
  sectorLabel: 'Setor 02 — Fase 2',
  introduction: 'A fábrica tem diferentes corpos e rodas para montar robôs. Escolha uma opção de cada tipo e conte todas as combinações possíveis.',
  question: 'Quantos robôs diferentes podem ser montados?',
  tutorial: ['Escolha um modelo de corpo.', 'Escolha um modelo de rodas e descubra quantas combinações existem.'],
  equation: '4 × 3 = ?',
  stages: assemblyStages,
  answers: [7, 9, 12, 16],
  correctAnswer: countCombinations(assemblyStages.map((stage) => stage.options.length)),
  hint: 'Para cada modelo de corpo, existem três possibilidades de rodas.',
  feedback: {
    7: 'Não some as quantidades. Cada corpo pode ser combinado com todos os modelos de rodas.',
    9: 'Confira as quantidades disponíveis: são 4 modelos de corpo e 3 modelos de rodas.',
    16: 'Pense em quantas opções de rodas existem para cada modelo de corpo.',
  },
  successExplanation: 'Cada modelo de corpo pode ser combinado com qualquer um dos modelos de rodas: 4 × 3 = 12 robôs.',
};

const routeStages = [
  { id: 'setor-1', name: 'Setor 1', options: [{ id: 'rota-1a', name: 'Caminho A', color: '#71dfda' }, { id: 'rota-1b', name: 'Caminho B', color: '#f4c955' }] },
  { id: 'setor-2', name: 'Setor 2', options: [{ id: 'rota-2a', name: 'Caminho A', color: '#71dfda' }, { id: 'rota-2b', name: 'Caminho B', color: '#f4c955' }, { id: 'rota-2c', name: 'Caminho C', color: '#b6a3eb' }] },
  { id: 'setor-3', name: 'Setor 3', options: [{ id: 'rota-3a', name: 'Caminho A', color: '#71dfda' }, { id: 'rota-3b', name: 'Caminho B', color: '#f4c955' }] },
] as const;

export const multiplicationRoutesChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-3',
  principle: 'multiplication',
  visual: 'routes',
  title: 'Caminhos da Fábrica',
  sectorLabel: 'Setor 02 — Fase 3',
  introduction: 'Um robô precisa atravessar três setores da fábrica. Em cada setor, escolha um caminho para descobrir todos os trajetos possíveis.',
  question: 'Quantos trajetos diferentes o robô pode realizar?',
  tutorial: ['Escolha um caminho em cada um dos três setores.', 'Multiplique as quantidades de caminhos para contar todos os trajetos.'],
  equation: '2 × 3 × 2 = ?',
  stages: routeStages,
  answers: [7, 10, 12, 14],
  correctAnswer: countCombinations(routeStages.map((stage) => stage.options.length)),
  hint: 'O robô escolhe um caminho em cada setor. Multiplique 2, 3 e 2.',
  feedback: {
    7: 'Não some os caminhos: o robô precisa passar pelos três setores.',
    10: 'Confira as possibilidades disponíveis em cada setor.',
    14: 'Revise a multiplicação das três etapas.',
  },
  successExplanation: 'Há 2 caminhos no primeiro setor, 3 no segundo e 2 no terceiro: 2 × 3 × 2 = 12 trajetos.',
};

const completeRobotStages = [
  { id: 'cabeca', name: 'Cabeça', options: [
    { id: 'cabeca-1', name: 'Cabeça 1', color: '#71dfda' },
    { id: 'cabeca-2', name: 'Cabeça 2', color: '#f4c955' },
    { id: 'cabeca-3', name: 'Cabeça 3', color: '#b6a3eb' },
  ] },
  { id: 'corpo', name: 'Corpo', options: [
    { id: 'corpo-1', name: 'Corpo 1', color: '#71dfda' },
    { id: 'corpo-2', name: 'Corpo 2', color: '#ef7d72' },
    { id: 'corpo-3', name: 'Corpo 3', color: '#b6a3eb' },
  ] },
  { id: 'bracos', name: 'Braços', options: [
    { id: 'bracos-1', name: 'Braços 1', color: '#71dfda' },
    { id: 'bracos-2', name: 'Braços 2', color: '#ef7d72' },
  ] },
  { id: 'sensores', name: 'Sensores', options: [
    { id: 'sensor-1', name: 'Sensor 1', color: '#f4c955' },
    { id: 'sensor-2', name: 'Sensor 2', color: '#71dfda' },
  ] },
] as const satisfies readonly MultiplicationStage[];

export const multiplicationCompleteRobotChallenge: MultiplicationChallengeDefinition = {
  id: 'multiplicacao-4',
  principle: 'multiplication',
  visual: 'complete-robot',
  title: 'Robô Completo',
  sectorLabel: 'Setor 02 — Fase 4',
  introduction: 'Atenção, construtor! Recebemos uma missão especial: mapear todos os modelos de robôs para a competição! Temos várias opções de peças na esteira. Você consegue descobrir quantas combinações diferentes conseguimos montar combinando uma peça de cada categoria?',
  question: 'Para a competição, a fábrica tem 3 opções de cabeça, 3 de corpo, 2 de braços e 2 de sensores. Se cada robô usa exatamente uma opção de cada categoria, quantos modelos diferentes podem ser construídos?',
  tutorial: [
    'Combine uma peça de cada categoria para ver o robô tomar forma.',
    'Experimente outras peças, calcule o total de modelos e escolha uma resposta.',
  ],
  equation: '3 × 3 × 2 × 2 = ?',
  stages: completeRobotStages,
  answers: [10, 18, 24, 36],
  correctAnswer: countCombinations(completeRobotStages.map(({ options }) => options.length)),
  hint: 'Observe quantas categorias existem. Cada categoria representa uma etapa da montagem. Em vez de somar, pense em quantas combinações se formam ao multiplicar as opções de cada etapa!',
  feedback: {
    10: 'Cuidado! Você somou a quantidade de peças disponíveis, mas cada cabeça combina com todas as opções de corpo, braços e sensores. Que operação conta essas combinações?',
    18: 'Chegou perto! Confira se incluiu as quatro categorias: cabeças, corpos, braços e sensores.',
    24: 'Quase lá! Vamos refazer a conta por partes: 3 × 3 = 9, depois 9 × 2 = 18 e agora 18 × 2 = ?',
  },
  successExplanation: 'Excelente trabalho, construtor! Cabeças e corpos dão 3 × 3 = 9 combinações. Com os braços, são 9 × 2 = 18. Com os sensores, 18 × 2 = 36 modelos. Como as quatro etapas são independentes, multiplicamos todas as possibilidades. Com essa estratégia, a fábrica vai dominar a competição!',
};

export interface VaultChallengeDefinition extends ChallengeDefinition {
  id: 'multiplicacao-5';
  principle: 'multiplication';
  visual: 'vault';
}

export const multiplicationVaultChallenge: VaultChallengeDefinition = {
  id: 'multiplicacao-5',
  principle: 'multiplication',
  visual: 'vault',
  title: 'Código do Cofre',
  sectorLabel: 'Setor 02 — Fase 5',
  introduction: 'Construtor, o cofre da fábrica só abre com uma letra seguida de três algarismos. Observe como a escolha de um algarismo afeta as outras posições. Quantos códigos diferentes o sistema aceita?',
  question: 'Quantos códigos diferentes o cofre aceita?',
  tutorial: [
    'Use o teclado para montar um código e testar as regras.',
    'Observe como as escolhas afetam as posições restantes e escolha uma resposta.',
  ],
  answers: [1440, 1640, 2025, 2250],
  correctAnswer: vaultCodeCount,
  hint: 'Comece pelo último algarismo: ele é 0 ou é outro número par? Em cada caso, quantas opções sobram para o primeiro e para o do meio?',
  feedback: {
    1440: 'Quantos algarismos pares sobram no final depende das escolhas anteriores. Lembre-se de que o 0 é par e só pode aparecer depois da primeira posição.',
    2025: 'O último algarismo também precisa ser diferente dos dois primeiros. Se o primeiro for par, quantos pares ainda sobram para o final?',
    2250: 'Os algarismos do código não podem se repetir. Quantas opções sobram para o meio depois de escolher o primeiro e o último?',
  },
  successExplanation: 'Cofre aberto, construtor! Separamos os trios em dois casos, somamos as possibilidades e multiplicamos pelas cinco letras.',
};

export interface PigeonholeChallengeDefinition extends ChallengeDefinition {
  principle: 'pigeonhole';
  visual?: undefined;
  items: number;
  itemLabel: string;
  itemPlural: string;
  boxLabel: string;
  boxes: number;
  boxNames?: readonly string[];
  targetOccupancy?: number;
  equation: string;
}

export const pigeonholeStorageChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-1',
  principle: 'pigeonhole',
  title: 'Organize o depósito',
  sectorLabel: 'Setor 03 — Fase demonstrativa',
  introduction: 'Temos 7 peças e 3 caixas. Toque nas caixas para guardar as peças e observe o que acontece.',
  question: 'Independentemente de como você distribuir as peças, qual é o menor número que podemos garantir que alguma caixa terá, pelo menos?',
  tutorial: [
    'Toque em uma caixa para guardar nela a próxima peça.',
    'Distribua as sete peças. Você pode reiniciar antes de responder.',
  ],
  items: 7,
  itemLabel: 'peça',
  itemPlural: 'peças',
  boxLabel: 'caixa',
  boxes: 3,
  equation: '⌈7 ÷ 3⌉ = ?',
  answers: [2, 3, 7],
  correctAnswer: minimumGuaranteedOccupancy(7, 3),
  hint: 'Se cada caixa tivesse no máximo 2 peças, caberiam apenas 6. E a peça que sobrou?',
  feedback: {
    2: 'Três caixas com no máximo 2 peças guardariam apenas 6. Precisamos guardar 7.',
    7: 'Uma caixa pode receber todas as peças, mas isso não acontece em toda distribuição. Procure a menor quantidade inevitável.',
  },
  successExplanation: 'Alguma caixa terá pelo menos 3 peças! Com apenas 2 em cada caixa, guardaríamos 6. A sétima exige que uma caixa tenha 3 ou mais.',
};

export const pigeonholeDistributionChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-2',
  principle: 'pigeonhole',
  title: 'O Armazém no Limite',
  sectorLabel: 'Setor 03 — Fase 2',
  introduction: 'Temos 13 caixas para distribuir em 5 compartimentos. Descubra o mínimo que necessariamente ficará em algum compartimento, mesmo com a divisão mais equilibrada.',
  question: 'Qual é a menor quantidade de caixas que podemos garantir em pelo menos um compartimento?',
  tutorial: ['Distribua as 13 caixas pelos cinco compartimentos.', 'Imagine a distribuição mais equilibrada e escolha a menor quantidade garantida.'],
  items: 13,
  itemLabel: 'caixa',
  itemPlural: 'caixas',
  boxLabel: 'compartimento',
  boxes: 5,
  equation: '⌈13 ÷ 5⌉ = ?',
  answers: [1, 2, 3, 5],
  correctAnswer: minimumGuaranteedOccupancy(13, 5),
  hint: 'Se cada compartimento tivesse no máximo 2 caixas, caberiam apenas 10.',
  feedback: {
    1: 'Pense no que ocorre quando as 13 caixas são distribuídas pelo maior número de compartimentos.',
    2: 'Cinco compartimentos com 2 caixas comportam apenas 10 caixas.',
    5: 'A quantidade garantida deve valer mesmo na distribuição mais equilibrada.',
  },
  successExplanation: 'Cinco compartimentos com 2 caixas acomodam 10. As três caixas restantes garantem que algum compartimento tenha pelo menos 3.',
};

export const pigeonholeComponentsChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-3',
  principle: 'pigeonhole',
  title: 'O Controle de Qualidade',
  sectorLabel: 'Setor 03 — Fase 3',
  introduction: 'A inspeção encontrou 31 componentes defeituosos. Eles pertencem a seis categorias; descubra o mínimo garantido em alguma categoria.',
  question: 'Qual é a menor quantidade de componentes que podemos garantir que terá o mesmo tipo de defeito?',
  tutorial: ['Distribua os 31 componentes pelas seis categorias.', 'Considere a divisão mais equilibrada para encontrar o mínimo garantido.'],
  items: 31,
  itemLabel: 'componente',
  itemPlural: 'componentes',
  boxLabel: 'categoria',
  boxes: 6,
  boxNames: ['Elétrico', 'Mecânico', 'Acabamento', 'Conexão', 'Montagem', 'Isolamento'],
  equation: '⌈31 ÷ 6⌉ = ?',
  answers: [4, 5, 6, 7],
  correctAnswer: minimumGuaranteedOccupancy(31, 6),
  hint: 'Se cada categoria tivesse no máximo 5 componentes, quantos componentes seriam distribuídos?',
  feedback: {
    4: 'Considere quantos componentes cabem em seis categorias com até 5 em cada.',
    5: 'Seis categorias com 5 componentes comportam apenas 30 componentes.',
    7: 'A divisão mais equilibrada determina o menor mínimo garantido.',
  },
  successExplanation: 'Seis categorias com 5 componentes acomodam 30. O componente restante garante que uma categoria tenha pelo menos 6.',
};

const productionLines = 7;
const productionTarget = 12;
const productionLimit = countCombinations([productionLines, productionTarget - 1]);

export const pigeonholeProductionChallenge: PigeonholeChallengeDefinition = {
  id: 'casas-de-pombo-4',
  principle: 'pigeonhole',
  title: 'Operação Linha de Produção',
  sectorLabel: 'Setor 03 — Fase 4',
  introduction: 'Temos uma missão importante no controle de qualidade! A fábrica possui 7 linhas de produção, e precisamos garantir que pelo menos uma delas tenha 12 lotes ou mais para receber uma auditoria especial. Não sabemos como os lotes serão distribuídos. Descubra quantos lotes precisamos registrar para ter essa garantia!',
  question: 'Qual é o menor número de lotes que a fábrica precisa registrar para garantir que pelo menos uma das 7 linhas de produção tenha 12 lotes ou mais?',
  tutorial: [
    'Cada lote pertence a uma única linha. A distribuição pode ser desigual.',
    'Para simular o cenário em que nenhuma linha alcança 12, preencha cada linha com 11 lotes.',
    'Observe o total do cenário-limite e pense no que acontece ao registrar mais um lote.',
  ],
  items: productionLimit,
  itemLabel: 'lote',
  itemPlural: 'lotes',
  boxLabel: 'linha',
  boxes: productionLines,
  targetOccupancy: productionTarget,
  equation: '7 × (12 − 1) + 1 = 78',
  answers: [77, 78, 84, 85],
  correctAnswer: countAlternatives([productionLimit, 1]),
  hint: 'Se cada uma das 7 linhas pudesse receber 11 lotes, quantos lotes seriam distribuídos ao todo? O que aconteceria com o lote seguinte?',
  feedback: {
    77: 'Ainda não! Com 77 lotes, você pode distribuir 11 em cada uma das 7 linhas. Assim, nenhuma chega a 12. É preciso considerar mais um lote.',
    84: 'Esse total garante a meta, mas o desafio pede o menor número possível. Verifique se a garantia já acontece antes de chegar a 84.',
    85: 'Esse total também ultrapassa o necessário. Queremos o primeiro lote que torna impossível manter todas as linhas com 11 ou menos.',
  },
  successExplanation: 'Excelente! Com 77 lotes, ainda podemos distribuir 11 em cada linha. Quando chega o 78º lote, alguma linha obrigatoriamente fica com pelo menos 12. Você aplicou a forma generalizada do Princípio das Casas de Pombo!',
};

export interface CriticalStorageChallengeDefinition extends ChallengeDefinition {
  id: 'casas-de-pombo-5';
  principle: 'pigeonhole';
  visual: 'critical-storage';
}

export const pigeonholeCriticalStorageChallenge: CriticalStorageChallengeDefinition = {
  id: 'casas-de-pombo-5',
  principle: 'pigeonhole',
  visual: 'critical-storage',
  title: 'Depósito Crítico',
  sectorLabel: 'Setor 03 — Fase 5',
  introduction: 'Construtor, o braço robótico retira peças às cegas. Para a inspeção, precisamos garantir 10 peças de uma mesma cor. Como os estoques são diferentes, pense no pior cenário possível.',
  question: 'Qual é o menor número de peças que precisam ser retiradas para garantir pelo menos 10 peças de uma mesma cor?',
  tutorial: [
    'Observe os cinco estoques. O braço retira uma peça por vez, às cegas e sem devolver nenhuma.',
    'Experimente algumas retiradas e imagine o maior total possível sem que nenhuma cor chegue a 10.',
    'Pense no que acontece na retirada seguinte e escolha uma resposta.',
  ],
  answers: [41, 42, 46, 51],
  correctAnswer: criticalStorageGuarantee,
  hint: 'Para cada cor, qual é o máximo que você pode retirar sem chegar a 10, respeitando o estoque?',
  feedback: {
    41: 'Com 41 peças, ainda é possível que nenhuma cor tenha 10. O que acontece quando o braço retira a próxima peça?',
    46: 'Esse cálculo supõe que todas as cores conseguem chegar a 9 peças. Confira o estoque das azuis e das verdes.',
    51: 'Para evitar atingir 10, o máximo por cor é 9. Algumas cores ainda têm estoque menor que isso.',
  },
  successExplanation: 'Perfeito, construtor! A 42ª peça garante pelo menos 10 da mesma cor. Você adaptou o Princípio das Casas de Pombo ao estoque real!',
};

export const demoChallenges = [
  additionRouteChallenge,
  multiplicationRobotChallenge,
  pigeonholeStorageChallenge,
] as const;

export const allChallenges = [
  additionRouteChallenge,
  additionSeparationChallenge,
  additionMaterialsChallenge,
  additionProductionChallenge,
  additionCertificationChallenge,
  multiplicationRobotChallenge,
  multiplicationAssemblyChallenge,
  multiplicationRoutesChallenge,
  multiplicationCompleteRobotChallenge,
  multiplicationVaultChallenge,
  pigeonholeStorageChallenge,
  pigeonholeDistributionChallenge,
  pigeonholeComponentsChallenge,
  pigeonholeProductionChallenge,
  pigeonholeCriticalStorageChallenge,
] as const;

export type AnyChallengeDefinition = (typeof allChallenges)[number];

export function getChallengeById(id: ChallengeId): AnyChallengeDefinition | undefined {
  return allChallenges.find((challenge) => challenge.id === id);
}

export function getNextChallenge(id: ChallengeId): AnyChallengeDefinition | undefined {
  if (!getChallengeById(id)) return undefined;
  const slots = sectors.flatMap((sector) => sector.challengeIds);
  for (const nextId of slots.slice(slots.indexOf(id) + 1)) {
    const challenge = getChallengeById(nextId);
    if (challenge) return challenge;
  }
  return undefined;
}
