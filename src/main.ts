import { otelSdk } from '@/otel/tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './config/app.config';
import { CustomLogger } from 'src/logger/custom-logger';
import { Config } from '@/config/config.factory';

async function bootstrap() {
  otelSdk.start();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(CustomLogger);
  app.useLogger(logger);

  const config = app.get(ConfigService<Config>);
  const { host, port } = config.get('app', { infer: true });

  logger.log(`Application is running on: http://${host}:${port}`);
  await app.listen(port, host);
}

bootstrap();
