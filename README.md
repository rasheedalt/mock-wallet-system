<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Mock Wallet system.

## Installation

```bash
#generate env file from env.example
$ cp .env.example .env
```

put the DB credentials

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Available Endpoints

- Sign up - /auth/sign-up [POST]
- Sign in - /auth/sign-in [POST]

- User Details - /user/:id [GET]
- Create Wallet - /user/:id/create-wallet [POST]
- Credit Wallet - /user/:id/credit-wallet [POST]
- Transfer - /user/:id/transfer [POST]

- Transactions - /transaction [GET]