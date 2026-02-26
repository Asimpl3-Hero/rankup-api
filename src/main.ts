import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function resolvePort(rawPort: string | undefined): number {
  const parsedPort = Number(rawPort ?? 3000);
  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    return 3000;
  }

  return parsedPort;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = 'api';
  const swaggerPath = process.env.SWAGGER_PATH ?? 'api/docs';
  const swaggerTitle = process.env.SWAGGER_TITLE ?? 'Rankup API';
  const swaggerDescription =
    process.env.SWAGGER_DESCRIPTION ??
    'API de videos con transformaciones para frontend';
  const swaggerVersion = process.env.SWAGGER_VERSION ?? '1.0.0';
  const port = resolvePort(process.env.PORT);

  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      { method: RequestMethod.GET, path: '' },
      { method: RequestMethod.GET, path: 'health' },
    ],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .addTag('app', 'Estado del servicio y rutas disponibles')
    .addTag(
      'videos',
      'Consulta de videos transformados para frontend (hype calculado, fecha amigable y orden descendente por hype)',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(port);
}
void bootstrap();
