import { CustomLogger } from '@/logger/custom-logger';
import { InitLoggerMiddleware } from './request-id.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ReqResMiddleware } from 'src/logger/req-res.middlewar';
import { context } from '@/logger/context';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CustomLogger,
    {
      provide: AsyncLocalStorage,
      useValue: context,
    },
  ],
  exports: [CustomLogger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitLoggerMiddleware, ReqResMiddleware).forRoutes('*');
  }
}
