# Demonstração com Três Fases — Plano de Implementação

> **Para agentes executores:** SUB-SKILL OBRIGATÓRIA: use `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans` para executar este plano tarefa por tarefa. Use os checkboxes para acompanhar o progresso.

**Objetivo:** Entregar uma demonstração mobile com uma fase completa de Adição, Multiplicação e Casas de Pombo, tutoriais, diálogos, efeitos sonoros, fallback sem Phaser e conclusão em sessão.

**Arquitetura:** React controla regras, acessibilidade e progressão; funções puras calculam gabaritos; cenas Phaser recebem somente estado visual por eventos tipados. Componentes compartilhados cobrem estrutura e respostas, enquanto cada mecânica mantém reducer e interação próprios.

**Stack:** React 19, TypeScript 6, Phaser 4, Zustand 5, Vite 8, Vitest 5 e Playwright 1.64.

**Especificação:** Plano aprovado pelo usuário na conversa em 03/11/2026.

## Restrições globais

- Criar `feat/demo-tres-fases` a partir de `feat/fase-adicao-1`; não fazer merge, push ou publicação.
- Manter exatamente três fases, sem pontuação, vidas, cronômetro, backend ou novas dependências.
- Persistir apenas som e instruções; conclusões duram somente na sessão.
- Preservar toque, teclado, 320/390 px, fallback sem Phaser, movimento reduzido e funcionamento offline.
- Calcular gabaritos exclusivamente com `countAlternatives`, `countCombinations` e `minimumGuaranteedOccupancy`.

## Foco da revisão

- Reentrar ou repetir uma fase deve começar uma mecânica limpa sem apagar a conclusão da sessão.
- Uma cena Phaser que fica pronta depois das interações deve receber o estado visual atual completo.
- A distribuição escolhida pelo jogador não pode alterar o gabarito de Casas de Pombo.
- Desligar o som deve interromper efeitos ativos; falha do `AudioContext` não pode bloquear a interação.
- Trocas de rota devem destruir o jogo anterior e manter exatamente um canvas.

### Task 1: Configurações, reducers e progresso em sessão

**Arquivos:** modificar `src/content/challenges.ts`, `src/state/store.ts`; criar reducers de Multiplicação e Casas de Pombo; ampliar seus testes.

**Interfaces:** produzir `ChallengeId`, três configurações tipadas, reducers independentes e `completeChallenge(id)` com `allDemoChallengesCompleted` derivado no estado.

- [ ] Escrever testes falhos para gabaritos 7/6/3, condições de liberação, tentativas, reinício e progresso não persistido.
- [ ] Rodar os testes e confirmar falhas causadas pelas APIs ausentes.
- [ ] Implementar as configurações, reducers e estado mínimo.
- [ ] Rodar `npm run test:run` e confirmar sucesso.
- [ ] Commitar como `feat: add three challenge models and session progress`.

### Task 2: Estrutura React, navegação e três fases

**Arquivos:** criar componentes compartilhados e telas de Multiplicação, Casas de Pombo e conclusão; modificar Adição, setores, instruções, navegação, App e estilos.

**Interfaces:** consumir as configurações e reducers da Tarefa 1; produzir rotas hash completas, tutorial revisável, ações finais e mapa com estado da sessão.

- [ ] Escrever cenários Playwright falhos para acesso às três fases, erros, acertos, repetição, sequência e conclusão.
- [ ] Confirmar as falhas nas rotas e telas ainda ausentes.
- [ ] Implementar componentes compartilhados e interações específicas, mantendo alvos de 48 px e foco acessível.
- [ ] Rodar Vitest e os cenários Playwright focados até ficarem verdes.
- [ ] Commitar como `feat: add three playable challenge flows`.

### Task 3: Cenas, eventos, fallback e áudio

**Arquivos:** generalizar o host e motor Phaser, criar cenas de Multiplicação e Casas de Pombo, ampliar eventos e efeitos sonoros.

**Interfaces:** adicionar eventos `challenge:robot-configured`, `challenge:item-placed` e `challenge:distribution-reset`; ampliar `playFeedback` para `reveal | select | place | error | success | complete`.

- [ ] Escrever testes falhos para eventos, sincronização, limpeza e política de áudio.
- [ ] Confirmar falhas específicas das novas interfaces.
- [ ] Implementar host discriminado, cenas, alternativas estáticas e efeitos com sobreposição limitada.
- [ ] Rodar testes unitários e Playwright de canvas/fallback/movimento reduzido.
- [ ] Commitar como `feat: add challenge scenes and sound feedback`.

### Task 4: Offline, mobile e documentação

**Arquivos:** ampliar testes E2E e atualizar `README.md` e `docs/implementation.md`.

**Interfaces:** nenhuma nova API; consolidar comportamento público e limitações reais.

- [ ] Adicionar cenários falhos para 320/390 px, teclado, som desligado, fallback por fase e fluxo offline.
- [ ] Corrigir somente problemas observados por esses cenários.
- [ ] Atualizar documentação removendo afirmações de desafios em preparação.
- [ ] Rodar `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build` e `npm run test:e2e`.
- [ ] Commitar como `test: cover three-phase mobile demo`.

### Task 5: Revisão final

- [ ] Inspecionar visualmente as três fases em 320 e 390 px.
- [ ] Verificar manualmente os efeitos sonoros quando o ambiente oferecer saída de áudio.
- [ ] Solicitar revisão independente do diff completo desde `a3e629d`.
- [ ] Corrigir achados críticos/importantes com RED→GREEN e repetir a suíte completa.
- [ ] Registrar limitações, resultados reais e comandos de execução sem merge, push ou publicação.
