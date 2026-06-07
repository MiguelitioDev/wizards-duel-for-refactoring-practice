# Relatório de Refatoração - Wizard Duel

## Lista de Problemas Encontrados
Durante a análise do código original, foram identificados os seguintes problemas de qualidade:
* [cite_start]**Números Mágicos:** Valores literais sem contexto (ex: atributos e tamanhos de deck) espalhados pelo código[cite: 20, 21, 22].
* [cite_start]**Nomes Sem Significado:** Variáveis e parâmetros com nomes pouco expressivos (ex: tmp, c, a, pw) que dificultavam a leitura[cite: 23, 24, 25].
* [cite_start]**Múltiplas Responsabilidades:** Rotas de API realizando fetch, filtragem e cálculos na mesma função[cite: 26, 27, 28].
* [cite_start]**Código Duplicado (DRY):** Lógica de cálculo de atributos e embaralhamento repetida em rotas diferentes[cite: 29, 30, 31].
* [cite_start]**Code Smells Gerais:** Uso de `var` em vez de let/const, concatenação manual de strings/HTML, uso de `==` em vez de `===` e `console.log` para tratamento de erros[cite: 32, 33, 34, 35, 36, 37].

## Decisões Tomadas
Para refatorar o código sem alterar o comportamento visível da aplicação, foram aplicadas as seguintes soluções:
1. [cite_start]**Configuração do ESLint:** Implementado o guia de estilo da Airbnb para garantir padronização[cite: 14, 16].
2. [cite_start]**Extração de Constantes:** Criado o arquivo `constants.js` para armazenar todos os números mágicos[cite: 41, 42].
3. [cite_start]**Modularização do Back-end:** Rotas separadas em `characters.js`, `spells.js` e `game.js`[cite: 50, 51, 55, 57]. [cite_start]Lógicas duplicadas e chamadas externas foram extraídas para a pasta `services` (`potterApi.js` e `statsCalculator.js`)[cite: 43, 44, 59, 60, 62].
4. [cite_start]**Modularização do Front-end:** Divisão da lógica em `api.js` (chamadas ao back-end), `render.js` (manipulação de DOM) e `game.js` (fluxo do jogo)[cite: 65, 66, 68, 71].
5. [cite_start]**Limpeza Geral:** Renomeação de variáveis sem significado[cite: 39, 40], substituição de `var` por `const`/`let`, aplicação de template literals e adoção de igualdade estrita (`===`).