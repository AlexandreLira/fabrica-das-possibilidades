# Proposta de fase

**Nome da fase:** Depósito Crítico
**Princípio matemático:** Casa de Pombos (Princípio das Gavetas)
**Autor:** Maria de Fatima
**Data da proposta:** 23/11/2026

## Objetivo de aprendizagem

Aplicar o **Princípio da Casa dos Pombos** em uma situação em que a fórmula direta $m(k-1)+1$ não funciona, porque algumas "gavetas" têm capacidade menor que $k-1$. O jogador deve construir o pior cenário real, respeitando o estoque de cada grupo, e só depois acrescentar mais um elemento.

## Contexto na fábrica

O depósito da fábrica guarda peças de 5 cores. Um braço robótico retira peças às cegas, uma a uma, sem devolvê-las. Para uma inspeção especial, o controle de qualidade precisa de 10 peças da mesma cor. Como ninguém sabe a ordem em que o braço vai pegar as peças, o B.O.T. quer descobrir quantas peças devem ser retiradas para ter certeza de que a inspeção será possível.

## Fala inicial do B.O.T.

*"Construtor, temos uma inspeção delicada! O braço robótico retira peças às cegas, e eu preciso ter certeza de que teremos 10 peças da mesma cor. Mas atenção: nem todas as cores têm o mesmo estoque! Pense no pior cenário possível e descubra quantas peças precisam ser retiradas."*

## Tutorial ou instruções

1. O B.O.T. apresenta as 5 caixas de peças, cada uma com sua cor e seu estoque:
   - Azul: 6 peças.
   - Verde: 8 peças.
   - Vermelha, amarela e branca: 12 peças cada.
2. O braço retira peças aleatoriamente e não devolve nenhuma.
3. O objetivo é garantir 10 peças da mesma cor, mesmo que a sorte seja a pior possível.
4. O B.O.T. orienta: "Imagine o maior número de peças que o braço pode retirar sem que nenhuma cor chegue a 10. Depois, pense na próxima peça."

## Elementos na tela

- 5 caixas coloridas, cada uma com o estoque visível.
- Braço robótico retirando peças para uma bandeja de contagem.
- Contador individual por cor na bandeja.
- Contador geral de peças retiradas.
- Indicador "meta: 10 da mesma cor".
- Simulador de retiradas aleatórias, que o jogador pode ativar quantas vezes quiser.
- Painel do desafio com a pergunta.
- Caixa de alternativas A, B, C e D.
- Botão de dica (lâmpada do B.O.T.).
- Botão **Enviar Resposta**.

## Ação do jogador

1. Lê o enunciado e observa o estoque de cada cor.
2. Executa algumas simulações de retirada e percebe que o azul e o verde nunca chegam a 10.
3. Compara o resultado da simulação com o que pode acontecer em outras ordens de retirada. Monta mentalmente o pior cenário: o maior número de peças retiradas sem que nenhuma cor chegue a 10.
4. Acrescenta mais uma peça ao total encontrado.
5. Seleciona uma alternativa.
6. Clica em **Enviar Resposta**.

## Dados e valores

- **Número de cores (gavetas):** 5.
- **Estoque:** azul = 6; verde = 8; vermelha = 12; amarela = 12; branca = 12.
- **Meta:** 10 peças da mesma cor.
- Retiradas às cegas, sem reposição.
- **Cores que podem alcançar 10:** apenas vermelha, amarela e branca.
- **Máximo no pior cenário:** azul 6 (todas), verde 8 (todas), e 9 de cada uma das outras três cores.

## Pergunta ou desafio

O depósito começa com 6 peças azuis, 8 verdes, 12 vermelhas, 12 amarelas e 12 brancas.

Retirando peças às cegas, sem reposição, qual é o **menor número** que garante 10 ou mais da mesma cor **em qualquer ordem de retirada**?

## Alternativas, quando existirem

- **A)** 41
- **B)** 42
- **C)** 46
- **D)** 51

## Resposta correta e cálculo passo a passo

**Alternativa correta: B) 42**

Uma rodada pode atingir a meta antes. Por exemplo, com 27 retiradas, a bandeja pode ter 3 azuis, 2 verdes, 5 vermelhas, 10 amarelas e 7 brancas. Isso mostra que atingir a meta com 27 é possível. Para garantir a meta em qualquer ordem, pensamos no pior cenário: o maior número de peças que podem ser retiradas sem que nenhuma cor chegue a 10.

1. Azul: só existem 6 peças, então ela nunca chega a 10. No pior cenário, todas as 6 azuis já foram retiradas.
2. Verde: só existem 8 peças, então ela também nunca chega a 10. No pior cenário, todas as 8 verdes já foram retiradas.
3. Vermelha, amarela e branca: cada uma pode chegar a 10, então o máximo sem atingir a meta é 9 de cada: $3 \times 9 = 27$.
4. Maior total sem atingir a meta:

$$6 + 8 + 3 \times 9 = 41$$

5. Com 41 peças, ainda é possível não ter 10 de nenhuma cor. Logo, 41 ainda não garante que alguma cor chegue a 10.
6. A 42ª peça precisa ser vermelha, amarela ou branca, pois azuis e verdes já acabaram. Essa cor já tinha 9 peças e passa a ter 10.

$$N = 6 + 8 + 3 \times (10 - 1) + 1 = 42$$

Por que $5 \times (10 - 1) + 1 = 46$ não é a resposta? A fórmula direta supõe que todas as cores podem receber 9 peças no pior cenário. Mas o azul só tem 6 e o verde só tem 8, então elas "fecham" antes de chegar a 9. O cálculo precisa respeitar o estoque real de cada cor. Com este estoque de 50 peças, 46 também garante a meta, mas 42 já é suficiente.

## Possíveis erros e feedback específico

- **Resposta A (41):**
  - *Erro:* Calculou corretamente o pior cenário, mas esqueceu de somar a peça que garante a meta.
  - *Feedback do B.O.T.:* *"Com 41 peças, ainda é possível que nenhuma cor tenha 10. Veja a bandeja: o que acontece quando o braço retira a próxima peça?"*
- **Resposta C (46):**
  - *Erro:* Aplicou $5 \times 9 + 1$ sem considerar que azul e verde não têm peças suficientes para chegar a 9.
  - *Feedback do B.O.T.:* *"Esse cálculo supõe que todas as cores conseguem chegar a 9 peças. Confira o estoque das azuis e das verdes."*
- **Resposta D (51):**
  - *Erro:* Calculou $5 \times 10 + 1$, usando 10 em vez de 9 como máximo por cor sem atingir a meta, e ignorou o estoque.
  - *Feedback do B.O.T.:* *"Cuidado! Para NÃO ter 10 peças de uma cor, o máximo que ela pode ter é 9. E lembre-se: algumas cores têm estoque menor que isso."*

## Dica

*"Para cada cor, qual é o máximo que você pode retirar sem chegar a 10, respeitando o estoque?"*

## Feedback e explicação de acerto

- **Animação:** O braço robótico enche a bandeja com todas as 6 azuis e as 8 verdes, depois 9 de cada uma das outras três cores, com o contador parando em 41. Então a 42ª peça entra, uma das caixas brilha e seu contador passa de 9 para 10.
- **Fala do B.O.T.:**  
  > *"Perfeito, construtor! No pior cenário, retiramos todas as azuis (6), todas as verdes (8) e 9 de cada cor grande: $6 + 8 + 27 = 41$. A 42ª peça obrigatoriamente completa 10 em alguma cor. Você adaptou o Princípio da Casa dos Pombos ao estoque real!"*

## Recursos visuais e sonoros necessários

- Cenário de depósito com 5 caixas coloridas e estoques visíveis.
- Braço robótico animado.
- Bandeja com contadores por cor e contador geral.
- Simulador de retiradas aleatórias.
- Animação do pior cenário (41 peças) seguida da 42ª peça.
- Destaque visual da caixa que atinge 10 peças.
- Som de peça caindo na bandeja.
- Efeitos de acerto e erro; comemoração do B.O.T.

## Condição de conclusão

O jogador selecionar a alternativa **B) 42**, clicar em **Enviar Resposta** e visualizar a animação do pior cenário com a 42ª peça.

## Observações e dúvidas para os desenvolvedores

1. O simulador aleatório não deve mostrar o pior cenário por conta própria. O jogador precisa construí-lo. A animação do pior cenário só aparece após o acerto ou após a dica.
2. O sistema não deve afirmar qual cor receberá a 42ª peça: a garantia é que alguma das três cores grandes terá 10.
3. O enunciado precisa destacar "menor número" e "garantir".
4. O simulador e o enunciado usam os mesmos estoques iniciais: 6, 8, 12, 12 e 12.
5. A fórmula adaptada só deve aparecer após a primeira tentativa.

## Revisão matemática

**Pessoa que revisou:** A definir
**Resultado da revisão e ajustes necessários:** *Conferido pelo autor da proposta. No pior cenário, as cores azul e verde esgotam seu estoque (6 e 8 peças) sem atingir 10, e cada uma das 3 cores restantes pode ter 9. O máximo sem atingir a meta é $6 + 8 + 27 = 41$, e a 42ª peça garante 10 em alguma das três cores grandes. Aguardando revisão.*

## Avaliação técnica

**Pessoa que avaliou:**
**Dúvidas, limitações ou ajustes necessários:**

## Validação após implementação

- [ ] A fase foi testada pelo autor da proposta.
- [ ] O conteúdo, as respostas e a explicação correspondem à proposta.
- [ ] Os problemas encontrados foram resolvidos.

**Data e observações da validação:**
