# Machine Learning - Identificador de perfil de investidor
Testando algoritmos de "Machine Learning" para identificar um perfil de investidor a partir das respostas de um questionário.

## Como utilizar

1. `npm install`
2. `nodemon index.js`

**Arvores de Decisão**
* **URL**

  http://localhost:5000/decisionTree

* **Method:**

  `POST`
  
* **Data Params**

  `{p1: 0,p2: 1,p3: 2,p4: 0,p5: 2,p6: 1, p7: 4, p8: 2, p9: 3, p10: 0, p11: 1}`

**Bayes**
* **URL**

  http://localhost:5000/bayesian

* **Method:**

  `POST`
  
* **Data Params**

  `{p1: 0,p2: 1,p3: 2,p4: 0,p5: 2,p6: 1, p7: 4, p8: 2, p9: 3, p10: 0, p11: 1}`

**Regressão Logística**
* **URL**

http://localhost:5000/logisticRegression

* **Method:**

`POST`

* **Data Params**

`{p1: 0,p2: 1,p3: 2,p4: 0,p5: 2,p6: 1, p7: 4, p8: 2, p9: 3, p10: 0, p11: 1}`


## Classes

| Conservador | Moderado | Arrojado |
| :---------: |:--------:| :-------:|
|    y = 1    |   y = 2  |   y = 3  |

## Atributos

### Lista de Perguntas

##### P1 - "-"

| a) | b) | c) | d) | e) |
| :-----: | :-----: | :-----: | :-----: | :-----: |
|    0    |    1    |    2    |    3    |    4    |


### Treinamento

| X1 (P1) | X2 (P2) | X3 (P3) | X4 (P4) | X5 (P5) | X6 (P6) | X7 (P7) | X8 (P8) | X9 (P9) | X10 (P10) | X11 (P11) |Y1 (Tipo de Investidor) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|   0   |   0   |   0   |   0   |   0   |   0   |   0   |   0   |   0   |   0   |   0   |   0   |

