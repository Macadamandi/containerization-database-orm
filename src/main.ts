import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import * as path from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));
  SwaggerModule.setup('doc', app, swaggerDocument);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  await app.listen(port);
  console.log(`App running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/doc`);
}

bootstrap();
