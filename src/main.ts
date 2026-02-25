import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = 'api';
  const swaggerPath = process.env.SWAGGER_PATH ?? 'api/docs';
  const swaggerTitle = process.env.SWAGGER_TITLE ?? 'Rankup API';
  const swaggerDescription =
    process.env.SWAGGER_DESCRIPTION ??
    'API de videos con transformaciones para frontend';
  const swaggerVersion = process.env.SWAGGER_VERSION ?? '1.0.0';
  const port = Number(process.env.PORT ?? 3000);

  app.setGlobalPrefix(apiPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription(swaggerDescription)
    .setVersion(swaggerVersion)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(port);
}
void bootstrap();
