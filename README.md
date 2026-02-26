# Rankup API

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203-85EA2D?logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

Backend en NestJS que procesa un mock tipo YouTube y entrega un contrato limpio para frontend.

## :dart: Que hace `GET /api/videos`

- Frontend: https://github.com/Asimpl3-Hero/rankup

`GET /api/videos` es el endpoint principal del reto que consume el front.

Hace todo este flujo:

1. Lee `mock/mock-youtube-api.json` (simulacion de proveedor externo).
2. Transforma cada video al contrato publico limpio.
3. Calcula `hype` con reglas de dominio.
4. Convierte fecha ISO a texto amigable.
5. Ordena por `hype` descendente.

Contrato de salida por video:

- `thumbnail`
- `title`
- `author`
- `publishedAt`
- `hype`

Reglas de negocio de hype:

- Formula base: `(likes + comments) / views`
- Si el titulo contiene `tutorial` (case insensitive), multiplica el hype por `2`.
- Si `comments` no existe, `hype = 0`.
- Si `views = 0`, `hype = 0`.

Formato de fecha (sin librerias externas):

- `Hace X meses`
- `Hace X dias`
- `Hace X horas`

## :bricks: Arquitectura (clean-modular)

Se usa arquitectura clean-modular, separando responsabilidades sin overengineering:

- `domain`: logica pura (`calculate-hype`, `format-published-at`).
- `application`: orquestacion de casos de uso.
- `infrastructure`: lectura y parseo del mock JSON.
- `presentation`: controllers HTTP.
- `dto`: contrato publico expuesto por API.

## :file_folder: Estructura de carpetas

```text
rankup-api/
|-- mock/
|   `-- mock-youtube-api.json
|-- src/
|   |-- app.controller.ts
|   |-- app.module.ts
|   |-- main.ts
|   `-- videos/
|       |-- application/
|       |   |-- get-videos.use-case.ts
|       |   |-- upload-mock-videos.use-case.ts
|       |   `-- youtube-video.types.ts
|       |-- domain/
|       |   |-- calculate-hype.ts
|       |   `-- format-published-at.ts
|       |-- dto/
|       |   |-- video-response.dto.ts
|       |   `-- upload-mock-response.dto.ts
|       |-- infrastructure/
|       |   `-- mock-youtube-json.service.ts
|       |-- presentation/
|       |   `-- videos.controller.ts
|       `-- videos.module.ts
`-- test/
    |-- app.e2e-spec.ts
    |-- jest-e2e.json
    `-- unit/
        |-- app/
        `-- videos/
```

## :white_check_mark: Cobertura de tests

Resultado actual de `npm run test:cov`:

- Statements: `99.4%`
- Branches: `90.9%`
- Functions: `100%`
- Lines: `99.34%`

Cobertura objetivo cumplida (`>= 80%`).

## :rocket: Ejecutar local

```bash
npm install
npm run start:dev
```

API local: `http://localhost:3000`

## :test_tube: Scripts utiles

```bash
npm run test
npm run test:cov
npm run test:e2e
npm run lint
npm run build
```

## :blue_book: Swagger

- UI: `http://localhost:3000/api/docs`
- JSON OpenAPI: `http://localhost:3000/api/docs-json`
