import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './config/server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService<ServerConfig>);
  const host = config.get('host');
  const port = config.get('port');

  await app.listen(port, host);
}

bootstrap();
