# Proposta de fase --- Dificuldade difícil

**Nome da fase:** Operação Linha de Produção\
**Princípio matemático:** Casa de Pombos (Princípio das Gavetas)\
**Autor:** Andrey Oliveira\
**Data da proposta:** 11/11/2026\
**Dificuldade:** Difícil

## Objetivo de aprendizagem

Aplicar a forma generalizada do Princípio da Casa dos Pombos para
descobrir quantos elementos são necessários para garantir que um mesmo
grupo contenha uma quantidade mínima determinada. O jogador deverá
raciocinar sobre o pior cenário possível e utilizar a expressão
(m(k-1)+1).

## Contexto na fábrica

A fábrica possui 7 linhas de produção. Cada lote produzido é registrado
em apenas uma dessas linhas. A equipe de controle de qualidade precisa
realizar uma auditoria especial em pelo menos uma linha, verificando 12
ou mais lotes.

O sistema ainda não sabe como os lotes serão distribuídos entre as
linhas. O B.O.T. precisa descobrir quantos lotes devem ser registrados
para que seja matematicamente impossível que todas as linhas tenham 11
lotes ou menos.

## Fala inicial do B.O.T.

"Temos uma missão importante no controle de qualidade! A fábrica possui
7 linhas de produção, e precisamos garantir que pelo menos uma delas
tenha 12 lotes ou mais para receber uma auditoria especial. Não sabemos
como os lotes serão distribuídos. Descubra quantos lotes precisamos
registrar para ter essa garantia!"

## Tutorial ou instruções

O B.O.T. apresenta as seguintes regras:

1.  Existem 7 linhas de produção.
2.  Cada lote pertence a uma única linha.
3.  Os lotes podem ser distribuídos de maneira desigual.
4.  O objetivo é garantir que pelo menos uma linha tenha 12 lotes ou
    mais.
5.  Para encontrar o menor total necessário, primeiro imagine o maior
    número de lotes que cada linha poderia receber sem alcançar 12.
6.  Depois, acrescente um lote ao total máximo desse cenário.

O tutorial deve apresentar a ideia de que, para evitar 12 lotes em uma
linha, cada uma pode receber no máximo 11.

## Elementos na tela

-   7 linhas de produção identificadas de 1 a 7.
-   Marcadores que representam os lotes.
-   Contador geral de lotes.
-   Painel que mostra a quantidade de lotes em cada linha.
-   Campo numérico para inserir a resposta.
-   Botão **Confirmar**.
-   Botão **Solicitar dica**.
-   Indicador visual de limite por linha: 11 lotes.
-   Personagem B.O.T. para apresentar instruções e feedback.

## Ação do jogador

1.  O jogador observa as 7 linhas de produção.
2.  O B.O.T. informa que a meta é garantir 12 lotes ou mais em pelo
    menos uma linha.
3.  O jogador testa o cenário-limite: coloca 11 lotes em cada linha.
4.  O painel calcula o total de lotes que podem ser distribuídos sem que
    nenhuma linha alcance 12.
5.  O jogador acrescenta mentalmente um lote ao total encontrado.
6.  Insere no campo numérico o menor total necessário para garantir a
    meta.
7.  Seleciona **Confirmar**.
8.  O jogo apresenta a demonstração matemática e o feedback
    correspondente.

## Dados e valores

-   Quantidade de linhas de produção: **7**.
-   Meta: pelo menos **12 lotes em uma mesma linha**.
-   Limite máximo por linha para ainda não atingir a meta: **11 lotes**.
-   Cada lote pertence a exatamente uma linha.
-   Não há limite físico de capacidade informado para as linhas.

## Pergunta ou desafio

**Qual é o menor número de lotes que a fábrica precisa registrar para
garantir que pelo menos uma das 7 linhas de produção tenha 12 lotes ou
mais?**

O jogador deverá informar um número inteiro.

## Alternativas, quando existirem

A)  77 lotes\
B)  78 lotes\
C)  84 lotes\
D)  85 lotes

## Resposta correta e cálculo passo a passo

**Alternativa correta: B) 78 lotes.**

Para resolver, devemos analisar o maior total possível sem que nenhuma
linha alcance 12 lotes.

1.  A fábrica possui 7 linhas.
2.  Para evitar que uma linha tenha 12 lotes, cada uma pode receber, no
    máximo, 11.
3.  Portanto, o maior total que pode ser distribuído sem atingir a meta
    é:

\[ 7 `\times 11`{=tex} = 77 \]

4.  Com 77 lotes, ainda é possível colocar exatamente 11 em cada uma das
    7 linhas. Portanto, 77 não garante que alguma linha tenha 12.
5.  Ao registrar mais um lote, chegamos a 78. Esse lote adicional
    necessariamente ficará em uma linha que já possui 11 ou mais,
    fazendo com que ela alcance pelo menos 12.

\[ 7 `\times `{=tex}(12-1)+1 \]

\[ 7 `\times 11`{=tex}+1=77+1=78 \]

**Resposta: 78 lotes.**

A fórmula generalizada é:

\[ N=m(k-1)+1 \]

Em que:

-   \(N\) = menor quantidade total necessária;
-   \(m\) = número de grupos;
-   \(k\) = quantidade mínima desejada em pelo menos um grupo.

O princípio se aplica porque, ao ultrapassar o máximo que todos os
grupos poderiam receber sem alcançar a meta, algum grupo
obrigatoriamente ultrapassará esse limite.

## Possíveis erros e feedback específico

-   **Resposta A --- 77:** "Ainda não! Com 77 lotes, você pode
    distribuir 11 em cada uma das 7 linhas. Assim, nenhuma chega a 12. É
    preciso considerar mais um lote."
-   **Resposta C --- 84:** "Você encontrou um número que garante a meta,
    mas o desafio pede o menor número possível. Verifique se a garantia
    já acontece antes de chegar a 84."
-   **Resposta D --- 85:** "Esse total também ultrapassa o necessário.
    Lembre-se: queremos o primeiro lote que torna impossível manter
    todas as linhas com 11 ou menos."
-   **Resposta em branco ou valor não inteiro:** "Informe um número
    inteiro de lotes. Primeiro calcule o máximo que pode ser distribuído
    sem atingir 12 em nenhuma linha."

## Dica

"Se cada uma das 7 linhas pudesse receber 11 lotes, quantos lotes seriam
distribuídos ao todo? O que aconteceria com o lote seguinte?"

## Feedback e explicação de acerto

"Excelente! Você encontrou o limite exato. Com 77 lotes, ainda podemos
distribuir 11 em cada linha. Mas, quando chega o 78º lote, alguma linha
obrigatoriamente recebe o 12º lote. Você aplicou a forma generalizada do
Princípio da Casa dos Pombos!"

A animação mostra 11 marcadores sendo colocados em cada uma das 7
linhas. Em seguida, aparece o 78º marcador, que é direcionado a uma das
linhas, fazendo seu contador passar de 11 para 12.

## Recursos visuais e sonoros necessários

-   Cenário de uma fábrica com 7 linhas de produção.
-   Sete painéis ou esteiras identificados de 1 a 7.
-   Marcadores visuais que representam os lotes.
-   Contador individual para cada linha.
-   Contador geral de lotes.
-   Animação que distribui 11 lotes em cada linha.
-   Animação destacando o 78º lote e a linha que passa a ter 12.
-   Campo para resposta numérica.
-   Efeitos sonoros de acerto e erro.
-   Animação de comemoração do B.O.T.

## Condição de conclusão

A fase será concluída quando o jogador informar **78 lotes** e
visualizar a explicação que demonstra:

-   por que 77 lotes ainda não garantem 12 em uma mesma linha;
-   por que o 78º lote torna essa garantia inevitável;
-   como a fórmula generalizada da Casa dos Pombos representa esse
    raciocínio.

## Observações e dúvidas para os desenvolvedores

-   O enunciado deve destacar as expressões **"menor número"** e
    **"garantir"**, pois o desafio não pergunta por um total que apenas
    torna a meta possível.
-   A simulação deve permitir visualizar o cenário-limite de 11 lotes em
    cada linha.
-   O 78º lote deve ser animado entrando em uma das linhas, sem exigir
    que o jogador escolha previamente qual será essa linha.
-   O sistema não deve afirmar que uma linha específica receberá o lote
    adicional: a garantia é que alguma linha terá pelo menos 12.
-   As alternativas incorretas devem gerar explicações diferentes,
    especialmente para distinguir o limite máximo (77) do primeiro valor
    que garante a meta (78).
-   Para manter a dificuldade alta, a fórmula pode ser apresentada
    somente depois da primeira tentativa, deixando o jogador construir o
    raciocínio antes de receber a formalização.

## Revisão matemática

**Pessoa que revisou:** A definir.

**Resultado da revisão e ajustes necessários:**

A resposta correta é **78 lotes**. Para que nenhuma das 7 linhas tenha
12 lotes, cada uma pode receber no máximo 11. Assim, o maior total que
evita a meta é (7 `\times 11`{=tex}=77). Com 78 lotes, pelo menos uma
linha terá 12 ou mais.

A expressão aplicada é:

\[ N=m(k-1)+1 \]

Substituindo (m=7) e (k=12):

\[ N=7(12-1)+1=78 \]

O raciocínio está matematicamente correto e utiliza a forma generalizada
do Princípio da Casa dos Pombos.
