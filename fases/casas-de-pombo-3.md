# Proposta de fase --- Dificuldade difícil

**Nome da fase:** O Armazém no Limite\
**Princípio matemático:** Casa de Pombos (Princípio das Gavetas)\
**Autor:** Andrey Oliveira\
**Data da proposta:** 11/11/2026\
**Dificuldade:** Difícil

## Objetivo de aprendizagem

Aplicar o Princípio da Casa dos Pombos em uma situação que exige mais do
que comparar a quantidade de objetos e espaços. O jogador deverá
calcular a quantidade mínima de itens que necessariamente ficará em um
mesmo grupo, considerando uma distribuição equilibrada entre os
compartimentos.

## Contexto na fábrica

O setor de expedição precisa armazenar **53 peças** em **8 caixas de
transporte**. As peças possuem etiquetas de identificação de 1 a 53, e
cada caixa pode receber qualquer quantidade de peças. O sistema não
informa como as peças serão distribuídas, mas a equipe precisa garantir
que pelo menos uma caixa contenha uma quantidade mínima de peças para
planejar a conferência de qualidade.

O B.O.T. solicita que o jogador determine essa quantidade mínima
garantida, mesmo considerando a distribuição mais equilibrada possível.

## Fala inicial do B.O.T.

"Alerta no setor de expedição! Temos 53 peças para distribuir em apenas
8 caixas. Não sabemos como a equipe vai organizar tudo, então precisamos
descobrir o que é inevitável, mesmo que a distribuição seja feita da
maneira mais equilibrada possível. Encontre o número mínimo de peças que
podemos garantir em pelo menos uma caixa!"

## Tutorial ou instruções

O B.O.T. apresenta as regras:

1.  Todas as 53 peças devem ser colocadas nas 8 caixas.
2.  Cada peça deve ficar em exatamente uma caixa.
3.  As caixas podem receber quantidades diferentes de peças, inclusive
    nenhuma.
4.  O desafio é encontrar o menor número de peças que **sempre** estará
    presente em pelo menos uma caixa, independentemente da distribuição.
5.  Para resolver, imagine primeiro a distribuição que deixa as caixas
    com quantidades tão próximas quanto possível.

O tutorial deve explicar que, para descobrir a garantia mínima, não
basta dividir e arredondar para cima sem interpretar o resultado: é
preciso analisar o pior cenário, isto é, a distribuição mais
equilibrada.

## Elementos na tela

-   8 caixas de transporte numeradas de 1 a 8.
-   53 peças representadas por ícones.
-   Contador de peças distribuídas e caixas disponíveis.
-   Painel para registrar a quantidade de peças por caixa.
-   Campo numérico para inserir a resposta.
-   Botão **Confirmar**.
-   Botão **Solicitar dica**.
-   Painel de explicação matemática após a resposta.
-   B.O.T. para apresentar orientações e feedback.

## Ação do jogador

1.  O jogador observa os 53 itens e as 8 caixas.
2.  O B.O.T. pede que ele pense na distribuição mais equilibrada
    possível.
3.  O jogador pode testar uma distribuição no painel, colocando
    quantidades hipotéticas em cada caixa.
4.  O jogador identifica quantas peças podem ficar em cada caixa sem que
    nenhuma ultrapasse determinado limite.
5.  Insere no campo numérico a menor quantidade que é garantida em pelo
    menos uma caixa.
6.  Seleciona **Confirmar**.
7.  Se acertar, o jogo apresenta a demonstração matemática. Se errar, o
    B.O.T. oferece feedback específico e permite nova tentativa.

## Dados e valores

-   Total de peças: **53**.
-   Total de caixas: **8**.
-   Todas as peças devem ser distribuídas.
-   Cada peça ocupa uma única caixa.
-   Não existe limite de capacidade informado para as caixas.
-   A distribuição pode ser desigual; para encontrar a garantia mínima,
    deve-se considerar o cenário mais equilibrado.

## Pergunta ou desafio

**Qual é o menor número de peças que podemos garantir que haverá em pelo
menos uma das 8 caixas, qualquer que seja a maneira de distribuir as 53
peças?**

O jogador deve informar um número inteiro.

## Alternativas, quando existirem

A)  6 peças\
B)  7 peças\
C)  8 peças\
D)  9 peças

## Resposta correta e cálculo passo a passo

**Alternativa correta: C) 8 peças.**

Para encontrar a menor quantidade garantida, analisamos primeiro o que
aconteceria se nenhuma caixa tivesse 8 peças. Nesse caso, cada caixa
poderia ter, no máximo, 7 peças.

-   8 caixas × 7 peças por caixa = 56 peças.

Como existem apenas 53 peças, é possível distribuí-las sem que qualquer
caixa chegue a 8 peças. Portanto, atenção: a resposta não pode ser 8.

A distribuição mais equilibrada de 53 peças em 8 caixas é:

\[ 53 = 8 `\times 6`{=tex} + 5 \]

Assim, cinco caixas podem receber 7 peças cada e três caixas podem
receber 6 peças cada:

\[ 7+7+7+7+7+6+6+6=53 \]

Logo, em qualquer distribuição, pelo menos uma caixa terá **7 peças ou
mais**, pois:

\[
`\left`{=tex}`\lceil`{=tex}`\frac{53}{8}`{=tex}`\right`{=tex}`\rceil`{=tex}
= `\left`{=tex}`\lceil 6{,}`{=tex}625`\right`{=tex}`\rceil
=7`{=tex} \]

**Resposta correta: B) 7 peças.**

A justificativa geral é que, distribuindo (n) objetos em (m) grupos,
pelo menos um grupo terá no mínimo:

\[
`\left`{=tex}`\lceil`{=tex}`\frac{n}{m}`{=tex}`\right`{=tex}`\rceil`{=tex}
\]

objetos. O teto indica o menor inteiro maior ou igual ao resultado da
divisão.

## Possíveis erros e feedback específico

-   **Resposta 6:** "Pense no que acontece se todas as caixas tiverem,
    no máximo, 6 peças. Quantas peças seriam armazenadas ao todo? Isso
    seria suficiente para guardar as 53?"
-   **Resposta 8:** "Cuidado para não arredondar a divisão para o
    inteiro errado. A garantia é o menor número que precisa aparecer em
    pelo menos uma caixa, mesmo na distribuição mais equilibrada."
-   **Resposta 9:** "A quantidade garantida não precisa ser tão alta.
    Teste uma distribuição equilibrada: é possível organizar as peças de
    modo que nenhuma caixa tenha 9?"
-   **Resposta em branco ou valor não inteiro:** "A resposta deve ser um
    número inteiro de peças. Refaça a divisão e interprete o
    arredondamento para cima."

## Dica

"Imagine que você tente evitar que qualquer caixa tenha 7 peças. Qual
seria o máximo de peças que conseguiria guardar nas 8 caixas? Compare
esse total com as 53 peças disponíveis."

## Feedback e explicação de acerto

"Excelente trabalho! Você encontrou o mínimo que podemos garantir. Se
todas as caixas tivessem no máximo 6 peças, caberiam apenas 48 peças.
Como temos 53, pelo menos uma caixa precisa ter 7 peças ou mais. Isso é
o Princípio da Casa dos Pombos!"

A animação mostra 8 caixas recebendo inicialmente 6 peças cada. Em
seguida, as 5 peças restantes são distribuídas, uma em cada uma de cinco
caixas, deixando cinco caixas com 7 peças e três com 6.

## Recursos visuais e sonoros necessários

-   Cenário de um setor de expedição da fábrica.
-   Oito caixas numeradas.
-   Cinquenta e três peças ou marcadores visuais.
-   Animação de distribuição equilibrada das peças.
-   Painel que permita visualizar a soma de cada caixa.
-   Campo de resposta numérica.
-   Efeitos sonoros discretos para acerto e erro.
-   Animação do B.O.T. destacando as caixas que receberam a peça
    excedente.
-   Recurso visual para comparar a capacidade hipotética de 8 caixas com
    6 peças (48) ao total de 53 peças.

## Condição de conclusão

A fase será concluída quando o jogador responder **7** e visualizar a
explicação que demonstra por que não é possível manter todas as caixas
com apenas 6 peças ou menos.

Para domínio completo, o jogador também deverá identificar que a
distribuição de 5 caixas com 7 peças e 3 caixas com 6 peças demonstra
que não é possível garantir 8 peças em uma caixa.

## Observações e dúvidas para os desenvolvedores

-   O enunciado deve destacar a expressão **"menor número garantido"**,
    para diferenciar a garantia mínima de uma quantidade que pode
    ocorrer em algumas distribuições.
-   A simulação de distribuição é exploratória: não deve ser obrigatório
    arrastar individualmente as 53 peças, pois isso pode tornar a fase
    demorada.
-   O painel pode permitir que o jogador informe quantas peças ficariam
    em cada caixa, validando se a soma é 53.
-   A dica deve orientar o jogador a testar o limite de 6 peças por
    caixa, sem revelar diretamente a resposta.
-   O feedback da alternativa 8 deve explicar que uma distribuição com
    caixas contendo 6 ou 7 peças é possível, portanto não se pode
    garantir 8.
-   Recomenda-se registrar tentativas e uso de dicas para avaliar se o
    jogador compreendeu a lógica ou apenas acertou por tentativa.

## Revisão matemática

**Pessoa que revisou:** A definir.

**Resultado da revisão e ajustes necessários:**

A resposta correta é **7 peças**. A divisão (53/8=6{,}625) exige
arredondamento para cima, resultando em 7. A garantia também pode ser
demonstrada por contradição: se todas as caixas tivessem no máximo 6
peças, haveria espaço para apenas (8`\times6`{=tex}=48) peças, menos do
que as 53 disponíveis. Por outro lado, a distribuição de cinco caixas
com 7 peças e três caixas com 6 peças totaliza 53, mostrando que não é
possível garantir 8 peças em uma caixa.

**Atenção à consistência:** a alternativa correta deve ser **B) 7
peças**. A alternativa C (8 peças) não é correta.
