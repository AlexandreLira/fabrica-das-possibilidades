# Fundação técnica — registro de implementação

Plano aprovado na conversa: React/TypeScript/Vite, Phaser 4 sob demanda, Tailwind,
Zustand/localStorage, matemática pura, Vitest, Playwright e PWA offline.
Sem missões, backend, autenticação, pontuação simulada ou publicação.

- Configuração e dependências: implementadas; npm ls sem conflitos.
- Matemática, persistência e eventos: implementados; 38 testes unitários passaram.
- Interface e cena: implementadas; tela inicial revisada em 390 × 844.
- StrictMode: três ciclos de entrada/saída, um canvas, feedback correto e nenhum
  erro de página no Chromium de desenvolvimento.
- Revisão independente: concluída; falha do sprite foi reproduzida em teste e
  recebeu evento tipado scene:failed. Listas esparsas agora são rejeitadas.
- Verificação final: lint, typecheck e build passaram; 38 testes unitários e
  16 testes Playwright passaram (Android/Chromium e iPhone/WebKit).

## Decisões

- Inicializar na pasta solicitada, em feat/fundacao, pois não havia Git ou código
  anterior. PDF original intacto; nenhuma publicação ou commit automático.
- TypeScript 6.0.3 em vez do latest 7 para atender às dependências pares do lint.
- Arte geométrica original e fontes de sistema, sem serviço externo de assets.
- Loader Phaser recebe SVG como arquivo, usando ?no-inline.
- PWA com clientsClaim para uso offline sem exigir um segundo acesso online;
  atualizações continuam dependendo do botão Atualizar.
- Testes que simulam falha de rede desabilitam service worker apenas nesses
  contextos. O trace demonstrou que o cache recuperava o sprite após falha/retry,
  impedindo a simulação. Os testes offline mantêm service worker habilitado.

## Limites conhecidos

- Sem teste em aparelhos físicos; apenas perfis mobile Chromium/WebKit.
- Chunk do Phaser acima do limiar padrão de aviso do Vite, separado por import
  dinâmico; cache antecipado para offline.
- Auditoria: zero vulnerabilidades de produção; 21 avisos em ferramentas de
  desenvolvimento. Não forçar rebaixamentos incompatíveis para silenciá-los.
- Melhoria menor sugerida pela revisão: anúncio por live region para a chegada
  de uma atualização PWA; o aviso e seus botões já são acessíveis na página.
