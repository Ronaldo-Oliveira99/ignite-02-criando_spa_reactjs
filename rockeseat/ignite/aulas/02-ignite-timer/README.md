
# ignite-02-criando_spa_reactjs

### Criação de um Timer pomodoro

Aplicação React utilizando o Vite e aprenderemos sobre os conceitos mais importantes do React, entre eles estão componentização, propriedades, estados, imutabilidade e hooks, além de aplicar o TypeScript no nosso projeto para adicionar tipagem estática à aplicação.

#### criar a estrutura do projeto utilizando o vite:

```bash
  npm crate vite@latest
```

#### apagar os arquivos: 

```javascript
App.css
index.css
logo.svg
```

#### Remover em App.tsx:
tudo dentro return(), e colocar um 
```javascript
<h1>Hello</h1>
```

#### ir no cmd e instalar todas as dependencias do projeto:


```bash
  /02-ignite-timer
    > npm i 
```

#### em App.tsx:
retira o export defalt App e colocar o export na function: 
```javascript
export function App() {}
```


#### em main.tsx, colocar chaves:

```javascript
import App from "./app"
```
para:

```javascript
import { App } from "./app"
```


para rodar o projeto:

```bash
yarn dev
```


----------------------------------------------------------------
### USAR O STYLED COMMPONENTS ( escrever css no formato javascript)

No site npmjs.com, ao lado de um pacote/dependencia tem uma sigla DT, que significa que o pacote possui ou nao possui tipagem typescript. sendo necessario utilizar outro pacote complemetar :
```bash
@types/styled-components
```

 
instalar:
```bash
npm i styled-components
npm i @types/styled-components -D
```


*(-D -> dependencia de desenvolvimento, nao pprecisa das tipagens em producao, em producao os codigos sao convertidos para javascript )*

---
Dica: criar uma pasta ja com um arquivo:
```javascript
components/Button.tsx 
```

importante: utilizar uma extensão vscode:  
**vscode-styled-components**
