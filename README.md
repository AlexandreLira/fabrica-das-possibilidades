# Fábrica das Possibilidades

Fundação de um jogo educativo mobile-first sobre os princípios da Adição, da
Multiplicação e das Casas de Pombo. Interface em português, para Ensino Médio.

Esta versão contém início, instruções, apresentação dos três setores e uma cena
interativa do B.O.T. **As nove missões, dicas e pontuação ainda não estão implementadas.**
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

A saída está em `dist/`; nenhuma publicação foi realizada. A aplicação usa caminhos
relativos e rotas hash, dispensando regras de reescrita no servidor estático.

## Organização

```text
src/
  app/          Inicialização, navegação hash e atualização PWA
  ui/           Tokens CSS/Tailwind e componentes compartilhados
  screens/      Início, instruções e setores
  game/         Host React, criação/destruição do motor
    bridge/     Contrato e canal de eventos tipados
    scenes/     Apresentação Phaser do B.O.T.
  domain/math/  Regras matemáticas puras e testes
  content/      Metadados dos setores e tipo mínimo de desafio
  state/        Zustand e armazenamento local versionado
  audio/        Efeito sintetizado e controle central de silêncio
  assets/       Arte geométrica local do B.O.T.
public/         Ícones PWA locais
tests/e2e/     Cenários mobile sobre a build de produção
```

React controla navegação, instruções, acessibilidade e preferências. Phaser é
importado dinamicamente somente ao abrir setores. O service worker pode baixá-lo
antecipadamente para o cache offline, mas isso não inicializa o motor.
A cena não conhece Zustand nem regras matemáticas. O contrato é:

- `scene:ready`: sem dados; habilita o botão React.
- `scene:failed`: sem dados; ativa a alternativa estática se o sprite falhar.
- `bot:greet`: `{ reducedMotion: boolean }`; solicita uma reação visual.
- `bot:greeted`: `{ message: string }`; anuncia feedback textual acessível.

Cada apresentação possui seu próprio canal. A saída remove ouvintes e destrói o
jogo. Falhas no carregamento mostram uma imagem estática e preservam a navegação.
O sprite usa `?no-inline` porque o loader SVG do Phaser requer URL de recurso,
em vez do formato de data URI produzido pelo Vite. Não há física nesta etapa.

O design usa arte geométrica original, fonte de sistema (sem downloads), áreas de
toque de 48 px, safe areas, texto legível, foco visível e movimento reduzido.
O áudio é sintetizado localmente após um gesto; não existe autoplay. Silenciar
interrompe efeitos ativos e persiste a preferência.

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
voltam aos padrões. Falha de leitura/gravação mantém a sessão em memória. Progresso
começa vazio e não é persistido nem pontuado até a implementação das missões.

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

## Resultado da validação — 31/10/2026

- Lint, TypeScript e build: passaram.
- Vitest: **38 testes passaram**.
- Playwright: **16 testes passaram** nos perfis Android/Chromium e iPhone/WebKit,
  incluindo offline, falhas de motor/sprite, teclado e larguras 320/390 px.
- Desenvolvimento/StrictMode: três ciclos de entrada/saída da cena, canvas único,
  feedback correto e nenhum erro de página.
- Revisão visual: início 390 × 844 e setores em perfil iPhone.
- Revisão independente concluída; notas e decisões em `docs/implementation.md`.
