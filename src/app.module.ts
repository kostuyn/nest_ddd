import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'src/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
