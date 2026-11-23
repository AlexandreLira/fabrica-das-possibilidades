# Proposta de fase

**Nome da fase:** Certificação Tripla
**Princípio matemático:** Adição
**Autor:** Maria de Fatima
**Data da proposta:** 23/11/2026

## Objetivo de aprendizagem

Aplicar o **Princípio da Adição** quando os grupos não são disjuntos: há pessoas que pertencem a dois ou três grupos ao mesmo tempo. O jogador deve separar os funcionários em grupos que não se misturam (ou usar a inclusão e exclusão) antes de somar, e ainda retirar quem não está disponível.

## Contexto na fábrica

Para a etapa final da produção, o B.O.T. precisa escolher um funcionário para coordenar a linha de montagem. Pela norma de segurança, o coordenador deve ter pelo menos uma das três certificações da fábrica (NR-10, NR-12 ou NR-35) e não pode estar afastado. O cadastro mostra quantas pessoas têm cada certificação, mas muitas têm mais de uma e aparecem em várias listas.

## Fala inicial do B.O.T.

*"Construtor, esta é uma missão de alto risco! Preciso escolher um coordenador com pelo menos uma certificação de segurança. Só que tem gente que aparece em mais de uma lista, e algumas pessoas estão afastadas. Se você somar as listas sem pensar, vai contar alguém mais de uma vez! Quantos funcionários diferentes posso escolher?"*

## Tutorial ou instruções

1. O B.O.T. exibe as três listas de certificação com seus totais e um quadro de pessoas que aparecem em mais de uma lista.
2. O B.O.T. avisa: "Cada pessoa deve ser contada UMA vez só."
3. O jogador pode tocar nos nomes repetidos (que aparecem destacados em cada lista) para ver em quais listas a pessoa aparece.
4. O jogador faz a contagem e escolhe uma alternativa.

## Elementos na tela

- Três listas de crachás: NR-10 (Elétrica), NR-12 (Máquinas) e NR-35 (Trabalho em altura).
- Quadro de interseções (pessoas que aparecem em mais de uma lista).
- Identificação das pessoas afastadas (marcadas com um aviso).
- Painel do desafio com a pergunta.
- Caixa de alternativas A, B, C e D.
- Botão de dica (lâmpada do B.O.T.).
- Botão **Enviar Resposta**.

## Ação do jogador

1. Lê os totais de cada certificação e o quadro de interseções.
2. Percebe que somar as três listas conta algumas pessoas mais de uma vez.
3. Organiza os funcionários em grupos sem repetição (ou corrige a soma com inclusão e exclusão).
4. Retira os funcionários afastados.
5. Seleciona uma alternativa.
6. Clica em **Enviar Resposta**.

## Dados e valores

- **NR-10:** 14 funcionários.
- **NR-12:** 11 funcionários.
- **NR-35:** 9 funcionários.
- Têm NR-10 e NR-12 (incluindo quem tem as três): 5.
- Têm NR-10 e NR-35 (incluindo quem tem as três): 4.
- Têm NR-12 e NR-35 (incluindo quem tem as três): 3.
- **Têm as três certificações:** 2.
- **Afastados:** 3 funcionários, todos com apenas a NR-12.
- Todo funcionário considerado tem pelo menos uma das três certificações.

## Pergunta ou desafio

*Na fábrica, 14 funcionários têm a certificação NR-10, 11 têm a NR-12 e 9 têm a NR-35. Cinco têm NR-10 e NR-12, quatro têm NR-10 e NR-35, três têm NR-12 e NR-35, e dois têm as três certificações. Além disso, 3 funcionários estão afastados, e todos eles têm apenas a NR-12.*  

*Se a fábrica precisa escolher um único coordenador que tenha pelo menos uma certificação e não esteja afastado, quantas possibilidades de escolha existem?*

## Alternativas, quando existirem

- **A)** 24
- **B)** 31
- **C)** 21
- **D)** 19

## Resposta correta e cálculo passo a passo

**Alternativa correta: C) 21**

Para usar a adição, os grupos precisam ser disjuntos (sem pessoas em comum). Separamos os funcionários pelas certificações exatas que possuem:

1. As três certificações: 2.
2. NR-10 e NR-12, mas não NR-35: $5 - 2 = 3$.
3. NR-10 e NR-35, mas não NR-12: $4 - 2 = 2$.
4. NR-12 e NR-35, mas não NR-10: $3 - 2 = 1$.
5. Somente NR-10: $14 - 3 - 2 - 2 = 7$.
6. Somente NR-12: $11 - 3 - 1 - 2 = 5$.
7. Somente NR-35: $9 - 2 - 1 - 2 = 4$.

Total de funcionários diferentes com pelo menos uma certificação (Princípio da Adição, pois os grupos não se misturam):

$$2 + 3 + 2 + 1 + 7 + 5 + 4 = 24$$

**Retirando os afastados:** os 3 afastados pertencem ao grupo "somente NR-12", que passa de 5 para 2:

$$24 - 3 = 21$$

**Conferência por inclusão e exclusão:**

$$14 + 11 + 9 - 5 - 4 - 3 + 2 = 24, \quad \text{e depois } 24 - 3 = 21$$

Portanto, existem 21 possibilidades de escolha. A adição se aplica porque o coordenador será escolhido de um único grupo disponível, e os grupos foram separados para que ninguém seja contado duas vezes.

## Possíveis erros e feedback específico

- **Resposta A (24):**
  - *Erro:* Contou corretamente as pessoas distintas, mas esqueceu de retirar os 3 afastados.
  - *Feedback do B.O.T.:* *"Ótima contagem! Mas releia o enunciado: o coordenador não pode estar afastado. Quantas pessoas devem sair da lista?"*
- **Resposta B (31):**
  - *Erro:* Somou as três listas ($14 + 11 + 9 = 34$) sem descontar quem foi contado mais de uma vez e retirou apenas os afastados ($34 - 3 = 31$).
  - *Feedback do B.O.T.:* *"Cuidado! Quem tem duas ou três certificações aparece em várias listas, e você contou essas pessoas mais de uma vez. Como contar cada pessoa só uma vez?"*
- **Resposta D (19):**
  - *Erro:* Descontou as interseções de dois em dois ($34 - 5 - 4 - 3 = 22$), mas não somou de volta quem tem as três certificações, e depois retirou os afastados ($22 - 3 = 19$).
  - *Feedback do B.O.T.:* *"Boa ideia em tirar as repetições! Mas as 2 pessoas com as três certificações foram contadas 3 vezes e descontadas 3 vezes, então sumiram da contagem! Como corrigir isso?"*

## Dica

*"Tente separar os funcionários em grupos que não se misturam: quem tem só uma certificação, quem tem exatamente duas e quem tem as três. Depois some os grupos e, por fim, pense em quem precisa ficar de fora."*

## Feedback e explicação de acerto

- **Animação:** As três listas de crachás se reorganizam em sete grupos coloridos que não se sobrepõem. Os 3 afastados saem com um aviso, e o contador final mostra 21 funcionários disponíveis.
- **Fala do B.O.T.:**  
  > *"Missão cumprida, construtor! Você separou os funcionários em grupos sem repetição: 24 pessoas com certificação. Depois retirou os 3 afastados e chegou a 21 coordenadores possíveis. Você aplicou a adição em um problema de verdade!"*

## Recursos visuais e sonoros necessários

- Três listas de crachás com cores diferentes por certificação.
- Destaque visual das pessoas que aparecem em mais de uma lista.
- Animação de reorganização das listas em 7 grupos disjuntos.
- Indicação visual de afastados.
- Contador final de funcionários disponíveis.
- Som de seleção ao tocar em um nome e efeitos de acerto e erro.
- Tela de comemoração do B.O.T.

## Condição de conclusão

O jogador selecionar a alternativa **C) 21**, clicar em **Enviar Resposta** e visualizar a reorganização em grupos disjuntos.

## Observações e dúvidas para os desenvolvedores

1. O quadro de interseções deve deixar claro que os valores "5, 4 e 3" incluem quem tem as três certificações. Isso é o ponto de maior risco de interpretação do enunciado.
2. A reorganização em 7 grupos só deve aparecer após o acerto ou após a segunda tentativa errada.
3. Para uma versão visual, vale usar um diagrama de Venn com três círculos que o jogador possa preencher?
4. Se a fase ficar muito carregada, os afastados podem ser movidos para uma segunda etapa da mesma fase.

## Revisão matemática

**Pessoa que revisou:** A definir
**Resultado da revisão e ajustes necessários:** *Conferido pelo autor da proposta. Os sete grupos exclusivos somam $2 + 3 + 2 + 1 + 7 + 5 + 4 = 24$, e a inclusão e exclusão $14 + 11 + 9 - 5 - 4 - 3 + 2 = 24$ confirma. Os afastados (3) pertencem ao grupo "somente NR-12" (5 pessoas), então a resposta é $24 - 3 = 21$. Aguardando revisão.*

## Avaliação técnica

**Pessoa que avaliou:**
**Dúvidas, limitações ou ajustes necessários:**

## Validação após implementação

- [ ] A fase foi testada pelo autor da proposta.
- [ ] O conteúdo, as respostas e a explicação correspondem à proposta.
- [ ] Os problemas encontrados foram resolvidos.

**Data e observações da validação:**
