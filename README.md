# Fábrica das Possibilidades

Fundação de um jogo educativo mobile-first sobre os princípios da Adição, da
Multiplicação e das Casas de Pombo. Interface em português, para Ensino Médio.

Esta versão demonstrável contém início, tutorial, mapa, diálogos do B.O.T. e exatamente
três fases completas: uma de Adição, uma de Multiplicação e uma de Casas de Pombo.
Cada fase oferece interação, dica, novas tentativas, feedback visual e sonoro,
explicação matemática, animação Phaser e alternativa estática sem o motor.
Não há backend, autenticação, banco remoto, telemetria ou serviços externos em execução.
O PDF original foi preservado.

## Rodar localmente

Requer **Node 24.x** e npm (referência: Node 24.20.0 / npm 11.19.0).

```sh
nvm use                 # opcional, para quem usa nvm
npm ci
npm run dev
```

Abra o endereço mostrado pelo Vite. Para testar pela rede local no celular:

```sh
npm run dev -- --host
```

Use o IP local do computador e a porta exibida, com ambos os aparelhos na mesma
rede. PWA/service worker exigem HTTPS ou localhost; HTTP pelo IP da rede serve
para conferir layout e navegação, mas não instalação/offline.

## Verificações

```sh
npm run lint
npm run typecheck
npm run test:run
npm run build
npx playwright install chromium webkit
npm run test:e2e
```

`npm test` abre Vitest em modo watch. Playwright faz uma build, inicia o preview na
porta 4173 e testa Chromium com perfil Pixel 7 e WebKit com perfil iPhone 13.
A porta precisa estar livre. Capturas e traces de falhas ficam em `test-results/`.
A emulação não substitui teste em Android e iPhone físicos. No WebKit, o teste de
teclado usa Option+Tab, respeitando a navegação completa por teclado do Safari.

Para inspecionar a versão de produção manualmente:

```sh
npm run build
npm run preview
```

A saída está em `dist/`; esta entrega não faz publicação automática. A aplicação usa
caminhos relativos e rotas hash, dispensando regras de reescrita no servidor estático.

## Fases demonstráveis

- `#/desafios/adicao-1`: examinar duas rotas e aplicar `3 + 4 = 7`.
- `#/desafios/multiplicacao-1`: combinar três carcaças com duas antenas em `3 × 2 = 6`.
- `#/desafios/casas-de-pombo-1`: distribuir sete peças em três caixas e garantir `⌈7 ÷ 3⌉ = 3`.
- `#/conclusao`: revisar os três princípios após concluir a sequência.

As fases ficam abertas no mapa. “Continuar” segue a ordem acima, e “Jogar novamente”
reinicia a mecânica sem apagar a marca de conclusão da sessão.

## Organização

```text
src/
  app/          Inicialização, navegação hash e atualização PWA
  ui/           Tokens CSS/Tailwind e componentes compartilhados
  screens/      Início, instruções, setores, fases e resumo final
  game/         Host React, criação/destruição do motor
    bridge/     Contrato e canal de eventos tipados
    scenes/     Apresentação Phaser do B.O.T.
  domain/math/  Regras matemáticas puras e testes
  content/      Metadados e configurações tipadas dos três desafios
  state/        Zustand e armazenamento local versionado
  audio/        Efeito sintetizado e controle central de silêncio
  assets/       Arte geométrica local do B.O.T.
public/         Ícones PWA locais
tests/e2e/     Cenários mobile sobre a build de produção
```

React controla navegação, instruções, acessibilidade e preferências. Phaser é
importado dinamicamente somente ao abrir setores. O service worker pode baixá-lo
antecipadamente para o cache offline, mas isso não inicializa o motor.
As cenas não conhecem Zustand nem regras matemáticas. O contrato inclui:

- `scene:ready`: sem dados; habilita o botão React.
- `scene:failed`: sem dados; ativa a alternativa estática se o sprite falhar.
- `bot:greet`: `{ reducedMotion: boolean }`; solicita uma reação visual.
- `bot:greeted`: `{ message: string }`; anuncia feedback textual acessível.
- `challenge:route-revealed`: revela uma rota na fase de Adição.
- `challenge:robot-configured`: sincroniza carcaça e antena na Multiplicação.
- `challenge:item-placed` e `challenge:distribution-reset`: sincronizam o depósito.
- `challenge:answer-evaluated` e `challenge:completed`: acionam feedback visual.

Cada apresentação possui seu próprio canal. A saída remove ouvintes e destrói o
jogo. Falhas no carregamento mostram uma imagem estática e preservam a navegação.
O sprite usa `?no-inline` porque o loader SVG do Phaser requer URL de recurso,
em vez do formato de data URI produzido pelo Vite. Não há física nesta etapa.

O design usa arte geométrica original, fonte de sistema (sem downloads), áreas de
toque de 48 px, safe areas, texto legível, foco visível e movimento reduzido.
O áudio é sintetizado localmente após um gesto; não existe autoplay. Há efeitos
distintos de exploração, seleção, colocação, erro, acerto e conclusão. Um novo efeito
interrompe o anterior, e silenciar interrompe efeitos ativos e persiste a preferência.

## Contratos matemáticos

Todos os módulos de `domain/math` são independentes da interface e do motor:

| Função | Hipótese | Exemplo |
| --- | --- | --- |
| `countAlternatives(counts)` | Alternativas mutuamente exclusivas | `[3, 4] → 7` |
| `countCombinations(counts)` | Quantidades de escolhas em etapas independentes | `[3, 4] → 12` |
| `minimumGuaranteedOccupancy(items, boxes)` | Distribuição entre caixas; limite inferior garantido da maior ocupação | `(10, 3) → 4` |

Exigem inteiros seguros não negativos; listas não podem ser vazias e caixas devem
ser positivas. Entradas inválidas ou resultados inseguros lançam `RangeError`.
São usados intermediários BigInt para evitar perda de precisão; a API retorna
`number`. Um fator zero produz zero, inclusive após fatores grandes. Não se
verifica disjunção ou independência a partir das cardinalidades: isso deve ser
garantido pela configuração pedagógica de cada futuro desafio.

## Persistência e PWA

Chave `fabrica-possibilidades:v1`, formato `{ version: 1, soundEnabled,
instructionsCompleted }`. Tipos inválidos, JSON corrompido e versões desconhecidas
voltam aos padrões. Falha de leitura/gravação mantém a sessão em memória. A conclusão
das três fases existe apenas durante a sessão atual e não entra no `localStorage`;
recarregar reinicia esse progresso. Não há pontuação.

O service worker registra apenas em produção, cacheia app, motor e recursos locais,
e assume controle após a instalação inicial. Espere concluir esse carregamento
antes de ficar offline. Atualizações mostram **Atualizar / Depois**; a página não
recarrega automaticamente para instalar uma nova versão. O navegador pode remover
caches/localStorage por falta de espaço ou políticas de privacidade.

## Dependências e limites conhecidos

Versões exatas constam em `package.json` e `package-lock.json`. `engines` e
`peerDependencies` foram consultados antes da instalação; `npm ls --depth=0`
confirmou a árvore. TypeScript 6.0.3 foi escolhido porque typescript-eslint 8.72.1
aceita TypeScript abaixo de 6.1, enquanto o latest do TypeScript já é 7.

Fontes oficiais: [Vite](https://vite.dev/guide/),
[Phaser](https://github.com/phaserjs/phaser/releases),
[Tailwind](https://tailwindcss.com/docs/installation/using-vite),
[Vitest](https://vitest.dev/guide/), [PWA](https://vite-pwa-org.netlify.app/guide/).

- O motor gera um chunk separado de aproximadamente 1,37 MB (358 kB gzip). O Vite
  avisa sobre seu tamanho; o restante da aplicação não depende de sua execução.
- A auditoria inicial encontrou 21 avisos em dependências de desenvolvimento
  (19 moderados, 2 baixos), ligados a ESLint e Workbox. `npm audit --omit=dev`
  não encontrou vulnerabilidades nas dependências de produção. Não foi aplicado
  `audit fix --force`, que propunha trocar versões principais/rebaixar ferramentas.
- Compatibilidade visada: navegadores atuais de Android e iPhone. Tailwind 4
  depende de recursos modernos de CSS; navegadores antigos não são alvo desta base.

## Resultado da validação — 03/11/2026

- Lint, TypeScript e build: passaram.
- Vitest: **62 testes passaram** em 8 arquivos.
- Playwright: **44 testes passaram** nos perfis Android/Chromium e iPhone/WebKit,
  incluindo as três fases, sequência completa, offline, fallback, teclado, som
  desligado, movimento reduzido, canvas único e larguras 320/390 px.
- Build PWA: 17 recursos no precache; permanece o aviso conhecido do chunk Phaser.
- Revisão visual: três fases completas no perfil iPhone 13, sem corte ou
  transbordamento observado.
- A política do áudio foi testada automaticamente, mas o ambiente sem saída audível
  não permitiu avaliar manualmente timbre e volume.
