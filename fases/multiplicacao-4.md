# Proposta de fase

**Nome da fase:** Robô Completo  
**Princípio matemático:** Princípio Multiplicativo (Multiplicação / Análise Combinatória)  
**Autor:** Felipe  
**Data da proposta:** 11/11/2026  
**Dificuldade:** Dificil
---

## Objetivo de aprendizagem

Compreender e aplicar o **Princípio Multiplicativo** (Princípio Fundamental da Contagem) para calcular o número total de combinações possíveis a partir de escolhas independentes em diferentes categorias.

---

## Contexto na fábrica

A fábrica recebeu uma encomenda expressa para montar protótipos de robôs para uma grande competição. Para garantir a melhor estratégia no campeonato, a equipe precisa mapear com precisão todas as combinações de robôs que podem ser construídas a partir das peças disponíveis no estoque. O jogador precisa ajudar a calcular esse total antes que as esteiras de montagem comecem a operar.

---

## Fala inicial do B.O.T.

> *"Atenção, construtor! Recebemos uma missão especial: mapear todos os modelos de robôs para a competição! Temos várias opções de peças na esteira. Você consegue descobrir quantas combinações diferentes conseguimos montar combinando uma peça de cada categoria?"*

---

## Tutorial ou instruções

1. O jogo exibe as 4 categorias de peças dispostas na tela (Cabeça, Corpo, Braços e Sensores) com seus respetivos seletores visuais.
2. Uma mensagem em destaque instrui o jogador: *"Combine 1 peça de cada categoria para ver o robô tomar forma e descubra o total de modelos possíveis!"*
3. Ao tocar nas alternativas ou interagir com os seletores, o jogador ajusta seu palpite final.

---

## Elementos na tela

* **Área central de montagem:** Manequim/base de robô interativo mudando de aparência conforme o jogador testa as peças.
* **Painel de peças (Estoque):**
  * 3 opções de Cabeça
  * 3 opções de Corpo
  * 2 opções de Braços
  * 2 opções de Sensores
* **Painel do desafio:** Enunciado completo com a pergunta central.
* **Caixa de alternativas:** Botões com as opções A (10), B (18), C (24) e D (36).
* **Botão de dica:** Ícone com a lâmpada do B.O.T.
* **Botão de confirmação:** *"Enviar Resposta"*.

---

## Ação do jogador

1. O jogador lê o enunciado da missão na tela.
2. Pode clicar/tocar no estoque de peças para alternar opções e visualizar a variedade de combinações no manequim.
3. Raciocina sobre a quantidade total de possibilidades de montagem.
4. Seleciona uma das alternativas de resposta (A, B, C ou D).
5. Clica em *"Enviar Resposta"*.

---

## Dados e valores

* **Categorias de escolha:** 4 independentes
* **Opções de Cabeça:** 3
* **Opções de Corpo:** 3
* **Opções de Braços:** 2
* **Opções de Sensores:** 2
* **Regra de montagem:** Exatamente 1 opção por categoria ($3 \times 3 \times 2 \times 2$).

---

## Pergunta ou desafio

> *A fábrica recebeu uma missão especial: construir robôs para uma competição.*  
> *Cada robô precisa ter:*  
> *- 3 opções de cabeça;*  
> *- 3 opções de corpo;*  
> *- 2 opções de braços;*  
> *- 2 opções de sensores.*  
> 
> *Sabendo que cada robô utiliza exatamente uma opção de cada categoria, quantos modelos diferentes podem ser construídos?*

---

## Alternativas, quando existirem

* **A)** 10
* **B)** 18
* **C)** 24
* **D)** 36

---

## Resposta correta e cálculo passo a passo

**Gabarito: D) 36**

### Explicação:
Como a escolha de cada peça ocorre em etapas independentes, aplicamos o **Princípio Multiplicativo** (Princípio Fundamental da Contagem). Multiplicamos a quantidade de opções disponíveis em cada uma das 4 etapas:

$$\text{Total de modelos} = 3 \times 3 \times 2 \times 2$$

1. Multiplicamos as cabeças pelo corpo: $3 \times 3 = 9$ combinações de cabeça e corpo.
2. Multiplicamos o resultado pelos braços: $9 \times 2 = 18$ combinações.
3. Multiplicamos o resultado pelos sensores: $18 \times 2 = 36$ modelos diferentes.

Portanto, a fábrica pode construir **36 modelos diferentes de robôs**.

---

## Possíveis erros e feedback específico

* **Se o jogador escolher A (10):**
  * *Erro:* Somou todas as opções ($3 + 3 + 2 + 2 = 10$).
  * *Feedback do B.O.T.:* *"Cuidado! Você somou a quantidade de peças disponíveis, mas lembre-se de que cada opção de cabeça combina com todas as opções de corpo, braços e sensores. Em vez de somar, qual operação junta todas as combinações?"*
* **Se o jogador escolher B (18):**
  * *Erro:* Esqueceu de multiplicar uma das categorias de 2 opções (ex: $3 \times 3 \times 2 = 18$).
  * *Feedback do B.O.T.:* *"Chegou perto! Mas verifique se você incluiu todas as 4 categorias no seu cálculo: cabeças, corpos, braços e os sensores!"*
* **Se o jogador escolher C (24):**
  * *Erro:* Erro de cálculo na multiplicação.
  * *Feedback do B.O.T.:* *"Quase lá! Vamos refazer a conta por partes: $3 \times 3 = 9$; depois $9 \times 2 = 18$; e agora $18 \times 2 = ?$"*

---

## Dica

> *"Observe quantas categorias existem. Cada categoria representa uma etapa da montagem. Em vez de somar, pense em quantas combinações se formam ao multiplicar as opções de cada etapa!"*

---

## Feedback e explicação de acerto

* **Animação:** O robô no centro da tela começa a se transformar rapidamente montando vários modelos coloridos e finaliza com uma pose de celebração.
* **Fala do B.O.T.:**  
  > *"Excelente trabalho, construtor! Como temos 4 etapas independentes, multiplicamos todas as possibilidades: $3 \times 3 \times 2 \times 2 = 36$. Com essa estratégia, a fábrica vai dominar a competição!"*

---

## Recursos visuais e sonoros necessários

* **Visuais:**
  * Sprites das peças separadas (3 cabeças, 3 corpos, 2 pares de braços, 2 sensores).
  * Animação de montagem rápida do robô ao acertar.
  * Holograma/Painel do B.O.T. com a fórmula $3 \times 3 \times 2 \times 2 = 36$ em destaque iluminado.
* **Sonoros:**
  * Efeito sonoro mecânico/clique de peças ao alternar componentes.
  * Fanfarra curta de conquista ao acertar.
  * Efeito de erro amigável (beep suave) au errar.

---

## Condição de conclusão

O jogador selecionar a alternativa **D) 36** e clicar em confirmar.

---

## Observações e dúvidas para os desenvolvedores

1. **Interatividade adicional:** Vale a pena permitir que o jogador clique nas peças e veja um contador visual dinâmico subindo à medida que testa peças diferentes, antes de responder?
2. **Animação da Dica:** Seria viável mostrar uma pequena árvore de possibilidades (diagrama de árvore) animada quando o jogador pedir a dica?

---

## Revisão matemática

**Pessoa que revisou:**  
**Resultado da revisão e ajustes necessários:**  
*Aplicação do Princípio Multiplicativo verificada e correta. Etapas independentes com restrição de exatamente 1 escolha por categoria originam exatamente $3 \times 3 \times 2 \times 2 = 36$ arranjos possíveis.*