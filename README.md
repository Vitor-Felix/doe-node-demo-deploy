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

## Rotas da API - MVP
- POST `/donation`
  - Cadastra nova doação
  - Exemplo de corpo (form-data):
```python
title: Nintendo 64
address: Rua dos alfeneiros
phonenumber: 486486486486
photo: /home/dev/Downloads/photo.jpeg
description: this is a description
userid: johndoer@example.com
```

- POST `/register`
  - Cadastra novo usuário
  - Exemplo de corpo (form-data):
```python
fullName: John Doe
email: johndoer6@example.com
password: password123
phoneNumber: +1 123-456-7890
facePhoto: /home/dev/Downloads/face.jpeg
documentPhoto: /home/dev/Downloads/id.jpeg
```

- POST `/login`
  - Verifica se credenciais são válidas para realizar login
  - Exemplo de corpo (JSON):
```JSON
{
  "nickname": "johndoer@example.com",
  "password": "password123"
}
```

- GET `/donations`
  - Lista últimas 20 doações, por default
  - Permite passar valor de paginação por Query Param `page`
    - Ex.:  `/donations?page=2`

- GET `/photos/{:id}`
  - Recupera imagem por sua `id` no MongoDB
  - Permite passar valor de paginação por Query Param `page`
    - Ex.:  `/photos/646226b9ebca2394b6850d75`

- GET `/`
  - Retorna mensagem de boas vindas: `Welcome to DOE API`
   
