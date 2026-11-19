
# Proposta de fase

**Nome da fase:** Princípio Matemático: O Controle de Qualidade  
**Autor:** Andrey Oliveira  
**Data da proposta:** 11/11/2026  
**Dificuldade:** Média

## Objetivo de aprendizagem

Aprofundar a compreensão do Princípio da Casa de Pombo, fazendo com que o jogador utilize o raciocínio matemático para resolver um problema com diferentes categorias.

Ao concluir a fase, o jogador deverá ser capaz de:

- Identificar os objetos e as categorias de distribuição.
- Interpretar problemas que envolvem uma quantidade mínima garantida.
- Analisar o pior cenário possível.
- Aplicar o Princípio da Casa de Pombo para encontrar uma quantidade mínima.
- Justificar matematicamente sua resposta.

## Contexto na fábrica

A fábrica está produzindo componentes eletrônicos que precisam passar por uma inspeção de qualidade.

Após a produção, os componentes são separados em seis categorias, de acordo com o tipo de defeito identificado:

1. Defeito elétrico.
2. Defeito mecânico.
3. Defeito de acabamento.
4. Defeito de conexão.
5. Defeito de montagem.
6. Defeito de isolamento.

Durante uma inspeção, o sistema identifica 31 componentes defeituosos.

O problema é que o relatório de qualidade não informa quantos componentes pertencem a cada categoria.

O B.O.T. precisa descobrir quantos componentes obrigatoriamente apresentarão o mesmo tipo de defeito.

O jogador deverá analisar os dados e ajudar a fábrica a encontrar essa quantidade mínima.

## Fala inicial do B.O.T.

"Precisamos resolver um problema no setor de qualidade!

Nossa inspeção encontrou 31 componentes defeituosos.

Eles podem apresentar seis tipos diferentes de defeitos, mas ainda não sabemos como estão distribuídos.

O diretor da fábrica quer saber uma coisa: quantos componentes podemos garantir que possuem o mesmo tipo de defeito?

Não podemos simplesmente adivinhar!

Vamos utilizar a matemática para descobrir essa informação!"

## Tutorial ou instruções

O B.O.T. apresenta as seis categorias de defeitos na tela.

Em seguida, explica:

- Cada componente representa um objeto.
- Cada tipo de defeito representa uma casa de pombo.
- Cada componente será colocado em uma única categoria.
- Um componente não pode pertencer a duas categorias simultaneamente.
- O objetivo é descobrir a menor quantidade que necessariamente aparecerá em pelo menos uma categoria.

O tutorial apresenta um exemplo:

Se temos 12 componentes e seis categorias, podemos distribuir dois componentes em cada categoria.

Entretanto, se tivermos 13 componentes, será necessário colocar pelo menos três componentes em alguma categoria.

O B.O.T. explica que essa lógica permite encontrar uma quantidade mínima garantida sem precisar conhecer a distribuição exata.

## Elementos na tela

- Uma bancada de inspeção industrial.
- Trinta e um componentes eletrônicos.
- Seis caixas representando as categorias de defeitos.
- Identificação visual de cada categoria.
- Contador de componentes disponíveis.
- Contador de componentes distribuídos.
- Painel com a quantidade total de componentes.
- Painel com a quantidade de categorias.
- Botão para distribuir os componentes automaticamente.
- Possibilidade de arrastar componentes entre as categorias.
- Painel para selecionar a resposta.
- Botão de confirmação.
- Personagem B.O.T. com animações e expressões.

## Ação do jogador

1. O jogador observa os 31 componentes identificados na inspeção.
2. Analisa as seis categorias de defeitos disponíveis.
3. Distribui os componentes entre as categorias.
4. Pode realizar diferentes distribuições para testar suas hipóteses.
5. Observa a quantidade de componentes em cada categoria.
6. O B.O.T. apresenta o desafio matemático.
7. O jogador analisa qual seria a distribuição mais equilibrada possível.
8. Seleciona a alternativa que representa a quantidade mínima garantida.
9. Confirma sua resposta.
10. Recebe a explicação matemática.

## Dados e valores

Dados principais:

- Total de componentes: 31.
- Total de categorias: 6.
- Quantidade mínima garantida em pelo menos uma categoria: 6 componentes.

As categorias são:

- Defeito elétrico.
- Defeito mecânico.
- Defeito de acabamento.
- Defeito de conexão.
- Defeito de montagem.
- Defeito de isolamento.

A distribuição mais equilibrada possível será:

- Categoria 1: 5 componentes.
- Categoria 2: 5 componentes.
- Categoria 3: 5 componentes.
- Categoria 4: 5 componentes.
- Categoria 5: 5 componentes.
- Categoria 6: 6 componentes.

Total: 31 componentes.

Essa distribuição demonstra que pelo menos uma categoria precisará conter seis ou mais componentes.

## Pergunta ou desafio

O B.O.T. pergunta:

"A inspeção encontrou 31 componentes defeituosos, que precisam ser distribuídos entre seis categorias diferentes.

Sem saber a quantidade exata de componentes em cada categoria, qual é a menor quantidade que podemos garantir que terá o mesmo tipo de defeito?"

## Alternativas, quando existirem

A) 4 componentes.

B) 5 componentes.

C) 6 componentes.

D) 7 componentes.

## Resposta correta e cálculo passo a passo

**Resposta correta: C) 6 componentes.**

Para resolver o desafio, utilizamos o Princípio da Casa de Pombo.

Temos:

- 31 componentes.
- 6 categorias de defeitos.

Primeiro, precisamos imaginar a situação mais equilibrada possível.

Vamos tentar colocar cinco componentes em cada categoria.

6 × 5 = 30.

Nesse cenário, conseguimos distribuir apenas 30 componentes.

Entretanto, ainda existe um componente restante:

31 - 30 = 1.

Esse componente precisará ser colocado em uma das seis categorias.

Consequentemente, pelo menos uma categoria terá seis ou mais componentes.

A fórmula utilizada é:

Quantidade mínima garantida = ⌈N / K⌉

Onde:

- N representa a quantidade de objetos.
- K representa a quantidade de categorias.
- ⌈ ⌉ representa o arredondamento para cima.

Aplicando os valores:

⌈31 / 6⌉ = ⌈5,1666...⌉ = 6.

Portanto, podemos garantir que pelo menos seis componentes apresentarão o mesmo tipo de defeito.

### Por que o princípio se aplica?

O Princípio da Casa de Pombo estabelece que, quando distribuímos mais objetos do que a capacidade total de manter uma determinada quantidade em cada categoria, pelo menos uma categoria precisará ultrapassar esse limite.

Neste problema, seria impossível colocar os 31 componentes nas seis categorias mantendo apenas cinco componentes em cada uma.

Isso acontece porque seis categorias com cinco componentes comportariam somente 30 componentes.

Como temos 31, pelo menos uma categoria terá seis ou mais componentes.

## Possíveis erros e feedback específico

**Erro: Alternativa A (4 componentes).**

Feedback do B.O.T.:

"Essa quantidade não é suficiente! Tente distribuir os 31 componentes entre as seis categorias. Será que conseguimos garantir apenas quatro em alguma delas?"

**Erro: Alternativa B (5 componentes).**

Feedback do B.O.T.:

"Você está muito perto! Mas pense no seguinte: se colocarmos cinco componentes em cada categoria, quantos conseguiremos distribuir? Ainda sobrará algum?"

**Erro: Alternativa D (7 componentes).**

Feedback do B.O.T.:

"Não precisamos garantir sete componentes na mesma categoria. Procure a menor quantidade que obrigatoriamente aparecerá em alguma delas."

## Dica

O B.O.T. apresenta uma dica:

"Imagine que todas as categorias recebam exatamente cinco componentes.

Quantos componentes conseguiremos distribuir?

Agora pense: o que acontece com o componente que ainda sobrar?"

A dica estimula o jogador a descobrir que a distribuição de cinco componentes por categoria não é suficiente.

## Feedback e explicação de acerto

Quando o jogador acertar, o B.O.T. comemora:

"Excelente trabalho!

Você conseguiu resolver o problema do controle de qualidade!

Se distribuirmos cinco componentes em cada uma das seis categorias, conseguiremos acomodar apenas 30 componentes.

Mas nossa inspeção encontrou 31!

Isso significa que pelo menos uma categoria obrigatoriamente terá seis ou mais componentes.

Você utilizou corretamente o Princípio da Casa de Pombo!

Agora podemos informar ao setor de qualidade a quantidade mínima garantida de componentes com o mesmo tipo de defeito."

Uma animação apresenta os componentes sendo distribuídos nas seis categorias.

O último componente é colocado em uma das categorias, que passa a apresentar seis unidades.

Essa categoria recebe um destaque visual.

## Recursos visuais e sonoros necessários

### Elementos visuais

- Bancada industrial de inspeção.
- 31 componentes eletrônicos.
- Seis caixas coloridas representando os tipos de defeito.
- Animação de distribuição dos componentes.
- Contadores individuais para cada categoria.
- Painel mostrando a operação 31 ÷ 6.
- Destaque visual na categoria que recebe o sexto componente.
- Animação de aprovação da inspeção.
- Personagem B.O.T. com expressões de dúvida, concentração e comemoração.

### Elementos sonoros

- Som de máquinas funcionando.
- Som de componentes sendo colocados nas caixas.
- Som de alerta ao identificar os componentes defeituosos.
- Som de confirmação para resposta correta.
- Som de erro para resposta incorreta.
- Efeito sonoro de descoberta durante a explicação.
- Música de comemoração ao concluir a fase.

## Condição de conclusão

A fase será considerada concluída quando:

1. O jogador visualizar os dados apresentados.
2. Identificar as 31 peças e as seis categorias.
3. Compreender a necessidade de encontrar a distribuição mais equilibrada.
4. Selecionar a resposta correta: seis componentes.
5. Receber a explicação matemática do B.O.T.

O sistema deverá registrar a conclusão da fase e liberar a próxima etapa.

## Observações e dúvidas para os desenvolvedores

- A fase deve apresentar maior complexidade em relação às anteriores.
- O jogador deve poder experimentar diferentes distribuições.
- A distribuição automática pode ser utilizada para demonstrar uma possibilidade de organização.
- A interface deve mostrar que a quantidade de componentes em cada categoria pode variar.
- A explicação matemática deve enfatizar a análise do pior cenário possível.
- O sistema deve diferenciar a quantidade mínima garantida da quantidade efetivamente observada em uma distribuição.
- As alternativas incorretas devem gerar feedbacks específicos.
- A fórmula matemática deve aparecer após o jogador ter oportunidade de raciocinar.
- O sistema não deve exigir que o jogador descubra a distribuição real dos defeitos, pois o desafio trata de uma garantia matemática.

**Sugestão para evolução:**

Em uma próxima fase, apresentar um problema em que os objetos possuam diferentes restrições de distribuição.

Por exemplo, alguns componentes podem pertencer a categorias específicas, exigindo que o jogador identifique primeiro quais categorias são realmente possíveis.

Isso permitirá avançar para aplicações mais elaboradas do Princípio da Casa de Pombo.

## Revisão matemática

**Pessoa que revisou:** A definir.

**Resultado da revisão e ajustes necessários:**

O raciocínio matemático está correto.

Para N objetos distribuídos entre K categorias, a quantidade mínima garantida em pelo menos uma categoria é:

⌈N / K⌉

Aplicando os valores:

⌈31 / 6⌉ = 6.

A distribuição mais equilibrada possível é:

5 + 5 + 5 + 5 + 5 + 6 = 31.

Portanto, pelo menos uma das seis categorias terá seis ou mais componentes.

A proposta apresenta corretamente o Princípio da Casa de Pombo, com dificuldade intermediária e aplicação em um contexto de controle de qualidade industrial.

**Observação matemática:** o resultado garante a existência de pelo menos uma categoria com seis ou mais componentes. Não significa que todas as categorias terão essa quantidade.
