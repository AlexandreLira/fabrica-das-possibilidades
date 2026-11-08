# Fluxo de elaboração das fases

Este guia ajuda a equipe a transformar uma ideia em uma proposta que possa ser
revisada, implementada e testada. O jogo aborda Adição, Multiplicação e Casas de
Pombo. A meta atual é ter pelo menos cinco fases em cada módulo; já existe uma
fase demonstrativa em cada um.

## Quem participa

| Pessoa | Participação |
| --- | --- |
| Ribamar | Elabora e valida o conteúdo das fases de Adição. |
| Felipe | Elabora e valida o conteúdo das fases de Multiplicação. |
| Andrey | Elabora e valida o conteúdo das fases de Casas de Pombo. |
| Eric | Contribui com a narrativa, os diálogos do B.O.T., o tutorial e os testes. |
| Alexandre e Javier | Avaliam a viabilidade técnica, implementam as fases e revisam o código. |

A pessoa responsável pelo conteúdo acompanha a fase durante todo o processo:
responde às dúvidas dos desenvolvedores, testa a implementação e valida se ela
representa a proposta e ensina o princípio corretamente.

## Etapas do trabalho

1. **Elaborar:** o responsável pelo módulo preenche o modelo de proposta deste
   guia, incluindo a ação do jogador, o gabarito e o cálculo explicado.
2. **Revisar a matemática:** outra pessoa confere o enunciado, os dados, o
   cálculo, a resposta e as hipóteses do princípio. O autor corrige as dúvidas
   ou inconsistências encontradas.
3. **Revisar a comunicação:** quando necessário, Eric contribui com o contexto,
   as falas do B.O.T. e as instruções para que o jogador entenda o que fazer.
4. **Avaliar a viabilidade:** Alexandre e Javier leem a proposta, verificam se
   a interação é viável e esclarecem eventuais dúvidas com o autor.
5. **Implementar e revisar:** depois da revisão do conteúdo e do gabarito, um
   desenvolvedor implementa a fase e o outro apoia a revisão do código.
6. **Validar com o autor:** a pessoa que criou a proposta joga a fase e confere
   se as ações, os textos, as respostas e o cálculo correspondem ao combinado.
7. **Registrar e concluir:** a equipe registra os problemas encontrados, resolve
   o que for necessário e confirma a conclusão depois da validação.

**Uma fase só deve começar a ser implementada depois que seu conteúdo e seu
gabarito forem revisados.** As propostas podem seguir pelo fluxo individualmente;
não é necessário esperar todas as fases de um módulo ficarem prontas.

## Modelo de proposta

Copie o bloco abaixo e preencha uma cópia para cada fase. Se um campo não se
aplicar, escreva “não se aplica” e explique o motivo quando necessário.

```markdown
# Proposta de fase

**Nome da fase:**
**Princípio matemático:**
**Autor:**
**Data da proposta:**

## Objetivo de aprendizagem

O que o jogador deve aprender ou praticar?

## Contexto na fábrica

O que está acontecendo e por que o jogador precisa ajudar?

## Fala inicial do B.O.T.

O que o B.O.T. diz para apresentar a fase?

## Tutorial ou instruções

Como o jogador descobre o que precisa fazer?

## Elementos na tela

Quais objetos, informações e controles aparecem?

## Ação do jogador

O que o jogador faz, em que ordem e como usa os controles?

## Dados e valores

Quais quantidades e condições devem ser usadas?

## Pergunta ou desafio

Qual pergunta o jogador precisa responder ou qual objetivo precisa alcançar?

## Alternativas, quando existirem

Liste as respostas oferecidas ao jogador.

## Resposta correta e cálculo passo a passo

Qual é a resposta? Explique como chegar a ela e por que o princípio se aplica.

## Possíveis erros e feedback específico

O que o jogador pode responder ou fazer de errado? Que mensagem ajuda em cada caso?

## Dica

Que orientação ajuda o jogador a raciocinar sem simplesmente dar a resposta?

## Feedback e explicação de acerto

O que acontece e o que o B.O.T. explica quando o jogador acerta?

## Recursos visuais e sonoros necessários

Quais objetos, imagens, animações ou sons são necessários para comunicar a fase?

## Condição de conclusão

O que precisa acontecer para a fase ser considerada concluída?

## Observações e dúvidas para os desenvolvedores

Há algum detalhe da interação ou recurso que precise ser discutido?

## Revisão matemática

**Pessoa que revisou:**
**Resultado da revisão e ajustes necessários:**
```

## O que conferir em cada princípio

- **Adição:** confirme que o jogador escolhe entre alternativas que não se
  sobrepõem. Se a mesma opção estiver nos dois grupos, somá-los diretamente
  contaria essa opção duas vezes.
- **Multiplicação:** identifique cada etapa de escolha. Confirme que a
  quantidade de opções de uma etapa é a mesma para cada escolha anterior e que
  as combinações consideradas são possíveis antes de multiplicar.
- **Casas de Pombo:** identifique os objetos e as caixas. Explique o que é
  garantido em todas as distribuições possíveis, não apenas na distribuição
  escolhida como exemplo. Confira também se existe ao menos uma caixa.

As regras atuais trabalham com quantidades inteiras não negativas; a equipe
deve conferir se os dados da proposta fazem sentido no contexto da fase. As
hipóteses de grupos sem sobreposição e de etapas independentes precisam ser
verificadas na proposta, pois as funções não conseguem deduzi-las apenas pelas
quantidades informadas.

## Checklists

### Proposta pronta para revisão matemática

- [ ] O objetivo, o contexto e a ação do jogador estão claros.
- [ ] A pergunta, os dados e as alternativas aplicáveis foram informados.
- [ ] A resposta e o cálculo passo a passo estão preenchidos.
- [ ] Os textos, a dica, os feedbacks e a condição de conclusão estão descritos.

### Proposta pronta para os desenvolvedores

- [ ] Outra pessoa revisou o princípio, os dados, o cálculo e o gabarito.
- [ ] O autor resolveu os ajustes da revisão matemática.
- [ ] A interação, os recursos necessários e as dúvidas estão registrados.
- [ ] Alexandre e Javier avaliaram a viabilidade e esclareceram as dúvidas.

### Fase implementada e pronta para validação

- [ ] A interação, os textos e os feedbacks previstos foram implementados.
- [ ] A fase pode ser concluída e os desenvolvedores revisaram o trabalho.
- [ ] Os desenvolvedores informaram ao autor como acessar e testar a fase.

### Fase validada pelo responsável pelo conteúdo

- [ ] O autor jogou a fase e conferiu os dados, a resposta e a explicação.
- [ ] As ações, as instruções, a dica e os feedbacks correspondem à proposta.
- [ ] Os problemas encontrados foram registrados e os ajustes necessários foram
      resolvidos pela equipe.
- [ ] A equipe confirmou a conclusão da fase.

## Exemplo preenchido: Pedido com rota alternativa

Este exemplo descreve a fase demonstrativa de Adição já existente. Ele serve
como referência para preencher o modelo e **não é uma nova missão**. Os nomes
do autor e de quem revisou, assim como a data da proposta, não estão registrados
na configuração da fase.

- **Nome e princípio:** Pedido com rota alternativa — Princípio da Adição.
- **Objetivo de aprendizagem:** contar alternativas de dois grupos distintos
  quando o pedido usa uma rota ou a outra.
- **Contexto:** um pedido precisa sair da fábrica em um veículo da rota local
  ou da rota expressa.
- **Fala inicial do B.O.T.:** “Um pedido precisa sair da fábrica! Vamos escolher
  um veículo da rota local OU da expressa. Toque nas duas rotas para conhecer as
  opções.”
- **Tutorial:** tocar nas duas rotas para revelar os veículos; depois escolher e
  confirmar uma resposta, usando a dica se precisar.
- **Elementos na tela:** representação das rotas e da esteira, botões para
  examiná-las, a conta `3 + 4 = ?`, alternativas, dica e confirmação.
- **Ação do jogador:** examinar as duas rotas; depois selecionar uma alternativa
  e confirmar. As respostas são liberadas após as duas rotas serem examinadas.
- **Dados:** três veículos na rota local e quatro na rota expressa. Escolhe-se
  um veículo de apenas uma das rotas.
- **Pergunta:** “Quantas opções de envio existem para o pedido?”
- **Alternativas:** 6, 7 e 12.
- **Resposta e cálculo:** 7 opções. Os grupos são distintos e a escolha é de
  um veículo de uma rota **ou** da outra: `3 + 4 = 7`.
- **Erros e feedback:** para 6, o jogo pede que o jogador confira os dois
  grupos; para 12, explica que multiplicar contaria pares, mas que aqui se
  escolhe apenas um veículo. Após um erro, é possível escolher outra resposta.
- **Dica:** o pedido usa apenas uma das rotas; conte as opções de um grupo junto
  com as do outro.
- **Acerto:** o B.O.T. explica que as opções dos grupos distintos são somadas;
  a esteira apresenta o resultado visualmente.
- **Recursos visuais e sonoros:** veículos e rotas em formas geométricas, uma
  esteira e efeitos curtos para revelar uma rota, errar e acertar. O som respeita
  a preferência do jogador; há representação alternativa se o motor visual
  não carregar.
- **Conclusão:** confirmar a resposta 7. O jogador pode continuar para o módulo
  de Multiplicação ou jogar novamente.
- **Observações para desenvolvedores:** nesta fase existente, a resposta é
  calculada pela regra matemática a partir das quantidades das duas rotas.
