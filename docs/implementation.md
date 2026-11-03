# Demonstração com três fases — registro de implementação

Implementação feita na branch `feat/demo-tres-fases`, derivada de
`feat/fase-adicao-1`. Esta entrega não faz merge, push ou publicação.

## Comportamento entregue

- Adição: duas rotas mutuamente exclusivas, respostas `6`, `7` e `12`, com
  gabarito calculado por `countAlternatives([3, 4])`.
- Multiplicação: três carcaças e duas antenas, prévia do robô e grade das seis
  combinações, com gabarito calculado por `countCombinations([3, 2])`.
- Casas de Pombo: distribuição de sete peças em três caixas, reinício e
  explicação `3–2–2`, com gabarito fixado por
  `minimumGuaranteedOccupancy(7, 3)` e independente da distribuição escolhida.
- Tutoriais contextuais revisáveis, dica, feedback específico de erro, novas
  tentativas, explicação de acerto, repetição e resumo final do B.O.T.
- Conclusões guardadas somente no Zustand em memória. Preferências de som e
  instruções continuam sendo os únicos dados persistidos no `localStorage`.

## React, Phaser e áudio

React mantém as regras, as respostas, os reducers e a acessibilidade. O host
Phaser seleciona uma cena visual por princípio e sincroniza o estado atual por
eventos tipados, inclusive quando o carregamento termina depois da interação.
Cada tela continua jogável com sua representação React se o motor falhar.

O áudio usa Web Audio sintetizado e oferece efeitos curtos para exploração,
seleção, colocação, erro, acerto e conclusão. O efeito anterior é interrompido
para evitar sobreposição; silenciar interrompe o som ativo. Falha ou bloqueio do
`AudioContext` não altera o fluxo visual.

## Decisões

- Reutilizar a fase de Adição e compartilhar apenas cabeçalho, tutorial, painel
  de respostas, dica, feedback e ações finais.
- Manter reducers específicos porque montagem e distribuição têm invariantes
  diferentes da exploração de rotas.
- Remontar a cena ao escolher “Jogar novamente”, garantindo visual limpo sem
  criar ações matemáticas dentro do Phaser.
- Manter todas as fases abertas no mapa e usar uma ordem fixa apenas no botão
  “Continuar”: Adição → Multiplicação → Casas de Pombo → resumo.
- Não adicionar dependências, arquivos de áudio, pontuação, vidas ou cronômetro.

## Limites conhecidos

- A conclusão das fases é perdida ao recarregar, por decisão de escopo.
- Os efeitos são sintetizados; testes automatizados verificam controle e
  interrupção, mas não substituem avaliação auditiva humana.
- A validação usa perfis Android/Chromium e iPhone/WebKit; aparelhos físicos
  ainda precisam de uma conferência posterior.
- O chunk do Phaser permanece acima do limiar de aviso do Vite, separado por
  import dinâmico e incluído no cache offline.

## Verificação

- `npm run lint`: passou.
- `npm run typecheck`: passou.
- `npm run test:run`: 62 testes passaram em 8 arquivos.
- `npm run build`: passou; PWA gerou service worker com 17 recursos em precache.
- `npm run test:e2e`: 46 testes passaram em Android/Chromium e iPhone/WebKit.
- Inspeção visual: Adição, Multiplicação e Casas de Pombo foram capturadas no
  perfil iPhone 13; hierarquia, contraste, áreas de toque e largura estavam
  coerentes, sem transbordamento horizontal.
- Áudio: criação, silenciamento, interrupção e indisponibilidade foram validados
  por testes. O ambiente headless não ofereceu saída audível para avaliar timbre
  e volume manualmente.
