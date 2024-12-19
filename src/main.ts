import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './config/server.config';
import { CustomLogger } from 'src/logger/custom-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(CustomLogger);
  app.useLogger(logger);

  const config = app.get(ConfigService<ServerConfig>);
  const host = config.get('host');
  const port = config.get('port');

  await app.listen(port, host);
}

bootstrap();
