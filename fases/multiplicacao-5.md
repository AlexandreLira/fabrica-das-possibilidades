# Proposta de fase

**Nome da fase:** Código do Cofre
**Princípio matemático:** Princípio Multiplicativo
**Autor:** Maria de Fatima
**Data da proposta:** 23/11/2026

## Objetivo de aprendizagem

Aplicar o **Princípio Multiplicativo** em um problema em que as etapas não são independentes: o número de opções de uma etapa depende das escolhas anteriores (algarismos distintos, primeiro algarismo diferente de 0 e último algarismo par). O jogador deve descobrir que, nesses casos, é preciso começar pela etapa mais restrita ou separar o problema em casos antes de multiplicar.

## Contexto na fábrica

O cofre das ferramentas especiais da fábrica foi trancado com um novo sistema de segurança, e o B.O.T. perdeu a lista de códigos válidos. Para saber se vale a pena cadastrar todos os códigos manualmente, a equipe precisa descobrir quantos códigos diferentes o sistema aceita.

## Fala inicial do B.O.T.

*"Construtor, o cofre da fábrica só abre com um código especial: uma letra seguida de três algarismos, com regras rígidas! Preciso saber quantos códigos diferentes o sistema aceita. Atenção: as regras mudam o número de opções em cada etapa. Observe como a escolha de um algarismo afeta as outras posições."*

## Tutorial ou instruções

1. O B.O.T. mostra o painel do cofre com 4 posições: Letra | Algarismo 1 | Algarismo 2 | Algarismo 3.
2. As regras ficam fixas na lateral da tela:
   - a letra é uma entre A, B, C, D, E;
   - os três algarismos são todos diferentes;
   - o primeiro algarismo não pode ser 0;
   - o último algarismo deve ser par (0, 2, 4, 6 ou 8).
3. O jogador pode testar códigos no painel. O sistema marca em verde os válidos e em vermelho os inválidos, com o motivo.
4. Depois de testar, o jogador raciocina sobre o total e escolhe uma alternativa.

## Elementos na tela

- Painel do cofre com 4 posições (letra e três algarismos).
- Teclado para testar códigos: letras A a E e algarismos de 0 a 9.
- Lista lateral com as 4 regras.
- Indicador de validade do código testado (verde ou vermelho, com o motivo).
- Painel do desafio com a pergunta.
- Caixa de alternativas A, B, C e D.
- Botão de dica (lâmpada do B.O.T.).
- Botão **Enviar Resposta**.

## Ação do jogador

1. Lê o enunciado e as regras.
2. Testa alguns códigos no painel e observa quais regras tornam um código inválido.
3. Percebe que o último algarismo (par) e o primeiro (não nulo) interferem um no outro, porque o 0 é par, mas não pode ser o primeiro.
4. Organiza a contagem, escolhendo por onde começar ou separando em casos.
5. Seleciona uma alternativa.
6. Clica em **Enviar Resposta**.

## Dados e valores

- **Letras disponíveis:** A, B, C, D, E (5 opções).
- **Algarismos disponíveis:** 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 (10 opções).
- **Formato do código:** 1 letra + 3 algarismos.
- Os 3 algarismos são distintos entre si.
- O primeiro algarismo é diferente de 0.
- O último algarismo é par.
- A letra não interfere nas regras dos algarismos.

## Pergunta ou desafio

*O cofre da fábrica aceita códigos formados por uma letra (A, B, C, D ou E) seguida de três algarismos, obedecendo às regras:*  
- *os três algarismos são diferentes entre si;*  
- *o primeiro algarismo não pode ser 0;*  
- *o último algarismo deve ser par.*  

*Quantos códigos diferentes o cofre aceita?*

## Alternativas, quando existirem

- **A)** 1.440
- **B)** 1.640
- **C)** 2.025
- **D)** 2.250

## Resposta correta e cálculo passo a passo

**Alternativa correta: B) 1.640**

A letra é uma etapa independente (5 opções). O cuidado está nos algarismos. O 0 é par, mas não pode ser o primeiro, então a quantidade de opções do primeiro algarismo depende de o último ser 0 ou outro par. Por isso, separamos em dois casos, começando pelo último algarismo (a etapa mais restrita).

**Caso 1:** o último algarismo é 0

- Último algarismo: 1 opção (o 0).
- Primeiro algarismo: 9 opções (de 1 a 9).
- Algarismo do meio: 8 opções (diferente dos dois já usados).
- Total: $1 \times 9 \times 8 = 72$.

**Caso 2:** o último algarismo é 2, 4, 6 ou 8

- Último algarismo: 4 opções.
- Primeiro algarismo: 8 opções (não pode ser 0 nem o algarismo já usado no final).
- Algarismo do meio: 8 opções (não pode repetir os dois já usados, mas o 0 já pode entrar).
- Total: $4 \times 8 \times 8 = 256$.

**Juntando os casos (Princípio da Adição):** $72 + 256 = 328$ combinações possíveis de algarismos.

**Incluindo a letra (Princípio Multiplicativo):**

$$5 \times 328 = 1.640$$

Portanto, o cofre aceita 1.640 códigos diferentes.

**Conferência:** o total de trios de algarismos distintos com primeiro diferente de 0 é $9 \times 9 \times 8 = 648$. Os trios com último algarismo ímpar são $5 \times 8 \times 8 = 320$. Logo, os de último algarismo par são $648 - 320 = 328$, o mesmo resultado.

## Possíveis erros e feedback específico

- **Resposta A (1.440):**
  - *Erro:* Calculou $5 \times 9 \times 8 \times 4$, supondo que sempre sobram exatamente 4 algarismos pares para o final.
  - *Feedback do B.O.T.:* *"Cuidado! Quantos algarismos pares sobram no final depende das escolhas anteriores. E o 0 é par, mas não pode ser o primeiro. Observe como a paridade e a proibição de repetir algarismos afetam as posições do código."*
- **Resposta C (2.025):**
  - *Erro:* Calculou $5 \times 9 \times 9 \times 5$, esquecendo que o último algarismo também deve ser diferente dos dois primeiros.
  - *Feedback do B.O.T.:* *"Quase! Você lembrou que o final é par, mas os três algarismos precisam ser todos diferentes. Se o primeiro for par, quantos pares ainda sobram para o final?"*
- **Resposta D (2.250):**
  - *Erro:* Calculou $5 \times 9 \times 10 \times 5$, ignorando a regra de algarismos diferentes.
  - *Feedback do B.O.T.:* *"Releia as regras no painel! Os algarismos do código não podem se repetir. Quantas opções sobram para o algarismo do meio depois de escolher o primeiro e o último?"*

## Dica

*"Quando uma regra restringe bastante uma etapa, comece por ela! Comece pelo último algarismo: ele é 0 ou é outro número par? Em cada caso, quantas opções sobram para o primeiro e para o do meio?"*

## Feedback e explicação de acerto

- **Animação:** O cofre gira os mostradores, exibe vários códigos válidos passando rapidamente e abre com um brilho. Em seguida, o painel do B.O.T. mostra os dois casos e a soma $72 + 256 = 328$, multiplicada por 5.
- **Fala do B.O.T.:**  
  > *"Cofre aberto, construtor! A chave foi começar pela etapa mais restrita e separar os casos: último algarismo 0 ou outro par. Depois somamos os casos e multiplicamos pelas 5 letras: $5 \times 328 = 1.640$ códigos!"*

## Recursos visuais e sonoros necessários

- Cenário do cofre da fábrica com painel de 4 posições.
- Teclado de letras e algarismos com marcação de validade.
- Mensagens visuais explicando por que um código é inválido.
- Animação do cofre abrindo.
- Painel holográfico do B.O.T. com os dois casos e a conta final.
- Som de clique ao digitar e de trava ao validar.
- Fanfarra de acerto e beep suave de erro.

## Condição de conclusão

O jogador selecionar a alternativa **B) 1.640**, clicar em **Enviar Resposta** e visualizar a explicação final com os dois casos.

## Observações e dúvidas para os desenvolvedores

1. O validador de códigos no painel deve mostrar qual regra foi violada. Isso ajuda o jogador a descobrir a interação entre o 0 e a regra do último algarismo par.
2. A explicação em dois casos só deve aparecer após o acerto ou após a segunda tentativa errada, para preservar a dificuldade.
3. Vale limitar o número de testes no painel (por exemplo, 10) para estimular o raciocínio em vez da tentativa e erro?
4. A regra do último algarismo par permite trabalhar dois casos com quantidades diferentes de opções. Em cada caso, o jogador usa a multiplicação; depois, soma os casos.

## Revisão matemática

**Pessoa que revisou:** A definir
**Resultado da revisão e ajustes necessários:** *Conferido pelo autor da proposta por dois caminhos: (1) separação em casos, $72 + 256 = 328$, e $5 \times 328 = 1.640$; (2) por complemento, $9 \times 9 \times 8 = 648$ trios válidos sem a regra do par, menos $5 \times 8 \times 8 = 320$ com último ímpar, igual a 328. Aguardando revisão.*

## Avaliação técnica

**Pessoa que avaliou:**
**Dúvidas, limitações ou ajustes necessários:**

## Validação após implementação

- [ ] A fase foi testada pelo autor da proposta.
- [ ] O conteúdo, as respostas e a explicação correspondem à proposta.
- [ ] Os problemas encontrados foram resolvidos.

**Data e observações da validação:**
