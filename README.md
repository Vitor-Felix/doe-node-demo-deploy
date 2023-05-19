# Projeto DOE - Backend
Backend que expõe API que oferece rotas ao [aplicativo DOE](https://github.com/Vitor-Felix/doe-expo-demo)

## Tecnologias de desenvolvimento
- Escrito com a linguagem [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- Utiliza [NodeJS](https://nodejs.org/en) como servidor
- Banco de dados [MongoDB](https://www.mongodb.com/)

## Tecnologias de hospedagem
- Deploy integrado ao Github e submetido através do [Railway](https://railway.app/)
  - Ao ser realizado um commit na branch `master`, o serviço do Railway puxa as modificações e sobe o serviço
  - Este projeto foi montado em cima de um template do Railray: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/Abo1zu?referralCode=alphasec)
- Banco de dados armazenado em cluster do [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

## Setup para execução local
- Necessário ter instalado Node.js > 18. Uma boa dica seria utilizar o [nvm](https://github.com/nvm-sh/nvm) que permite utilizar e gerenciar várias versões do Node em paralelo.
- Pode ser utilizado `npm`, mas o desenvolvimento é feito utilizando `yarn`
  - install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
### Para instalar os módulos:
```console
dev@dev:~$ yarn install
``` 

## Execução
- Execução do projeto
```console
dev@dev:~$ yarn start
``` 
- Execução do projeto em modo de desenvolvimento:
```console
dev@dev:~$ yarn dev
```
