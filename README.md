# rankup-api

Backend en NestJS con endpoint `GET /api/videos` que lee `mock-youtube-api.json`, aplica reglas de negocio y devuelve una respuesta limpia para frontend.

## Endpoint

- `GET /api/videos`

Respuesta publica por item:

- `thumbnail`
- `title`
- `author`
- `publishedAt` (texto amigable: `Hace X meses`, `Hace X dias`, `Hace X horas`)
- `hype`

## Reglas de negocio

- Formula base: `(likes + comments) / views`
- Si el titulo contiene `tutorial` (case insensitive), el hype final se multiplica por `2`.
- Si `comments` no existe en el video, el hype es `0`.
- Si `views` es `0`, el hype es `0`.
- Los videos se ordenan por `hype` descendente.

## Arquitectura clean-modular

`src/videos/`

- `domain`: funciones puras (`calculate-hype`, `format-published-at`)
- `application`: orquestacion (`get-videos.use-case`)
- `infrastructure`: lectura del JSON (`mock-youtube-json.service`)
- `presentation`: controller HTTP (`videos.controller`)
- `dto`: contrato publico de respuesta

## Ejecutar

```bash
npm install
npm run start:dev
```

Servidor por defecto: `http://localhost:3000`

## Probar

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```
