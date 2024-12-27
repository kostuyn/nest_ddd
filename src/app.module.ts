import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigFactory } from '@/config/config.factory';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: ConfigFactory.createConfig.bind(ConfigFactory),
      envFilePath: ConfigFactory.envFile,
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
